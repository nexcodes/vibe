import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  // Sandbox.connect automatically resumes a paused sandbox
  const sandbox = await Sandbox.connect(sandboxId, {
    timeoutMs: 2 * 60 * 1000, // extend/resume for 2 minutes
  });
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant",
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}

export const parseAgentOutput = (value: Message[], defaultReturn: string) => {
  const output = value[0];

  if (output.type !== "text") return defaultReturn;

  if (Array.isArray(output.content)) {
    return output.content.map((text) => text).join(" ");
  }

  return output.content;
};
