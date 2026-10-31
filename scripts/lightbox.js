// Images with data-lightbox open full size. Images in the same <section>
// form a sequence that can be stepped through with the arrow buttons or keys.
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous image">&lsaquo;</button>' +
        '<img class="lightbox-img" alt="" />' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next image">&rsaquo;</button>' +
        '<span class="lightbox-counter"></span>';
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-img');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    const counter = overlay.querySelector('.lightbox-counter');

    let group = [];
    let index = 0;

    function show(i) {
        index = (i + group.length) % group.length;
        const img = group[index];
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        counter.textContent = (index + 1) + ' / ' + group.length;
    }

    function open(img) {
        const scope = img.closest('section') || document.body;
        group = Array.from(scope.querySelectorAll('img[data-lightbox]'));
        overlay.classList.toggle('single', group.length < 2);
        show(group.indexOf(img));
        overlay.classList.add('active');
    }

    function close() {
        overlay.classList.remove('active');
    }

    document.querySelectorAll('img[data-lightbox]').forEach(img => {
        img.addEventListener('click', () => open(img));
    });

    prevBtn.addEventListener('click', e => { e.stopPropagation(); show(index - 1); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); show(index + 1); });
    lightboxImg.addEventListener('click', e => e.stopPropagation());
    overlay.addEventListener('click', close);

    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        else if (group.length < 2) return;
        else if (e.key === 'ArrowLeft' || e.key === '<' || e.key === ',') show(index - 1);
        else if (e.key === 'ArrowRight' || e.key === '>' || e.key === '.') show(index + 1);
    });
});
