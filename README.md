# Portfolio (static site)

HTML + CSS + vanilla JS. No build step.

## Edit content
Everything you see on the page lives in `assets/data/content.pro.js`. Edit that file, not `index.html`.
- Empty links (`href: ""`) are hidden automatically.
- Fill in at least one contact link before sharing the site.

## Edit look
Colors, fonts, and spacing are CSS variables at the top of `assets/css/style.css`.

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder.

## Deploy (Netlify, free)
1. Push this folder to a GitHub repository.
2. Netlify > Add new site > Import an existing project > pick the repo.
3. Build command: leave empty. Publish directory: `.`
4. Every `git push` to the main branch redeploys automatically.

- Casual mode lives in `assets/data/content.casual.js`: it only lists what differs from the professional version.
- Wrap a word in `*stars*` to highlight it in butter yellow.
- Bump `lastUpdated.date` whenever you change the content.
