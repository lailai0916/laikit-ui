import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldPublish } from '../scripts/check-release.mjs';

const name = '@lailai0916/ui';
const manifest = { name, version: '0.1.1' };
const registry =
  (latest, versions = [latest]) =>
  async () =>
    Response.json({
      name,
      'dist-tags': { latest },
      versions: Object.fromEntries(versions.map((v) => [v, {}])),
    });

test('publishes a new stable version with numeric version ordering', async () => {
  assert.equal(await shouldPublish(manifest, registry('0.1.0')), true);
  assert.equal(await shouldPublish({ name, version: '0.10.0' }, registry('0.9.9')), true);
  assert.equal(await shouldPublish({ name, version: '1.0.0' }, registry('0.99.99')), true);
});

test('skips versions that already exist, including reruns of old releases', async () => {
  assert.equal(await shouldPublish(manifest, registry('0.1.1')), false);
  assert.equal(await shouldPublish(manifest, registry('0.2.0', ['0.1.1', '0.2.0'])), false);
});

test('refuses an unpublished version older than latest', async () => {
  await assert.rejects(shouldPublish(manifest, registry('0.2.0')), /older version/);
});

test('registry failures never authorize publishing', async () => {
  for (const status of [401, 403, 404, 429, 500]) {
    await assert.rejects(
      shouldPublish(manifest, async () => new Response('', { status })),
      /HTTP/
    );
  }
  await assert.rejects(
    shouldPublish(manifest, async () => {
      throw new Error('offline');
    }),
    /offline/
  );
  await assert.rejects(
    shouldPublish(manifest, async () => new Response('not JSON')),
    SyntaxError
  );
  await assert.rejects(
    shouldPublish(manifest, async () => Response.json({})),
    /incomplete/
  );
});

test('rejects incorrect package identity and prereleases before contacting npm', async () => {
  const unexpectedRequest = async () => assert.fail('Registry must not be contacted');
  await assert.rejects(shouldPublish({ name: 'ui', version: '0.1.1' }, unexpectedRequest), /name/);
  for (const version of ['0.2.0-beta.1', '0.1', '01.1.1', '0.1.1+build', undefined]) {
    await assert.rejects(shouldPublish({ name, version }, unexpectedRequest), /stable/);
  }
});
