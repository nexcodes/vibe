type Models =
  | "stepfun/step-3.5-flash:free" // best overall
  | "arcee-ai/trinity-large-preview:free" // works, but not as good as step-3.5-flash
  | "qwen/qwen3-coder:free" // it's slow, uptime very low
  | "openai/gpt-oss-120b:free" // uptime decent
  | "meta-llama/llama-3.3-70b-instruct:free"
  | "nvidia/nemotron-3-nano-30b-a3b:free"

interface Config {
  codeAgent: {
    model: Models;
    maxIter: number;
    parameters: {
      temperature?: number;
      max_completion_tokens?: number | undefined;
    };
  };
}

export const config: Config = {
  codeAgent: {
    model: "stepfun/step-3.5-flash:free",
    maxIter: 30,
    parameters: {
      temperature: 0.1,
    },
  },
};
