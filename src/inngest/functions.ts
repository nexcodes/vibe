import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";

import {
  FRAGMENT_TITLE_PROMPT,
  RESPONSE_PROMPT,
} from "@/constants/additional-prompt";
import { PROMPT } from "@/constants/better-prompt";
import { config } from "@/constants/config";
import { db } from "@/lib/db";
import {
  createAgent,
  createNetwork,
  createState,
  createTool,
  Message,
  openai,
  type Tool
} from "@inngest/agent-kit";
import z from "zod";
import {
  getSandbox,
  lastAssistantTextMessageContent,
  parseAgentOutput,
} from "./utils";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const runCodeAgent = inngest.createFunction(
  { id: "run-code-agent", retries: 10 },
  { event: "app/code-agent.run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.betaCreate("vibe", {
        autoPause: true,
        timeoutMs: 2 * 60 * 1000, // 2 minutes
      });
      return sandbox.sandboxId;
    });

    const previousMessage = await step.run("get-previous-message", async () => {
      const formattedMessages: Message[] = [];

      const messages = await db.message.findMany({
        where: {
          projectId: event.data.projectId,
          NOT: {
            id: (
              await db.message.findFirst({
                where: { projectId: event.data.projectId },
                orderBy: { createdAt: "desc" },
                select: { id: true },
              })
            )?.id,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }
      return formattedMessages;
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessage,
      },
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:
        "An agent that can write code and run it in a sandbox environment",
      system: PROMPT,
      model: openai({
        model: config.codeAgent.model,
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultParameters: {
          temperature: config.codeAgent.parameters.temperature,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                const errorMessage = `Command execution failed: ${error}  \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`;
                console.error(errorMessage);
                return errorMessage;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>,
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};

                  const sandbox = await getSandbox(sandboxId);

                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              },
            );

            if (
              newFiles &&
              typeof newFiles === "object" &&
              Object.keys(newFiles).length > 0
            ) {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);

                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents);
              } catch (error) {
                return "Error: " + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: config.codeAgent.maxIter,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: config.codeAgent.fragmentTitleModel,
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: config.codeAgent.responseModel,
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary,
    );
    const { output: responseMessageOutput } = await responseGenerator.run(
      result.state.data.summary,
    );

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;
    const errorReason = !result.state.data.summary
      ? "No summary generated"
      : "No files generated";

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await db.message.create({
          data: {
            projectId: event.data.projectId,
            content: `Something went wrong. Please Try again.`,
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await db.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseMessageOutput, "Here you go!"),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxId,
              sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput, "Fragment"),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: parseAgentOutput(fragmentTitleOutput, "Fragment"),
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
