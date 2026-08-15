# LiteSpec

LiteSpec is a lightweight specification-driven development method for work that has outgrown a TinySpec but does not justify the ceremony of a full Spec Kit workflow.

It uses one adaptive Codex orchestrator and exactly three feature artifacts:

```text
.litespec/<feature>/
├── spec.md
├── plan.md
└── tests.md
```

The workflow is conversational, approval-gated, traceable, and intentionally compact.

## 1. Position in the specification ladder

| Tier | Best fit | Artifacts | Typical rigor |
|---|---|---:|---|
| TinySpec | The requested behavior and implementation path are already clear | 1 | Requirements, short plan, tasks, done conditions |
| LiteSpec | TinySpec no longer provides enough shared understanding | 3 | User stories, acceptance criteria, phased design, and test traceability |
| Full Spec Kit | LiteSpec becomes insufficient during discovery or implementation | Full workflow | Rich specification, planning, task decomposition, analysis, and governance |

The orchestrator does not use a mandatory complexity score or fixed escalation checklist. It judges whether the current tier is sufficient from the project requirements and codebase evidence.

Before moving from TinySpec to LiteSpec, or from LiteSpec to full Spec Kit, it must:

1. Explain what the current tier fails to capture.
2. Explain what the proposed tier adds.
3. Ask the user to confirm the change.
4. Preserve the approved work already completed.

## 2. Design principles

### 2.1 Intent before implementation

LiteSpec retains Spec Kit's core idea that intent should be made explicit before code is changed. GitHub Spec Kit uses an artifact chain in which each Markdown output feeds the next phase, with a core flow of specification, planning, tasks, and implementation. LiteSpec compresses that model into three artifacts while keeping explicit handoffs. See [GitHub Spec Kit](https://github.github.com/spec-kit/) and its [workflow approval gates](https://github.github.com/spec-kit/reference/workflows.html).

### 2.2 Conversation before document generation

The orchestrator asks one focused question at a time and adapts the next question to the answer. It should not present a complete questionnaire. Conversation establishes shared understanding; the documents record the result.

### 2.3 User value over interface inventory

Stories describe valuable behavioral increments rather than screens, buttons, or technical components. This follows Agile Alliance guidance that user stories represent increments of value and that their detail evolves as work approaches implementation. Stories should be checked against INVEST without turning the mnemonic into a scoring exercise. See [Agile Alliance: User Stories](https://agilealliance.org/glossary/user-stories/).

### 2.4 Observable acceptance

Acceptance criteria describe outcomes that a user or external system can observe. Use a concise checklist for straightforward behavior. Use Given/When/Then when context, action, and result need to be made explicit. Cucumber describes these scenarios as both examples and executable specifications, and recommends keeping examples focused. See the [Cucumber Gherkin reference](https://cucumber.io/docs/gherkin/reference/).

### 2.5 Lightweight traceability

Stable story and acceptance-criterion IDs connect intent to implementation and tests:

```text
US-01 → AC-01.1 → P1-T2 → T-01
```

This is a compact form of requirements traceability. Formal traceability practice connects requirements to design, development, and test effort so that requirements do not become orphaned. See the Hong Kong Digital Policy Office's [Effective Systems Analysis & Design Guide, Tool 11](https://www.digitalpolicy.gov.hk/en/our_work/digital_infrastructure/methodology/system_development/doc/G61a_Effective_SAnD_Guide_Appendix_A_v1_2.pdf).

### 2.6 Decisions with context

`plan.md` records only decisions that materially shape implementation. Each decision states the choice, rationale, and consequences. This borrows from lightweight Architecture Decision Records without creating separate ADR files. See the UK Department for Education's guidance on [architecture documentation](https://ddt.beta.education.gov.uk/guides/architecture-documentation).

### 2.7 Automation with honest exceptions

Every acceptance criterion should map to an automated check. If automation is unsuitable—for example, a subjective visual judgment or behavior requiring unavailable hardware—the test plan records a manual exception and why it is trustworthy.

Test coverage should be placed at the lowest practical level that provides confidence, reserving broad end-to-end tests for behavior that lower layers cannot prove. This follows the balanced-portfolio principle of the [Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html).

### 2.8 Controlled change

Approved artifacts are living documents, but changes are explicit. A compatible clarification or extension increments `1.0` to `1.1`. A change large enough to invalidate the core scope triggers a recommendation to review the work under full Spec Kit. This is a lightweight adaptation—not a full implementation—of the meaning-bearing version changes described by [Semantic Versioning](https://semver.org/).

## 3. Artifact contract

### 3.1 `spec.md`: intent and observable behavior

`spec.md` answers: **What must be true, for whom, and why?**

Required sections:

| Section | Content guidance |
|---|---|
| Summary | One short paragraph naming the change and its value |
| Problem | The current limitation or unmet need; avoid implementation details |
| Desired outcome | A compact description of success |
| Requirements | Separate current-release requirements from deferred work |
| User stories | One valuable behavior per story, including rationale, acceptance criteria, and edge cases |
| Non-functional requirements | Explicit, measurable quality expectations; write `None identified` when genuinely absent |
| Codebase context | Broad assessment summarized only to facts that constrain or inform the feature |
| Assumptions and open questions | Low-risk assumptions may remain; high-impact unknowns block approval |
| Amendment history | Version, date, change, reason, and affected IDs |

Conditional content:

- Goals, non-goals, and constraints when ambiguity or boundary risk exists.
- Inline research findings with direct sources when external knowledge is unfamiliar, unstable, regulated, or high risk.
- Data, privacy, accessibility, security, compatibility, reliability, or performance detail only when relevant.

Story contract:

```markdown
### US-01 — <behavioral title>

**Story:** As a <role>, I want <capability>, so that <value>.

**Rationale:** <why this matters>

**Acceptance criteria:**

- **AC-01.1:** <observable, verifiable result>
- **AC-01.2:** Given <context>, when <event>, then <outcome>.

**Edge cases:**

- <boundary or failure behavior>
```

Acceptance criteria rules:

- Assign stable IDs in the form `AC-<story>.<sequence>`.
- Describe outcomes rather than internal implementation.
- Prefer one assertion of behavior per criterion.
- Use a checklist by default.
- Use Given/When/Then when a scenario has meaningful preconditions, branching, or recovery behavior.
- Do not add speculative cases solely to make the document appear complete.

### 3.2 `plan.md`: technical path and controlled execution

`plan.md` answers: **How will the approved intent be implemented safely?**

Required sections:

| Section | Content guidance |
|---|---|
| Technical approach | The smallest coherent implementation strategy |
| Key decisions | Choice, rationale, alternatives considered, and consequences; include only material decisions |
| Impacted areas | Files, modules, services, schemas, contracts, and operational surfaces likely to change |
| Implementation phases | Ordered outcomes, not generic lifecycle labels |
| Tasks | Dependencies, linked story or acceptance IDs, and a verification step |
| Amendment history | Plan changes caused by approved requirement amendments or implementation evidence |

Conditional content:

- Interfaces, data models, migrations, state transitions, or diagrams when they materially remove ambiguity.
- Risks and mitigations only when meaningful risks are discovered.
- Release, rollback, or compatibility notes when the change affects deployed state or external consumers.

Task contract:

```markdown
- [ ] **P1-T1 — <task outcome>**
  - Covers: US-01, AC-01.1
  - Depends on: None
  - Work: <bounded implementation actions>
  - Verify: <specific evidence that completes the task>
```

Use independently implementable and verifiable tasks for risky or sequencing-sensitive work. Routine work may remain grouped within a broader phase task.

### 3.3 `tests.md`: proof and traceability

`tests.md` answers: **What evidence will prove the approved behavior works?**

Required sections:

| Section | Content guidance |
|---|---|
| Strategy | Test levels and why they provide sufficient confidence |
| Traceability | Every acceptance criterion mapped to one or more test IDs |
| Critical user flows | Successful journeys whose failure would defeat the feature's purpose |
| Failure and recovery cases | Invalid input, unavailable dependencies, persistence failures, and safe recovery as relevant |
| Automated checks | Test level, setup, action, expected result, and linked acceptance IDs |
| Manual exceptions | Criterion, rationale, method, and evidence; omit when none |
| Test data and setup | Fixtures, accounts, environment, browser state, or service doubles needed |
| Completion criteria | Objective conditions for declaring validation complete |

Test contract:

```markdown
### T-01 — <behavior under test>

- Covers: AC-01.1
- Level: unit | component | integration | end-to-end
- Setup: <required state>
- Action: <trigger>
- Expected: <observable result>
```

The artifact stays focused on critical flows and failure cases. It does not attempt to enumerate every unit test the implementation may contain.

## 4. Section-level size controls

LiteSpec uses guidance rather than page limits:

- Summary, problem, outcome, and technical approach should normally be one to three short paragraphs each.
- Each user story should represent one independently understandable increment of value.
- Acceptance criteria should include only conditions needed to accept the story.
- Codebase context should summarize findings, not reproduce repository documentation.
- Key decisions should record only choices that a future implementer could reasonably revisit.
- Each phase should produce a demonstrable or verifiable outcome.
- The traceability table should map IDs, not repeat full requirements.
- Research should be summarized beside the affected claim or decision, with a direct link.

If a section repeatedly exceeds these bounds, the orchestrator should reassess the tier and explain whether full Spec Kit would provide a safer structure.

## 5. Orchestrator workflow

LiteSpec can be invoked naturally with “Use LiteSpec” or explicitly with `/litespec`.

### Stage 1 — Orient

1. Inspect the repository broadly enough to understand architecture, conventions, tests, and relevant dependencies.
2. Summarize only the codebase facts that matter to the requested feature.
3. Decide whether TinySpec still appears sufficient.
4. If recommending LiteSpec, explain the insufficiency and request confirmation.
5. Tell the user before external research is performed, including why it is needed.

Repository inspection is read-only during discovery. It does not authorize code changes.

### Stage 2 — Discover

1. Ask one focused question at a time.
2. Prefer two or three mutually exclusive answers when useful, while allowing a custom response.
3. Adapt the next question to the answer rather than following a rigid questionnaire.
4. Cover user value, current-release boundaries, deferred work, user stories, acceptance behavior, quality expectations, constraints, and unresolved questions.
5. Document low-risk assumptions; block on high-impact unknowns.

### Stage 3 — Specify

1. Ask permission to create `spec.md`.
2. Draft it from confirmed answers and repository evidence.
3. Assign stable `US-*` and `AC-*` identifiers.
4. Mark its status `review`.
5. Present a concise summary and ask for approval.
6. On approval, record the date and set the status to `approved`.

No `plan.md` or `tests.md` is created before `spec.md` approval.

### Stage 4 — Plan

1. Ask permission to create `plan.md`.
2. Derive the plan from the approved specification and current codebase.
3. Link tasks to story and acceptance IDs.
4. Record material decisions and conditional risks.
5. Present the plan for approval before proceeding.

### Stage 5 — Design validation

1. Ask permission to create `tests.md`.
2. Map every acceptance criterion to automated evidence.
3. Use documented manual exceptions only when automation is unsuitable.
4. Focus detailed cases on critical flows and failure or recovery behavior.
5. Present the test plan for approval.

### Stage 6 — Offer implementation

After all three artifacts are approved, offer implementation as a separate next step. Do not change code automatically.

If authorized:

1. Set artifact status to `implementing`.
2. Execute plan tasks in dependency order.
3. Keep acceptance and test IDs visible in progress updates or commits when practical.
4. Run the agreed validation.
5. Set status to `done` only when completion criteria are satisfied.

### Stage 7 — Amend safely

When implementation exposes a requirement gap:

1. Pause the affected work.
2. Explain the gap and its impact.
3. Propose the smallest coherent amendment.
4. Ask the user to approve it.
5. Update every affected artifact and its amendment history.
6. Increment the minor version, such as `1.0` to `1.1`.
7. Resume only after the artifacts agree.

If the change invalidates the core scope, recommend full Spec Kit, explain why, and wait for confirmation.

## 6. Metadata and lifecycle

Every artifact starts with YAML front matter:

```yaml
---
feature: example-feature
artifact: spec
status: draft
owner: user
version: 0.1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Allowed lifecycle:

```text
draft → review → approved → implementing → done
```

Rules:

- `draft`: being created; not ready for approval.
- `review`: complete enough for user review.
- `approved`: explicitly approved by the user.
- `implementing`: authorized implementation is in progress.
- `done`: implementation and agreed validation are complete.
- Each artifact has its own status, but the three artifacts should converge during implementation.
- The orchestrator must never infer approval from silence or from approval of a different artifact.

## 7. Priority model

LiteSpec uses two requirement priorities:

- **Current release:** required for the approved implementation.
- **Deferred:** explicitly outside the current implementation but retained for future consideration.

Deferred requirements do not receive implementation tasks or required tests in the current LiteSpec version.

## 8. Research policy

External research is performed only when the work relies on unfamiliar, unstable, regulated, or high-risk information.

The orchestrator must:

1. Tell the user that research is needed and why.
2. Prefer primary and authoritative sources.
3. Distinguish sourced fact from inference.
4. Place a concise finding and direct link beside the affected requirement or decision.
5. Avoid a separate research artifact.

## 9. Approval gates

| Gate | Required user action | What remains prohibited |
|---|---|---|
| Tier selection | Confirm LiteSpec | Creating LiteSpec artifacts |
| Specification | Approve `spec.md` | Creating the plan or changing code |
| Plan | Approve `plan.md` | Creating the test plan or changing code |
| Tests | Approve `tests.md` | Changing code |
| Implementation | Explicitly authorize implementation | Code and external-state changes |
| Amendment | Approve the proposed amendment | Continuing affected implementation |
| Tier escalation | Confirm full Spec Kit | Expanding into the full workflow |

## 10. Quality checks

Before requesting approval, the orchestrator checks:

### Specification

- Every story expresses a user or stakeholder value.
- Every current-release story has stable IDs, rationale, acceptance criteria, and relevant edge cases.
- Acceptance criteria are observable and testable.
- Deferred work is clearly separated.
- Non-functional requirements are measurable or explicitly absent.
- High-impact questions are resolved.
- Codebase claims are based on inspected evidence.

### Plan

- Every implementation task maps to approved intent.
- Dependencies and verification are explicit.
- Technical detail exists only where it removes meaningful ambiguity.
- Material decisions include rationale and consequences.
- Risks appear only when real risks were identified.
- No deferred requirement is accidentally implemented.

### Tests

- Every acceptance criterion maps to evidence.
- Critical flows and relevant failure paths are covered.
- Tests are placed at the lowest practical level.
- Manual exceptions have a rationale, method, and expected evidence.
- Completion criteria are objective.

### Cross-artifact consistency

- IDs are unique and stable.
- All links resolve in both directions.
- Versions and statuses are coherent.
- Amendments are reflected in every affected artifact.
- There are no orphan requirements, tasks, or tests.

## 11. Deliverables in this package

- [Specification template](templates/spec.md)
- [Implementation plan template](templates/plan.md)
- [Test plan template](templates/tests.md)
- [Simple Kanban specification](../../.litespec/simple-kanban/spec.md)
- [Simple Kanban implementation plan](../../.litespec/simple-kanban/plan.md)
- [Simple Kanban test plan](../../.litespec/simple-kanban/tests.md)

The Simple Kanban files are illustrative approved-state snapshots. Their `example: true` metadata means they demonstrate the completed artifact shape and do not authorize code changes or replace approval in a live LiteSpec run.

## 12. Codex skill

The repository-scoped [LiteSpec Codex skill](../../.agents/skills/litespec/SKILL.md) packages this method as one orchestrator supporting natural-language invocation, `$litespec`, and `/litespec`-style requests. It bundles the templates, enforces approval-gate ordering, conducts adaptive one-question-at-a-time discovery, and validates cross-artifact traceability before offering implementation.
