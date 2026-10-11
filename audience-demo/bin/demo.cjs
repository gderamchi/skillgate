#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline/promises');

const SOURCE = path.resolve(__dirname, '..');
const FILES = [
  'examples/avalanche-payments/SKILL.md',
  'examples/avalanche-settlement/SKILL.md',
  'examples/case.json',
];

// Copies only bundled, harmless teaching files into a fresh OS-temporary folder.
// It never discovers profiles, reads secrets, runs code, or contacts a network.
function prepareDemo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'avax-skill-demo-'));
  try {
    for (const relative of FILES) {
      const destination = path.join(root, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
      fs.copyFileSync(path.join(SOURCE, relative), destination, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(destination, 0o600);
    }
    return root;
  } catch (error) {
    fs.rmSync(root, { recursive: true, force: true });
    throw error;
  }
}

function compareCase(example) {
  // This is a comparison of authored fixture data, not an AI/security verdict.
  return {
    expected: example.task.beneficiary,
    proposed: example.routingCase.beneficiary,
    mismatch: example.task.beneficiary !== example.routingCase.beneficiary,
  };
}

async function main(args = process.argv.slice(2)) {
  const allowed = new Set(['--help', '-h', '--show-case']);
  const unknown = args.find((arg) => !allowed.has(arg));
  if (unknown) throw new Error(`Option non prise en charge : ${unknown}`);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Avalanche skill demo\nUsage: avax-demo [--show-case]\n');
    console.log('Exemples inoffensifs dans un dossier temporaire. Aucun vrai skill piege,');
    console.log('profil d\'agent, wallet, reseau blockchain ou modele utilise.');
    return;
  }

  console.log('\nAVALANCHE PAY ASSISTANT');
  console.log('Demo de securite · donnees fictives · aucun wallet personnel');
  console.log('Aucun skill n\'est ajoute a votre agent habituel.\n');
  const root = prepareDemo();
  const example = JSON.parse(fs.readFileSync(path.join(root, 'examples/case.json'), 'utf8'));
  console.log('Exemples copies dans le labo temporaire :');
  console.log('  Avalanche Pay Assistant        (avalanche-payments)');
  console.log('  Avalanche Settlement Assistant (avalanche-settlement)');
  console.log(`\nDossier : ${root}`);
  console.log(`\nDemande illustrative : ${example.task.amount} ${example.task.asset} vers ${example.task.beneficiary}.`);
  console.log('Les fichiers sont des supports de demonstration, pas des agents executes.');

  let reveal = args.includes('--show-case');
  if (!reveal && process.stdin.isTTY && process.stdout.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
      const answer = await rl.question('\nEntree pour examiner le cas de routage, ou q pour quitter : ');
      reveal = answer.trim().toLowerCase() !== 'q';
    } finally { rl.close(); }
  }
  if (reveal) {
    const comparison = compareCase(example);
    console.log('\nCAS ILLUSTRATIF — pas une transaction executee');
    console.log(`Attendu  : ${comparison.expected}`);
    console.log(`Propose  : ${comparison.proposed}`);
    console.log(`Ecart de beneficiaire : ${comparison.mismatch ? 'OUI' : 'NON'}`);
    console.log(example.explanation);
    console.log('\nPour la preuve technique, utiliser le vrai rapport SkillGate sur la machine du presentateur.');
  }
  console.log('\nAucune signature, aucun appel API, aucune modification de votre agent.');
  console.log('Vous pouvez supprimer le dossier temporaire apres la demonstration.');
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Demo interrompue : ${error.message}`);
    process.exitCode = 1;
  });
}
module.exports = { prepareDemo, compareCase, main };
