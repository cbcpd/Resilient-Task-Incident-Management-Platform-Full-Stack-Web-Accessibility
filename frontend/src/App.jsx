import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const emptyForm = { title: '', description: '', priority: 'MEDIUM', status: 'OPEN', assignee: '' };

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true); setError('');
    try {
      const params = new URLSearchParams({ page, size: 8 });
      if (status) params.set('status', status);
      if (search.trim()) params.set('search', search.trim());
      const response = await fetch(`${API}/incidents?${params}`);
      if (!response.ok) throw new Error('Could not load incidents.');
      const data = await response.json();
      setItems(data.content); setTotalPages(data.totalPages);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  useEffect(() => { load(); }, [page, status, search]);

  function update(field, value) { setForm(current => ({ ...current, [field]: value })); }

  async function createIncident(event) {
    event.preventDefault(); setError('');
    try {
      const response = await fetch(`${API}/incidents`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Please check the form and try again.');
      setForm(emptyForm); setPage(0); await load();
    } catch (e) { setError(e.message); }
  }

  async function changeStatus(item, nextStatus) {
    const response = await fetch(`${API}/incidents/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, status: nextStatus })
    });
    if (response.ok) load(); else setError('Unable to update incident status.');
  }

  async function remove(id) {
    if (!window.confirm('Delete this incident?')) return;
    const response = await fetch(`${API}/incidents/${id}`, { method: 'DELETE' });
    if (response.ok) load(); else setError('Unable to delete incident.');
  }

  return <main className="shell">
    <header className="topbar">
      <div><p className="eyebrow">OPERATIONS / SERVICE RELIABILITY</p><h1>Incident Desk</h1>
        <p className="muted">Track work, resolve incidents, keep teams moving.</p></div>
      <span className="live"><span aria-hidden="true">●</span> Workspace</span>
    </header>

    <section className="stats" aria-label="Incident overview">
      <div className="stat"><span>Visible incidents</span><strong>{items.length}</strong></div>
      <div className="stat"><span>Current page</span><strong>{page + 1}{totalPages ? ` / ${totalPages}` : ''}</strong></div>
      <div className="stat"><span>Service</span><strong className="healthy">Ready</strong></div>
    </section>

    <div className="columns">
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">WORK QUEUE</p><h2>Incidents</h2></div>
          <button className="secondary" onClick={load} type="button">Refresh</button></div>
        <div className="filters">
          <label className="search-label">Search incidents
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search title, details, assignee…" />
          </label>
          <label>Status
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}>
              <option value="">All statuses</option><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option>
            </select>
          </label>
        </div>
        {error && <p className="alert" role="alert">{error}</p>}
        {busy ? <p className="muted" role="status">Loading incidents…</p> :
          <div className="incident-list">
            {items.length === 0 ? <p className="empty">No incidents found. Create one to get started.</p> :
              items.map(item => <article className="incident" key={item.id}>
                <div className="incident-main">
                  <div className="chips"><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span><span className="id">INC-{item.id}</span></div>
                  <h3>{item.title}</h3><p>{item.description}</p><small>Assignee: {item.assignee || 'Unassigned'}</small>
                </div>
                <div className="incident-actions">
                  <label>Update status
                    <select aria-label={`Status for ${item.title}`} value={item.status} onChange={e => changeStatus(item, e.target.value)}>
                      <option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option>
                    </select>
                  </label>
                  <button className="text-button" type="button" onClick={() => remove(item.id)}>Delete</button>
                </div>
              </article>)}
          </div>}
        <nav className="pagination" aria-label="Incident pages">
          <button className="secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span aria-live="polite">Page {page + 1} of {Math.max(totalPages, 1)}</span>
          <button className="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </nav>
      </section>

      <aside className="panel create-panel">
        <p className="eyebrow">NEW WORK ITEM</p><h2>Create incident</h2>
        <form onSubmit={createIncident}>
          <label htmlFor="title">Title</label><input id="title" required maxLength="140" value={form.title} onChange={e => update('title', e.target.value)} />
          <label htmlFor="description">Description</label><textarea id="description" required maxLength="4000" rows="4" value={form.description} onChange={e => update('description', e.target.value)} />
          <label htmlFor="priority">Priority</label><select id="priority" value={form.priority} onChange={e => update('priority', e.target.value)}>
            <option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select>
          <label htmlFor="assignee">Assignee / team</label><input id="assignee" maxLength="120" value={form.assignee} onChange={e => update('assignee', e.target.value)} placeholder="e.g. Platform Team" />
          <button className="primary" type="submit">Create incident <span aria-hidden="true">→</span></button>
        </form>
      </aside>
    </div>
    <footer>Incident Desk <span>•</span> Built with Spring Boot, React & PostgreSQL</footer>
  </main>;
}
