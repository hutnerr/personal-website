document.querySelectorAll('.game-embed-placeholder').forEach(placeholder => {
  placeholder.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = placeholder.dataset.src;
    iframe.width = placeholder.dataset.width || 640;
    iframe.height = placeholder.dataset.height || 380;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.className = 'itch-embed';
    placeholder.replaceWith(iframe);
  });
});
