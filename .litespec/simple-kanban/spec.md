---
feature: simple-kanban
artifact: spec
status: approved
owner: example
version: 1.0
created: 2026-08-15
updated: 2026-08-15
example: true
---

# Specification: Simple Kanban

> Worked example: this approved-state snapshot demonstrates LiteSpec structure; it is not a live authorization record.

## Summary

Simple Kanban is a private, browser-based todo board that lets one person capture work, move it through three states, maintain task titles, and review the LiteSpec that defines the product.

## Problem

A plain todo list does not show the difference between upcoming, active, and completed work. A full project-management system adds accounts, configuration, and collaboration features that are unnecessary for a personal board.

## Desired outcome

A user can open one calm, responsive page and manage a small workflow through To Do, In Progress, and Done. Data remains on the user's device, and the specification remains inspectable from the product itself.

## Boundaries

### Goals

- Make task state visible at a glance.
- Keep task creation and maintenance lightweight.
- Retain board state across reloads on the same browser.
- Make the product's governing specification transparent.

### Non-goals

- Accounts, sharing, or real-time collaboration.
- Server-side synchronization or cross-device access.
- Due dates, labels, descriptions, assignments, or subtasks.
- Multiple boards or configurable columns.

### Constraints

- All task data must remain in browser storage.
- Cards move between columns by drag and drop.
- The implementation must remain a single-page application within the existing vinext project.

## Requirements

### Current release

- **R-01:** Provide fixed To Do, In Progress, and Done columns with task counts.
- **R-02:** Support title-only task creation in To Do.
- **R-03:** Support drag-and-drop movement between columns.
- **R-04:** Support inline title editing and confirmed destructive actions.
- **R-05:** Persist the board in the current browser.
- **R-06:** Display a readable product specification and link to its raw Markdown.

### Deferred

- **D-01:** Keyboard controls for moving cards between columns.
- **D-02:** Cross-device synchronization and user accounts.
- **D-03:** Reordering cards within a column.

## User stories

### US-01 — Capture work

**Story:** As a user, I want to add a task directly to To Do, so that I can capture work without leaving the board.

**Rationale:** Fast capture is the entry point for every other board action.

**Acceptance criteria:**

- **AC-01.1:** Entering a non-empty title and submitting creates one task at the top of To Do and clears the input.
- **AC-01.2:** Whitespace-only input cannot create a task.

**Edge cases:**

- Leading and trailing whitespace is removed.
- Titles are limited to 120 characters.
- The empty To Do state is replaced immediately after creation.

### US-02 — Move work through the workflow

**Story:** As a user, I want to drag a task into another column, so that its visible state matches its actual progress.

**Rationale:** State movement is the defining behavior of the Kanban view.

**Acceptance criteria:**

- **AC-02.1:** Given an existing task, when it is dropped on another column, then it appears in that column and both column counts update.
- **AC-02.2:** A potential drop column receives a visible target state during a valid drag.

**Edge cases:**

- Dropping a task into its current column does not duplicate it.
- An empty target column remains droppable.

### US-03 — Maintain or remove work

**Story:** As a user, I want to correct and remove tasks, so that the board reflects my current intent.

**Rationale:** Personal boards become unreliable when stale or incorrect tasks are difficult to fix.

**Acceptance criteria:**

- **AC-03.1:** Selecting a title opens inline editing; Enter or blur saves a non-empty title, while Escape restores the previous title.
- **AC-03.2:** Deleting one task requires confirmation; cancel preserves it and confirm removes it.
- **AC-03.3:** Clear done is disabled when Done is empty and otherwise removes all Done tasks only after confirmation.

**Edge cases:**

- Clearing an edited title does not save an empty task.
- Clearing Done does not affect To Do or In Progress.

### US-04 — Retain local state safely

**Story:** As a returning user, I want my board restored in the same browser, so that I can continue where I stopped.

**Rationale:** A board that forgets work after a reload is not dependable enough for routine use.

**Acceptance criteria:**

- **AC-04.1:** Created, edited, moved, and remaining tasks are restored after a reload in the same browser.
- **AC-04.2:** Given absent or unreadable stored data, when the app starts, then it presents an empty usable board instead of failing.

**Edge cases:**

- The initial empty render must not overwrite stored data before restoration completes.
- Storage failures must not prevent in-session use.

### US-05 — Inspect the governing specification

**Story:** As a user, I want to view the product specification from the app, so that I can understand the agreed behavior and boundaries.

**Rationale:** Visible specifications make intent inspectable and make later amendments easier to discuss.

**Acceptance criteria:**

- **AC-05.1:** Selecting View TinySpec opens a readable modal containing the specification summary, requirements, and completion conditions; Escape, the close control, or the backdrop closes it.
- **AC-05.2:** The modal provides a working link to the complete raw Markdown specification.

**Edge cases:**

- The dialog remains usable on a narrow viewport.
- Closing the dialog does not change board data.

## Non-functional requirements

- **NFR-01 — Accessibility:** Forms, inline editing, destructive controls, and the specification dialog are keyboard operable with visible focus; semantic labels identify controls and regions.
- **NFR-02 — Responsive layout:** The three-column board becomes a readable single-column layout below the desktop breakpoint without horizontal page scrolling.
- **NFR-03 — Privacy:** Task content is stored only in the current browser and is not sent to an application backend.
- **NFR-04 — Resilience:** Missing, invalid, or unavailable browser storage does not prevent the app from rendering a usable board.
- **NFR-05 — Motion:** Users who request reduced motion do not receive nonessential transitions.

## Codebase context

- `app/page.tsx` is a client component containing the todo model, local-storage lifecycle, board behavior, and specification dialog.
- `app/globals.css` owns the responsive layout and all product interaction states.
- `app/layout.tsx` supplies site metadata and the social-preview image.
- `public/tinyspec.md` is the deployable raw specification currently shown by the product.
- `tests/rendered-html.test.mjs` validates the server-rendered shell and statically checks the presence of core behaviors.
- The project uses vinext and produces a Cloudflare Worker-compatible deployment bundle.

## Assumptions and open questions

### Assumptions

- **A-01:** The board is intended for one person on one browser profile; clearing browser data may remove tasks.
- **A-02:** Native drag-and-drop behavior is sufficient for the currently supported pointer-based interaction.

### Open questions

- None.

## Amendment history

| Version | Date | Change | Reason | Affected IDs |
|---|---|---|---|---|
| 1.0 | 2026-08-15 | Initial LiteSpec worked example | Demonstrate the reusable method with Simple Kanban | All |
