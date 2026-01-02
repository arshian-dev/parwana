/**
 * CS Learning Hub - Concept Page Application
 */

let currentConcept = null;
let saveTimeout = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const conceptId = urlParams.get('id');

    if (!conceptId) { showError('No concept specified'); return; }

    await Data.loadConcepts();
    currentConcept = Data.getConceptById(conceptId);

    if (!currentConcept) { showError('Concept not found'); return; }

    renderConceptPage();
}

function showError(message) {
    const container = document.getElementById('concept-content');
    if (container) {
        container.innerHTML = `<div class="empty-state"><p>${message}</p><a href="index.html" class="back-link">← Back</a></div>`;
    }
}

function renderConceptPage() {
    document.title = `${currentConcept.name} - CS Learning Hub`;
    renderHeader();
    renderResources();
    renderVisualizer();
    renderNotes();
    renderNextConcepts();
}

function renderHeader() {
    const header = document.getElementById('concept-header');
    if (!header) return;
    const status = Storage.getStatus(currentConcept.id);

    header.innerHTML = `
    <div class="concept-header__info">
      <h1>${currentConcept.name}</h1>
      <p class="concept-header__description">${currentConcept.description}</p>
    </div>
    <select id="status-select" class="status-select">
      <option value="not_started" ${status === 'not_started' ? 'selected' : ''}>📋 Not Started</option>
      <option value="learning" ${status === 'learning' ? 'selected' : ''}>📖 Learning</option>
      <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>✅ Mastered</option>
    </select>
  `;

    document.getElementById('status-select').addEventListener('change', (e) => {
        Storage.saveStatus(currentConcept.id, e.target.value);
    });
}

function renderResources() {
    const container = document.getElementById('resources-section');
    if (!container) return;

    const allLinks = [
        ...currentConcept.explanation_links.map(l => ({ ...l, type: 'explanation' })),
        ...currentConcept.reference_links.map(l => ({ ...l, type: 'reference' }))
    ];

    if (allLinks.length === 0) {
        container.innerHTML = `<div class="section"><p class="empty-state">No resources available.</p></div>`;
        return;
    }

    container.innerHTML = `
    <div class="section">
      <div class="section__header"><span class="section__icon">📚</span><h2 class="section__title">Resources</h2></div>
      <ul class="resource-list">
        ${allLinks.map(link => {
        const icon = link.type === 'explanation' ? '🎬' : '📄';
        const domain = new URL(link.url).hostname.replace('www.', '');
        return `<li class="resource-item"><a href="${link.url}" target="_blank" class="resource-link">
            <span class="resource-link__icon">${icon}</span>
            <div><div class="resource-link__title">${link.title}</div><div class="resource-link__url">${domain}</div></div>
          </a></li>`;
    }).join('')}
      </ul>
    </div>
  `;
}

function renderVisualizer() {
    const container = document.getElementById('visualizer-section');
    if (!container) return;

    if (currentConcept.visualization_links.length === 0) {
        container.innerHTML = `<div class="section"><div class="section__header"><span class="section__icon">🎮</span><h2 class="section__title">Visualizer</h2></div><div class="visualizer-placeholder"><p>No visualizer available</p></div></div>`;
        return;
    }

    const viz = currentConcept.visualization_links[0];
    container.innerHTML = `
    <div class="section">
      <div class="section__header"><span class="section__icon">🎮</span><h2 class="section__title">Visualizer</h2></div>
      <p style="margin-bottom:var(--space-md);color:var(--text-secondary);"><a href="${viz.url}" target="_blank">${viz.title} ↗</a></p>
      <div class="visualizer-container"><iframe src="${viz.url}" class="visualizer-iframe" title="${viz.title}" loading="lazy"></iframe></div>
    </div>
  `;
}

function renderNotes() {
    const container = document.getElementById('notes-section');
    if (!container) return;
    const notes = Storage.getNotes(currentConcept.id);

    container.innerHTML = `
    <div class="section">
      <div class="section__header"><span class="section__icon">📝</span><h2 class="section__title">My Notes</h2></div>
      <textarea id="notes-textarea" class="notes-textarea" placeholder="Write your notes here...">${notes}</textarea>
      <p id="notes-saved" class="notes-saved">✓ Saved</p>
    </div>
  `;

    const textarea = document.getElementById('notes-textarea');
    const saved = document.getElementById('notes-saved');

    textarea.addEventListener('input', () => {
        if (saveTimeout) clearTimeout(saveTimeout);
        saved.classList.remove('visible');
        saveTimeout = setTimeout(() => {
            Storage.saveNotes(currentConcept.id, textarea.value);
            saved.classList.add('visible');
            setTimeout(() => saved.classList.remove('visible'), 2000);
        }, 500);
    });
}

function renderNextConcepts() {
    const container = document.getElementById('next-concepts-section');
    if (!container) return;
    const nextConcepts = Data.getNextConcepts(currentConcept.id);

    container.innerHTML = `
    <div class="section">
      <div class="section__header"><span class="section__icon">➡️</span><h2 class="section__title">Next Concepts</h2></div>
      ${nextConcepts.length > 0
            ? `<div class="next-concepts-list">${nextConcepts.map(c => `<a href="concept.html?id=${c.id}" class="next-concept-card"><span>→</span> ${c.name}</a>`).join('')}</div>`
            : `<p class="next-concepts-empty">No concepts depend on this one.</p>`}
    </div>
  `;
}
