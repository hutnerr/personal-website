document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.filter-group').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

function applyFilters() {
  const activeFilters = Array.from(document.querySelectorAll('.filter-group')).map(group => {
    const active = group.querySelector('.filter-btn.active');
    return active ? active.dataset.filter : 'all';
  });

  document.querySelectorAll('.card[data-tags]').forEach(card => {
    const tags = card.dataset.tags.split(' ');
    const visible = activeFilters.every(f => f === 'all' || tags.includes(f));
    card.style.display = visible ? '' : 'none';
  });
}

// Pre-activate filters from URL query params (?game=forgotten-paths&type=devlog)
const params = new URLSearchParams(window.location.search);
document.querySelectorAll('.filter-group[data-param]').forEach(group => {
  const value = params.get(group.dataset.param);
  if (!value) return;
  const btn = group.querySelector(`.filter-btn[data-filter="${value}"]`);
  if (!btn) return;
  group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});
applyFilters();
