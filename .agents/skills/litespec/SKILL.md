---
name: litespec
description: Guide a lightweight specification-driven development workflow between a one-file TinySpec and full GitHub Spec Kit. Use when the user says "Use LiteSpec", invokes `/litespec` or `$litespec`, asks for adaptive one-question-at-a-time feature discovery, or wants three approval-gated Markdown artifacts (`spec.md`, `plan.md`, and `tests.md`) with user stories, acceptance criteria, implementation phases, and test traceability. Also use to amend or implement an existing `.litespec/feature-name/` package.
---

# LiteSpec

Create enough shared understanding for medium-complexity work without expanding into full Spec Kit. Keep one orchestrator, three feature artifacts, adaptive discovery, explicit approvals, and traceable evidence.

## Start safely

1. Resolve the project and requested feature.
2. Inspect the repository broadly and read-only: architecture, conventions, relevant behavior, tests, dependencies, and deployment surfaces.
3. Judge whether TinySpec is still sufficient. Do not use a numerical score.
4. If recommending LiteSpec, explain what TinySpec fails to capture, explain what LiteSpec adds, and request confirmation.
5. If LiteSpec appears insufficient, explain why full Spec Kit is safer and request confirmation before changing tiers.
6. Tell the user before external research. Research only unfamiliar, unstable, regulated, or high-risk facts; prefer primary sources and place findings beside affected requirements or decisions.
7. Read [references/method.md](references/method.md) before drafting or amending any artifact.

Do not create artifacts, change code, or mutate external state during orientation.

## Conduct discovery

- Ask one focused question at a time.
- Adapt each next question to the prior answer; never dump a full questionnaire.
- Offer two or three mutually exclusive choices when useful and permit a custom answer.
- Cover user value, current-release boundaries, deferred work, user stories, observable acceptance, relevant quality expectations, constraints, and unresolved questions.
- Document low-risk assumptions. Resolve high-impact unknowns before approval.
- Continue until the user can evaluate the proposed behavior without guessing.

## Create artifacts through gates

Store feature artifacts in:

```text
.litespec/<feature>/
├── spec.md
├── plan.md
└── tests.md
```

Use the bundled templates in `assets/`. Prefer `scripts/scaffold_litespec.py` to create one new artifact at a time because it enforces ordering and refuses overwrites.

### Gate 1 — Specification

1. Ask permission to create `spec.md`.
2. Scaffold and fill only `spec.md`.
3. Assign stable `US-*`, `AC-*`, requirement, and non-functional IDs.
4. Set status to `review`, summarize the result, and ask for approval.
5. Change status to `approved` only after explicit approval.

Do not create `plan.md` before specification approval.

### Gate 2 — Plan

1. Ask permission to create `plan.md`.
2. Derive the technical approach from the approved specification and inspected codebase.
3. Link every task to approved IDs, dependencies, and a verification step.
4. Record only material decisions and meaningful risks.
5. Set status to `review`, summarize the result, and ask for approval.
6. Change status to `approved` only after explicit approval.

Do not create `tests.md` before plan approval.

### Gate 3 — Tests

1. Ask permission to create `tests.md`.
2. Map every current-release acceptance criterion to automated evidence.
3. Document manual exceptions only when reliable automation is unsuitable.
4. Focus detailed cases on critical flows and failure or recovery behavior.
5. Set status to `review`, summarize the result, and ask for approval.
6. Change status to `approved` only after explicit approval.

## Validate the package

Run:

```text
python <skill-dir>/scripts/validate_litespec.py <project>/.litespec/<feature>
```

Use `--approved` before offering implementation. Fix duplicate IDs, missing mappings, incoherent metadata, or orphan acceptance criteria before continuing.

Validation supports judgment but does not grant approval.

## Offer implementation separately

After all three artifacts are approved:

1. Offer implementation as the next step.
2. Wait for explicit authorization to change code.
3. Set statuses to `implementing` only after authorization.
4. Execute plan tasks in dependency order and verify each task.
5. Run the agreed tests and cross-artifact validation.
6. Set status to `done` only when completion criteria are satisfied.

Never infer implementation permission from artifact approval.

## Amend safely

When requirements change or implementation reveals a gap:

1. Pause affected work.
2. Explain the gap, impact, and smallest coherent amendment.
3. Ask the user to approve the amendment.
4. Update every affected artifact and its amendment history.
5. Increment the minor version, such as `1.0` to `1.1`.
6. Re-run validation and resume only when artifacts agree.

If the change invalidates core scope, recommend full Spec Kit and wait for confirmation.

Never overwrite an existing artifact with the scaffold script. Read it, preserve approved content and user edits, and patch only the accepted amendment.

## Communicate decisions

- Lead with the current outcome or decision needed.
- Keep discovery to one question per turn.
- State why research, tier changes, manual-test exceptions, or pauses are necessary.
- At each gate, summarize what changed, what remains unresolved, and what approval permits next.
- Keep the final handoff centered on artifact links, approval state, validation result, and the next authorized action.

## Resources

- Read `references/method.md` for artifact contracts, metadata, size controls, quality checks, and research foundations.
- Use `assets/spec.md`, `assets/plan.md`, and `assets/tests.md` as output templates.
- Use `scripts/scaffold_litespec.py` for safe ordered creation.
- Use `scripts/validate_litespec.py` for deterministic metadata and traceability checks.
