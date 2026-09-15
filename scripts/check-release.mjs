import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

function stableVersion(version) {
  if (typeof version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Automatic publishing requires a stable X.Y.Z version: ${version}`);
  }
  return version.split('.').map(BigInt);
}

export async function shouldPublish({ name, version }, request = fetch) {
  if (name !== '@lailai0916/ui') throw new Error(`Unexpected package name: ${name}`);
  const next = stableVersion(version);
  const response = await request(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`npm registry returned HTTP ${response.status}`);

  const metadata = await response.json();
  const latest = metadata['dist-tags']?.latest;
  if (metadata.name !== name || !metadata.versions || !Object.hasOwn(metadata.versions, latest)) {
    throw new Error('npm registry returned incomplete package metadata');
  }
  if (Object.hasOwn(metadata.versions, version)) return false;

  const current = stableVersion(latest);
  const difference = next.findIndex((part, index) => part !== current[index]);
  if (difference === -1 || next[difference] < current[difference]) {
    throw new Error(`Refusing to replace npm latest ${latest} with older version ${version}`);
  }
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  if (lock.version !== manifest.version || lock.packages[''].version !== manifest.version) {
    throw new Error('package.json and package-lock.json versions must match');
  }
  const publish = await shouldPublish(manifest);
  const message = `${manifest.name}@${manifest.version}: ${publish ? 'ready to publish' : 'already published; skipping'}`;
  console.log(message);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `publish=${publish}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
  }
}
