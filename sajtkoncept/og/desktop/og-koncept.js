/*
 * KONCEPT (2026-11-18): två OG-unika block. Stil i og-koncept.css, markup i index.html (#familjen, #helgen).
 * Fakta från docs/og-fakta.md och OG-manualen. Allt i [hakparentes] är påhittat eller overifierat.
 * Följer sajtens säsong (html[data-season]) och byter innehåll live.
 */
(() => {
  const root = document.documentElement;
  const IMG = "./assets/img/";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const season = () => (root.dataset.season === "summer" ? "summer" : "winter");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const fmt = (n) => (Math.round(n * 10) / 10).toString().replace(".", ",");

  /* Piktogram i 32-rastret: 2 px linje + en accentform (som Icons / Content). Skisser, inte ritade i Figma. */
  const P = {
    lyan: '<path class="linje" d="M5 15 16 5l11 10M8 13v14h16V13"/><circle class="accent" cx="16" cy="21" r="4"/><path class="linje" d="m14.4 17.4 1.6-1.6 1.6 1.6"/>',
    backen: '<path class="linje" d="M3 27c6 0 9-8 15-8s7 3 11 3"/><path class="linje" d="M11 22.5V8"/><path class="accent" d="M11 8h9l-2.5 3 2.5 3h-9z"/>',
    skolan: '<path class="linje" d="M16 7 3 13l13 6 13-6z"/><path class="linje" d="M9 16.5V22c0 2 3 4 7 4s7-2 7-4v-5.5M27 13.5v6"/><circle class="accent" cx="27" cy="22" r="2.5"/>',
    berget: '<path class="linje" d="M3 27 13 10l5 8 3-4 8 13z"/><path class="linje" d="m9.6 15.6 3.4 2.4 2.6-2.2"/><circle class="accent" cx="25" cy="7" r="3.5"/>',
    stranden: '<circle class="accent" cx="16" cy="11" r="5"/><path class="linje" d="M3 21c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2M3 26.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2"/>',
    skogen: '<path class="linje" d="M12 4 5 14h4l-5 8h16l-5-8h4zM12 22v6"/><circle class="accent" cx="24" cy="24" r="4"/><path class="linje" d="m22.4 20.4 1.6-1.6 1.6 1.6"/>',
    klatter: '<path class="linje" d="M6 4v24M26 4v24M6 11c5 6 15 6 20 0M10 14v3M16 15.5v3M22 14v3"/><path class="accent" d="M12 26a4 4 0 0 1 8 0z"/>',
    lederna: '<circle class="linje" cx="8" cy="21" r="5"/><circle class="linje" cx="24" cy="21" r="5"/><path class="linje" d="m8 21 5-9h8l3 9M13 12l3 9H8M18 8h4"/><circle class="accent" cx="12" cy="6.5" r="2.5"/>',
    eld: '<path class="accent" d="M16 3.5c4 5 7 8 7 12.5a7 7 0 0 1-14 0c0-3.5 2-5.5 3.5-7.5.5 2.5 1.5 4 3 4.5-.5-3.5-.5-6.5.5-9.5z"/><path class="linje" d="m5 27 22-4M5 23l22 4"/>',
    skidor: '<path class="linje" d="M3 23 22 7.5c1.6-1.3 3.6.2 2.7 2M6.5 27.5l19-15.5c1.6-1.3 3.6.2 2.7 2"/><circle class="accent" cx="8.5" cy="8.5" r="3.5"/>',
    bil: '<path class="linje" d="M4 21v-4l3-6h18l3 6v4a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 4 21zM4 17h24"/><circle class="linje" cx="9.5" cy="23" r="2.5"/><circle class="linje" cx="22.5" cy="23" r="2.5"/><path class="accent" d="M11.5 12.5h9l1.5 3h-12z"/>'
  };
  const pikto = (k, extra = "") => `<svg class="og-pikto${extra}" viewBox="0 0 32 32" aria-hidden="true">${P[k]}</svg>`;

  /* ─────────────────────────── Block 1: Familjen ─────────────────────────── */
  const ZONER = {
    winter: [
      { namn: "Blåbärslyan", fran: 0, till: 2, pikto: "lyan",
        bilder: [["mer/AA102015.jpg", "Bärra i dörren till Blåbärslyan"], ["mer/AA104712.jpg", "Flicka på kälke i snön"]],
        saker: [["Blåbärslyan", "Inomhuslek för de minsta, öppen från 21 dec."], ["Pulkabacken", "I barnområdet, med värmestuga intill."], ["Bärras Härbre", "Titta in hos Bärra i Blåbärsskogen."]] },
      { namn: "Barnbacken", fran: 3, till: 6, pikto: "backen", chip: "0 kr liftkort", kortChip: "Åker gratis",
        bilder: [["guide/guide-barra-barnbacken.jpg", "Barn i skidhjälm bredvid Bärra i barnbacken"], ["mer/AA102531.jpg", "Barn åker skidor med Bärra"]],
        saker: [["Skidkarusellen", "Knappliftar och rullband i Barnbacken."], ["Skidskola i grupp", "Alpin grupp från ca 3–4 år."], ["Liftkort 0 kr", "Gratis till och med 6 år, med hjälm."]] },
      { namn: "Skidskolan", fran: 7, till: 12, pikto: "skolan",
        bilder: [["mer/AA102967.jpg", "Skidlärare och barn i skidskolevästar i backen"], ["aktuellt/barnens-vasalopp.jpg", "Barn i längdspåret"]],
        saker: [["Skidskola i grupp", "Egen grupp på rätt nivå, medan ni åker själva."], ["Barnens Vasalopp", "Ca 900 meter i spåret, med Bärra."], ["Söderbacken och Mellanbacken", "Nästa steg efter Barnbacken."]] },
      { namn: "Hela berget", fran: 13, till: 17, pikto: "berget",
        bilder: [["mer/AA106867.jpg", "Skidåkare svänger ner i nypreparerad backe"], ["aktuellt/kvallsakning.jpg", "Kvällsåkning i backen"]],
        saker: [["Norrbacken", "24 nedfarter, från gröna till svarta."], ["Längdskola i grupp", "Från 13 år, med Almgren Coaching."], ["Elljusspåret", "4,2 km, tänt till 21."]] }
    ],
    summer: [
      { namn: "Stranden", fran: 0, till: 2, pikto: "stranden",
        bilder: [["aktuellt/vecka-i-juli.jpg", "Mamma och barn badar i sjön"], ["mer/AA109583.jpg", "Fika på bryggan vid Rädsjön"]],
        saker: [["Rädsjön", "Sandstrand och brygga."], ["Utomhuspoolen", "Vid Wärdshuset."], ["Bärras Härbre", "Titta in hos Bärra i Blåbärsskogen."]] },
      { namn: "Blåbärsskogen", fran: 3, till: 6, pikto: "skogen",
        bilder: [["aktuellt/barra-blabarsskogen.jpg", "Bärra och ett barn i Blåbärsskogen"], ["mer/AA106842.jpg", "Flicka bygger koja av grenar"]],
        saker: [["Blåbärsskogen", "Bärras skog, med Härbret mitt i."], ["Minigolf", "En runda före middagen."], ["Bryggan vid Rädsjön", "Bada, plaska, fika."]] },
      { namn: "Klätterparken", fran: 7, till: 12, pikto: "klatter",
        bilder: [["guide/guide-klatterpark-barn.jpg", "Barn i sele och hjälm i klätterparken"], ["mer/AA106620.jpg", "Barn hoppar med cykeln från träramp"]],
        saker: [["Klätterparken", "Banor bland tallarna. [Från X år.]"], ["Skills trail", "Ramper och kurvor. Hyrcyklar på Längdcentrum."], ["Älgsafari", "Leta älg i skogarna runt Grönklitt."]] },
      { namn: "Lederna", fran: 13, till: 17, pikto: "lederna",
        bilder: [["mer/AA106478.jpg", "Pojke cyklar fort genom tallskogen"], ["mer/AA107577.jpg", "Barn hoppar från bryggan i motljus"]],
        saker: [["Flowtrail", "Liftburen cykling 100 kr/dag, sommarliften 13/7–9/8."], ["SUP på Rädsjön", "Paddla ut från stranden."], ["Discgolf", "Utmana resten av familjen."]] }
    ]
  };
  const IHOP = {
    winter: {
      sma: { bild: ["en-dag/brasan.jpg", "Familj vid elden i snön med pulka"], saker: [["Grillplatsen vid Barnbacken", "Korv och varm choklad mitt på dagen."], ["Pizza på Wärdshuset", "Efter sista åket."]] },
      stora: { bild: ["guide/guide-toppstugan.jpg", "Toppstugan i snön"], saker: [["Fonduekväll i Toppstugan", "Hela familjen, högst upp."], ["Pizza på Wärdshuset", "Efter sista åket."]] },
      cta: "Boka skidskola"
    },
    summer: {
      sma: { bild: ["mer/AA108699.jpg", "Familj vid grillplatsen vid sjön"], saker: [["Rädsjön", "Sandstrand, brygga och fika."], ["Pizza på Wärdshuset", "Efter en dag i skogen."]] },
      stora: { bild: ["mer/AA109821.jpg", "Pappa med barn på ryggen kliver upp på flotten"], saker: [["Bastuflotten på Rädsjön", "Bastu och dopp, hela gänget."], ["Pizza på Wärdshuset", "Efter en dag i skogen."]] },
      cta: "Se sommarens aktiviteter"
    }
  };
  const ORD = ["bebis", "ettåring", "tvååring", "treåring", "fyraåring", "femåring", "sexåring", "sjuåring", "åttaåring", "nioåring", "tioåring", "elvaåring", "tolvåring", "trettonåring", "fjortonåring", "femtonåring", "sextonåring", "sjuttonåring"];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const namn = (age, count) => cap(ORD[age] + (count > 1 ? "arna" : "en"));
  const zonIndex = (age) => (age <= 2 ? 0 : age <= 6 ? 1 : age <= 12 ? 2 : 3);
  const MAX_BARN = 5;

  const familj = document.getElementById("familjen");
  if (familj) {
    const band = familj.querySelector("[data-familj-band]");
    const zonerEl = familj.querySelector("[data-familj-zoner]");
    const grid = familj.querySelector("[data-familj-grid]");
    const addBtn = familj.querySelector("[data-familj-add]");
    const status = familj.querySelector("[data-familj-status]");
    let uid = 0;
    let barn = [4, 9];
    try {
      const saved = JSON.parse(localStorage.getItem("og-koncept-barn") || "null");
      if (Array.isArray(saved) && saved.length && saved.length <= MAX_BARN && saved.every((a) => Number.isInteger(a) && a >= 0 && a <= 17)) barn = saved;
    } catch (e) {}
    barn = barn.map((age) => ({ id: ++uid, age }));
    const save = () => { try { localStorage.setItem("og-koncept-barn", JSON.stringify(barn.map((b) => b.age))); } catch (e) {} };

    const ingress = familj.querySelector("[data-familj-ingress]");
    const INGRESS = {
      winter: "Dra barnen längs linjen eller lägg till fler. Ni får förslag för just deras ålder, från Blåbärslyan till toppen av Norrbacken.",
      summer: "Dra barnen längs linjen eller lägg till fler. Ni får förslag för just deras ålder, från sandstranden vid Rädsjön till flowtrailen."
    };
    const renderZoner = () => {
      if (ingress) ingress.textContent = INGRESS[season()];
      const zs = ZONER[season()];
      const used = new Set(barn.map((b) => zonIndex(b.age)));
      zonerEl.innerHTML = zs.map((z, i) => `
        <div class="og-familj-zon${used.has(i) ? "" : " is-tom"}">
          ${pikto(z.pikto)}
          <span class="og-familj-zon-namn">${esc(z.namn)}</span>
          <span class="td-ui-caption og-familj-zon-alder">${z.fran}–${z.till} år</span>
          ${season() === "winter" && z.chip ? `<span class="og-familj-zon-chip">${esc(z.chip)}</span>` : ""}
        </div>`).join("");
    };

    const placeMarkers = () => {
      const seen = {};
      [...barn].sort((a, b) => a.id - b.id).forEach((b) => {
        const el = band.querySelector(`[data-barn-id="${b.id}"]`);
        if (!el) return;
        const stapel = (seen[b.age] = (seen[b.age] ?? -1) + 1);
        el.style.setProperty("--alder", b.age);
        el.style.setProperty("--stapel", Math.min(stapel, 2));
        const m = el.querySelector(".og-familj-markor");
        m.querySelector(".og-familj-markor-tal").textContent = b.age;
        m.setAttribute("aria-valuenow", b.age);
        m.setAttribute("aria-valuetext", `${b.age} år, ${ZONER[season()][zonIndex(b.age)].namn}`);
        el.querySelector(".og-familj-ta-bort").setAttribute("aria-label", `Ta bort ${ORD[b.age]}en`);
      });
      band.querySelectorAll(".og-familj-barn").forEach((el) => el.classList.toggle("is-ensam", barn.length === 1));
      band.classList.toggle("is-full", barn.length >= MAX_BARN);
      addBtn.disabled = barn.length >= MAX_BARN;
    };

    const renderMarkers = () => {
      band.querySelectorAll(".og-familj-barn").forEach((el) => el.remove());
      barn.forEach((b, i) => {
        const el = document.createElement("div");
        el.className = "og-familj-barn";
        el.dataset.barnId = b.id;
        el.innerHTML = `
          <div class="og-familj-markor" role="slider" tabindex="0" aria-label="Barn ${i + 1}, ålder" aria-valuemin="0" aria-valuemax="17">
            <span class="og-familj-markor-tal"></span><span class="og-familj-markor-enhet">år</span>
          </div>
          <button class="og-familj-ta-bort" type="button">×</button>`;
        band.append(el);
      });
      placeMarkers();
    };

    let kortNyckel = "";
    const renderKort = () => {
      const s = season();
      const nyckel = s + ":" + barn.map((b) => b.age).sort((a, b) => a - b).join(",");
      if (nyckel === kortNyckel) return;
      kortNyckel = nyckel;
      const zs = ZONER[s];
      const groups = new Map();
      [...barn].sort((a, b) => a.age - b.age).forEach((b) => groups.set(b.age, (groups.get(b.age) || 0) + 1));
      const perZon = {};
      const cards = [...groups].map(([age, count]) => {
        const zi = zonIndex(age);
        const z = zs[zi];
        const n = (perZon[zi] = (perZon[zi] ?? -1) + 1);
        const [src, alt] = z.bilder[n % z.bilder.length];
        const chip = s === "winter" && z.kortChip ? `<span class="td-chip-tag td-chip-tag-solid td-chip-tag-dark">${esc(z.kortChip)}</span>` : "";
        return `
          <article class="og-familj-kort">
            <div class="og-familj-kort-bild"><img src="${IMG + src}" alt="${esc(alt)}" decoding="async">${chip}</div>
            <p class="td-ui-caption og-familj-kort-zon">${esc(z.namn)} · ${z.fran}–${z.till} år</p>
            <h3 class="td-heading-xs">${esc(namn(age, count))}</h3>
            <ul class="og-familj-lista">
              ${z.saker.map(([t, d]) => `<li><span class="td-ui-body og-familj-lista-titel">${esc(t)}</span><span class="td-ui-caption">${esc(d)}</span></li>`).join("")}
            </ul>
          </article>`;
      });
      const k = cards.length;
      const span = 4 - (k % 4);
      const youngest = Math.min(...barn.map((b) => b.age));
      const ih = IHOP[s][youngest <= 6 ? "sma" : "stora"];
      const free = barn.filter((b) => b.age <= 6).length;
      const skola = barn.filter((b) => b.age >= 3).length;
      const summa = s === "winter"
        ? [free ? `<strong>${free}</strong> av ${barn.length} åker gratis med hjälm` : "", skola ? `<strong>${skola}</strong> kan gå i skidskola` : ""].filter(Boolean).join(" · ")
        : `<strong>${barn.length}</strong> barn, <strong>${k * 3 + 2}</strong> förslag att spara till resan`;
      const bred = span >= 2;
      cards.push(`
        <article class="og-familj-ihop${bred ? " is-bred" : ""}" style="grid-column: span ${span}">
          <div class="og-familj-ihop-bild"><img src="${IMG + ih.bild[0]}" alt="${esc(ih.bild[1])}" decoding="async"></div>
          <div class="og-familj-ihop-text">
            <p class="td-ui-caption">Hela familjen</p>
            <h3 class="td-heading-xs">Det här gör ni ihop</h3>
            <ul class="og-familj-ihop-lista">${ih.saker.map(([t, d]) => `<li class="td-ui-body"><strong>${esc(t)}</strong><span class="td-ui-caption">${esc(d)}</span></li>`).join("")}</ul>
            ${summa ? `<p class="td-ui-body og-familj-summa">${summa}</p>` : ""}
            <div class="og-familj-ctas">
              <a class="td-button td-button-md td-button-secondary" href="#">${esc(IHOP[s].cta)}</a>
              <button class="td-button td-button-md td-button-text-ljus" type="button" data-familj-fraga>Fråga Orsaguiden</button>
            </div>
          </div>
        </article>`);
      grid.innerHTML = cards.join("");
    };

    const describe = () => {
      const groups = new Map();
      [...barn].sort((a, b) => a.age - b.age).forEach((b) => groups.set(b.age, (groups.get(b.age) || 0) + 1));
      return [...groups].map(([age, c]) => (c > 1 ? `${c} ${ORD[age]}ar` : `en ${ORD[age]}`)).join(" och ").replace(/ och (?=.* och )/g, ", ");
    };

    let raf = 0;
    const refresh = (all = false) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        placeMarkers();
        renderZoner();
        renderKort();
        if (all) save();
      });
    };
    const full = () => { renderZoner(); renderMarkers(); renderKort(); };

    const ageAt = (clientX) => {
      const r = band.getBoundingClientRect();
      return Math.max(0, Math.min(17, Math.floor(((clientX - r.left) / r.width) * 18)));
    };
    const announce = (b) => { if (status) status.textContent = `${namn(b.age, 1)}: ${ZONER[season()][zonIndex(b.age)].namn}`; };
    const addAt = (age) => {
      if (barn.length >= MAX_BARN) return;
      const b = { id: ++uid, age };
      barn.push(b);
      renderMarkers();
      refresh(true);
      announce(b);
      band.querySelector(`[data-barn-id="${b.id}"] .og-familj-markor`)?.focus({ preventScroll: true });
    };
    const remove = (id) => {
      if (barn.length <= 1) return;
      barn = barn.filter((b) => b.id !== id);
      renderMarkers();
      refresh(true);
    };

    let drag = null;
    band.addEventListener("pointerdown", (e) => {
      const marker = e.target.closest(".og-familj-markor");
      if (marker) {
        const id = Number(marker.parentElement.dataset.barnId);
        drag = { id, el: marker.parentElement };
        drag.el.classList.add("is-drar");
        marker.setPointerCapture(e.pointerId);
        marker.focus({ preventScroll: true });
        e.preventDefault();
        return;
      }
      if (e.target.closest(".og-familj-ta-bort")) return;
      e.preventDefault(); /* behåll fokus på det nya barnet */
      addAt(ageAt(e.clientX));
    });
    band.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const b = barn.find((x) => x.id === drag.id);
      const age = ageAt(e.clientX);
      if (b && b.age !== age) { b.age = age; placeMarkers(); refresh(); }
    });
    const end = () => {
      if (!drag) return;
      drag.el.classList.remove("is-drar");
      const b = barn.find((x) => x.id === drag.id);
      drag = null;
      refresh(true);
      if (b) announce(b);
    };
    band.addEventListener("pointerup", end);
    band.addEventListener("pointercancel", end);
    band.addEventListener("click", (e) => {
      const x = e.target.closest(".og-familj-ta-bort");
      if (x) remove(Number(x.parentElement.dataset.barnId));
    });
    band.addEventListener("keydown", (e) => {
      const marker = e.target.closest(".og-familj-markor");
      if (!marker) return;
      const id = Number(marker.parentElement.dataset.barnId);
      const b = barn.find((x) => x.id === id);
      if (!b) return;
      const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
      if (step) b.age = Math.max(0, Math.min(17, b.age + step));
      else if (e.key === "Home") b.age = 0;
      else if (e.key === "End") b.age = 17;
      else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); remove(id); return; }
      else return;
      e.preventDefault();
      refresh(true);
      announce(b);
    });
    addBtn.addEventListener("click", () => {
      const taken = new Set(barn.map((b) => b.age));
      const age = [6, 2, 11, 14, 0, 8, 16].find((a) => !taken.has(a)) ?? 5;
      addAt(age);
    });
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-familj-fraga]");
      if (!btn) return;
      const q = `Vad passar ${describe()} i Orsa Grönklitt?`;
      if (typeof window.tdFragaAsk === "function") window.tdFragaAsk(q, btn);
    });

    full();
    new MutationObserver(full).observe(root, { attributes: true, attributeFilter: ["data-season"] });
  }

  /* ─────────────────────────── Block 2: Bästa mixen ─────────────────────────── */
  const MIX = {
    winter: {
      kmEtikett: "i spåret",
      namn: ["Bara vila", "Mest vila", "Halva-halva", "Mest åkning", "Bara åkning"],
      start: { tid: "Fre 15:00", plats: "Stockholm", rubrik: "Lämna stan", text: "30 mil, ca 4 h. Nyckeln ligger i kuvertet vid incheckningen." },
      slut: { tid: "Sön 11:00", plats: "Utcheckning", rubrik: "Hemåt", text: "Hemma i Stockholm vid 15." },
      rader: [
        { tid: "Fre 19:30", t: 43,
          aktiv: { rubrik: "Elljusspåret", text: "4,2 km i strålkastarljus, tänt till 21.", bild: "mer/AA109814.jpg", alt: "Två längdåkare i snötyngd skog", km: 4.2, korg: "Längdskidor, hyra" },
          lugn: { rubrik: "Middag på Wärdshuset", text: "Restaurang, bar och pizza.", bild: "guide/guide-wardshuset.jpg", alt: "Middag i levande ljus på Wärdshuset", h: 2 } },
        { tid: "Lör 08:00", t: 14,
          aktiv: { rubrik: "Första spåret", text: "Från Längdcentrum, [15 km-slingan]. Spåren öppnar 06.", bild: "en-dag/langd.jpg", alt: "Längdåkare i spåret på morgonen", km: 15, korg: "Längdskidor, hyra" },
          lugn: { rubrik: "Sovmorgon", text: "Bröd från Baka Kaka på Mötestorget.", bild: "aktuellt/jul-i-stugan.jpg", alt: "Snötäckt stugby i gryningsljus", h: 3 } },
        { tid: "Lör 11:00", t: 71,
          aktiv: { rubrik: "Norrbacken från toppen", text: "24 nedfarter, gröna till svarta.", bild: "mer/AA106867.jpg", alt: "Skidåkare svänger ner i nypreparerad backe", km: 0, korg: "Liftkort, 1 dag" },
          lugn: { rubrik: "Fika vid elden", text: "Kaffe och bulle vid eldstaden.", bild: "mer/AA104437.jpg", alt: "Fika vid eldstaden i snön", h: 1.5 } },
        { tid: "Lör 14:00", t: 28,
          aktiv: { rubrik: "Elitspåret, 10 km", text: "Ett av två elitspår, 5 och 10 km.", bild: "aktuellt/langdspar.jpg", alt: "Längdåkare i skogsspår", km: 10, korg: "Längdskidor, hyra" },
          lugn: { rubrik: "[Bastu och vak]", text: "[Bastun på isen och ett dopp i vaken.]", bild: "mer/AA105425.jpg", alt: "Badare kliver upp ur vaken", h: 2, korg: "[Bastu]" } },
        { tid: "Lör 18:00", t: 86,
          aktiv: { rubrik: "Kvällsbacken", text: "[Belysta nedfarter till 19.]", bild: "aktuellt/kvallsakning.jpg", alt: "Kvällsåkning i backen", km: 0, korg: "Liftkort, 1 dag" },
          lugn: { rubrik: "Fonduekväll i Toppstugan", text: "Ost, bröd och levande ljus.", bild: "mer/AA105757.jpg", alt: "Bricka med chark vid levande ljus", h: 3, korg: "Fonduekväll" } },
        { tid: "Sön 08:00", t: 57,
          aktiv: { rubrik: "Söndagsturen", text: "[2 mil] i lugnt tempo före frukost.", bild: "mer/AA101089.jpg", alt: "Längdåkare vid röd timmergård i snön", km: 20, korg: "Längdskidor, hyra" },
          lugn: { rubrik: "Långfrukost", text: "Utcheckning 11. Ingen brådska.", bild: "mer/AA105870.jpg", alt: "Öppen eld i timmerstugan", h: 2 } }
      ]
    },
    summer: {
      kmEtikett: "på cykel och stig",
      namn: ["Bara vila", "Mest vila", "Halva-halva", "Mest fart", "Bara fart"],
      start: { tid: "Fre 15:00", plats: "Stockholm", rubrik: "Lämna stan", text: "30 mil, ca 4 h. Nyckeln ligger i kuvertet vid incheckningen." },
      slut: { tid: "Sön 11:00", plats: "Utcheckning", rubrik: "Hemåt", text: "Hemma i Stockholm vid 15." },
      rader: [
        { tid: "Fre 19:30", t: 43,
          aktiv: { rubrik: "Kvällstur på cykel", text: "[15 km] grön led genom tallskogen.", bild: "mer/AA106496.jpg", alt: "Två vuxna på mountainbike i skogen", km: 15, korg: "Hyrcykel" },
          lugn: { rubrik: "Kvällsdopp i Rädsjön", text: "Sandstrand och brygga.", bild: "en-dag/sommar-kvallsdopp.jpg", alt: "Kvällsdopp från bryggan", h: 2 } },
        { tid: "Lör 08:00", t: 14,
          aktiv: { rubrik: "Skills trail", text: "Ramper och kurvor. Hyrcyklar på Längdcentrum.", bild: "mer/AA106620.jpg", alt: "Cyklist hoppar från träramp", km: 5, korg: "Hyrcykel" },
          lugn: { rubrik: "Frukost på bryggan", text: "Kaffe och bullar vid Rädsjön.", bild: "mer/AA109583.jpg", alt: "Fika på bryggan vid Rädsjön", h: 2 } },
        { tid: "Lör 11:00", t: 71,
          aktiv: { rubrik: "Klätterparken", text: "Banor bland tallarna.", bild: "mer/AA106362.jpg", alt: "Klättrare i hjälm vid trädet", km: 0, korg: "Klätterparken" },
          lugn: { rubrik: "Pizza på Wärdshuset", text: "Pizza, café och bar.", bild: "en-dag/sommar-pizza.jpg", alt: "Pizza utomhus i skogen", h: 1.5 } },
        { tid: "Lör 14:00", t: 28,
          aktiv: { rubrik: "Gravel", text: "[4 mil] grusväg. Här går Orsa GRVL den 10/7.", bild: "mer/AA106711.jpg", alt: "Cyklister vid leden", km: 40, korg: "Hyrcykel" },
          lugn: { rubrik: "Bastuflotten på Rädsjön", text: "Bastu, dopp, bastu.", bild: "mer/AA109790.jpg", alt: "Par i bastun med fönster mot sjön", h: 2, korg: "[Bastuflotten]" } },
        { tid: "Lör 18:00", t: 86,
          aktiv: { rubrik: "SUP på Rädsjön", text: "Kvällspaddling på blankt vatten.", bild: "guide/guide-radsjon.jpg", alt: "Rädsjön en stilla kväll", km: 0, korg: "[SUP, hyra]" },
          lugn: { rubrik: "Grill vid sjön", text: "Grillplats med utsikt över vattnet.", bild: "mer/AA108699.jpg", alt: "Familj vid grillplatsen vid sjön", h: 3 } },
        { tid: "Sön 08:00", t: 57,
          aktiv: { rubrik: "Morgonlöpning", text: "[8 km] stig, delar av Grönklitt Trail.", bild: "guide/guide-trollstigen.jpg", alt: "Stig genom skogen", km: 8 },
          lugn: { rubrik: "Promenad med utsikt", text: "Över Orsasjön och skogarna.", bild: "mer/AA107196.jpg", alt: "Barn på mammas axlar med utsikt över skog och sjö", h: 2 } }
      ]
    }
  };

  const mix = document.getElementById("helgen");
  if (mix) {
    const range = mix.querySelector("[data-mix-range]");
    const namnEl = mix.querySelector("[data-mix-namn]");
    const kmEl = mix.querySelector("[data-mix-km]");
    const kmEtikett = mix.querySelector("[data-mix-km-etikett]");
    const hEl = mix.querySelector("[data-mix-h]");
    const korgEl = mix.querySelector("[data-mix-korg]");
    const schema = mix.querySelector("[data-mix-schema]");
    let state = [];
    let lastKorg = "";

    const fast = (f) => `
      <li class="og-mix-rad is-fast">
        <p class="og-mix-tid">${esc(f.tid)}<span>${esc(f.plats)}</span></p>
        <div class="og-mix-bild">${pikto("bil")}</div>
        <div class="og-mix-text"><p class="og-mix-tagg">På vägen</p><h3 class="td-ui-title">${esc(f.rubrik)}</h3><p class="td-ui-caption">${esc(f.text)}</p></div>
      </li>`;
    const radInner = (r, lage) => {
      const v = r[lage];
      return `
        <div class="og-mix-bild"><img src="${IMG + v.bild}" alt="${esc(v.alt)}" loading="lazy" decoding="async"></div>
        <div class="og-mix-text"><p class="og-mix-tagg">${lage === "aktiv" ? "Ladda upp" : "Koppla av"}</p><h3 class="td-ui-title">${esc(v.rubrik)}</h3><p class="td-ui-caption">${esc(v.text)}</p></div>`;
    };

    const build = () => {
      const d = MIX[season()];
      const v = Number(range.value);
      state = d.rader.map((r) => (v >= r.t ? "aktiv" : "lugn"));
      schema.innerHTML = fast(d.start) + d.rader.map((r, i) => `
        <li class="og-mix-rad" data-lage="${state[i]}" data-rad="${i}">
          <p class="og-mix-tid">${esc(r.tid.split(" ")[0])}<span>${esc(r.tid.split(" ")[1])}</span></p>
          ${radInner(r, state[i])}
        </li>`).join("") + fast(d.slut);
      kmEtikett.textContent = d.kmEtikett;
      lastKorg = "";
      update(false);
    };

    const update = (animate = true) => {
      const d = MIX[season()];
      const v = Number(range.value);
      range.style.setProperty("--fyll", v + "%");
      let km = 0;
      let h = 0;
      let aktiva = 0;
      const korg = ["Stuga fre–sön"];
      d.rader.forEach((r, i) => {
        const lage = v >= r.t ? "aktiv" : "lugn";
        if (lage === "aktiv") { km += r.aktiv.km || 0; aktiva++; } else h += r.lugn.h || 0;
        const item = r[lage].korg;
        if (item && !korg.includes(item)) korg.push(item);
        if (state[i] !== lage) {
          state[i] = lage;
          const li = schema.querySelector(`[data-rad="${i}"]`);
          if (!li) return;
          li.dataset.lage = lage;
          li.querySelectorAll(".og-mix-bild, .og-mix-text").forEach((el) => el.remove());
          li.insertAdjacentHTML("beforeend", radInner(r, lage));
          if (animate && !reduced) {
            li.querySelectorAll(".og-mix-bild, .og-mix-text").forEach((el, k) =>
              el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: k * 40, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }));
          }
        }
      });
      const n = d.namn;
      const label = aktiva === 0 ? n[0] : aktiva <= 2 ? n[1] : aktiva === 3 ? n[2] : aktiva <= 5 ? n[3] : n[4];
      namnEl.textContent = label;
      range.setAttribute("aria-valuetext", `${label}: ${aktiva} av ${d.rader.length} pass aktiva`);
      kmEl.textContent = `${fmt(Math.round(km))} km`;
      hEl.textContent = `${fmt(h)} h`;
      const k = korg.join("|");
      if (k !== lastKorg) {
        lastKorg = k;
        korgEl.innerHTML = korg.map((x) => `<li>${esc(x)}</li>`).join("");
      }
    };

    range.addEventListener("input", () => update(true));
    build();
    new MutationObserver(build).observe(root, { attributes: true, attributeFilter: ["data-season"] });
  }
})();
