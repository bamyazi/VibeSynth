// Drum grid UI
import { DRUM_NAMES } from '../config.js';
import { clearDrumPatternData } from '../pattern.js';

export function createDrumUI(drumSequencerEl, drumNames, drumPattern) {
  const header = document.createElement("div");
  header.className = "seq-header";

  const labelCell = document.createElement("div");
  labelCell.textContent = "Drum";
  header.appendChild(labelCell);

  for (let step = 0; step < 16; step++) {
    const stepCell = document.createElement("div");
    stepCell.textContent = step + 1;
    header.appendChild(stepCell);
  }

  drumSequencerEl.appendChild(header);

  DRUM_NAMES.forEach((name, drumIndex) => {
    const row = document.createElement("div");
    row.className = "seq-row";

    const rowLabel = document.createElement("div");
    rowLabel.className = "seq-row-label";
    rowLabel.textContent = name;
    row.appendChild(rowLabel);

    for (let step = 0; step < 16; step++) {
      const cell = document.createElement("div");
      cell.className = "seq-grid-cell";
      cell.dataset.drum = drumIndex;
      cell.dataset.step = step;

      cell.addEventListener("click", () => {
        const d = parseInt(cell.dataset.drum, 10);
        const s = parseInt(cell.dataset.step, 10);
        drumPattern[d][s] = !drumPattern[d][s];
        cell.classList.toggle("active", drumPattern[d][s]);
      });

      row.appendChild(cell);
    }

    drumSequencerEl.appendChild(row);
  });
}

export function clearDrumPatterns(drumPattern) {
  clearDrumPatternData(drumPattern);
  
  const selector = `.seq-grid-cell[data-drum]`;
  document.querySelectorAll(selector).forEach(cell => cell.classList.remove("active"));
}
