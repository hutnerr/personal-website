// fills [data-stat] elements with live values from shields.io JSON endpoints
(function () {
    document.querySelectorAll('[data-stat]').forEach(function (el) {
        fetch(el.getAttribute('data-stat'))
            .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
            .then(function (data) {
                if (!data.value || data.value === 'invalid') return;
                el.textContent = data.value;
            })
            .catch(function () {});
    });
})();
