/* Omega Developers: engine carried over from the S2D / Marhaba / Serop builds
   (media registry by id, blur-up images, masonry gallery + lightbox, WhatsApp composer,
   floating WhatsApp that hides over heavy sections), plus: tab routing, site-visit booking,
   Trust-style finder / filters / shortlist / land owners' form, Arabic ↔ English with RTL,
   the payment-plan studio (live building elevation + 4-year timeline), video and the Byblos map.
   Everything that shows text is drawn by a render function so a language switch can redraw it. */
{
  const MEDIA = window.OM_MEDIA || {};
  const PROJECTS = window.OM_PROJECTS || [];
  const C = window.OM_CONTACT || {};
  const I18N = window.OM_I18N;
  const tr = (s) => I18N.tr(s);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wa = (text, num) => "https://wa.me/" + (num || C.whatsapp) + "?text=" + encodeURIComponent(text);
  const bySlug = (s) => PROJECTS.find((p) => p.slug === s) || null;
  const img = (id) => (id && MEDIA[id]) || null;
  const REGIONS = [...new Set(PROJECTS.map((p) => p.region).filter(Boolean))];
  const GOALS = { apartment: "Buy an apartment", office: "Buy an office", clinic: "Buy a clinic", shop: "Rent a shop", rent: "Rent a space", invest: "Invest" };
  const HELLO = "Hello, I'd like to know more about your spaces in Central Byblos.";
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

  /* ---------- Saved shortlist (this browser only) ---------- */
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem("om-saved") || "[]")); } catch (e) {}
  const persist = () => { try { localStorage.setItem("om-saved", JSON.stringify([...saved])); } catch (e) {} };
  function syncSaved() {
    $$("[data-saved-count]").forEach((n) => (n.textContent = String(saved.size)));
    $$(".saved-link").forEach((a) => a.classList.toggle("has", saved.size > 0));
    $$("[data-heart]").forEach((b) => {
      const on = saved.has(b.dataset.heart);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", tr(on ? "Remove" : "Save") + " " + tr((bySlug(b.dataset.heart) || {}).title || ""));
    });
  }
  function heart(slug) {
    const b = el("button", "heart"); b.type = "button"; b.dataset.heart = slug;
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1Z"/></svg>';
    return b;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-heart]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const s = b.dataset.heart;
    saved.has(s) ? saved.delete(s) : saved.add(s);
    persist(); syncSaved();
    if (!$("#view-projects").hidden) renderRows();
  });

  /* ---------- Images and video ---------- */
  const warmed = new Set();
  function warm(src) { if (!src || warmed.has(src)) return; warmed.add(src); const i = new Image(); i.decoding = "async"; i.src = src; }
  function blurUp(host, im, m) {
    if (m.lqip) host.style.backgroundImage = 'url("' + m.lqip + '")';
    host.classList.add("blur-up");
    const done = () => host.classList.add("is-loaded");
    if (im.tagName === "VIDEO") { if (im.readyState >= 2) done(); else { im.addEventListener("loadeddata", done); im.addEventListener("error", done); } return; }
    if (im.complete && im.naturalWidth) done(); else { im.addEventListener("load", done); im.addEventListener("error", done); }
  }
  // Fill a frame with a registered photo or video, or the line elevation of the building when there is none.
  // A video entry: { type: "video", src: "x.mp4", poster: "x-poster.webp", ... }. Cards show the poster.
  function fill(host, id, opts) {
    opts = opts || {};
    const ph = el("div", "ph");
    ph.innerHTML = '<svg aria-hidden="true"><use href="#elevation"/></svg><span>' + esc(tr("Renders coming soon")) + "</span>";
    host.appendChild(ph);
    const m = img(id);
    if (!m) { host.classList.add("is-empty"); return host; }
    let node;
    if (m.type === "video" && !opts.still && !reduced()) {
      node = document.createElement("video");
      node.muted = true; node.loop = true; node.autoplay = true; node.playsInline = true;
      ["muted", "loop", "autoplay", "playsinline"].forEach((a) => node.setAttribute(a, ""));
      node.preload = "metadata"; node.poster = m.poster || ""; node.src = m.src;
      const p = node.play(); if (p && p.catch) p.catch(() => {});
    } else {
      node = document.createElement("img");
      node.src = m.type === "video" ? (m.poster || "") : (opts.full ? m.src : (m.thumb || m.src));
      node.alt = opts.decorative ? "" : (m.alt || "");
      node.decoding = "async";
      node.loading = opts.eager ? "eager" : "lazy";
      if (opts.eager) node.setAttribute("fetchpriority", "high");
    }
    node.width = m.width; node.height = m.height;
    if (m.focal) node.style.objectPosition = m.focal;
    blurUp(host, node, m);
    node.addEventListener("error", () => { node.remove(); host.classList.add("is-empty"); });
    host.prepend(node);
    if (m.type === "video") host.classList.add("has-video");
    return host;
  }
  const frame = (id, opts) => fill(el("div", "frame"), id, opts);
  $$("[data-img]").forEach((f) => fill(f, f.dataset.img, { eager: f.hasAttribute("data-eager"), full: true, decorative: true }));

  /* ---------- Static-ish bits that carry text ---------- */
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); btn.textContent = tr("Copied"); }
    catch (e) {
      const t = btn.closest("li") && $(".num", btn.closest("li"));
      if (t) { const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      btn.textContent = tr("Selected");
    }
    setTimeout(() => (btn.textContent = tr("Copy")), 1600);
  }
  function officeLink(o) { const a = el("a", "link", tr("Open in Maps")); a.href = o.map; a.target = "_blank"; a.rel = "noopener"; return a; }
  function renderContact() {
    $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));
    $$("[data-ig]").forEach((a) => { a.href = "https://instagram.com/" + C.instagram; a.textContent = "@" + C.instagram; });
    $$("[data-wa-general]").forEach((a) => (a.href = wa(tr(HELLO))));
    $$("[data-count-projects]").forEach((n) => (n.textContent = String(PROJECTS.length)));
    const phones = $("[data-phones]"); phones.replaceChildren();
    (C.phones || []).forEach((p) => {
      const li = el("li");
      const who = el("div", "who");
      if (p.name) who.appendChild(el("small", "", tr(p.name)));
      const num = el("span", "num", p.display); num.dir = "ltr";
      who.appendChild(num); li.appendChild(who);
      const mini = el("div", "mini");
      const w = el("a", "", tr("WhatsApp")); w.href = wa(tr(HELLO), p.wa); w.target = "_blank"; w.rel = "noopener";
      const c = el("button", "", tr("Copy")); c.type = "button"; c.addEventListener("click", () => copy(p.display, c));
      mini.append(w, c); li.appendChild(mini); phones.appendChild(li);
    });
    const officeList = $("[data-office-list]"); officeList.replaceChildren();
    (C.offices || []).forEach((o) => {
      const li = el("li"); const d = el("div");
      d.appendChild(el("strong", "", tr(o.name))); d.appendChild(el("span", "", tr(o.place)));
      li.append(d, officeLink(o)); officeList.appendChild(li);
    });
    const offices = $("[data-offices]"); offices.replaceChildren();
    (C.offices || []).forEach((o) => {
      const box = el("div", "office");
      box.append(el("h2", "display", tr(o.name)), el("p", "", tr(o.place)), officeLink(o));
      offices.appendChild(box);
    });
    const foot = $("[data-foot-contact]"); foot.replaceChildren();
    (C.phones || []).forEach((p) => { const a = el("a", "", p.display); a.dir = "ltr"; a.href = wa(tr(HELLO), p.wa); a.target = "_blank"; a.rel = "noopener"; foot.appendChild(a); });
    foot.appendChild(el("span", "", tr("Central Byblos, Jbeil")));
  }

  /* ---------- Project cards + rows ---------- */
  function card(p) {
    const c = el("article", "card");
    const a = el("a", "card-link"); a.href = "#" + p.slug; a.dataset.go = p.slug;
    a.appendChild(frame(p.coverId, { still: true }));
    const meta = el("div", "card-meta");
    meta.appendChild(el("h3", "display", tr(p.title)));
    meta.appendChild(el("p", "", tr(p.location)));
    meta.appendChild(el("p", "type", tr(p.type)));
    a.appendChild(meta);
    a.appendChild(el("span", "more", tr("View project")));
    c.append(a, heart(p.slug));
    return c;
  }
  function renderCards() { $("[data-cards]").replaceChildren(...PROJECTS.map(card)); }

  function row(p) {
    const r = el("article", "row");
    const media = el("div", "row-media");
    const link = el("a", ""); link.href = "#" + p.slug; link.dataset.go = p.slug; link.setAttribute("aria-label", tr("View project") + ": " + tr(p.title));
    link.appendChild(frame(p.coverId));
    media.append(link, heart(p.slug));
    const copyBox = el("div", "row-copy");
    copyBox.appendChild(el("p", "place", tr(p.location) + " · " + tr(p.type)));
    copyBox.appendChild(el("h2", "display l", tr(p.title)));
    copyBox.appendChild(el("p", "", tr(p.summary)));
    const act = el("div", "actions");
    const v = el("a", "btn", tr("View project")); v.href = "#" + p.slug; v.dataset.go = p.slug;
    const b = el("button", "btn line", tr("Book a site visit")); b.type = "button"; b.dataset.visit = p.slug;
    act.append(v, b); copyBox.appendChild(act);
    r.append(media, copyBox);
    return r;
  }

  /* ---------- Projects filters (location + saved) ---------- */
  const filter = { region: "all", saved: false };
  function chip(label, on, fn) { const b = el("button", "chip", label); b.type = "button"; b.setAttribute("aria-pressed", on ? "true" : "false"); b.addEventListener("click", fn); return b; }
  function renderRows() {
    $("[data-filters]").replaceChildren(
      chip(tr("All locations"), filter.region === "all" && !filter.saved, () => { filter.region = "all"; filter.saved = false; renderRows(); }),
      ...REGIONS.map((r) => chip(tr(r), filter.region === r && !filter.saved, () => { filter.region = r; filter.saved = false; renderRows(); })),
      chip(tr("Saved") + " (" + saved.size + ")", filter.saved, () => { filter.saved = true; renderRows(); })
    );
    const rows = $("[data-rows]");
    const list = PROJECTS.filter((p) => (filter.saved ? saved.has(p.slug) : filter.region === "all" || p.region === filter.region));
    rows.replaceChildren(...list.map(row));
    if (!list.length) {
      const e = el("div", "empty");
      e.appendChild(el("h2", "display m", tr(filter.saved ? "No saved projects yet" : "Nothing here yet")));
      e.appendChild(el("p", "", tr(filter.saved ? "Tap the heart on any project to keep it on your shortlist." : "Tell us what you're looking for and we'll call you with options.")));
      const all = el("button", "btn", tr("See all projects")); all.type = "button";
      all.addEventListener("click", () => { filter.region = "all"; filter.saved = false; renderRows(); });
      e.appendChild(all);
      rows.appendChild(e);
    }
    syncSaved();
  }

  /* ---------- Space finder (home): buy → payment plan, rent → booking ---------- */
  const finder = $("[data-finder]");
  let intent = "apartment";
  function renderFinderAreas() {}
  finder.addEventListener("submit", (e) => {
    e.preventDefault();
    const space = finder.elements.space.value, deal = finder.elements.deal.value;
    if (space === "shop" || deal === "rent") { openVisit("central-byblos", space === "shop" ? "shop" : "rent"); return; }
    intent = space; pick.space = space; renderStudio();
    if (location.hash.replace("#", "") === "plan") route("plan"); else location.hash = "plan";
  });

  /* ---------- Forms: site visit, business owners ---------- */
  const DAYS = ["Weekday", "Saturday"];
  const TIMES = ["Morning", "Afternoon"];
  function pills(name, list, key) {
    return '<div class="pills">' + list.map((t, i) =>
      '<label><input type="radio" name="' + name + '" id="' + key + "-" + name + "-" + i + '" value="' + t + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(tr(t)) + "</span></label>").join("") + "</div>";
  }
  function missingMsg(miss) {
    const list = miss.map(tr).join(I18N.lang === "ar" ? " و" : " and ");
    return I18N.lang === "ar" ? "أضف " + list + " لإرسال الطلب." : "Add " + list + " to send the request.";
  }
  function guard(f, send, msg, extra, okText) {
    send.addEventListener("click", (e) => {
      const F = f.elements, miss = [];
      if (!F.fullname.value.trim()) miss.push("your name");
      if (F.phone.value.replace(/\D/g, "").length < 7) miss.push("a phone number we can reach");
      (extra || []).forEach(([n, label]) => { if (!F[n].value.trim()) miss.push(label); });
      if (miss.length) { e.preventDefault(); msg.textContent = missingMsg(miss); return; }
      msg.textContent = tr(okText);
    });
    f.addEventListener("submit", (e) => { e.preventDefault(); send.click(); });
  }
  const line = (k, v) => tr(k) + ": " + v;
  function visitForm(key) {
    const f = el("form", "form"); f.noValidate = true;
    f.innerHTML =
      '<div class="two">' +
        '<div class="field"><label for="' + key + '-name">' + esc(tr("Full name")) + '</label><input id="' + key + '-name" name="fullname" autocomplete="name"></div>' +
        '<div class="field"><label for="' + key + '-phone">' + esc(tr("Phone number")) + '</label><input id="' + key + '-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+961" dir="ltr"></div>' +
      "</div>" +
      '<div class="two">' +
        '<div class="field"><label for="' + key + '-goal">' + esc(tr("I'm looking to")) + '</label><select id="' + key + '-goal" name="goal">' +
          Object.entries(GOALS).map(([v, t]) => '<option value="' + v + '">' + esc(tr(t)) + "</option>").join("") + "</select></div>" +
        '<div class="field"><label for="' + key + '-project">' + esc(tr("Project")) + '</label><select id="' + key + '-project" name="project"><option value="">' + esc(tr("Not sure yet")) + "</option>" +
          PROJECTS.map((p) => '<option value="' + p.slug + '">' + esc(tr(p.title)) + "</option>").join("") + "</select></div>" +
      "</div>" +
      '<div class="two"><fieldset class="field"><legend>' + esc(tr("Preferred day")) + "</legend>" + pills("day", DAYS, key) + "</fieldset>" +
      '<fieldset class="field"><legend>' + esc(tr("Preferred time")) + "</legend>" + pills("time", TIMES, key) + "</fieldset></div>" +
      '<p class="form-msg" role="status"></p>' +
      '<a class="btn accent" target="_blank" rel="noopener">' + esc(tr("Send request on WhatsApp")) + "</a>";
    const F = f.elements, send = $("a.btn", f), msg = $(".form-msg", f);
    const text = () => {
      const p = bySlug(F.project.value);
      return [tr("Hello, I'd like to book a site visit."), "",
        line("Name", F.fullname.value.trim()),
        line("Phone", F.phone.value.trim()),
        line("Looking to", tr(GOALS[F.goal.value] || "")),
        line("Project", p ? tr(p.title) : tr("Not sure yet")),
        line("Preferred day", tr(f.querySelector("input[name=day]:checked").value)),
        line("Preferred time", tr(f.querySelector("input[name=time]:checked").value))].join("\n");
    };
    const sync = () => (send.href = wa(text()));
    f.addEventListener("input", sync); f.addEventListener("change", sync); sync();
    guard(f, send, msg, [], "WhatsApp opens with your request filled in. Press send there to confirm.");
    f.preselect = (slug, goal) => { F.project.value = slug || ""; F.goal.value = GOALS[goal] ? goal : intent; msg.textContent = ""; sync(); };
    return f;
  }
  const NEEDS = [["shop", "Rent a shop"], ["office", "An office"], ["clinic", "A clinic"]];
  function landForm() {
    const f = el("form", "form"); f.noValidate = true;
    f.innerHTML =
      '<fieldset class="field"><legend>' + esc(tr("I need")) + '</legend><div class="pills">' +
        NEEDS.map(([v, t], i) => '<label><input type="radio" name="aim" id="biz-aim-' + i + '" value="' + v + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(tr(t)) + "</span></label>").join("") +
      "</div></fieldset>" +
      '<div class="two">' +
        '<div class="field"><label for="biz-name">' + esc(tr("Full name")) + '</label><input id="biz-name" name="fullname" autocomplete="name"></div>' +
        '<div class="field"><label for="biz-phone">' + esc(tr("Phone number")) + '</label><input id="biz-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+961" dir="ltr"></div>' +
      "</div>" +
      '<div class="two">' +
        '<div class="field"><label for="biz-what">' + esc(tr("Your business")) + '</label><input id="biz-what" name="where" placeholder="' + esc(tr("Pharmacy, café, dental clinic…")) + '"></div>' +
        '<div class="field"><label for="biz-size">' + esc(tr("Size you need")) + '</label><input id="biz-size" name="size" inputmode="numeric" placeholder="m²"></div>' +
      "</div>" +
      '<p class="form-msg" role="status"></p>' +
      '<a class="btn accent" target="_blank" rel="noopener">' + esc(tr("Send details on WhatsApp")) + "</a>";
    const F = f.elements, send = $("a.btn", f), msg = $(".form-msg", f);
    const text = () => {
      const aim = f.querySelector("input[name=aim]:checked").value;
      const size = F.size.value.trim().replace(/\s*m²?\s*$/i, "");
      return [tr("Hello, I'd like a commercial space in your Central Byblos building."), "",
        line("Name", F.fullname.value.trim()),
        line("Phone", F.phone.value.trim()),
        line("I need", tr(NEEDS.find((n) => n[0] === aim)[1])),
        line("Business", F.where.value.trim()),
        line("Size", size ? size + " m²" : tr("Not given"))].join("\n");
    };
    const sync = () => (send.href = wa(text()));
    f.addEventListener("input", sync); f.addEventListener("change", sync); sync();
    guard(f, send, msg, [["where", "what your business does"]], "WhatsApp opens with your details filled in. Press send there and we'll call you.");
    return f;
  }
  const sheet = $("#visitSheet");
  let sheetForm = null;
  function renderForms() {
    $('[data-form-slot="contact"]').replaceChildren(visitForm("contact"));
    sheetForm = visitForm("sheet");
    $('[data-form-slot="sheet"]').replaceChildren(sheetForm);
    $("[data-land-slot]").replaceChildren(landForm());
  }
  function openVisit(slug, goal) {
    sheetForm.preselect(slug, goal);
    if (sheet.showModal) sheet.showModal(); else sheet.setAttribute("open", "");
    setTimeout(() => sheetForm.elements.fullname.focus(), 30);
  }
  const closeVisit = () => (sheet.close ? sheet.close() : sheet.removeAttribute("open"));
  $("[data-close]", sheet).addEventListener("click", closeVisit);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeVisit(); });
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-visit]"); if (t) openVisit(t.dataset.visit || "", t.dataset.goal); });

  /* ---------- Payment plan: live building elevation + 4-year timeline ---------- */
  const PLAN = {
    space: [{ v: "apartment", l: "Apartment · 190 m²" }, { v: "office", l: "Office · from 90 m²" }, { v: "clinic", l: "Clinic · from 90 m²" }],
    aim: [{ v: "live", l: "Live in it" }, { v: "work", l: "Run my business" }, { v: "invest", l: "Invest" }]
  };
  const pick = { space: "apartment", aim: "live", price: 250000 };
  try { Object.assign(pick, JSON.parse(localStorage.getItem("om-plan") || "{}")); } catch (e) {}
  if (!PLAN.space.some((o) => o.v === pick.space)) pick.space = "apartment";
  const opt = (g) => PLAN[g].find((o) => o.v === pick[g]) || PLAN[g][0];
  const ZONES = { apartment: [102, 98, 424, 126], office: [52, 222, 456, 110], clinic: [52, 222, 456, 110], shop: [96, 332, 430, 50] };
  const split = () => { const P = Math.max(0, +pick.price || 0); return { down: P * 0.2, rest: P * 0.8, month: (P * 0.8) / 48 }; };

  // The Omega building drawn in its own materials; the chosen space lights up in green.
  function buildingSVG(space) {
    const glass = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#gl)"/>';
    const wood = Array.from({ length: 3 }, (_, r) => Array.from({ length: 7 }, (_, c) =>
      '<rect x="' + (122 + c * 40) + '" y="' + (114 + r * 36) + '" width="24" height="24" fill="#2b363b"/><rect x="' + (122 + c * 40) + '" y="' + (114 + r * 36) + '" width="9" height="24" fill="#6f4529"/>').join("")).join("");
    const mull = (x0, x1, y0, y1, n) => Array.from({ length: n - 1 }, (_, i) => { const x = x0 + ((i + 1) * (x1 - x0)) / n; return '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + y1 + '" stroke="#f4f4f1" stroke-width="2.5"/>'; }).join("");
    const plants = (xs, y) => '<g fill="#5f7d33">' + xs.map((x, i) => '<circle cx="' + x + '" cy="' + (y - (i % 2) * 3) + '" r="' + (6 + (i % 3) * 2) + '"/>').join("") + "</g>";
    const shops = Array.from({ length: 6 }, (_, i) => '<rect x="' + (112 + i * 68) + '" y="340" width="56" height="40" fill="url(#warm)"/>').join("");
    const solar = '<g stroke="#56636b" stroke-width="1.2">' + Array.from({ length: 12 }, (_, i) => '<line x1="' + (140 + i * 32) + '" y1="' + (89 - i * 2.2) + '" x2="' + (136 + i * 32) + '" y2="' + (99 - i * 2.2) + '"/>').join("") + "</g>";
    const z = ZONES[space] || ZONES.apartment;
    const label = tr(space === "shop" ? "Shops" : opt("space").l);
    const lw = Math.max(120, label.length * 8.6 + 28);
    return '<svg viewBox="0 0 640 420" role="img" direction="ltr">' +
      "<defs>" +
        '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe7ea"/><stop offset="1" stop-color="#f5f6f2"/></linearGradient>' +
        '<linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5e7079"/><stop offset=".55" stop-color="#93a7ae"/><stop offset="1" stop-color="#4d5d65"/></linearGradient>' +
        '<linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d79c"/><stop offset="1" stop-color="#c9883f"/></linearGradient>' +
      "</defs>" +
      '<rect width="640" height="420" fill="url(#sky)"/>' +
      '<g fill="#b9c8ad" opacity=".7"><circle cx="40" cy="330" r="34"/><circle cx="74" cy="346" r="26"/><circle cx="600" cy="340" r="30"/></g>' +
      '<rect x="0" y="380" width="640" height="40" fill="#cfd3cb"/><rect x="0" y="380" width="640" height="5" fill="#e9eae4"/>' +
      '<polygon points="518,78 566,380 518,380" fill="#2b3237"/>' +
      '<rect x="104" y="100" width="300" height="124" fill="#8b5a37"/>' + wood +
      '<rect x="404" y="96" width="114" height="128" fill="#39454b"/>' + glass(414, 108, 94, 30) +
      plants([112, 140, 170, 200, 232, 262, 300, 340, 380], 222) +
      '<polygon points="92,90 530,58 538,78 100,104" fill="#2b3237"/>' + solar +
      '<rect x="414" y="132" width="88" height="92" fill="url(#gl)" stroke="#f4f4f1" stroke-width="7"/>' + mull(414, 502, 132, 224, 3) + plants([430, 470], 220) +
      '<rect x="100" y="224" width="418" height="108" fill="#33403f"/>' +
      '<rect x="56" y="228" width="248" height="50" fill="url(#gl)" stroke="#f4f4f1" stroke-width="7"/>' + mull(56, 304, 228, 278, 6) +
      '<rect x="56" y="278" width="248" height="50" fill="url(#gl)" stroke="#f4f4f1" stroke-width="7"/>' + mull(56, 304, 278, 328, 6) +
      '<rect x="304" y="246" width="200" height="82" fill="url(#gl)" stroke="#f4f4f1" stroke-width="7"/>' + mull(304, 504, 246, 328, 5) +
      plants([80, 130, 180, 230, 280], 276) + plants([330, 380, 430, 480], 326) +
      '<rect x="96" y="332" width="430" height="48" fill="#1c2226"/>' + shops +
      '<g class="hl"><rect x="' + z[0] + '" y="' + z[1] + '" width="' + z[2] + '" height="' + z[3] + '" fill="#a8c256" fill-opacity=".32" stroke="#a8c256" stroke-width="3"/>' +
        '<rect x="' + (z[0] + 10) + '" y="' + (z[1] + 10) + '" width="' + lw + '" height="30" fill="#14191c"/>' +
        '<text x="' + (z[0] + 24) + '" y="' + (z[1] + 30) + '" class="hl-label">' + esc(label) + "</text></g>" +
      "</svg>";
  }
  function timelineSVG() {
    const t = split(), P = +pick.price || 0;
    const base = 120, top = 26, H = base - top, x0 = 86, step = 11.1;
    const mh = Math.max(9, H * (P ? t.month / t.down : 0.083));
    const bars = Array.from({ length: 48 }, (_, i) => '<rect x="' + (x0 + i * step).toFixed(1) + '" y="' + (base - mh).toFixed(1) + '" width="6.4" height="' + mh.toFixed(1) + '" fill="' + (i < 36 ? "#2b3237" : "#7f8b90") + '"/>').join("");
    const kx = x0 + 35.5 * step + 3.2;
    const yr = [0, 12, 24, 36, 48].map((m, i) => '<text x="' + (i === 0 ? 46 : (x0 + (m - 0.5) * step + 3.2)).toFixed(1) + '" y="146" text-anchor="middle" class="tl-year">' + esc(i === 0 ? tr("Today") : tr("Year") + " " + i) + "</text>").join("");
    return '<svg viewBox="0 0 640 156" role="img" direction="ltr">' +
      '<line x1="20" y1="' + base + '" x2="630" y2="' + base + '" stroke="#c7cdc9"/>' +
      '<rect x="30" y="' + top + '" width="32" height="' + H + '" fill="#5f7c1f"/>' +
      '<text x="46" y="' + (top - 8) + '" text-anchor="middle" class="tl-big">20%</text>' + bars +
      '<line x1="' + kx + '" y1="10" x2="' + kx + '" y2="' + base + '" stroke="#5f7c1f" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<rect x="' + (kx - 86) + '" y="4" width="80" height="24" fill="#a8c256"/>' +
      '<text x="' + (kx - 46) + '" y="21" text-anchor="middle" class="tl-keys">' + esc(tr("Keys")) + "</text>" + yr +
      "</svg>";
  }
  function planBrief() {
    const F = $("[data-studio]").elements, t = split();
    return [tr("Hello, here is the payment plan I'd like to discuss."), "",
      line("Name", F.fullname.value.trim()),
      line("Phone", F.phone.value.trim()), "",
      line("Space", tr(opt("space").l)),
      line("Buying to", tr(opt("aim").l)),
      line("Price in mind", money(pick.price)),
      line("Down payment (20%)", money(t.down)),
      line("Remaining over 4 years", money(t.rest)),
      line("About per month", money(t.month))].join("\n");
  }
  function syncStudio() {
    const t = split();
    $("[data-preview]").innerHTML = buildingSVG(pick.space);
    $("[data-timeline]").innerHTML = timelineSVG();
    $('[data-sum="down"]').textContent = money(t.down);
    $('[data-sum="rest"]').textContent = money(t.rest);
    $('[data-sum="month"]').innerHTML = esc(money(t.month)) + '<small class="per">' + esc(tr("/mo")) + "</small>";
    $("[data-studio-send]").href = wa(planBrief());
    try { localStorage.setItem("om-plan", JSON.stringify(pick)); } catch (e) {}
  }
  const studio = $("[data-studio]");
  function renderStudio() {
    ["space", "aim"].forEach((g) => {
      $('[data-opts="' + g + '"]').innerHTML = PLAN[g].map((o, i) =>
        '<label class="opt-item"><input type="radio" name="' + g + '" id="st-' + g + "-" + i + '" value="' + o.v + '"' + (pick[g] === o.v ? " checked" : "") + ">" +
        '<span class="opt-chip">' + esc(tr(o.l)) + "</span></label>").join("");
    });
    studio.elements.price.value = Math.min(1000000, Math.max(50000, pick.price));
    studio.elements.priceText.value = Math.round(pick.price).toLocaleString("en-US");
    syncStudio();
  }
  studio.addEventListener("change", (e) => {
    const t = e.target; if (PLAN[t.name]) { pick[t.name] = t.value; syncStudio(); }
  });
  studio.addEventListener("input", (e) => {
    const t = e.target;
    if (t.name === "price") { pick.price = +t.value; studio.elements.priceText.value = (+t.value).toLocaleString("en-US"); syncStudio(); }
    else if (t.name === "priceText") {
      const n = +t.value.replace(/\D/g, "").slice(0, 9);
      pick.price = n; studio.elements.price.value = Math.min(1000000, Math.max(50000, n || 50000));
      t.value = n ? n.toLocaleString("en-US") : ""; syncStudio();
    }
    else if (t.name === "fullname" || t.name === "phone") $("[data-studio-send]").href = wa(planBrief());
  });
  guard(studio, $("[data-studio-send]"), $(".brief .form-msg"), [], "WhatsApp opens with your plan filled in. Press send there and our team will call you.");

  /* ---------- Projects map (schematic, approximate) ---------- */
  const MAP = { w: 520, h: 540, lon0: 35.6, lon1: 35.72, lat0: 34.06, lat1: 34.18 };
  const px = ([lat, lon]) => [((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w, ((MAP.lat1 - lat) / (MAP.lat1 - MAP.lat0)) * MAP.h];
  const COAST = [[34.18, 35.652], [34.16, 35.646], [34.14, 35.641], [34.128, 35.641], [34.121, 35.643], [34.11, 35.647], [34.09, 35.652], [34.075, 35.657], [34.06, 35.661]];
  const LABEL = { "central-byblos": [18, 6, "start"] };
  const PORT = [34.1205, 35.6438];
  function renderMap() {
    const pts = COAST.map(px);
    const coast = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const sea = coast + " L0 " + MAP.h + " L0 0 Z";
    const ridges = [60, 140, 230, 320].map((d, k) => '<path d="' + pts.map((p, i) => (i ? "L" : "M") + (p[0] + d + (i % 2) * 16).toFixed(1) + " " + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="#14191c" stroke-opacity="' + (0.12 - k * 0.025) + '" stroke-width="1.2"/>').join("");
    const grid = Array.from({ length: 9 }, (_, i) => '<line x1="' + (i * 65) + '" y1="0" x2="' + (i * 65) + '" y2="' + MAP.h + '" stroke="#14191c" stroke-opacity=".04"/>').join("");
    const projectPins = PROJECTS.filter((p) => p.pin).map((p) => {
      const [x, y] = px(p.pin), [dx, dy, an] = LABEL[p.slug] || [14, 5, "start"];
      return '<a href="#' + p.slug + '" data-go="' + p.slug + '" class="pin">' +
        '<circle class="pulse" cx="' + x + '" cy="' + y + '" r="11" fill="none" stroke="#a8c256" stroke-width="2"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#14191c" stroke="#a8c256" stroke-width="3"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="#a8c256"/>' +
        '<text x="' + (x + dx) + '" y="' + (y + dy) + '" text-anchor="' + an + '" class="pin-label">' + esc(tr(p.title)) + "</text></a>";
    }).join("");
    const [qx, qy] = px(PORT);
    const port = '<path d="M' + (qx - 16) + " " + (qy - 10) + " q-10 10 0 20" + '" fill="none" stroke="#a8c256" stroke-width="2"/><text x="' + (qx - 24) + '" y="' + (qy + 5) + '" text-anchor="end" class="sea-label">' + esc(tr("Old port")) + "</text>";
    $("[data-map]").innerHTML =
      '<svg viewBox="0 0 ' + MAP.w + " " + MAP.h + '" direction="ltr" role="img" aria-label="' + esc(tr("Where we build")) + '">' +
      '<rect width="' + MAP.w + '" height="' + MAP.h + '" fill="#f5f6f2"/>' + grid + ridges +
      '<path d="' + sea + '" fill="#14191c"/>' +
      '<path d="' + coast + '" fill="none" stroke="#a8c256" stroke-width="2"/>' +
      '<text x="70" y="330" class="sea-name" transform="rotate(-84 70 330)">' + esc(tr("Mediterranean")) + "</text>" +
      port + projectPins + '<text x="' + (px([34.1, 35.69])[0]) + '" y="' + (px([34.1, 35.69])[1]) + '" class="town">' + esc(tr("Jbeil")) + "</text></svg>";
    const legend = $("[data-map-legend]"); legend.replaceChildren();
    PROJECTS.forEach((p) => {
      const li = el("li"); const a = el("a", "", tr(p.title)); a.href = "#" + p.slug; a.dataset.go = p.slug;
      li.appendChild(el("i", "key")); li.appendChild(a);
      if (p.map) { const g = el("a", "small-link", tr("Open in Maps")); g.href = p.map; g.target = "_blank"; g.rel = "noopener"; li.appendChild(g); }
      legend.appendChild(li);
    });
  }

  /* ---------- Project detail ---------- */
  const detail = $("[data-detail]"), galleryWrap = $("[data-gallery-wrap]"), gallery = $("[data-gallery]");
  let tiles = [], shots = [];
  const HIGHLIGHTS = ["No agents' commissions, directly from the developer", "Flexible payment plans", "Competitive prices"];
  function renderProject(p) {
    detail.replaceChildren();
    const media = el("div", "detail-media");
    const cover = frame(p.coverId, { eager: true, full: true });
    media.append(cover, heart(p.slug));
    detail.appendChild(media);
    const box = el("div", "detail-copy");
    box.appendChild(el("p", "place", tr(p.location)));
    box.appendChild(el("h1", "display xl", tr(p.title)));
    box.appendChild(el("p", "lead", tr(p.description || p.summary)));
    const dl = el("dl", "facts-list");
    [["Location", p.location], ["Type", p.type]].concat(p.facts || [])
      .forEach(([k, v]) => { const d = el("div"); d.append(el("dt", "", tr(k)), el("dd", "", tr(v))); dl.appendChild(d); });
    box.appendChild(dl);
    const hl = el("ul", "ticks");
    (p.highlights && p.highlights.length ? p.highlights : HIGHLIGHTS).forEach((t) => hl.appendChild(el("li", "", tr(t))));
    box.appendChild(hl);
    if (!(p.galleryIds || []).some(img)) box.appendChild(el("p", "note", I18N.lang === "ar"
      ? "مخططات وصور " + tr(p.title) + " ستُضاف قريبًا إلى هذه الصفحة. احجز زيارة وسيرافقك فريقنا في جولة على المشروع."
      : "Plans and renders of " + p.title + " are on their way to this page. Book a site visit and our team will walk you through the project in person."));
    const act = el("div", "actions");
    if (p.slug === "central-byblos") { const pl = el("a", "btn accent", tr("See your payment plan")); pl.href = "#plan"; pl.dataset.go = "plan"; act.appendChild(pl); }
    const b = el("button", "btn", tr("Book a site visit")); b.type = "button"; b.dataset.visit = p.slug;
    const w = el("a", "btn line", tr("Ask on WhatsApp")); w.target = "_blank"; w.rel = "noopener";
    w.href = wa(I18N.lang === "ar" ? "مرحبًا، أود معرفة المزيد عن " + tr(p.title) + " (" + tr(p.location) + ")." : "Hello, I'd like to know more about " + p.title + " (" + p.location + ").");
    act.append(b, w); box.appendChild(act);
    if (p.map) { const m = el("a", "link", I18N.lang === "ar" ? "افتح " + tr(p.title) + " في خرائط Google" : "Open " + p.title + " in Google Maps"); m.href = p.map; m.target = "_blank"; m.rel = "noopener"; box.appendChild(m); }
    detail.appendChild(box);

    tiles = []; shots = [];
    (p.galleryIds || []).forEach((id) => {
      const m = img(id); if (!m) return;
      shots.push(m);
      const idx = shots.length - 1;
      if (id === p.coverId) { cover.style.cursor = "zoom-in"; cover.addEventListener("click", () => openLb(idx, tr(p.title))); return; }
      const t = el("button", "tile" + (m.type === "video" ? " is-video" : "")); t.type = "button"; t.style.aspectRatio = m.width + " / " + m.height;
      t.setAttribute("aria-label", m.alt || "");
      const im = document.createElement("img"); im.src = m.type === "video" ? m.poster : (m.thumb || m.src); im.alt = m.alt || ""; im.loading = idx < 6 ? "eager" : "lazy"; im.decoding = "async";
      blurUp(t, im, m); t.appendChild(im);
      t.addEventListener("click", () => openLb(idx, tr(p.title)));
      tiles.push({ el: t, ratio: m.height / m.width });
    });
    $("[data-gallery-title]").textContent = I18N.lang === "ar" ? tr("Gallery") + "، " + shots.length + " صور" : "Gallery, " + shots.length + " renders";
    galleryWrap.hidden = !tiles.length;
    gallery.dataset.cols = "";
    layout();
    const others = PROJECTS.filter((o) => o.slug !== p.slug).sort((a, b) => (b.region === p.region) - (a.region === p.region)).slice(0, 3);
    $("[data-more]").replaceChildren(...others.map(card));
    $("[data-more-wrap]").hidden = !others.length;
    syncSaved();
  }
  function layout() {
    if (!tiles.length) return;
    const n = Math.min(matchMedia("(min-width: 1000px)").matches ? 3 : 2, tiles.length);
    if (gallery.dataset.cols === String(n)) return;
    gallery.dataset.cols = String(n); gallery.style.setProperty("--cols", n); gallery.replaceChildren();
    const cols = [], h = [];
    for (let i = 0; i < n; i++) { const c = el("div", "gallery-col"); gallery.appendChild(c); cols.push(c); h.push(0); }
    tiles.forEach((t) => { const s = h.indexOf(Math.min(...h)); cols[s].appendChild(t.el); h[s] += t.ratio; });
  }
  window.addEventListener("resize", layout);

  /* ---------- Lightbox (photos and videos) ---------- */
  const lb = $(".lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let lbI = 0, lbTitle = "", lastFocus = null;
  function show() {
    const m = shots[lbI];
    const old = $("video", lb); if (old) { old.pause(); old.remove(); }
    if (m.type === "video") {
      lbImg.hidden = true;
      const v = document.createElement("video");
      v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.poster = m.poster || ""; v.src = m.src;
      lbImg.after(v);
    } else {
      lbImg.hidden = false;
      lbImg.src = m.thumb || m.src; lbImg.alt = m.alt || "";
      if (m.thumb) { const full = new Image(); full.onload = () => { if (shots[lbI] === m) lbImg.src = m.src; }; full.src = m.src; }
    }
    lbCap.textContent = lbTitle + "   " + (lbI + 1) + " / " + shots.length;
    [1, -1].forEach((d) => { const n = shots[(lbI + d + shots.length) % shots.length]; warm(n.type === "video" ? n.poster : n.src); });
  }
  function openLb(i, title) { lastFocus = document.activeElement; lbI = i; lbTitle = title; show(); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); $("[data-lb-close]", lb).focus(); }
  function closeLb() { const v = $("video", lb); if (v) { v.pause(); v.remove(); } lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); if (lastFocus) lastFocus.focus(); }
  const step = (d) => { lbI = (lbI + d + shots.length) % shots.length; show(); };
  $("[data-lb-close]", lb).addEventListener("click", closeLb);
  $("[data-lb-prev]", lb).addEventListener("click", () => step(-1));
  $("[data-lb-next]", lb).addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); tx = null; });

  /* ---------- Tabs: bare #tokens ---------- */
  const VIEWS = { home: "Omega Developers", projects: "Projects", about: "About us", contact: "Contact us", plan: "Payment plan" };
  let current = "home";
  function route(token, keepScroll) {
    token = (token || "").replace(/^#/, "") || "home";
    current = token;
    const p = bySlug(token);
    if (token === "saved") filter.saved = true;
    const view = p ? "project" : token === "saved" ? "projects" : token === "sell" ? "home" : (VIEWS[token] ? token : "home");
    $$(".view").forEach((v) => (v.hidden = v.id !== "view-" + view));
    const tab = p ? "projects" : view;
    $$("[data-tab]").forEach((a) => (a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    if (p) renderProject(p);
    if (view === "projects") renderRows();
    const name = tr("Omega Developers");
    document.title = p ? tr(p.title) + " | " + name : (view === "home" ? name : tr(VIEWS[view]) + " | " + name);
    if (!keepScroll) {
      if (token === "sell") requestAnimationFrame(() => $("#sell").scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }));
      else window.scrollTo(0, 0);
    }
    syncFab();
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-go]"); if (!a) return;
    e.preventDefault();
    const t = a.dataset.go || a.getAttribute("data-go");
    if (t === "projects") filter.saved = false;
    if (location.hash.replace("#", "") === t) { route(t); return; }
    location.hash = t;
  });
  window.addEventListener("hashchange", () => route(location.hash));

  /* ---------- Language ---------- */
  const toggle = $("[data-lang-toggle]");
  function renderAll() {
    renderContact(); renderCards(); renderFinderAreas(); renderForms(); renderStudio(); renderMap();
    I18N.apply();
    toggle.textContent = I18N.lang === "ar" ? "English" : "عربي";
    toggle.lang = I18N.lang === "ar" ? "en" : "ar";
    toggle.setAttribute("aria-label", I18N.lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    syncSaved();
  }
  toggle.addEventListener("click", () => {
    I18N.set(I18N.lang === "ar" ? "en" : "ar");
    renderAll();
    route(current, true);
  });

  /* ---------- Header shadow + floating WhatsApp ---------- */
  const header = $(".site-header");
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", syncHeader, { passive: true }); syncHeader();
  const fab = $(".fab"), blocking = new Set();
  function syncFab() { fab.classList.toggle("is-hidden", [...blocking].some((n) => n.offsetParent !== null)); }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? blocking.add(en.target) : blocking.delete(en.target)));
      syncFab();
    }, { threshold: 0.1 });
    $$(".hero, .page-head, .form-card, .land, .brief, .cta, .site-footer, .spaces").forEach((n) => io.observe(n));
  }

  renderAll();
  route(location.hash);

  /* ---------- Opening intro: once per visit, skipped for reduced motion ---------- */
  (function intro() {
    const box = $("#intro"); if (!box) return;
    const root = document.documentElement;
    if (!root.classList.contains("show-intro")) { box.remove(); return; }
    try { sessionStorage.setItem("om-intro", "1"); } catch (e) {}
    let gone = false;
    const end = () => {
      if (gone) return; gone = true;
      box.remove();
      root.classList.remove("show-intro");
      setTimeout(() => root.classList.remove("intro-playing"), 4000);
    };
    box.addEventListener("animationend", (e) => { if (e.animationName === "introLift") end(); });
    box.addEventListener("click", () => {
      if (box.classList.contains("is-leaving")) return;
      box.classList.add("is-leaving");
      $$(".frames").forEach((a) => (a.style.animationDelay = "0.5s"));
    });
    setTimeout(end, 4500);
  })();

  window.addEventListener("load", () => {
    const go = () => Object.values(MEDIA).forEach((m) => warm(m.type === "video" ? m.poster : (m.thumb || m.src)));
    "requestIdleCallback" in window ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200);
  });
}
