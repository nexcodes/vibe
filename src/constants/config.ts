type Models =
  | "stepfun/step-3.5-flash:free" // best overall
  | "google/gemini-3-flash-preview" // max_tokens: 13333, works well
  | "arcee-ai/trinity-large-preview:free" // works, but not as good as step-3.5-flash
  | "google/gemini-2.5-flash"
  | "qwen/qwen3-coder:free"; // maxIter 15, it's slow

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
    model: "google/gemini-3-flash-preview",
    maxIter: 5,
    parameters: {
      temperature: 0.1,
      max_completion_tokens: 12000,
    },
  },
};
