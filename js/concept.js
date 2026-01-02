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
      <option value="not_started" ${status === 'not_started' ? 'selected' : ''}>Not Started</option>
      <option value="learning" ${status === 'learning' ? 'selected' : ''}>Learning</option>
      <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>Mastered</option>
    </select>
  `;

  document.getElementById('status-select').addEventListener('change', (e) => {
    Storage.saveStatus(currentConcept.id, e.target.value);
  });
}

function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function renderResources() {
  const container = document.getElementById('resources-section');
  if (!container) return;

  const explanations = currentConcept.explanation_links || [];
  const references = currentConcept.reference_links || [];

  if (explanations.length === 0 && references.length === 0) {
    container.innerHTML = `<div class="section"><p class="empty-state">No resources available.</p></div>`;
    return;
  }

  let content = `<div class="section"><h2 class="section__title">Resources</h2>`;

  // Video Section
  const videos = explanations.filter(l => l.url.includes('youtube') || l.url.includes('youtu.be'));
  const articles = [...explanations.filter(l => !videos.includes(l)), ...references];

  if (videos.length > 0) {
    content += `<h3 class="subsection__title">Videos</h3><div class="video-grid">`;
    videos.forEach(video => {
      const videoId = getYoutubeId(video.url);
      if (videoId) {
        content += `
          <div class="video-card">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              title="${video.title}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
            <div class="video-title">${video.title}</div>
          </div>`;
      } else {
        content += createResourceItem(video);
      }
    });
    content += `</div>`;
  }

  // Articles/Docs Section
  if (articles.length > 0) {
    content += `<h3 class="subsection__title">Articles & Documentation</h3><ul class="resource-list">`;
    content += articles.map(link => createResourceItem(link)).join('');
    content += `</ul>`;
  }

  content += `</div>`;
  container.innerHTML = content;
}

function createResourceItem(link) {
  const domain = new URL(link.url).hostname.replace('www.', '');
  return `<li class="resource-item"><a href="${link.url}" target="_blank" class="resource-link">
    <div><div class="resource-link__title">${link.title}</div><div class="resource-link__url">${domain}</div></div>
  </a></li>`;
}

function renderVisualizer() {
  const container = document.getElementById('visualizer-section');
  if (!container) return;

  // Show wrapper for all concepts
  container.innerHTML = `
    <div class="section">
      <div class="section__header"><h2 class="section__title">Interactive Visualizer</h2></div>
      
      <div id="viz-wrapper" class="visualizer-wrapper">
        <button id="load-viz-btn" class="btn-primary btn-large">
          <span class="icon">🎮</span>
          Load Custom Visualizer
        </button>
        <p class="visualizer-note">Click to load the interactive tool.</p>
        
        <!-- Optional fallback link if external exists -->
        ${currentConcept.visualization_links?.[0] ?
      `<a href="${currentConcept.visualization_links[0].url}" target="_blank" class="visualizer-fallback-link">Or try external visualizer ↗</a>`
      : ''}
      </div>
    </div>
  `;

  document.getElementById('load-viz-btn').addEventListener('click', function () {
    const wrapper = document.getElementById('viz-wrapper');
    // Clear wrapper and setting up for VisualizerEngine
    wrapper.innerHTML = `<div id="viz-container"></div>`;

    // Initialize the engine
    const engine = new VisualizerEngine('viz-container');
    engine.render(currentConcept.id);
  });
}

function renderNotes() {
  const container = document.getElementById('notes-section');
  if (!container) return;
  const notes = Storage.getNotes(currentConcept.id);

  container.innerHTML = `
    <div class="section">
      <div class="section__header"><h2 class="section__title">My Notes</h2></div>
      <textarea id="notes-textarea" class="notes-textarea" placeholder="Write your notes here...">${notes}</textarea>
      <p id="notes-saved" class="notes-saved">Saved</p>
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
      <div class="section__header"><h2 class="section__title">Next Concepts</h2></div>
      ${nextConcepts.length > 0
      ? `<div class="next-concepts-list">${nextConcepts.map(c => `<a href="concept.html?id=${c.id}" class="next-concept-card">${c.name}</a>`).join('')}</div>`
      : `<p class="next-concepts-empty">No concepts depend on this one.</p>`}
    </div>
  `;
}
