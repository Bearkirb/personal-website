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
                img.loading = 'eager';
                img.alt = (item.title || 'project') + ' thumbnail';
                img.referrerPolicy = 'no-referrer';
                a.append(img);
                loadThumb(img, item.thumb, a);
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

    // Khan Academy blocks hotlinked images from non-browser requests
    // (bot challenge), and rate-limits real browsers sometimes. There's
    // no reliable proxy workaround: image proxies can't pass the
    // challenge either, and wsrv.nl responds HTTP 200 with its own
    // "noimage" placeholder — which silently replaces our fallback.
    // So: try the direct URL (works with the visitor's own browser
    // session); if it fails, swap in the styled placeholder tile so
    // nothing looks broken.
    function loadThumb(img, src, card) {
        img.onerror = () => {
            img.remove();
            const fb = document.createElement('div');
            fb.className = 'thumb-fallback';
            fb.textContent = '</>';
            card.insertBefore(fb, card.firstChild);
        };

        img.src = src;
    }

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(() => {
        const khanEl = document.getElementById('khan-gallery');
        if (khanEl && cfg.khan) {
            if (cfg.featured) khanEl.classList.add('featured');
            renderList(cfg.khan, 'khan', khanEl, !!cfg.featured);
        }
        const desmosEl = document.getElementById('desmos-gallery');
        if (desmosEl && cfg.desmos) {
            if (cfg.featured) desmosEl.classList.add('featured');
            renderList(cfg.desmos, 'desmos', desmosEl, !!cfg.featured);
        }
    });
})();
