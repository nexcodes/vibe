import { Template, defaultBuildLogger } from 'e2b'
import { template } from './template'

async function main() {
  await Template.build(template, 'vibe-dev', {
    onBuildLogs: defaultBuildLogger(),
    apiKey: "e2b_98160904e9e530ec3acea7cf7ce3cdf55e7dbd18",
  });
}

main().catch(console.error);