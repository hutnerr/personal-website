(function () {
    var path = window.location.pathname;
    var section =
        (path === '/' || /\/index\.html$/.test(path)) ? 'home' :
        (/\/pages\/projects\//.test(path) || /\/nav\/projects\.html$/.test(path)) ? 'projects' :
        (/\/nav\/contact\.html$/.test(path)) ? 'contact' :
        (/\/pages\/other\//.test(path) || /\/nav\/other\.html$/.test(path) || /\/pages\/games\//.test(path)) ? 'other' : '';
    if (!section) return;
    document.querySelectorAll('.site-nav a').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (
            (section === 'home' && href.endsWith('index.html')) ||
            (section === 'projects' && href.includes('projects')) ||
            (section === 'contact' && href.includes('contact')) ||
            (section === 'other' && href.includes('other'))
        ) {
            a.classList.add('nav-active');
        }
    });
}());
