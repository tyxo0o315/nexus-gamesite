// filter.js — Mod list filtering logic

document.addEventListener('DOMContentLoaded', () => {
  let activeCategory = 'all';
  let searchText = '';
  let requiredOnly = false;

  // Category chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeCategory = chip.dataset.category;
      rerender();
    });
  });

  // Search input
  const searchInput = document.getElementById('mod-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchText = searchInput.value.trim();
      rerender();
    });
  }

  // Required-only toggle
  const requiredToggle = document.getElementById('filter-required');
  if (requiredToggle) {
    requiredToggle.addEventListener('change', () => {
      requiredOnly = requiredToggle.checked;
      rerender();
    });
  }

  function rerender() {
    if (window.__renderMods) {
      window.__renderMods(SITE_DATA.mods, activeCategory, searchText, requiredOnly);
    }
  }
});
