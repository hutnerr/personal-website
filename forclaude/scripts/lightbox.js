document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const enlarged = document.createElement('img');
    enlarged.src = img.src;
    enlarged.alt = img.alt;

    overlay.appendChild(enlarged);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.addEventListener('click', close);

    const onKey = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
  });
});
