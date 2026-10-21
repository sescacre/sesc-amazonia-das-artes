/* Modelo "Rio" — monta a página a partir de js/data.js */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const { L, E, P, icone, esc, ling, estado, idYoutube, imagemDe, hash, aleatorio, reduz, botoesLinks, videoEmbed, revelar } = window.BASE;
  const $ = (s, c) => (c || document).querySelector(s);
  const filtro = { linguagem: "", estado: "" };

  /* ---------- Nascente: ondas na água ---------- */
  function montarAgua() {
    const cv = $("#agua"), ctx = cv.getContext && cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2); let W = 0, H = 0, ondas = [], visivel = true, cor = "62,142,138";
    const lerCor = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--rio").trim();
      const m = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (m) cor = [m[1], m[2], m[3]].map((h) => parseInt(h, 16)).join(",");
    };
    const medir = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const nova = (x, y, forca) => ondas.push({ x, y, r: 0, v: 0.5 + Math.random() * 0.5, max: (120 + Math.random() * 220) * (forca || 1) });
    const desenhar = () => {
      ctx.clearRect(0, 0, W, H);
      ondas.forEach((o) => {
        for (let k = 0; k < 3; k++) {
          const r = o.r - k * 16; if (r <= 0) continue;
          const a = (1 - o.r / o.max) * (0.32 - k * 0.09);
          if (a <= 0) continue;
          ctx.beginPath(); ctx.ellipse(o.x, o.y, r, r * 0.42, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cor},${a.toFixed(3)})`; ctx.lineWidth = 1.5; ctx.stroke();
        }
      });
    };
    lerCor(); medir();
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", lerCor);
    new MutationObserver(lerCor).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    addEventListener("resize", () => { medir(); desenhar(); });
    // estado inicial já com algumas ondas, para a tela parada não ficar vazia
    const r0 = aleatorio(9);
    for (let i = 0; i < 7; i++) { nova(r0() * W, r0() * H, 1.2); ondas[i].r = r0() * ondas[i].max * 0.7; }
    desenhar();
    if (reduz) return;
    let ultimo = 0;
    $(".nascente").addEventListener("pointermove", (e) => {
      const t = performance.now(); if (t - ultimo < 90) return; ultimo = t;
      const r = cv.getBoundingClientRect(); nova(e.clientX - r.left, e.clientY - r.top, 0.6);
    });
    new IntersectionObserver((e) => { visivel = e[0].isIntersecting; if (visivel) requestAnimationFrame(loop); }).observe(cv);
    let acum = 0;
    function loop() {
      if (!visivel) return;
      acum++; if (acum % 40 === 0) nova(Math.random() * W, Math.random() * H, 1);
      ondas.forEach((o) => { o.r += o.v; }); ondas = ondas.filter((o) => o.r < o.max);
      desenhar(); requestAnimationFrame(loop);
    }
  }

  /* ---------- Chips de linguagem ---------- */
  function montarChips() {
    $("#chips").innerHTML = `<button type="button" class="chip" data-ling="" aria-pressed="true">Todas</button>` +
      L.map((l) => `<button type="button" class="chip" data-ling="${l.slug}" style="--cor:${l.cor}" aria-pressed="false">${icone(l.icone)}${esc(l.nome)}</button>`).join("");
    $("#chips").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) escolher(b.dataset.ling, true); });
    $("#limpar").addEventListener("click", () => { filtro.estado = ""; escolher("", false); });
  }
  function escolher(slug, rolar) {
    filtro.linguagem = slug || "";
    try { history.replaceState(null, "", slug ? "#" + slug : "#roteiro"); } catch (_) { /* ignorado */ }
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.ling === filtro.linguagem)));
    const l = slug ? ling(slug) : null;
    $("#roteiroDesc").textContent = l ? l.desc : "Siga o rio: cada parada é um projeto selecionado para circular pela região.";
    const fe = $("#filtroEstado");
    fe.hidden = !filtro.estado;
    if (filtro.estado) {
      fe.innerHTML = `Projetos de ${esc(estado(filtro.estado).nome)} <button type="button" aria-label="Remover filtro de estado">✕</button>`;
      $("button", fe).addEventListener("click", () => { filtro.estado = ""; escolher(filtro.linguagem, false); });
    }
    montarParadas();
    if (rolar) $("#roteiro").scrollIntoView({ behavior: reduz ? "auto" : "smooth" });
  }

  /* ---------- Paradas ---------- */
  function ondasSvg(seed) {
    const r = aleatorio(hash(seed)); let d = "";
    for (let i = 0; i < 6; i++) {
      const y = 18 + i * 34 + r() * 10; let p = `M-40 ${y.toFixed(1)}`;
      for (let x = 0; x <= 440; x += 60) p += ` q 30 ${((r() - .5) * 28).toFixed(1)} 60 0`;
      d += `<path d="${p}"/>`;
    }
    return `<svg class="ondas" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${d}</svg>`;
  }
  function capa(p) {
    const l = ling(p.linguagem), img = imagemDe(p), vid = idYoutube(p.video);
    return `<span class="capa" style="--cor:${l.cor}">${ondasSvg(p.id || p.titulo)}${icone(l.icone, "capa__ic")}` +
      (img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : "") +
      (vid ? `<span class="capa__play">${icone("play")}</span>` : "") +
      (p.exemplo ? '<span class="selo">Exemplo</span>' : "") + "</span>";
  }
  function montarParadas() {
    const lista = P.filter((p) => (!filtro.linguagem || p.linguagem === filtro.linguagem) && (!filtro.estado || p.estado === filtro.estado));
    $("#vazio").hidden = lista.length > 0;
    $("#paradas").innerHTML = lista.map((p, i) => {
      const l = ling(p.linguagem), est = estado(p.estado);
      return `<li class="parada" style="--cor:${l.cor}"><span class="parada__ponto" aria-hidden="true"></span>` +
        `<button type="button" class="parada__card" data-id="${esc(p.id)}">${capa(p)}<span class="parada__corpo">` +
        `<span class="parada__meta"><b>Parada ${String(i + 1).padStart(2, "0")}</b><span>${esc(l.nome)}</span><span>${esc(est.nome)}</span></span>` +
        `<span class="parada__titulo">${esc(p.titulo)}</span><span class="parada__grupo">${esc(p.grupo)}</span>` +
        `<span class="parada__resumo">${esc(p.resumo)}</span></span></button></li>`;
    }).join("");
    requestAnimationFrame(desenharRio);
  }

  /* ---------- O rio que liga as paradas ---------- */
  let compRio = 0;
  function desenharRio() {
    const perc = $("#percurso"), svg = $("#rioSvg"), b = perc.getBoundingClientRect();
    const pontos = [...perc.querySelectorAll(".parada__ponto")].map((el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]; });
    svg.setAttribute("viewBox", `0 0 ${b.width.toFixed(0)} ${b.height.toFixed(0)}`);
    svg.setAttribute("width", b.width.toFixed(0)); svg.setAttribute("height", b.height.toFixed(0));
    if (!pontos.length) { $("#rioLeito").setAttribute("d", ""); $("#rioAgua").setAttribute("d", ""); return; }
    const amp = innerWidth < 720 ? 14 : 80;
    const todos = [[pontos[0][0], 0], ...pontos, [pontos[pontos.length - 1][0], b.height]];
    let d = `M${todos[0][0].toFixed(1)} 0`;
    for (let i = 1; i < todos.length; i++) {
      const [x0, y0] = todos[i - 1], [x1, y1] = todos[i], dy = y1 - y0, s = i % 2 ? 1 : -1;
      d += ` C${(x0 + amp * s).toFixed(1)} ${(y0 + dy * 0.5).toFixed(1)} ${(x1 + amp * s).toFixed(1)} ${(y1 - dy * 0.5).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    $("#rioLeito").setAttribute("d", d);
    const agua = $("#rioAgua"); agua.setAttribute("d", d);
    compRio = agua.getTotalLength();
    agua.style.strokeDasharray = compRio;
    correrRio();
  }
  function correrRio() {
    const perc = $("#percurso"), agua = $("#rioAgua"); if (!compRio) return;
    const b = perc.getBoundingClientRect();
    const prog = reduz ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.75 - b.top) / b.height));
    agua.style.strokeDashoffset = (compRio * (1 - prog)).toFixed(1);
    const nivel = innerHeight * 0.75;
    perc.querySelectorAll(".parada").forEach((p) => p.classList.toggle("alcancada", reduz || $(".parada__ponto", p).getBoundingClientRect().top < nivel));
  }

  /* ---------- Portos (estados) ---------- */
  function montarPortos() {
    $("#portos").innerHTML = E.map((e) => {
      const n = P.filter((p) => p.estado === e.uf).length;
      return `<li class="revela"><button type="button" class="porto" data-uf="${e.uf}"><span class="porto__uf">${esc(e.uf)}</span>` +
        `<span class="porto__nome">${esc(e.nome)}</span><span class="porto__qtd">${n} ${n === 1 ? "projeto" : "projetos"}</span>` +
        (e.convidado ? '<span class="porto__conv">Convidado</span>' : "") + "</button></li>";
    }).join("");
    $("#portos").addEventListener("click", (ev) => { const b = ev.target.closest(".porto"); if (!b) return; filtro.estado = b.dataset.uf; escolher("", true); });
  }

  /* ---------- Detalhes ---------- */
  const modal = $("#modal");
  function abrir(id) {
    const p = P.find((x) => x.id === id); if (!p) return;
    const l = ling(p.linguagem), est = estado(p.estado), vid = idYoutube(p.video);
    const ficha = `<dl class="ficha"><div><dt>Origem</dt><dd>${esc(est.nome)}</dd></div>` +
      Object.entries(p.ficha || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") + "</dl>";
    const botoes = botoesLinks(p, "botao botao--cor", "botao botao--borda");
    $("#modalCorpo").innerHTML = (vid ? `<div class="modal__video">${videoEmbed(p)}</div>` : capa(p)) +
      `<div class="modal__info" style="--cor:${l.cor}"><p class="rotulo">${esc(l.nome)} · ${esc(est.nome)}</p>` +
      `<h2 id="modalTitulo">${esc(p.titulo)}</h2><p><strong>${esc(p.grupo)}</strong></p>` +
      `<p class="modal__sinopse">${esc(p.sinopse || p.resumo)}</p>${ficha}` +
      (botoes ? `<div class="modal__links">${botoes}</div>` : "") + "</div>";
    modal.showModal ? modal.showModal() : modal.setAttribute("open", "");
  }
  const fechar = () => (modal.close ? modal.close() : modal.removeAttribute("open"));
  modal.addEventListener("close", () => { $("#modalCorpo").innerHTML = ""; });
  modal.addEventListener("click", (e) => { if (e.target === modal) fechar(); });
  $("#fecharModal").addEventListener("click", fechar);
  $("#paradas").addEventListener("click", (e) => { const b = e.target.closest(".parada__card"); if (b) abrir(b.dataset.id); });

  /* ---------- Iniciar ---------- */
  $("#numLing").textContent = L.length;
  $("#avisoExemplo").hidden = !P.some((p) => p.exemplo);
  montarAgua(); montarChips(); montarParadas(); montarPortos(); revelar();
  addEventListener("scroll", correrRio, { passive: true });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(desenharRio, 120); });
  document.fonts && document.fonts.ready.then(desenharRio);
  addEventListener("load", desenharRio);
  const h = location.hash.slice(1);
  if (L.some((l) => l.slug === h)) escolher(h, true);
  else if (h && document.getElementById(h)) setTimeout(() => document.getElementById(h).scrollIntoView(), 60);
})();
