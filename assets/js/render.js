/* Mengisi halaman dari window.CONTENT; mode casual (CONTENT_CASUAL) sementara cuma halaman coming soon. Semua teks lewat textContent, tidak ada innerHTML dari data. */
(function () {
  "use strict";
  var PRO = window.CONTENT;
  var CASUAL = window.CONTENT_CASUAL;
  if (!PRO) return;
  var MODE_KEY = "porto-mode";
  var mode = "pro";
  var activeTab = null;

  function $(id) { return document.getElementById(id); }

  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) node.className = opts.cls;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.attrs) Object.keys(opts.attrs).forEach(function (k) { node.setAttribute(k, opts.attrs[k]); });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  // "*kata*" jadi <mark>kata</mark>, sisanya text node biasa
  function rich(node, text) {
    String(text).split(/\*(.+?)\*/).forEach(function (part, i) {
      if (part) node.appendChild(i % 2 ? el("mark", { text: part }) : document.createTextNode(part));
    });
    return node;
  }

  function clear(id) { var n = $(id); n.textContent = ""; return n; }

  function isExternal(href) { return /^https?:\/\//i.test(href); }

  function link(item, cls) {
    var a = el("a", { cls: cls, text: item.label, attrs: { href: item.href } });
    if (isExternal(item.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }

  function tags(list, label) {
    var ul = el("ul", { cls: "tags", attrs: label ? { "aria-label": label } : {} });
    (list || []).forEach(function (s) { ul.appendChild(el("li", { text: s })); });
    return list && list.length ? ul : null;
  }

  function points(list) {
    if (!list || !list.length) return null;
    var ul = el("ul", { cls: "points" });
    list.forEach(function (t) { ul.appendChild(rich(el("li"), t)); });
    return ul;
  }

  function renderProjects(C) {
    var P = C.projects;
    if (!P.tabs.some(function (t) { return t.id === activeTab; })) activeTab = P.tabs[0].id;

    var tabBox = clear("project-tabs");
    P.tabs.forEach(function (t) {
      var b = el("button", {
        text: t.label,
        attrs: { type: "button", role: "tab", "aria-selected": String(t.id === activeTab), "aria-controls": "projects-list" },
      });
      b.addEventListener("click", function () { activeTab = t.id; renderProjects(C); });
      tabBox.appendChild(b);
    });

    var list = clear("projects-list");
    list.scrollLeft = 0;
    var tab = P.tabs.filter(function (t) { return t.id === activeTab; })[0];

    tab.items.forEach(function (p) {
      var card = el("article", { cls: "card" }, [
        el("span", { cls: "dot", attrs: { "aria-hidden": "true" } }),
        p.kind ? el("p", { cls: "kind", text: p.kind }) : null,
        el("h3", { text: p.title }),
        p.summary ? rich(el("p"), p.summary) : null,
        p.approach ? el("details", {}, [el("summary", { text: P.howLabel }), el("p", { text: p.approach })]) : null,
        p.results && p.results.length ? el("p", { cls: "sub", text: tab.resultLabel || P.resultLabel }) : null,
        points(p.results),
        tags(p.stack, "Tools and methods"),
      ]);
      var links = (p.links || []).filter(function (l) { return l.href; });
      if (links.length) {
        var ll = el("ul", { cls: "card-links" });
        links.forEach(function (l) { ll.appendChild(el("li", {}, [link(l)])); });
        card.appendChild(ll);
      }
      list.appendChild(card);
    });

    // Kartu "coming soon" di ujung carousel, kecuali tab-nya pakai comingSoon: false
    if (P.comingSoon && tab.comingSoon !== false) {
      list.appendChild(el("article", { cls: "card soon" }, [
        el("span", { cls: "plus", text: "+", attrs: { "aria-hidden": "true" } }),
        el("h3", { text: P.comingSoon.title }),
        el("p", { text: P.comingSoon.text }),
      ]));
    }
  }

  function render(C) {
    // Meta
    document.documentElement.lang = C.lang || "en";
    document.title = C.meta.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", C.meta.description);

    // Header + mode
    $("mode-label").textContent = C.modeLabel;
    var upd = C.lastUpdated;
    if (upd && upd.date) {
      var d = new Date(upd.date + "T00:00:00");
      var when = el("time", { attrs: { datetime: upd.date },
        text: d.toLocaleDateString(C.lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) });
      var u = clear("last-updated");
      u.appendChild(document.createTextNode(upd.label + " · "));
      u.appendChild(when);
    }
    var nav = clear("nav");
    C.nav.forEach(function (n) { nav.appendChild(el("li", {}, [link(n)])); });

    // Profile
    // Inisial selalu ada di belakang; foto menutupinya, dan dihapus kalau file-nya belum ada
    var photo = clear("photo");
    photo.appendChild(el("span", { text: C.hero.initials, attrs: { "aria-hidden": "true" } }));
    if (C.hero.photo) {
      var img = el("img", { attrs: { src: C.hero.photo, alt: C.hero.name } });
      img.addEventListener("error", function () { img.remove(); });
      photo.appendChild(img);
    }
    $("hero-role").textContent = C.hero.role;
    $("hero-name").textContent = C.hero.name;
    var lines = clear("hero-lines");
    C.hero.lines.forEach(function (l) { lines.appendChild(el("li", { text: l })); });

    // About
    $("about-heading").textContent = C.about.heading;
    var about = clear("about-body");
    C.about.paragraphs.forEach(function (p) { about.appendChild(rich(el("p"), p)); });
    var hl = clear("about-highlights");
    (C.about.highlights || []).forEach(function (h) { hl.appendChild(el("li", { text: h })); });
    var skills = clear("about-skills");
    (C.about.skills || []).forEach(function (s) { skills.appendChild(el("li", { text: s })); });
    var cta = clear("hero-cta");
    (C.about.cta || []).forEach(function (b) { cta.appendChild(link(b, "btn" + (b.primary ? " primary" : ""))); });

    // Work experience
    $("work-heading").textContent = C.work.heading;
    var work = clear("work-list");
    C.work.items.forEach(function (j) {
      work.appendChild(el("article", { cls: "card" }, [
        el("span", { cls: "dot", attrs: { "aria-hidden": "true" } }),
        el("p", { cls: "kind", text: j.org + (j.period ? " · " + j.period : "") }),
        el("h3", { text: j.role }),
        j.summary ? rich(el("p"), j.summary) : null,
        j.did && j.did.length ? el("p", { cls: "sub", text: C.work.didLabel }) : null,
        points(j.did),
        tags(j.skills, "Skills"),
      ]));
    });

    // Project experience
    $("projects-heading").textContent = C.projects.heading;
    renderProjects(C);

    // Contact: link kosong tidak ditampilkan; kalau semuanya kosong, section + menu disembunyikan
    var contactLinks = C.contact.links.filter(function (l) { return l.href; });
    $("contact").hidden = !contactLinks.length;
    if (!contactLinks.length) {
      var contactNav = nav.querySelector('a[href="#contact"]');
      if (contactNav) contactNav.parentNode.remove();
    }
    rich(clear("contact-heading"), C.contact.heading);
    $("contact-text").textContent = C.contact.text;
    var cl = clear("contact-links");
    contactLinks.forEach(function (l, i) { cl.appendChild(el("li", {}, [link(l, "btn" + (i === 0 ? " primary" : ""))])); });

    // Footer
    $("footer-text").textContent = C.footer;
  }

  function setMode(next) {
    mode = next === "casual" && CASUAL ? "casual" : "pro";
    var casual = mode === "casual";
    document.body.classList.toggle("is-casual", casual);
    document.documentElement.lang = (casual ? CASUAL : PRO).lang || "en";
    $("mode-label").textContent = (casual ? CASUAL : PRO).modeLabel;
    if (casual) {
      $("soon-tag").textContent = CASUAL.soon.tag;
      rich(clear("soon-title"), CASUAL.soon.title);
      $("soon-text").textContent = CASUAL.soon.text;
    }
    document.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode));
    });
    try { localStorage.setItem(MODE_KEY, mode); } catch (e) { /* storage diblokir: abaikan */ }
  }

  document.querySelectorAll("[data-mode]").forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });

  // Tombol panah carousel
  document.querySelectorAll("[data-rail]").forEach(function (b) {
    b.addEventListener("click", function () {
      var rail = $(b.getAttribute("data-rail"));
      rail.scrollBy({ left: Number(b.getAttribute("data-dir")) * rail.clientWidth * 0.9, behavior: "smooth" });
    });
  });

  // Favicon: D script pink chrome tanpa latar, digambar setelah font-nya termuat.
  // Posisi dihitung dari bentuk huruf yang sebenarnya supaya pas di tengah.
  function drawFavicon() {
    var S = 64, PAD = 3;
    var c = document.createElement("canvas");
    c.width = c.height = S;
    var x = c.getContext("2d");
    x.font = '100px "Pinyon Script"';
    var m = x.measureText("D");
    var w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    var h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    var scale = (S - PAD * 2) / Math.max(w, h);
    x.translate(S / 2, S / 2);
    x.scale(scale, scale);
    x.translate((m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2, (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
    var g = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    g.addColorStop(0, "#ff5fae"); g.addColorStop(0.4, "#ff3d9a");
    g.addColorStop(0.6, "#ff8fc6"); g.addColorStop(1, "#c77dff");
    x.fillStyle = g;
    x.fillText("D", 0, 0);
    $("favicon").href = c.toDataURL("image/png");
  }
  if (document.fonts && document.fonts.load) {
    document.fonts.load('50px "Pinyon Script"').then(function (f) { if (f.length) drawFavicon(); }, function () {});
  }

  // Menu hamburger (mobile): buka/tutup, tutup lagi saat link dipilih, klik di luar, atau tekan Esc
  var header = document.querySelector(".site-header");
  var menuBtn = $("menu-btn");
  function setMenu(open) {
    header.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("open")); });
  $("nav").addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", function (e) { if (!header.contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 641px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  render(PRO);
  var saved = "pro";
  try { saved = localStorage.getItem(MODE_KEY) || "pro"; } catch (e) { /* abaikan */ }
  setMode(saved);
})();
