/**
 * CS Learning Hub - Storage Module
 * Handles localStorage operations for notes and status persistence
 */

const STORAGE_PREFIX = 'dsa_hub_';

/**
 * Get the notes for a specific concept
 * @param {string} conceptId - The concept ID
 * @returns {string} The saved notes or empty string
 */
function getNotes(conceptId) {
  return localStorage.getItem(`${STORAGE_PREFIX}notes_${conceptId}`) || '';
}

/**
 * Save notes for a specific concept
 * @param {string} conceptId - The concept ID
 * @param {string} notes - The notes to save
 */
function saveNotes(conceptId, notes) {
  localStorage.setItem(`${STORAGE_PREFIX}notes_${conceptId}`, notes);
}

/**
 * Get the status for a specific concept
 * @param {string} conceptId - The concept ID
 * @returns {string} The status ('not_started', 'learning', or 'mastered')
 */
function getStatus(conceptId) {
  return localStorage.getItem(`${STORAGE_PREFIX}status_${conceptId}`) || 'not_started';
}

/**
 * Save status for a specific concept
 * @param {string} conceptId - The concept ID
 * @param {string} status - The status to save
 */
function saveStatus(conceptId, status) {
  localStorage.setItem(`${STORAGE_PREFIX}status_${conceptId}`, status);
}

/**
 * Get all statuses as an object
 * @param {Array} concepts - Array of concept objects
 * @returns {Object} Object mapping concept IDs to statuses
 */
function getAllStatuses(concepts) {
  const statuses = {};
  concepts.forEach(concept => {
    statuses[concept.id] = getStatus(concept.id);
  });
  return statuses;
}

/**
 * Calculate progress statistics
 * @param {Array} concepts - Array of concept objects
 * @returns {Object} { total, mastered, learning, notStarted }
 */
function getProgressStats(concepts) {
  const statuses = getAllStatuses(concepts);
  const stats = {
    total: concepts.length,
    mastered: 0,
    learning: 0,
    notStarted: 0
  };
  
  Object.values(statuses).forEach(status => {
    if (status === 'mastered') stats.mastered++;
    else if (status === 'learning') stats.learning++;
    else stats.notStarted++;
  });
  
  return stats;
}

/**
 * Export all user data (notes and statuses)
 * @param {Array} concepts - Array of concept objects
 * @returns {Object} Exported data
 */
function exportData(concepts) {
  const data = {};
  concepts.forEach(concept => {
    data[concept.id] = {
      notes: getNotes(concept.id),
      status: getStatus(concept.id)
    };
  });
  return data;
}

/**
 * Import user data (notes and statuses)
 * @param {Object} data - Data to import
 */
function importData(data) {
  Object.entries(data).forEach(([conceptId, { notes, status }]) => {
    if (notes) saveNotes(conceptId, notes);
    if (status) saveStatus(conceptId, status);
  });
}

// Export functions for use in other modules
window.Storage = {
  getNotes,
  saveNotes,
  getStatus,
  saveStatus,
  getAllStatuses,
  getProgressStats,
  exportData,
  importData
};
