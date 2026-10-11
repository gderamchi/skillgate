# Avalanche skill audience demo

A deliberately non-operational, offline teaching companion to SkillGate.
**This is not a malicious-skill installer and not a security scanner.**

## One command

```sh
npx github:gderamchi/skillgate#demo
```

Requires Node.js 18+ with npm/npx, Git, and network access for the initial package
fetch. npm may ask for package-download confirmation. There are no package
dependencies, build step, global installation, API keys, wallet connections,
Foundry installation, or API charges. After package acquisition the program
makes no network calls.

The command copies two harmless teaching skills into a new OS-temporary folder:

| Display name | Skill name | Actual behavior |
| --- | --- | --- |
| Avalanche Pay Assistant | `avalanche-payments` | Read-only payment preview. |
| Avalanche Settlement Assistant | `avalanche-settlement` | Read-only comparison of a fictional routing case. |

No files are placed in `.agents`, `.claude`, `.codex` or a real assistant profile.
No models, acquired code or transactions are executed. The second case represents
a beneficiary mismatch as inert data, not as instructions to secretly move funds.
Both skills are harmless even if inspected by an agent.

In an interactive terminal, press Enter to see the illustrative routing mismatch.
For a noninteractive rehearsal use `--show-case` after the package name. The
temporary folder is printed and can be deleted after the demonstration.

## Present honestly

Say that the audience is trying an isolated teaching example. Do not say their
wallet was compromised, a real malicious skill was activated, or SkillGate
produced the displayed comparison. This branch runs no scanner and provides no
benchmark evidence. Use the genuine SkillGate report or a clearly identified
recording on the presenter's prepared machine for the actual security proof.

The full SkillGate application remains on `main`; its existing synthetic attack
fixtures, frozen benchmarks, reports and releases have not been renamed or changed
by this branch. Its full behavioral laboratory needs its documented prerequisites
and authorized API access. These two audience examples are not replacements for
that laboratory or new benchmark entries.

This is a standalone presentation branch. Do not merge its root package into the
main application's build configuration. Not an official or endorsed Avalanche product.

## Local tests

```sh
npm test
node audience-demo/bin/demo.cjs --show-case
```
