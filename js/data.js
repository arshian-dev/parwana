/**
 * CS Learning Hub - Data Module
 * Handles loading and managing concept data
 */

let conceptsData = [];

/**
 * Load concepts from JSON file
 * @returns {Promise<Array>} Array of concept objects
 */
async function loadConcepts() {
    if (conceptsData.length > 0) {
        return conceptsData;
    }

    try {
        const response = await fetch('./data/concepts.json');
        if (!response.ok) {
            throw new Error('Failed to load concepts');
        }
        conceptsData = await response.json();
        return conceptsData;
    } catch (error) {
        console.error('Error loading concepts:', error);
        return [];
    }
}

/**
 * Get a concept by its ID
 * @param {string} id - The concept ID
 * @returns {Object|null} The concept object or null
 */
function getConceptById(id) {
    return conceptsData.find(c => c.id === id) || null;
}

/**
 * Get all concepts
 * @returns {Array} Array of concept objects
 */
function getAllConcepts() {
    return conceptsData;
}

/**
 * Get concepts that have the given concept as a prerequisite
 * These are the "next" concepts to study after mastering the given concept
 * @param {string} conceptId - The concept ID
 * @returns {Array} Array of concept objects
 */
function getNextConcepts(conceptId) {
    return conceptsData.filter(concept =>
        concept.prerequisites.includes(conceptId)
    );
}

/**
 * Get prerequisite concepts for a given concept
 * @param {string} conceptId - The concept ID
 * @returns {Array} Array of concept objects
 */
function getPrerequisites(conceptId) {
    const concept = getConceptById(conceptId);
    if (!concept) return [];

    return concept.prerequisites
        .map(prereqId => getConceptById(prereqId))
        .filter(c => c !== null);
}

/**
 * Check if all prerequisites are mastered for a concept
 * @param {string} conceptId - The concept ID
 * @returns {boolean} True if all prerequisites are mastered
 */
function arePrerequisitesMet(conceptId) {
    const concept = getConceptById(conceptId);
    if (!concept) return false;

    return concept.prerequisites.every(prereqId =>
        Storage.getStatus(prereqId) === 'mastered'
    );
}

/**
 * Get suggested next concepts based on current progress
 * Returns concepts where all prerequisites are mastered but concept is not started
 * @returns {Array} Array of concept objects
 */
function getSuggestedConcepts() {
    return conceptsData.filter(concept => {
        const status = Storage.getStatus(concept.id);
        if (status !== 'not_started') return false;
        return arePrerequisitesMet(concept.id);
    });
}

// Export functions for use in other modules
window.Data = {
    loadConcepts,
    getConceptById,
    getAllConcepts,
    getNextConcepts,
    getPrerequisites,
    arePrerequisitesMet,
    getSuggestedConcepts
};
