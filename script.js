/* Captured By Tiffany — v2 */
(function () {
  const IMG = "images/Aether-WR-3.jpg.webp";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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
    { name: "Design Essentials", count: 25, hours: "3 – 4 hours on site" },
    { name: "Design Feature", count: 35, hours: "3 – 4 hours on site" },
    { name: "The Signature Set", count: 60, hours: "Up to 5 hours on site" }
  ];

  /* ---------- work index ---------- */
  $("#index-list").innerHTML = PROJECTS.map((p, i) => `
    <a class="row fx" href="#work/${p.slug}" data-link>
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <span class="t">${p.name}</span>
      <span class="v">View</span>
    </a>`).join("");

  // floating image that follows the cursor over the index
  const ci = $("#cursor-img");
  let cx = 0, cy = 0, tx = 0, ty = 0, raf;
  const list = $("#index-list");
  list.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; if (!raf) loop(); });
  list.addEventListener("mouseover", e => { if (e.target.closest(".row")) ci.classList.add("show"); });
  list.addEventListener("mouseleave", () => ci.classList.remove("show"));
  function loop() {
    cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
    ci.style.left = cx + "px"; ci.style.top = cy + "px";
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(loop) : null;
  }

  /* ---------- packages ---------- */
  $("#pk-list").innerHTML = PACKAGES.map(p => `
    <article class="pk fx">
      <h2>${p.name}</h2>
      <p class="pk-n">${p.count}<small>Edited images</small></p>
      <ul>
        <li>${p.count} professionally edited images</li>
        <li>One shoot location</li>
        <li>${p.hours}</li>
        <li>Proof sheets to select your imagery</li>
        <li>Final images delivered in high resolution</li>
      </ul>
      <a href="#home/contact" data-link class="btn" data-pk="${p.name}">Enquire</a>
    </article>`).join("");

  /* ---------- project page ---------- */
  function renderProject(slug) {
    const i = PROJECTS.findIndex(p => p.slug === slug);
    if (i < 0) return false;
    const p = PROJECTS[i], next = PROJECTS[(i + 1) % PROJECTS.length];
    const meta = (p.meta || []).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const figs = ["wide", "", "", "wide", "", ""].map((c, n) =>
      `<figure class="${c} fx"><img src="${IMG}" alt="${p.name}, image ${n + 1}" loading="lazy"></figure>`).join("");
    $("#project").innerHTML = `
      <section class="proj-hero">
        <img src="${IMG}" alt="${p.name}" class="hero-img">
        <div class="hero-shade"></div>
        <h1>${p.name}</h1>
      </section>
      ${meta ? `<dl class="proj-meta">${meta}</dl>` : ""}
      <div class="gallery">${figs}</div>
      <a class="proj-next" href="#work/${next.slug}" data-link><small>Next Project</small><span>${next.name}</span></a>`;
    return true;
  }

  /* ---------- router ---------- */
  const hdr = $("#hdr");
  const pages = $$(".page");
  // pages whose top is a dark full-bleed image get a light header
  const darkTop = { home: true, project: true, packages: true, work: false };
  let current = "home";

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    if (h === "main" || h === "intro") return;
    let [page, sub] = h.split("/");
    page = page || "home";
    let target = page;
    if (page === "work" && sub) target = renderProject(sub) ? "project" : "work";
    if (!pages.some(p => p.dataset.page === target)) target = "home";
    current = target;

    pages.forEach(p => (p.hidden = p.dataset.page !== target));
    $$(".hdr a[data-link]").forEach(a => {
      const href = a.getAttribute("href").slice(1);
      a.classList.toggle("on", href === (target === "project" ? "work" : target));
    });
    document.title = ({ home: "", work: "Work | ", packages: "Packages | " }[target] ??
      ($("#project h1")?.textContent + " | ")) + "Captured By Tiffany";
    closeDrawer();
    ci.classList.remove("show");

    if (page === "home" && sub === "contact") {
      requestAnimationFrame(() => $("#contact").scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo(0, 0);
    }
    onScroll();
    watch();
  }
  window.addEventListener("hashchange", route);

  /* ---------- header state + parallax ---------- */
  function onScroll() {
    const solid = !darkTop[current] || scrollY > innerHeight * 0.75;
    hdr.classList.toggle("solid", solid || !$("#drawer").hidden);
    const par = $(".page:not([hidden]) [data-parallax]");
    if (par && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = par.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const prog = (innerHeight - r.top) / (innerHeight + r.height);
        par.style.transform = `translateY(${-prog * 16}%)`;
      }
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- reveal ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }) : null;
  function watch() {
    $$(".page:not([hidden]) .fx:not(.in)").forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 110 + "ms";
      io ? io.observe(el) : el.classList.add("in");
    });
  }

  /* ---------- mobile drawer ---------- */
  const burger = $(".burger"), drawer = $("#drawer");
  function closeDrawer() { drawer.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  burger.addEventListener("click", () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    onScroll();
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lb");
  document.addEventListener("click", e => {
    const f = e.target.closest(".gallery figure");
    if (f) { $("img", lb).src = $("img", f).src; lb.hidden = false; return; }
    if (e.target === lb || e.target.closest(".lb button")) lb.hidden = true;
    const pk = e.target.closest("[data-pk]");
    if (pk) setTimeout(() => { const t = $("#form textarea"); if (!t.value) t.value = `I'm interested in the ${pk.dataset.pk} package.\n\n`; }, 60);
  });
  addEventListener("keydown", e => { if (e.key === "Escape") { lb.hidden = true; closeDrawer(); } });

  /* ---------- form ---------- */
  const form = $("#form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    $$(".bad", form).forEach(x => x.classList.remove("bad"));
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
    if (bad.length) { err.textContent = "Please complete the highlighted fields."; err.hidden = false; bad[0].focus(); return; }
    err.hidden = true;

    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.firstName} ${d.lastName}\nEmail: ${d.email}\nType of work: ${work.join(", ")}\nLocation: ${d.location}\nFound via: ${src.value}\n\nProject details:\n${d.details}`;
    location.href = "mailto:hello@capturedbytiffany.com?subject=" +
      encodeURIComponent(`New enquiry from ${d.firstName} ${d.lastName}`) + "&body=" + encodeURIComponent(body);
    $(".ok", form).hidden = false;
  });

  route();
})();
