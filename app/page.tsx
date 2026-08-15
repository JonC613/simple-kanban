"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { DocsLibrary } from "./DocsLibrary";

type Status = "todo" | "doing" | "done";
type Todo = { id: string; title: string; status: Status; createdAt: number };

const STORAGE_KEY = "simple-kanban.todos.v1";
const columns: Array<{ id: Status; label: string; eyebrow: string }> = [
  { id: "todo", label: "To Do", eyebrow: "Up next" },
  { id: "doing", label: "In Progress", eyebrow: "In motion" },
  { id: "done", label: "Done", eyebrow: "Completed" },
];

function readTodos(): Todo[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as Todo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function TodoCard({ todo, onEdit, onDelete, onDragStart }: {
  todo: Todo;
  onEdit: (id: string, title: string) => void;
  onDelete: (todo: Todo) => void;
  onDragStart: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.select() }, [editing]);

  function save() {
    const title = draft.trim();
    if (title) onEdit(todo.id, title);
    else setDraft(todo.title);
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") save();
    if (event.key === "Escape") {
      setDraft(todo.title);
      setEditing(false);
    }
  }

  return (
    <article className="todo-card" draggable={!editing} onDragStart={(event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", todo.id);
      onDragStart(todo.id);
    }}>
      <span className="drag-handle" aria-hidden="true">⋮⋮</span>
      <div className="card-copy">
        {editing ? (
          <input ref={inputRef} className="edit-input" value={draft} maxLength={120}
            aria-label="Edit todo title" onChange={(event) => setDraft(event.target.value)}
            onBlur={save} onKeyDown={handleKeyDown} />
        ) : (
          <button className="todo-title" type="button" title="Edit todo" onClick={() => setEditing(true)}>
            {todo.title}
          </button>
        )}
      </div>
      <button className="delete-button" type="button" aria-label={`Delete ${todo.title}`} onClick={() => onDelete(todo)}>×</button>
    </article>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<Status | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  // Client-only restoration intentionally runs after hydration to avoid server/client markup drift.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setTodos(readTodos()); setReady(true) }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }, [ready, todos]);

  const grouped = useMemo(() => Object.fromEntries(columns.map((column) => [
    column.id, todos.filter((todo) => todo.status === column.id),
  ])) as Record<Status, Todo[]>, [todos]);
  const completed = grouped.done.length;

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setTodos((current) => [{ id: crypto.randomUUID(), title: nextTitle, status: "todo", createdAt: Date.now() }, ...current]);
    setTitle("");
  }

  function moveTodo(id: string, status: Status) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, status } : todo));
  }

  function deleteTodo(todo: Todo) {
    if (window.confirm(`Delete “${todo.title}”?`)) setTodos((current) => current.filter((item) => item.id !== todo.id));
  }

  function clearDone() {
    if (completed > 0 && window.confirm(`Delete all ${completed} completed ${completed === 1 ? "todo" : "todos"}?`)) {
      setTodos((current) => current.filter((todo) => todo.status !== "done"));
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="kicker">Personal workspace</p>
          <h1>Simple Kanban</h1>
          <p className="subtitle">A calm place to move work forward.</p>
        </div>
        <div className="header-actions">
          <div className="summary" aria-label={`${todos.length} total todos, ${completed} completed`}>
            <strong>{todos.length}</strong><span>Total</span><i /><strong>{completed}</strong><span>Done</span>
          </div>
          <button className="quiet-button docs-button" type="button" onClick={() => setShowDocs(true)}><span aria-hidden="true">◫</span> Docs</button>
          <button className="quiet-button" type="button" disabled={completed === 0} onClick={clearDone}>Clear done</button>
        </div>
      </header>

      <section className="board" aria-label="Kanban board">
        {columns.map((column) => (
          <section className={`column column-${column.id}${dragTarget === column.id ? " is-drag-target" : ""}`}
            key={column.id} aria-labelledby={`heading-${column.id}`}
            onDragEnter={(event) => { event.preventDefault(); setDragTarget(column.id) }}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move" }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragTarget(null) }}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/plain") || draggedId;
              if (id) moveTodo(id, column.id);
              setDraggedId(null); setDragTarget(null);
            }}>
            <div className="column-header">
              <div><p>{column.eyebrow}</p><h2 id={`heading-${column.id}`}>{column.label}</h2></div>
              <span className="count-badge">{grouped[column.id].length}</span>
            </div>

            {column.id === "todo" && (
              <form className="add-form" onSubmit={addTodo}>
                <label className="sr-only" htmlFor="new-todo">New todo title</label>
                <input id="new-todo" value={title} maxLength={120} placeholder="What needs doing?"
                  onChange={(event) => setTitle(event.target.value)} />
                <button type="submit" disabled={!title.trim()} aria-label="Add todo">+</button>
              </form>
            )}

            <div className="card-list">
              {grouped[column.id].map((todo) => (
                <TodoCard key={todo.id} todo={todo} onDragStart={setDraggedId}
                  onEdit={(id, nextTitle) => setTodos((current) => current.map((item) => item.id === id ? { ...item, title: nextTitle } : item))}
                  onDelete={deleteTodo} />
              ))}
              {grouped[column.id].length === 0 && (
                <div className="empty-state"><span aria-hidden="true">{column.id === "done" ? "✓" : "—"}</span>
                  <p>{column.id === "todo" ? "Add your first todo" : column.id === "doing" ? "Drag active work here" : "Completed work lands here"}</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </section>

      <footer className="app-footer">
        <p><span className="status-dot" /> Saved in this browser</p>
        <p>Drag cards to move them · Select a title to edit</p>
      </footer>

      {showDocs && <DocsLibrary onClose={() => setShowDocs(false)} />}
    </main>
  );
}
