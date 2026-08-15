---
feature: simple-kanban
artifact: plan
status: approved
owner: example
version: 1.0
created: 2026-08-15
updated: 2026-08-15
spec_version: 1.0
example: true
---

# Implementation Plan: Simple Kanban

> Worked example: this approved-state snapshot demonstrates LiteSpec structure; it is not a live authorization record.

## Technical approach

Keep Simple Kanban as a client-side React page within the existing vinext application. Represent each task with a stable ID, title, status, and creation time. Maintain the active board in React state and synchronize it to browser local storage only after initial restoration completes.

Render the three fixed columns from shared metadata, derive per-column task groups from state, and update task status through native drag-and-drop events. Keep the specification viewer in the same page as an accessible modal, with the complete Markdown copy emitted as a public static asset.

## Key decisions

### KD-01 — Browser-local persistence

- **Choice:** Store tasks as versioned JSON in `localStorage`.
- **Rationale:** R-05 and NFR-03 explicitly require device-local state without accounts or a backend.
- **Alternatives considered:** IndexedDB; hosted database.
- **Consequences:** The implementation remains small, but tasks do not synchronize and may be lost when browser data is cleared.

### KD-02 — Native drag and drop

- **Choice:** Use the browser drag-and-drop API for inter-column movement.
- **Rationale:** It satisfies R-03 without adding a dependency and matches the approved interaction constraint.
- **Alternatives considered:** Pointer-event drag implementation; drag library; move buttons.
- **Consequences:** Desktop pointer support is simple, but touch behavior requires explicit compatibility verification and keyboard movement remains deferred.

### KD-03 — Embedded specification viewer

- **Choice:** Render a concise specification view in a modal and publish the full Markdown separately.
- **Rationale:** Users can read the essential contract without leaving the board while retaining access to the complete source.
- **Alternatives considered:** A second application route; raw Markdown link only.
- **Consequences:** Essential specification text exists in both the UI and Markdown and must be kept aligned during amendments.

## Impacted areas

| Area | Expected change | Related IDs |
|---|---|---|
| `app/page.tsx` | Task state, CRUD, drag and drop, persistence, and specification dialog | US-01–US-05 |
| `app/globals.css` | Board, card, focus, dialog, responsive, and reduced-motion styles | NFR-01, NFR-02, NFR-05 |
| `public/tinyspec.md` | Full deployable specification copy | AC-05.2 |
| `tests/rendered-html.test.mjs` | Server-shell and feature-presence checks | AC-05.1, AC-05.2 |
| Behavioral test surface | Automated interaction and storage tests | AC-01.1–AC-04.2 |

## Risks and mitigations

| Risk | Impact | Mitigation | Evidence or trigger |
|---|---|---|---|
| Native drag behavior varies on touch devices | Users may see a responsive board but be unable to move cards | Verify agreed browser/device targets; propose a pointer or explicit-move amendment if required | Compatibility test cannot complete a move |
| Specification UI and Markdown drift | The visible summary may contradict the source | Update both in one task and add source-presence assertions | Any amended requirement appears in only one copy |
| Early persistence write | Stored tasks could be replaced by the initial empty state | Gate writes behind a restoration-ready flag | Reload test loses seeded tasks |

## Implementation phases

### Phase 1 — Reliable local task model

- [ ] **P1-T1 — Implement restoration-safe task state**
  - Covers: US-04, AC-04.1, AC-04.2, NFR-03, NFR-04
  - Depends on: None
  - Work: Define the task model, safe read helper, readiness flag, and guarded persistence effect.
  - Verify: Storage restoration, invalid-data fallback, and in-session behavior pass automated tests.

- [ ] **P1-T2 — Implement task capture**
  - Covers: US-01, AC-01.1, AC-01.2
  - Depends on: P1-T1
  - Work: Add the To Do form, input normalization, stable IDs, length limit, and empty state transition.
  - Verify: Valid and whitespace-only creation cases pass.

### Phase 2 — Board workflow and maintenance

- [ ] **P2-T1 — Implement inter-column movement**
  - Covers: US-02, AC-02.1, AC-02.2
  - Depends on: P1-T1
  - Work: Add draggable cards, droppable columns, target styling, state updates, and count derivation.
  - Verify: Movement, same-column drops, empty targets, and counts pass automated interaction tests.

- [ ] **P2-T2 — Implement editing and destructive actions**
  - Covers: US-03, AC-03.1, AC-03.2, AC-03.3
  - Depends on: P1-T1
  - Work: Add inline edit lifecycle, individual deletion confirmation, and confirmed clearing of Done.
  - Verify: Save, cancel, invalid edit, delete cancel/confirm, and clear-done cases pass.

### Phase 3 — Specification transparency and quality

- [ ] **P3-T1 — Add the in-app specification viewer**
  - Covers: US-05, AC-05.1, AC-05.2, NFR-01
  - Depends on: P1-T2, P2-T1, P2-T2
  - Work: Add the dialog, close paths, readable content, and raw Markdown link.
  - Verify: Dialog interaction and static-asset tests pass.

- [ ] **P3-T2 — Complete responsive and accessibility behavior**
  - Covers: NFR-01, NFR-02, NFR-05
  - Depends on: P3-T1
  - Work: Add responsive breakpoints, semantic labels, focus visibility, and reduced-motion handling.
  - Verify: Automated accessibility checks pass and the documented responsive manual exception has evidence.

- [ ] **P3-T3 — Run cross-artifact and production validation**
  - Covers: All current-release IDs
  - Depends on: P3-T2
  - Work: Run the build, test suite, traceability audit, and specification-copy consistency check.
  - Verify: Every completion criterion in `tests.md` is satisfied with no orphan IDs.

## Release and rollback considerations

- **Release:** Publish only after the production build and current-release evidence pass. Existing browser data must remain readable under the unchanged storage key.
- **Rollback:** Redeploy the previous site version. Because the data schema is unchanged and browser-local, no server data rollback is required.

## Amendment history

| Version | Date | Change | Reason | Affected IDs |
|---|---|---|---|---|
| 1.0 | 2026-08-15 | Initial worked-example plan | Derived from LiteSpec example version 1.0 | All |
