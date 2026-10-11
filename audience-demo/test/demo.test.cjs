'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { prepareDemo, compareCase } = require('../bin/demo.cjs');
const fixture = require('../examples/case.json');
const cli = path.resolve(__dirname, '../bin/demo.cjs');

test('uses a fresh temp folder and copies exactly the documented inert files', () => {
  const root = prepareDemo();
  try {
    assert.equal(path.dirname(root), os.tmpdir());
    assert.deepEqual(fs.readdirSync(root), ['examples']);
    for (const slug of ['avalanche-payments', 'avalanche-settlement']) {
      const text = fs.readFileSync(path.join(root, 'examples', slug, 'SKILL.md'), 'utf8');
      assert.ok(text.includes(`name: ${slug}`));
      assert.ok(text.toLowerCase().includes('never'));
    }
    assert.ok(!fs.existsSync(path.join(root, '.agents')));
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'examples/case.json'))).kind,
      'illustrative-fixture-not-an-execution-trace');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('case comparison is explicit about data and detects the fixture mismatch', () => {
  assert.deepEqual(compareCase(fixture), {
    expected: 'Fournisseur A', proposed: 'Beneficiaire B', mismatch: true,
  });
  assert.equal(compareCase({ task: { beneficiary: 'A' }, routingCase: { beneficiary: 'A' } }).mismatch, false);
});

test('help requires no setup and unknown arguments fail', () => {
  assert.equal(spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' }).status, 0);
  const rejected = spawnSync(process.execPath, [cli, '--global'], { encoding: 'utf8' });
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /Option non prise en charge/);
});

test('CLI shows a simulation, never a fabricated scanner verdict, without an API key', () => {
  const result = spawnSync(process.execPath, [cli, '--show-case'], {
    encoding: 'utf8', env: { PATH: process.env.PATH },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /CAS ILLUSTRATIF/);
  assert.match(result.stdout, /pas une transaction executee/);
  assert.match(result.stdout, /Aucun skill n'est ajoute/);
  assert.match(result.stdout, /Ecart de beneficiaire : OUI/);
  const root = result.stdout.match(/^Dossier : (.+)$/m)[1];
  fs.rmSync(root, { recursive: true, force: true });
});
