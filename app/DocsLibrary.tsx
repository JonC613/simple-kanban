"use client";

import { useEffect, useMemo, useState } from "react";

export const documents = [
  { category: "Start here", title: "LiteSpec Guide", description: "The lightweight workflow and its three artifacts.", path: "/docs/litespec/README.md" },
  { category: "Templates", title: "Specification Template", description: "Reusable product intent, stories, and acceptance criteria.", path: "/docs/litespec/templates/spec.md" },
  { category: "Templates", title: "Implementation Plan Template", description: "Reusable decisions, phases, risks, and release plan.", path: "/docs/litespec/templates/plan.md" },
  { category: "Templates", title: "Test Plan Template", description: "Reusable acceptance traceability and completion evidence.", path: "/docs/litespec/templates/tests.md" },
  { category: "Simple Kanban", title: "Product Specification", description: "The approved behavior and boundaries for this app.", path: "/docs/simple-kanban/spec.md" },
  { category: "Simple Kanban", title: "Implementation Plan", description: "The technical approach and phased delivery plan.", path: "/docs/simple-kanban/plan.md" },
  { category: "Simple Kanban", title: "Test Plan", description: "The acceptance-to-test traceability contract.", path: "/docs/simple-kanban/tests.md" },
  { category: "Codex skill", title: "LiteSpec Skill Instructions", description: "The orchestrator instructions used by Codex.", path: "/docs/litespec/skill/SKILL.md" },
  { category: "Codex skill", title: "LiteSpec Method Reference", description: "Detailed discovery, approval, amendment, and validation rules.", path: "/docs/litespec/skill/method.md" },
] as const;

type DocumentEntry = (typeof documents)[number];

export function DocsLibrary({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<DocumentEntry>(documents[0]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const categories = useMemo(() => [...new Set(documents.map((document) => document.category))], []);

  useEffect(() => {
    let active = true;
    fetch(selected.path)
      .then((response) => {
        if (!response.ok) throw new Error("Document unavailable");
        return response.text();
      })
      .then((text) => { if (active) setMarkdown(text) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) });
    return () => { active = false };
  }, [selected]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function selectDocument(document: DocumentEntry) {
    setLoading(true);
    setError(false);
    setSelected(document);
  }

  return (
    <div className="docs-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="docs-dialog" role="dialog" aria-modal="true" aria-labelledby="docs-title">
        <header className="docs-header">
          <div>
            <p className="kicker">Build openly</p>
            <h2 id="docs-title">LiteSpec Docs</h2>
            <p>Nine source documents behind Simple Kanban.</p>
          </div>
          <button className="docs-close" type="button" aria-label="Close Docs library" onClick={onClose}>×</button>
        </header>

        <div className="docs-layout">
          <nav className="docs-nav" aria-label="Published documentation">
            {categories.map((category) => (
              <section key={category}>
                <h3>{category}</h3>
                {documents.filter((document) => document.category === category).map((document) => (
                  <button className={selected.path === document.path ? "is-selected" : ""} type="button"
                    key={document.path} onClick={() => selectDocument(document)}>
                    <strong>{document.title}</strong>
                    <span>{document.description}</span>
                  </button>
                ))}
              </section>
            ))}
          </nav>

          <article className="docs-reader" aria-live="polite">
            <header>
              <div><p>{selected.category}</p><h3>{selected.title}</h3></div>
              <a href={selected.path} target="_blank" rel="noreferrer">Raw Markdown ↗</a>
            </header>
            {loading && <p className="docs-state">Loading document…</p>}
            {error && <p className="docs-state docs-error">This document could not be loaded. Try its raw Markdown link.</p>}
            {!loading && !error && <pre className="markdown-source">{markdown}</pre>}
          </article>
        </div>
      </section>
    </div>
  );
}
