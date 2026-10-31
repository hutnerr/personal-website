// Filters the projects grid. Each .filter-group contributes one active filter;
// a card is shown when it matches all of them. A card's tags are its
// data-tags plus its status (read from the .status-badge--* class).
document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.card[data-tags]'));
    const count = document.getElementById('filter-count');
    const empty = document.getElementById('filter-empty');

    cards.forEach(card => {
        const tags = card.dataset.tags.split(' ');
        const badge = card.querySelector('[class*="status-badge--"]');
        if (badge) tags.push(badge.className.match(/status-badge--(\w+)/)[1]);
        card._tags = tags;
    });

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

        let shown = 0;
        cards.forEach(card => {
            const visible = activeFilters.every(f => f === 'all' || card._tags.includes(f));
            card.style.display = visible ? '' : 'none';
            if (visible) shown++;
        });

        if (count) count.textContent = 'showing ' + shown + ' of ' + cards.length;
        if (empty) empty.hidden = shown > 0;

        const banner = document.getElementById('game-jams-banner');
        if (banner) banner.style.display = activeFilters.includes('games') ? '' : 'none';
    }

    applyFilters();
});
