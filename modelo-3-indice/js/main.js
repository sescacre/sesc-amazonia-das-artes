/* Modelo "Índice" — monta a página a partir de js/data.js */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const { L, E, P, icone, esc, normal, ling, estado, idYoutube, imagemDe, hash, aleatorio, reduz, botoesLinks, videoEmbed, revelar } = window.BASE;
  const $ = (s, c) => (c || document).querySelector(s);
  const filtro = { linguagem: "", estado: "", busca: "" };
  const num = (i) => String(i + 1).padStart(2, "0");
  // número fixo de cada projeto no índice (ordem do data.js)
  const ordem = new Map(P.map((p, i) => [p.id, num(i)]));

  /* ---------- Capa gerada (cor + listras + título fantasma) ---------- */
  function capa(p) {
    const l = ling(p.linguagem), img = imagemDe(p), r = aleatorio(hash(p.id || p.titulo));
    return `<div class="capa" style="--cor:${l.cor};--ang:${Math.floor(r() * 4) * 45}deg"><span class="capa__listras"></span>` +
      `<span class="capa__t">${esc(p.titulo)}</span>${icone(l.icone, "capa__ic")}` +
      (img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : "") + "</div>";
  }

  /* ---------- Trilho lateral ---------- */
  function montarLateral() {
    $("#navLinguagens").innerHTML = L.map((l) =>
      `<li><a href="#${l.slug}" data-ling="${l.slug}" style="--cor:${l.cor}">${esc(l.nome)}<small>${String(P.filter((p) => p.linguagem === l.slug).length).padStart(2, "0")}</small></a></li>`).join("");
    $("#navLinguagens").addEventListener("click", (e) => {
      const a = e.target.closest("a[data-ling]"); if (!a) return;
      e.preventDefault(); escolher(a.dataset.ling, true); fecharMenu();
    });
    const botao = $("#abrirMenu"), nav = $("#lateralNav"), mq = matchMedia("(max-width: 960px)");
    const ajusta = () => { const ab = botao.getAttribute("aria-expanded") === "true"; nav.hidden = mq.matches && !ab; botao.textContent = ab ? "Fechar" : "Menu"; };
    window.fecharMenu = () => { botao.setAttribute("aria-expanded", "false"); ajusta(); };
    botao.addEventListener("click", () => { botao.setAttribute("aria-expanded", String(botao.getAttribute("aria-expanded") !== "true")); ajusta(); });
    nav.addEventListener("click", (e) => { if (e.target.closest("a") && mq.matches) fecharMenu(); });
    mq.addEventListener("change", fecharMenu); ajusta();
  }
  const fecharMenu = () => window.fecharMenu && window.fecharMenu();

  /* ---------- Abertura ---------- */
  function montarAbertura() {
    $("#dLing").textContent = L.length; $("#dEst").textContent = E.length; $("#dProj").textContent = P.length;
    // espectro: barras nas cores das linguagens que sobem e descem como nível de rio
    const r = aleatorio(68), barras = window.innerWidth < 700 ? 36 : 72;
    let h = "";
    for (let i = 0; i < barras; i++) {
      const l = L[i % L.length] || { cor: "#466430" };
      const onda = .35 + .3 * Math.sin(i / barras * Math.PI * 2.2) + r() * .3;
      h += `<i style="--cor:${l.cor};--a:${Math.min(1, onda).toFixed(2)};--b:${(.08 + r() * .35).toFixed(2)};--d:${(1.6 + r() * 2.4).toFixed(2)}s;--atraso:-${(r() * 3).toFixed(2)}s"></i>`;
    }
    $("#espectro").innerHTML = h;
  }

  /* ---------- Abas e filtros ---------- */
  function montarFiltros() {
    $("#abas").innerHTML = `<button type="button" class="aba" data-ling="" aria-pressed="true">Todas<sup>${P.length}</sup></button>` +
      L.map((l) => `<button type="button" class="aba" data-ling="${l.slug}" style="--cor:${l.cor}" aria-pressed="false">${esc(l.nome)}<sup>${P.filter((p) => p.linguagem === l.slug).length}</sup></button>`).join("");
    $("#abas").addEventListener("click", (e) => { const b = e.target.closest(".aba"); if (b) escolher(b.dataset.ling, false); });

    const sel = $("#filtroEstado");
    E.forEach((e) => sel.insertAdjacentHTML("beforeend", `<option value="${e.uf}">${esc(e.nome)}</option>`));
    sel.addEventListener("change", () => { filtro.estado = sel.value; montarIndice(true); });
    let t; $("#busca").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { filtro.busca = normal(e.target.value); montarIndice(true); }, 160); });
    $("#limpar").addEventListener("click", () => { filtro.estado = ""; filtro.busca = ""; sel.value = ""; $("#busca").value = ""; escolher("", false); });
    $("#avisoExemplo").hidden = !P.some((p) => p.exemplo);
  }

  function escolher(slug, rolar) {
    filtro.linguagem = slug || "";
    try { history.replaceState(null, "", slug ? "#" + slug : "#programacao"); } catch (_) { /* ignorado */ }
    document.querySelectorAll(".aba").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ling === filtro.linguagem)));
    document.querySelectorAll("#navLinguagens a").forEach((a) => a.classList.toggle("ativo", a.dataset.ling === filtro.linguagem));
    montarIndice(true);
    if (rolar) $("#programacao").scrollIntoView({ behavior: reduz ? "auto" : "smooth" });
  }

  /* ---------- Índice ---------- */
  function montarIndice(animar) {
    const lista = P.filter((p) =>
      (!filtro.linguagem || p.linguagem === filtro.linguagem) &&
      (!filtro.estado || p.estado === filtro.estado) &&
      (!filtro.busca || normal(`${p.titulo} ${p.grupo} ${p.resumo || ""}`).includes(filtro.busca)));
    $("#vazio").hidden = lista.length > 0;
    $("#contagem").textContent = `${lista.length} de ${P.length} ${P.length === 1 ? "projeto" : "projetos"}`;
    $("#indice").innerHTML = lista.map((p, i) => {
      const l = ling(p.linguagem), est = estado(p.estado);
      return `<button type="button" class="linha${animar && !reduz ? " surge" : ""}" data-id="${esc(p.id)}" style="--cor:${l.cor};animation-delay:${Math.min(i, 10) * 40}ms">` +
        `<span class="linha__n">${ordem.get(p.id)}</span>` +
        `<span class="linha__titulo">${esc(p.titulo)}${p.exemplo ? "<em>Exemplo</em>" : ""}</span>` +
        `<span class="linha__grupo">${esc(p.grupo)}</span>` +
        `<span class="linha__ling"><i></i>${esc(l.nome)}</span>` +
        `<span class="linha__uf" title="${esc(est.nome)}">${esc(est.uf)}</span>` +
        `<span class="linha__seta">${icone("seta")}</span></button>`;
    }).join("");
  }

  /* ---------- Prévia que segue o cursor ---------- */
  function montarEspiao() {
    const esp = $("#espiao");
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let alvoX = 0, alvoY = 0, x = 0, y = 0, atual = "", rodando = false;
    const passo = () => {
      x += (alvoX - x) * .18; y += (alvoY - y) * .18;
      esp.style.setProperty("--x", x.toFixed(1) + "px"); esp.style.setProperty("--y", y.toFixed(1) + "px");
      esp.style.setProperty("--r", ((alvoX - x) * .03).toFixed(2) + "deg");
      if (esp.classList.contains("visivel")) requestAnimationFrame(passo); else rodando = false;
    };
    $("#indice").addEventListener("mousemove", (e) => {
      const linha = e.target.closest(".linha"); if (!linha) return;
      if (linha.dataset.id !== atual) {
        atual = linha.dataset.id;
        const p = P.find((q) => q.id === atual); if (p) esp.innerHTML = capa(p);
      }
      alvoX = Math.min(e.clientX + 28, innerWidth - 280); alvoY = Math.max(16, Math.min(e.clientY - 160, innerHeight - 340));
      if (!esp.classList.contains("visivel")) { x = alvoX; y = alvoY; esp.classList.add("visivel"); }
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    });
    $("#indice").addEventListener("mouseleave", () => { esp.classList.remove("visivel"); atual = ""; });
  }

  /* ---------- Gaveta de detalhes ---------- */
  const gaveta = $("#gaveta");
  function abrir(id) {
    const p = P.find((x) => x.id === id); if (!p) return;
    const l = ling(p.linguagem), est = estado(p.estado), vid = idYoutube(p.video);
    const topo = vid ? `<div class="gaveta__video">${videoEmbed(p)}</div>` : capa(p);
    const ficha = `<dl class="ficha mono-ficha"><div><dt class="mono">Origem</dt><dd>${esc(est.nome)}</dd></div>` +
      Object.entries(p.ficha || {}).map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") + "</dl>";
    const botoes = botoesLinks(p, "btn btn--cheio", "btn");
    $("#gavetaCorpo").innerHTML = topo + `<div class="gaveta__info" style="--cor:${l.cor}">` +
      `<p class="mono gaveta__meta"><b>Nº ${ordem.get(p.id)}</b><span>${esc(l.nome)}</span><span>${esc(est.uf)}</span>${p.exemplo ? "<span>Exemplo</span>" : ""}</p>` +
      `<h2 id="gavetaTitulo">${esc(p.titulo)}</h2><p><strong>${esc(p.grupo)}</strong></p>` +
      `<p class="gaveta__sinopse">${esc(p.sinopse || p.resumo)}</p>${ficha}` +
      (botoes ? `<div class="gaveta__links">${botoes}</div>` : "") + "</div>";
    $("#espiao").classList.remove("visivel");
    gaveta.showModal ? gaveta.showModal() : gaveta.setAttribute("open", "");
  }
  const fechar = () => (gaveta.close ? gaveta.close() : gaveta.removeAttribute("open"));
  gaveta.addEventListener("close", () => { $("#gavetaCorpo").innerHTML = ""; });
  gaveta.addEventListener("click", (e) => { if (e.target === gaveta) fechar(); });
  $("#fecharGaveta").addEventListener("click", fechar);
  $("#indice").addEventListener("click", (e) => { const b = e.target.closest(".linha"); if (b) abrir(b.dataset.id); });

  /* ---------- Circuito ---------- */
  function montarEstados() {
    $("#estados").innerHTML = E.map((e) => {
      const n = P.filter((p) => p.estado === e.uf).length;
      return `<li><button type="button" data-uf="${e.uf}">${esc(e.nome)}</button><sup>${n}</sup>${e.convidado ? "<small>convidado</small>" : ""}</li>`;
    }).join("");
    $("#estados").addEventListener("click", (ev) => {
      const b = ev.target.closest("button[data-uf]"); if (!b) return;
      filtro.estado = b.dataset.uf; $("#filtroEstado").value = b.dataset.uf; escolher("", true);
    });
  }

  /* ---------- Progresso de leitura ---------- */
  function montarProgresso() {
    const barra = $("#progresso");
    const att = () => { const max = document.documentElement.scrollHeight - innerHeight; barra.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0); };
    addEventListener("scroll", att, { passive: true }); addEventListener("resize", att); att();
  }

  /* ---------- Link direto: site.com/#teatro ---------- */
  function lerHash() {
    const h = location.hash.slice(1);
    if (L.some((l) => l.slug === h)) { escolher(h, false); setTimeout(() => $("#programacao").scrollIntoView(), 60); }
  }

  montarLateral(); montarAbertura(); montarFiltros(); montarIndice(false); montarEstados();
  montarEspiao(); montarProgresso(); revelar(); lerHash();
  addEventListener("hashchange", lerHash);
})();
