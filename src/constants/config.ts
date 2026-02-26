type Models =
  | "stepfun/step-3.5-flash:free" // best overall
  | "google/gemini-3-flash-preview" // max_tokens problem, works well
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
    model: "stepfun/step-3.5-flash:free",
    maxIter: 15,
    parameters: {
      temperature: 0.1,
    },
  },
};
