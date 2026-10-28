(function () {
    //Use saved config to decide what cards to use and if featured.
    const cfg = window.SHOWCASE_CONFIG || {};

    //pushes the given gallery to the right page.
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

        //Reverse items so it is easier to add new items chronologically.
        const items = featured ? [list[list.length - 1]] : [...list].reverse();

        for (const item of items) {
            const a = document.createElement('a');
            a.className = 'thumb-card';
            a.href = item.url;
            a.target = '_blank';
            a.rel = 'noopener';

            //main page only
            if (featured) {
                const badge = document.createElement('span');
                badge.className = 'latest-badge';
                badge.textContent = kind === 'khan' ? 'Latest program' : 'Latest graph';
                a.append(badge);
            } 

            //Thumbnails with a nicer looking fallback, changes to that fallback also if imageload fails later.
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

            //Create the card elements
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

    //Handles image failure cause it happens.  But shouldn't anymore
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

    //Handle galleries when ready
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
