// Modal dialog utilities

/**
 * Shows a modal dialog with a text input
 * @param {string} title - Modal title
 * @param {string} defaultValue - Default input value
 * @returns {Promise<string|null>} - Resolves with input value or null if cancelled
 */
export function showPatternNameModal(title, defaultValue = '') {
  return new Promise((resolve) => {
    const modal = document.getElementById('patternNameModal');
    const modalTitle = document.getElementById('modalTitle');
    const input = document.getElementById('patternNameInput');
    const saveBtn = document.getElementById('modalSaveBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    
    modalTitle.textContent = title;
    input.value = defaultValue;
    modal.style.display = 'flex';
    
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
    
    const cleanup = () => {
      modal.style.display = 'none';
      saveBtn.onclick = null;
      cancelBtn.onclick = null;
      input.onkeydown = null;
    };
    
    saveBtn.onclick = () => {
      const value = input.value.trim();
      cleanup();
      resolve(value || null);
    };
    
    cancelBtn.onclick = () => {
      cleanup();
      resolve(null);
    };
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        cleanup();
        resolve(value || null);
      } else if (e.key === 'Escape') {
        cleanup();
        resolve(null);
      }
    };
  });
}
