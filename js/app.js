/**
 * CS Learning Hub - Home Page Application
 * Renders concept cards and handles navigation
 */

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const concepts = await Data.loadConcepts();
    renderProgressBar(concepts);
    renderConceptCards(concepts);
}

/**
 * Render the progress bar section
 */
function renderProgressBar(concepts) {
    const stats = Storage.getProgressStats(concepts);

    const progressSection = document.getElementById('progress-section');
    if (!progressSection) return;

    const masteredPercent = (stats.mastered / stats.total) * 100;
    const learningPercent = (stats.learning / stats.total) * 100;

    progressSection.innerHTML = `
    <div class="progress-stats">
      <div class="progress-stat">
        <span class="progress-stat__dot progress-stat__dot--mastered"></span>
        <span>${stats.mastered} Mastered</span>
      </div>
      <div class="progress-stat">
        <span class="progress-stat__dot progress-stat__dot--learning"></span>
        <span>${stats.learning} Learning</span>
      </div>
      <div class="progress-stat">
        <span class="progress-stat__dot progress-stat__dot--not-started"></span>
        <span>${stats.notStarted} Not Started</span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-bar__fill--mastered" style="width: ${masteredPercent}%"></div>
      <div class="progress-bar__fill--learning" style="width: ${learningPercent}%"></div>
    </div>
  `;
}

/**
 * Render all concept cards
 */
function renderConceptCards(concepts) {
    const grid = document.getElementById('concepts-grid');
    if (!grid) return;

    grid.innerHTML = concepts.map(concept => createConceptCard(concept)).join('');

    // Add click handlers
    grid.querySelectorAll('.concept-card').forEach(card => {
        card.addEventListener('click', () => {
            const conceptId = card.dataset.conceptId;
            window.location.href = `concept.html?id=${conceptId}`;
        });
    });
}

/**
 * Create HTML for a concept card
 */
function createConceptCard(concept) {
    const status = Storage.getStatus(concept.id);
    const statusLabel = getStatusLabel(status);
    const prereqText = concept.prerequisites.length > 0
        ? `Requires: ${concept.prerequisites.map(id => {
            const prereq = Data.getConceptById(id);
            return prereq ? prereq.name : id;
        }).join(', ')}`
        : 'No prerequisites';

    return `
    <article class="concept-card" data-concept-id="${concept.id}">
      <div class="concept-card__header">
        <h2 class="concept-card__title">${concept.name}</h2>
        <span class="concept-card__status concept-card__status--${status}">
          <span class="concept-card__status-dot"></span>
          ${statusLabel}
        </span>
      </div>
      <p class="concept-card__description">${concept.description}</p>
      <p class="concept-card__prereqs">${prereqText}</p>
    </article>
  `;
}

/**
 * Get human-readable status label
 */
function getStatusLabel(status) {
    const labels = {
        'not_started': 'New',
        'learning': 'Learning',
        'mastered': 'Mastered'
    };
    return labels[status] || 'New';
}
