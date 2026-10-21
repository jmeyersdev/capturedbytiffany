/* Captured by Tiffany: motion and routing */
(function () {
  const IMG = "images/Aether-WR-3.jpg.webp";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ======================= DATA ======================= */
  const PROJECTS = [
    { slug: "aether", name: "Aether", meta: [["Client", "SABDIA"], ["Project by", "Koda Design and CHS Building"], ["Client", "ABI Interiors"]] },
    { slug: "belvedere", name: "Belvedere" },
    { slug: "erin-holland-wk-stone", name: "Erin Holland | WK Stone" },
    { slug: "mister-zimi", name: "Mister Zimi" },
    { slug: "the-tahune", name: "The Tahune" },
    { slug: "the-valle-casa", name: "The Valle Casa" },
    { slug: "soho-house", name: "Soho House" },
    { slug: "natalya-robinson", name: "Natalya Robinson | WK Stone" },
    { slug: "arcadia", name: "Arcadia" },
    { slug: "villa-kokomo", name: "Villa Kokomo" },
    { slug: "currumbin-beach-house", name: "Currumbin Beach House" },
    { slug: "35-savoy", name: "35 Savoy", meta: [["Client", "ABI Interiors"]] },
    { slug: "the-courtyard-house", name: "The Courtyard House", meta: [["Client", "ABI Interiors"]] },
    { slug: "scott-st", name: "Scott St" }
  ];
  const PACKAGES = [
    { name: "Design Teaser", count: 15, hours: "Up to 2 hours on site" },
    { name: "Design Essentials", count: 25, hours: "3 to 4 hours on site" },
    { name: "Design Feature", count: 35, hours: "3 to 4 hours on site" },
    { name: "The Signature Set", count: 60, hours: "Up to 5 hours on site" }
  ];

  /* ======================= RENDER ======================= */
  $("#index-list").innerHTML = PROJECTS.map((p, i) => `
    <a class="row fx" href="#work/${p.slug}" data-link>
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <span class="t">${p.name}</span>
      <span class="v">View</span>
    </a>`).join("");

  $("#pk-list").innerHTML = PACKAGES.map(p => `
    <article class="pk fx">
      <h2>${p.name}</h2>
      <p class="pk-n"><span data-count="${p.count}">0</span><small>edited images</small></p>
      <ul>
        <li>${p.count} professionally edited images</li>
        <li>One shoot location</li>
        <li>${p.hours}</li>
        <li>Proof sheets to select your imagery</li>
        <li>Final images delivered in high resolution</li>
      </ul>
      <a href="#home/contact" data-link class="btn magnetic" data-pk="${p.name}"><span>Enquire</span></a>
    </article>`).join("");

  function renderProject(slug) {
    const i = PROJECTS.findIndex(p => p.slug === slug);
    if (i < 0) return false;
    const p = PROJECTS[i], next = PROJECTS[(i + 1) % PROJECTS.length];
    const meta = (p.meta || []).map(([k, v]) => `<div class="fx"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const figs = ["wide", "", "", "wide", "", ""].map((c, n) =>
      `<figure class="${c} reveal-img" data-cursor="Expand"><img src="${IMG}" alt="${p.name}, image ${n + 1}" loading="lazy" data-speed="0.06"></figure>`).join("");
    $("#project").innerHTML = `
      <section class="proj-hero" data-hero>
        <div class="hero-media"><img src="${IMG}" alt="${p.name}" class="hero-img"></div>
        <div class="hero-shade"></div>
        <h1 data-split>${p.name}</h1>
      </section>
      ${meta ? `<dl class="proj-meta">${meta}</dl>` : ""}
      <div class="gallery">${figs}</div>
      <a class="proj-next" href="#work/${next.slug}" data-link data-cursor="Next"><small>Next project</small><span class="t">${next.name}</span></a>`;
    prepare($("#project"));
    return true;
  }

  /* ======================= TEXT SPLITTING ======================= */
  function split(el) {
    if (el.dataset.done) return;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span class="wi" style="--i:${i}">${esc(w)}</span></span>`).join(" ");
    el.dataset.done = 1;
  }
  function scrubSplit(el) {
    if (el.dataset.done) return;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="sw">${esc(w)}</span>`).join(" ");
    el.dataset.done = 1;
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function prepare(root = document) {
    $$("[data-split]", root).forEach(split);
    $$("[data-scrub]", root).forEach(scrubSplit);
  }
  prepare();

  /* ======================= REVEAL ON SCROLL ======================= */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.matches("[data-count]")) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }) : null;

  function watch() {
    const scope = $$(".page:not([hidden]), .ftr");
    scope.forEach(s => {
      $$(".fx:not(.in), [data-split]:not(.in), .reveal-img:not(.in), .count:not(.in)", s).forEach((el, i) => {
        if (el.classList.contains("fx")) el.style.transitionDelay = (i % 4) * 90 + "ms";
        io ? io.observe(el) : el.classList.add("in");
      });
    });
  }

  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 1;
    const end = +el.dataset.count, dur = reduced ? 0 : 1600, t0 = performance.now();
    (function tick(t) {
      const p = dur ? clamp((t - t0) / dur, 0, 1) : 1;
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ======================= ROUTER + PAGE TRANSITIONS ======================= */
  const hdr = $("#hdr"), pages = $$(".page"), curtain = $("#curtain");
  const darkTop = { home: true, project: true, packages: true, work: false };
  let current = null, busy = false;

  function parse() {
    const h = location.hash.replace(/^#\/?/, "");
    let [page, sub] = h.split("/");
    if (page === "main" || page === "intro") return null;
    page = page || "home";
    return { page, sub };
  }

  function show(page, sub) {
    let target = page;
    if (page === "work" && sub) target = renderProject(sub) ? "project" : "work";
    if (!pages.some(p => p.dataset.page === target)) target = "home";
    current = target;
    pages.forEach(p => (p.hidden = p.dataset.page !== target));
    $$(".hdr a[data-link]").forEach(a => a.classList.toggle("on", a.getAttribute("href").slice(1) === (target === "project" ? "work" : target)));
    document.title = ({ home: "", work: "Work | ", packages: "Packages | " }[target] ??
      ($("#project h1")?.getAttribute("aria-label") + " | ")) + "Captured by Tiffany";
    closeDrawer();
    $("#cursor-img").classList.remove("show");
    hdr.classList.remove("hide");
    if (page === "home" && sub === "contact") {
      requestAnimationFrame(() => $("#contact").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
    } else {
      window.scrollTo(0, 0);
    }
    $$(".page:not([hidden]) [data-hero]").forEach(h => { h.classList.remove("ready"); requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("ready"))); });
    watch();
    frame(true);
  }

  function route() {
    const r = parse();
    if (!r) return;
    const nextTarget = r.page === "work" && r.sub ? "project" : r.page;
    // same page (e.g. Contact while on Home): just scroll, no curtain
    if (current && nextTarget === current && nextTarget !== "project") { show(r.page, r.sub); return; }
    if (!current || reduced) { show(r.page, r.sub); return; }
    if (busy) return;
    busy = true;
    curtain.classList.remove("leave");
    curtain.classList.add("cover");
    setTimeout(() => {
      show(r.page, r.sub);
      curtain.classList.replace("cover", "leave");
      setTimeout(() => { curtain.classList.remove("leave"); busy = false; }, 850);
    }, 750);
  }
  addEventListener("hashchange", route);

  /* ======================= SCROLL-DRIVEN EFFECTS ======================= */
  const progress = $("#progress");
  let lastY = scrollY, ticking = false;

  function frame(force) {
    const y = scrollY, vh = innerHeight;
    // header state
    const solid = !darkTop[current] || y > vh * 0.75 || !$("#drawer").hidden;
    hdr.classList.toggle("solid", solid);
    if (!force && y > vh * 0.9) hdr.classList.toggle("hide", y > lastY + 2 ? true : y < lastY - 2 ? false : hdr.classList.contains("hide"));
    else hdr.classList.remove("hide");
    lastY = y;

    // progress bar
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (reduced) return;

    // hero parallax + fade
    const hero = $(".page:not([hidden]) [data-hero]");
    if (hero) {
      const p = clamp(y / hero.offsetHeight, 0, 1);
      const media = $(".hero-media", hero), txt = $(".hero-text, h1", hero), foot = $(".hero-foot", hero);
      media.style.transform = `translate3d(0,${y * 0.4}px,0)`;
      if (txt) { txt.style.transform = `translate3d(0,${-y * 0.18}px,0)`; txt.style.opacity = 1 - p * 1.3; }
      if (foot) foot.style.opacity = 1 - p * 2;
    }

    // image parallax
    $$(".page:not([hidden]) [data-speed]").forEach(img => {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      const centre = (box.top + box.height / 2 - vh / 2) / vh;
      img.style.transform = `translate3d(0,${centre * -100 * +img.dataset.speed}%,0) scale(${img.closest(".reveal-img:not(.in)") ? 1.3 : 1.08})`;
    });

    // architecture image grows to full width as it scrolls in
    $$(".page:not([hidden]) [data-grow]").forEach(el => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * 0.9), 0, 1);
      const inset = (1 - p) * 12;
      el.style.clipPath = `inset(${inset * 0.6}% ${inset}% ${inset * 0.6}% ${inset}%)`;
    });

    // statement words light up as you scroll
    $$(".page:not([hidden]) [data-scrub]").forEach(el => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const words = $$(".sw", el), lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    });
  }
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { frame(); ticking = false; }); }
  }, { passive: true });
  addEventListener("resize", () => frame(true));

  /* ======================= CUSTOM CURSOR ======================= */
  const cur = $("#cursor"), label = $(".cursor-label", cur), ci = $("#cursor-img");
  let mx = -100, my = -100, cx = -100, cy = -100, ix = 0, iy = 0;
  if (finePointer && !reduced) {
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; cur.classList.add("on"); }, { passive: true });
    document.addEventListener("mouseleave", () => cur.classList.remove("on"));
    document.addEventListener("mouseover", e => {
      const big = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, label, input, textarea");
      cur.classList.toggle("big", !!big);
      cur.classList.toggle("link", !big && !!link);
      if (big) label.textContent = big.dataset.cursor;
      if (e.target.closest("#index-list .row")) ci.classList.add("show");
      else if (!e.target.closest("#index-list")) ci.classList.remove("show");
    });
    (function loop() {
      cx = lerp(cx, mx, 0.2); cy = lerp(cy, my, 0.2);
      ix = lerp(ix, mx, 0.1); iy = lerp(iy, my, 0.1);
      cur.style.left = cx + "px"; cur.style.top = cy + "px";
      ci.style.left = ix + "px"; ci.style.top = iy + "px";
      requestAnimationFrame(loop);
    })();
  }
  $("#index-list").addEventListener("mouseleave", () => ci.classList.remove("show"));

  /* ======================= MAGNETIC BUTTONS ======================= */
  if (finePointer && !reduced) {
    document.addEventListener("mousemove", e => {
      $$(".page:not([hidden]) .magnetic").forEach(b => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height);
        b.style.transform = near ? `translate(${dx * 0.25}px,${dy * 0.35}px)` : "";
        b.style.transition = near ? "transform .2s ease-out, color .5s" : "transform .8s cubic-bezier(.16,.8,.2,1), color .5s";
      });
    }, { passive: true });
  }

  /* ======================= DRAWER ======================= */
  const burger = $(".burger"), drawer = $("#drawer");
  function closeDrawer() { drawer.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  burger.addEventListener("click", () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    frame(true);
  });

  /* ======================= CLICKS: lightbox, package prefill, top ======================= */
  const lb = $("#lb");
  document.addEventListener("click", e => {
    const f = e.target.closest(".gallery figure");
    if (f) { $("img", lb).src = $("img", f).src; lb.hidden = false; return; }
    if (e.target === lb || e.target.closest(".lb button")) lb.hidden = true;
    const pk = e.target.closest("[data-pk]");
    if (pk) setTimeout(() => { const t = $("#form textarea"); if (!t.value) t.value = `I'm interested in the ${pk.dataset.pk} package.\n\n`; }, 900);
  });
  addEventListener("keydown", e => { if (e.key === "Escape") { lb.hidden = true; closeDrawer(); } });
  $("#to-top").addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  /* ======================= FORM ======================= */
  const form = $("#form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    $$(".bad", form).forEach(x => x.classList.remove("bad"));
    void form.offsetWidth; // restart shake animation
    const bad = [];
    $$("[required]", form).forEach(i => {
      const v = i.value.trim();
      if (!v || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(v))) { i.closest(".field").classList.add("bad"); bad.push(i); }
    });
    const [fsWork, fsSrc] = $$("fieldset", form);
    const work = $$("[name=workType]:checked", form).map(i => i.value);
    const src = $("[name=source]:checked", form);
    if (!work.length) { fsWork.classList.add("bad"); bad.push($("input", fsWork)); }
    if (!src) { fsSrc.classList.add("bad"); bad.push($("input", fsSrc)); }
    const err = $(".err", form);
    if (bad.length) { err.textContent = "Please complete the highlighted fields."; err.hidden = false; bad[0].focus({ preventScroll: true }); bad[0].closest(".field").scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    err.hidden = true;
    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.firstName} ${d.lastName}\nEmail: ${d.email}\nType of work: ${work.join(", ")}\nLocation: ${d.location}\nFound via: ${src.value}\n\nProject details:\n${d.details}`;
    location.href = "mailto:hello@capturedbytiffany.com?subject=" +
      encodeURIComponent(`New enquiry from ${d.firstName} ${d.lastName}`) + "&body=" + encodeURIComponent(body);
    $(".ok", form).hidden = false;
  });

  /* ======================= INTRO LOADER ======================= */
  const loader = $("#loader"), bar = $(".loader-bar span", loader);
  const r0 = parse() || { page: "home" };
  show(r0.page, r0.sub);
  $$("[data-hero]").forEach(h => h.classList.remove("ready"));
  // hold reveals until the loader lifts
  const held = $$(".page:not([hidden]) [data-hero] [data-split]");
  held.forEach(el => io && io.unobserve(el));

  let pct = 0;
  const minTime = reduced ? 0 : 1300, start = performance.now();
  let loaded = document.readyState === "complete";
  addEventListener("load", () => (loaded = true));
  (function fill() {
    const t = performance.now() - start;
    pct = Math.min(loaded ? 1 : 0.85, t / minTime);
    bar.style.transform = `scaleX(${pct})`;
    if (pct >= 1 || (loaded && t >= minTime)) return finish();
    if (t > 6000) return finish(); // never block on slow networks
    requestAnimationFrame(fill);
  })();
  function finish() {
    bar.style.transform = "scaleX(1)";
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("loading");
      $$(".page:not([hidden]) [data-hero]").forEach(h => h.classList.add("ready"));
      setTimeout(() => held.forEach(el => el.classList.add("in")), 350);
      setTimeout(() => loader.remove(), 1200);
    }, reduced ? 0 : 250);
  }
})();
