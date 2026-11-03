/* Mengisi halaman dari window.CONTENT. Semua teks lewat textContent, tidak ada innerHTML dari data. */
(function () {
  "use strict";
  var CONTENT = window.CONTENT;
  if (!CONTENT) return;
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

  // Kotak gambar hanya untuk item yang punya field image (boleh kosong).
  // Huruf pertama judul selalu ada di belakang; gambar menutupinya, dan dihapus kalau file-nya belum ada
  function thumb(p) {
    if (!("image" in p)) return null;
    var box = el("div", { cls: "thumb" }, [el("span", { text: (p.title || p.org).charAt(0), attrs: { "aria-hidden": "true" } })]);
    if (p.image) {
      var img = el("img", { attrs: { src: p.image, alt: "" } });
      img.addEventListener("error", function () { img.remove(); });
      box.appendChild(img);
    }
    return box;
  }

  function liveLinks(p) { return (p.links || []).filter(function (l) { return l.href; }); }

  // Isi lengkap satu item: dipakai popup detail dan kartu tab yang tidak pakai popup.
  // Di popup, link tidak ikut karena sudah jadi tombol di kartunya.
  function fullInfo(p, tab, P, noLinks) {
    var links = noLinks ? [] : liveLinks(p);
    var ll = null;
    if (links.length) {
      ll = el("ul", { cls: "card-links" });
      links.forEach(function (l) { ll.appendChild(el("li", {}, [link(l)])); });
    }
    return [
      p.kind ? el("p", { cls: "kind", text: p.kind }) : null,
      el("h3", { text: p.title }),
      p.summary ? rich(el("p"), p.summary) : null,
      p.approach ? el("p", { cls: "sub", text: P.howLabel }) : null,
      p.approach ? el("p", { text: p.approach }) : null,
      p.results && p.results.length ? el("p", { cls: "sub", text: tab.resultLabel || P.resultLabel }) : null,
      points(p.results),
      tags(p.stack, "Tools and methods"),
      ll,
    ];
  }

  function dot() { return el("span", { cls: "dot", attrs: { "aria-hidden": "true" } }); }

  // Logo kecil di kartu pengalaman kerja; kalau file-nya tidak ada, kembali ke bulatan warna
  function logo(j) {
    if (!j.logo) return null;
    var img = el("img", { cls: "logo", attrs: { src: j.logo, alt: j.org } });
    img.addEventListener("error", function () { img.replaceWith(dot()); });
    return img;
  }

  function openDetail(p, tab, P) {
    var body = clear("detail-body");
    [p.image ? thumb(p) : null].concat(fullInfo(p, tab, P, true)).forEach(function (n) { if (n) body.appendChild(n); });
    body.querySelector("h3").id = "detail-title";
    $("detail").showModal();
    body.scrollTop = 0;
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
    var tab = P.tabs.filter(function (t) { return t.id === activeTab; })[0];

    tab.items.forEach(function (p) {
      if (!tab.popup) {
        list.appendChild(el("article", { cls: "card" }, [thumb(p) || dot()].concat(fullInfo(p, tab, P))));
        return;
      }
      var more = el("button", { cls: "btn", text: P.detailLabel, attrs: { type: "button", "aria-haspopup": "dialog", "aria-label": P.detailLabel + ": " + p.title } });
      more.addEventListener("click", function () { openDetail(p, tab, P); });
      // Tombol Detail + link projek (mis. coba website-nya) langsung di kartu
      var actions = el("div", { cls: "card-actions" }, [more]);
      liveLinks(p).forEach(function (l) { actions.appendChild(link(l, "btn primary")); });
      list.appendChild(el("article", { cls: "card project" }, [thumb(p), el("h3", { text: p.title }), actions]));
    });

    // Kartu "coming soon" di ujung daftar, kecuali tab-nya pakai comingSoon: false
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

    // Header
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
    var facts = clear("about-facts");
    C.about.forEach(function (g) {
      if (!g.items || !g.items.length) return;
      var ul = el("ul", { cls: g.tags ? "tags" : "highlights" });
      g.items.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
      facts.appendChild(el("div", {}, [el("h2", { cls: "label", text: g.label }), ul]));
    });

    // Work experience
    $("work-heading").textContent = C.work.heading;
    var work = clear("work-list");
    C.work.items.forEach(function (j) {
      work.appendChild(el("article", { cls: "card" }, [
        logo(j) || dot(),
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

  // Popup detail projek: tutup lewat tombol X, klik di luar kotak, atau Esc (bawaan <dialog>)
  $("detail-close").addEventListener("click", function () { $("detail").close(); });
  $("detail").addEventListener("click", function (e) { if (e.target === $("detail")) $("detail").close(); });

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

  render(CONTENT);
})();
