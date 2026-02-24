import "dotenv/config";

import { Template, defaultBuildLogger } from "e2b";
import { template } from "./template";

async function main() {
  console.log("Building vibe-dev...");
  console.log(process.env.E2B_API_KEY);

  await Template.build(template, "vibe-dev", {
    onBuildLogs: defaultBuildLogger(),
    apiKey: process.env.E2B_API_KEY,
  });
}

main().catch(console.error);
