(function () {
    const cfg = window.SHOWCASE_CONFIG || {};

    function renderList(list, kind, container, featured) {
        if (!list || !list.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-note';
            empty.textContent = kind === 'khan'
                ? 'No programs yet — add some in data.js!'
                : 'No graphs yet — add some in data.js!';
            container.append(empty);
            return;
        }

        const items = featured ? [list[list.length - 1]] : [...list].reverse();

        for (const item of items) {
            const a = document.createElement('a');
            a.className = 'thumb-card';
            a.href = item.url;
            a.target = '_blank';
            a.rel = 'noopener';

            if (featured) {
                const badge = document.createElement('span');
                badge.className = 'latest-badge';
                badge.textContent = kind === 'khan' ? 'Latest program' : 'Latest graph';
                a.append(badge);
            }

            if (item.thumb) {
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = item.thumb;
                img.alt = (item.title || 'project') + ' thumbnail';
                a.append(img);
            } else {
                const fb = document.createElement('div');
                fb.className = 'thumb-fallback';
                fb.textContent = kind === 'khan' ? '</>' : 'ƒ(x)';
                a.append(fb);
            }

            const info = document.createElement('div');
            info.className = 'info';
            const h3 = document.createElement('h3');
            h3.textContent = item.title || 'Untitled';
            const p = document.createElement('p');
            p.textContent = item.desc || '';
            info.append(h3, p);

            a.append(info);
            container.append(a);
        }
    }

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(() => {
        const khanEl = document.getElementById('khan-gallery');
        if (khanEl && cfg.khan) renderList(cfg.khan, 'khan', khanEl, !!cfg.featured);
        const desmosEl = document.getElementById('desmos-gallery');
        if (desmosEl && cfg.desmos) renderList(cfg.desmos, 'desmos', desmosEl, !!cfg.featured);
    });
})();
