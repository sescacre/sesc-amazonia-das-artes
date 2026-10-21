/* Sesc Amazônia das Artes 2026 — comportamento da página.
   O conteúdo fica em js/data.js; este arquivo só monta e anima. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var LINGUAGENS = window.LINGUAGENS || [];
  var ESTADOS = window.ESTADOS || [];
  var PROJETOS = window.PROJETOS || [];
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Ícones (traço, 24x24) ---------- */
  var ICONES = {
    teatro: '<path d="M3 4h9v6.5a4.5 4.5 0 0 1-9 0z"/><path d="M6 8.2h.01M9 8.2h.01"/><path d="M5.6 11.6c.8.7 2.1.7 2.8 0"/><path d="M12 9h9v6.5a4.5 4.5 0 0 1-9 0"/><path d="M15 13h.01M18 13h.01"/><path d="M15 17.2c.8-.8 2.2-.8 3 0"/>',
    circo: '<path d="M12 2.5v3"/><path d="M12 2.5l3 1.2-3 1.2"/><path d="M3 20.5 12 5.5l9 15z"/><path d="M12 5.5v15"/><path d="M8.5 20.5 12 14l3.5 6.5"/><path d="M2 20.5h20"/>',
    danca: '<circle cx="13" cy="4" r="2"/><path d="M13 6.5 11 13l4 3 1 5.5"/><path d="M11 13l-3.5 7.5"/><path d="M6 8.5l5-1.5 5 3 3-2"/>',
    musica: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M9 9l11-2"/>',
    literatura: '<path d="M2.5 5.5C5 4 8.5 4 12 6c3.5-2 7-2 9.5-.5v14c-2.5-1.5-6-1.5-9.5.5-3.5-2-7-2-9.5-.5z"/><path d="M12 6v14"/>',
    audiovisual: '<rect x="2.5" y="6" width="13.5" height="12" rx="2"/><path d="m16 10.5 5.5-3v9l-5.5-3z"/><path d="M6 6V4.5M12 6V4.5"/>',
    "artes-visuais": '<path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.2-3.6 3.2h-2.2a1.8 1.8 0 0 0-1.3 3.1A1.6 1.6 0 0 1 12 21z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7" r="1.1"/><circle cx="15.5" cy="7.8" r="1.1"/>',
    oficina: '<path d="M14.5 6.5 17.5 3.5l3 3-3 3"/><path d="M17.5 9.5 8 19l-4 1 1-4 9.5-9.5"/>',
    estrela: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" stroke="none"/>',
    vimeo: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.3 6.7h.01"/>',
    spotify: '<circle cx="12" cy="12" r="9.5"/><path d="M7 9.5c3.5-1 7.5-.6 10.3.9M7.6 12.6c2.9-.8 6-.4 8.4.9M8.3 15.5c2.2-.5 4.4-.2 6.3.8"/>',
    drive: '<path d="M8.5 3.5h7l6 10.5-3.5 6h-12L2.5 14z"/><path d="M8.5 3.5 15 14.5H2.5M15.5 3.5 9 14.5l-3 5.5M21.5 14H9"/>',
    site: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.8 6 3.8 9.5s-1.2 6.7-3.8 9.5c-2.6-2.8-3.8-6-3.8-9.5S9.4 5.3 12 2.5z"/>'
  };
  function icone(nome, classe) {
    return '<svg class="' + (classe || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONES[nome] || ICONES.estrela) + "</svg>";
  }
  var ROTULO_LINK = { youtube: "Assistir no YouTube", vimeo: "Assistir no Vimeo", instagram: "Instagram", spotify: "Ouvir no Spotify", drive: "Ver material", site: "Site oficial" };

  /* ---------- utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function normal(t) { return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function lingPor(slug) { return LINGUAGENS.find(function (l) { return l.slug === slug; }) || { slug: slug, nome: slug, cor: "#466430", icone: "estrela" }; }
  function estadoPor(uf) { return ESTADOS.find(function (e) { return e.uf === uf; }) || { uf: uf, nome: uf }; }
  function idYoutube(url) {
    if (!url) return "";
    var m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function aleatorio(semente) { var a = semente; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* Capa gerada: linhas de rio sobre a cor da linguagem */
  function arteCapa(semente) {
    var r = aleatorio(hash(semente)), paths = "";
    for (var i = 0; i < 7; i++) {
      var y = 20 + i * 34 + r() * 14, d = "M-40 " + y.toFixed(1);
      for (var x = 0; x <= 480; x += 80) {
        var cy = y + (r() - .5) * 70, ny = y + (r() - .5) * 30;
        d += " Q " + (x + 40) + " " + cy.toFixed(1) + " " + (x + 80) + " " + ny.toFixed(1);
      }
      var op = (.10 + r() * .22).toFixed(2), w = (1 + r() * 2.5).toFixed(1);
      paths += '<path d="' + d + '" fill="none" stroke="#fff" stroke-opacity="' + op + '" stroke-width="' + w + '"/>';
    }
    var cx = 280 + r() * 100, cy2 = 40 + r() * 60;
    return '<svg class="capa__arte" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="g' + hash(semente) + '" cx="' + (cx / 400) + '" cy="' + (cy2 / 250) + '" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient></defs>' +
      '<rect width="400" height="250" fill="url(#g' + hash(semente) + ')"/>' + paths + "</svg>";
  }

  function capa(p, comChip) {
    var l = lingPor(p.linguagem), vid = idYoutube(p.video), img = p.imagem || (vid ? "https://img.youtube.com/vi/" + vid + "/hqdefault.jpg" : "");
    var html = '<div class="capa" style="--cor:' + l.cor + '">' + arteCapa(p.id || p.titulo);
    html += icone(l.icone, "capa__icone");
    if (img) html += '<img src="' + esc(img) + '" alt="" loading="lazy" onerror="this.remove()">';
    if (vid) html += '<span class="capa__play">' + icone("play") + "</span>";
    if (comChip) html += '<span class="capa__chip">' + icone(l.icone).replace('class=""', 'width="14" height="14"') + esc(l.nome) + "</span>";
    if (p.exemplo) html += '<span class="selo">Exemplo</span>';
    return html + "</div>";
  }

  /* ---------- estado dos filtros ---------- */
  var filtro = { linguagem: "", estado: "", busca: "" };

  /* ---------- Abas (menu de linguagens) ---------- */
  function montarAbas() {
    var html = '<a class="aba" href="#programacao" data-ling="" aria-current="true">' + icone("estrela") + "Todas</a>";
    LINGUAGENS.forEach(function (l) {
      html += '<a class="aba" href="#' + l.slug + '" data-ling="' + l.slug + '" style="--cor:' + l.cor + '">' + icone(l.icone) + esc(l.nome) + "</a>";
    });
    $("#abas").innerHTML = html;
    $("#abas").addEventListener("click", function (e) {
      var a = e.target.closest(".aba"); if (!a) return;
      e.preventDefault();
      escolherLinguagem(a.dataset.ling, true);
    });
  }

  function marcarAbas() {
    document.querySelectorAll(".aba").forEach(function (a) {
      var ativa = a.dataset.ling === filtro.linguagem;
      a.setAttribute("aria-current", ativa ? "true" : "false");
      if (ativa) a.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduzMovimento ? "auto" : "smooth" });
    });
  }

  /* ---------- Cards de linguagens ---------- */
  function montarLinguagens() {
    $("#numLinguagens").textContent = LINGUAGENS.length;
    $("#numLinguagens").dataset.conta = LINGUAGENS.length;
    $("#gradeLinguagens").innerHTML = LINGUAGENS.map(function (l) {
      var n = PROJETOS.filter(function (p) { return p.linguagem === l.slug; }).length;
      return '<a class="ling revela" href="#' + l.slug + '" data-ling="' + l.slug + '" style="--cor:' + l.cor + '">' +
        '<span class="ling__qtd">' + n + (n === 1 ? " projeto" : " projetos") + "</span>" +
        icone(l.icone, "ling__icone") +
        '<span class="ling__grupo">' + esc(l.grupo) + "</span>" +
        "<h3>" + esc(l.nome) + "</h3><p>" + esc(l.desc) + "</p></a>";
    }).join("");
    $("#gradeLinguagens").addEventListener("click", function (e) {
      var a = e.target.closest(".ling"); if (!a) return;
      e.preventDefault(); escolherLinguagem(a.dataset.ling, true);
    });
  }

  function escolherLinguagem(slug, rolar) {
    filtro.linguagem = slug || "";
    try { history.replaceState(null, "", slug ? "#" + slug : "#programacao"); } catch (err) { /* ignorado */ }
    marcarAbas(); montarProjetos(true);
    if (rolar) $("#programacao").scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth" });
  }

  /* ---------- Programação ---------- */
  function montarFiltroEstado() {
    var sel = $("#filtroEstado");
    ESTADOS.forEach(function (e) {
      var o = document.createElement("option"); o.value = e.uf; o.textContent = e.nome; sel.appendChild(o);
    });
    sel.addEventListener("change", function () { filtro.estado = sel.value; montarProjetos(true); });
    var t; $("#busca").addEventListener("input", function (e) {
      clearTimeout(t); t = setTimeout(function () { filtro.busca = normal(e.target.value); montarProjetos(true); }, 160);
    });
    $("#limpar").addEventListener("click", function () {
      filtro.estado = ""; filtro.busca = ""; sel.value = ""; $("#busca").value = ""; escolherLinguagem("", false);
    });
  }

  function montarProjetos(animar) {
    var l = filtro.linguagem ? lingPor(filtro.linguagem) : null;
    $("#tituloProgramacao").textContent = l ? l.nome : "Todos os projetos";
    $("#descProgramacao").textContent = l ? l.desc : "Trabalhos selecionados pela curadoria para circular pela Amazônia Legal.";

    var lista = PROJETOS.filter(function (p) {
      if (filtro.linguagem && p.linguagem !== filtro.linguagem) return false;
      if (filtro.estado && p.estado !== filtro.estado) return false;
      if (filtro.busca && normal(p.titulo + " " + p.grupo + " " + (p.resumo || "")).indexOf(filtro.busca) < 0) return false;
      return true;
    });

    $("#avisoExemplo").hidden = !PROJETOS.some(function (p) { return p.exemplo; });
    $("#vazio").hidden = lista.length > 0;
    $("#projetos").innerHTML = lista.map(function (p, i) {
      var lg = lingPor(p.linguagem), est = estadoPor(p.estado);
      return '<button type="button" class="card' + (animar && !reduzMovimento ? " surge" : "") + '" data-id="' + esc(p.id) + '" style="--cor:' + lg.cor + ";animation-delay:" + Math.min(i, 8) * 55 + 'ms">' +
        capa(p, true) +
        '<span class="card__corpo">' +
        '<span class="card__meta"><b>' + esc(est.nome) + "</b><span>" + esc(p.grupo) + "</span></span>" +
        "<h3>" + esc(p.titulo) + "</h3>" +
        '<span class="card__resumo">' + esc(p.resumo) + "</span>" +
        '<span class="card__mais">Ver detalhes ' + icone("seta") + "</span>" +
        "</span></button>";
    }).join("");
  }

  /* ---------- Modal ---------- */
  var modal = $("#modal");
  function abrirProjeto(id) {
    var p = PROJETOS.find(function (x) { return x.id === id; }); if (!p) return;
    var l = lingPor(p.linguagem), est = estadoPor(p.estado), vid = idYoutube(p.video);
    var topo = vid
      ? '<div class="modal__video"><iframe src="https://www.youtube-nocookie.com/embed/' + vid + '?rel=0" title="' + esc(p.titulo) + '" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>'
      : capa(p, true);
    var ficha = p.ficha ? '<dl class="ficha"><div><dt>Origem</dt><dd>' + esc(est.nome) + "</dd></div>" +
      Object.keys(p.ficha).map(function (k) { return "<div><dt>" + esc(k) + "</dt><dd>" + esc(p.ficha[k]) + "</dd></div>"; }).join("") + "</dl>" : "";
    var links = (p.links || []).slice();
    if (p.video && !links.some(function (k) { return k.url === p.video; })) links.unshift({ tipo: "youtube", url: p.video });
    var botoes = links.map(function (k, i) {
      return '<a class="botao ' + (i === 0 ? "botao--cor" : "botao--borda") + '" style="--cor:' + l.cor + '" href="' + esc(k.url) + '" target="_blank" rel="noopener">' +
        icone(k.tipo) + esc(k.rotulo || ROTULO_LINK[k.tipo] || "Abrir link") + "</a>";
    }).join("");
    $("#modalCorpo").innerHTML = topo +
      '<div class="modal__info">' +
      '<p class="rotulo" style="color:' + l.cor + '">' + esc(l.nome) + " · " + esc(est.uf) + "</p>" +
      '<h2 id="modalTitulo">' + esc(p.titulo) + "</h2>" +
      '<p class="card__meta"><b>' + esc(p.grupo) + "</b></p>" +
      '<p class="modal__sinopse">' + esc(p.sinopse || p.resumo) + "</p>" + ficha +
      (botoes ? '<div class="modal__links">' + botoes + "</div>" : "") +
      "</div>";
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  function fecharModal() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  modal.addEventListener("close", function () { $("#modalCorpo").innerHTML = ""; });
  modal.addEventListener("click", function (e) { if (e.target === modal) fecharModal(); });
  $("#fecharModal").addEventListener("click", fecharModal);
  $("#projetos").addEventListener("click", function (e) { var c = e.target.closest(".card"); if (c) abrirProjeto(c.dataset.id); });

  /* ---------- Circuito (estados) ---------- */
  function montarEstados() {
    $("#estados").innerHTML = ESTADOS.map(function (e) {
      var n = PROJETOS.filter(function (p) { return p.estado === e.uf; }).length;
      return '<li class="estado revela">' +
        (e.convidado ? '<span class="estado__conv">Convidado</span>' : "") +
        '<span class="estado__uf">' + esc(e.uf) + "</span>" +
        '<span class="estado__nome">' + esc(e.nome) + "</span>" +
        '<span class="estado__qtd">' + n + (n === 1 ? " projeto selecionado" : " projetos selecionados") + "</span>" +
        '<button type="button" data-uf="' + e.uf + '" aria-label="Ver projetos de ' + esc(e.nome) + '"></button></li>';
    }).join("");
    $("#estados").addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-uf]"); if (!b) return;
      filtro.estado = b.dataset.uf; $("#filtroEstado").value = b.dataset.uf; escolherLinguagem("", true);
    });
    // faixa animada do hero
    var nomes = ESTADOS.map(function (e) { return "<span>" + esc(e.nome) + "</span>"; }).join("");
    $("#faixa").innerHTML = nomes + nomes;
  }

  /* ---------- Rodapé ---------- */
  function montarRodape() {
    $("#rodapeLinks").innerHTML = LINGUAGENS.map(function (l) {
      return '<li><a href="#' + l.slug + '" data-ling="' + l.slug + '">' + esc(l.nome) + "</a></li>";
    }).join("");
    $("#rodapeLinks").addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return; e.preventDefault(); escolherLinguagem(a.dataset.ling, true);
    });
  }

  /* ---------- Topo: sombra ao rolar, menu mobile, link ativo ---------- */
  function montarTopo() {
    var topo = $("#topo"), botao = $("#abrirMenu"), menu = $("#menu");
    var mq = window.matchMedia("(max-width: 760px)");
    function ajusta() { if (mq.matches) { menu.hidden = botao.getAttribute("aria-expanded") !== "true"; } else { menu.hidden = false; } }
    ajusta(); mq.addEventListener ? mq.addEventListener("change", ajusta) : mq.addListener(ajusta);
    botao.addEventListener("click", function () {
      var aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto)); botao.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu"); ajusta();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && mq.matches) { botao.setAttribute("aria-expanded", "false"); ajusta(); }
    });
    window.addEventListener("scroll", function () { topo.classList.toggle("rolou", window.scrollY > 40); }, { passive: true });

    if ("IntersectionObserver" in window) {
      var links = menu.querySelectorAll("a");
      var obs = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("ativo", a.getAttribute("href") === "#" + en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["sobre", "linguagens", "programacao", "circuito"].forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
    }
  }

  /* ---------- Revelar ao rolar + contadores + rio do circuito ---------- */
  function montarRevelar() {
    if (reduzMovimento || !("IntersectionObserver" in window)) return;
    var vistos = new WeakSet();
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en, i) {
        if (!en.isIntersecting || vistos.has(en.target)) return;
        vistos.add(en.target);
        var r = en.target.getBoundingClientRect();
        if (r.top < window.innerHeight * .2) return; // já estava na tela: não pisca
        en.target.style.animationDelay = (i % 6) * 70 + "ms";
        en.target.classList.add("entrou");
        en.target.querySelectorAll("[data-conta]").forEach(contar);
      });
    }, { threshold: .12 });
    document.querySelectorAll(".revela").forEach(function (el) { obs.observe(el); });

    var rio = document.getElementById("rioCircuito");
    if (rio && rio.getTotalLength) {
      var len = rio.getTotalLength();
      var obsRio = new IntersectionObserver(function (ents) {
        if (!ents[0].isIntersecting) return;
        obsRio.disconnect();
        rio.style.strokeDasharray = len; rio.style.strokeDashoffset = len;
        rio.getBoundingClientRect();
        rio.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)";
        rio.style.strokeDashoffset = 0;
      }, { threshold: .5 });
      obsRio.observe(rio);
    }
  }
  function contar(el) {
    var fim = parseInt(el.dataset.conta, 10); if (isNaN(fim)) return;
    var ini = fim > 1000 ? fim - 18 : 0, t0 = null;
    function passo(t) {
      if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1300), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(ini + (fim - ini) * e); if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  /* ---------- Hero: rios em movimento e vaga-lumes ---------- */
  function montarRios() {
    var cv = document.getElementById("rios"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, ativo = true, t = 0;
    var cores = ["70,100,48", "155,73,29", "120,160,96", "228,165,122", "243,241,232"];
    var rios = [], luzes = [];
    var r = aleatorio(2026);
    for (var i = 0; i < 16; i++) {
      rios.push({ y: r(), amp: 18 + r() * 60, f1: .6 + r() * 1.6, f2: 2 + r() * 3, vel: .05 + r() * .12, fase: r() * 10,
        cor: cores[i % cores.length], alfa: i % 5 === 4 ? .08 : .14 + r() * .22, larg: .8 + r() * 2.2 });
    }
    for (var j = 0; j < 46; j++) luzes.push({ x: r(), y: r(), v: .02 + r() * .05, ph: r() * 6.28, s: .8 + r() * 1.8 });

    function medir() {
      var b = cv.getBoundingClientRect(); W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function desenhar() {
      ctx.clearRect(0, 0, W, H);
      rios.forEach(function (rio) {
        ctx.beginPath();
        var base = H * (.08 + rio.y * .84), passo = Math.max(8, W / 90);
        for (var x = -20; x <= W + 20; x += passo) {
          var u = x / W;
          var y = base + Math.sin(u * rio.f1 * 6.28 + t * rio.vel + rio.fase) * rio.amp + Math.sin(u * rio.f2 * 6.28 - t * rio.vel * 1.7) * rio.amp * .25;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(" + rio.cor + "," + rio.alfa + ")"; ctx.lineWidth = rio.larg; ctx.stroke();
      });
      luzes.forEach(function (l) {
        var y = ((l.y - t * l.v * .02) % 1 + 1) % 1, x = l.x + Math.sin(t * .3 + l.ph) * .01;
        var a = .25 + .55 * Math.pow(Math.sin(t * .9 + l.ph) * .5 + .5, 3);
        ctx.beginPath(); ctx.arc(x * W, y * H, l.s, 0, 6.28);
        ctx.fillStyle = "rgba(240,200,140," + a.toFixed(3) + ")"; ctx.fill();
      });
    }
    function loop() { if (!ativo) return; t += 1 / 60; desenhar(); requestAnimationFrame(loop); }

    medir(); desenhar();
    window.addEventListener("resize", function () { medir(); desenhar(); });
    if (reduzMovimento) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        var vis = e[0].isIntersecting; if (vis && !ativo) { ativo = true; requestAnimationFrame(loop); } else if (!vis) ativo = false;
      }).observe(cv);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- link direto: site.com/#teatro ---------- */
  function lerHash() {
    var h = (location.hash || "").slice(1);
    if (LINGUAGENS.some(function (l) { return l.slug === h; })) {
      escolherLinguagem(h, false);
      setTimeout(function () { $("#programacao").scrollIntoView(); }, 60);
    }
  }

  /* ---------- iniciar ---------- */
  montarAbas(); montarLinguagens(); montarFiltroEstado(); montarProjetos(false);
  montarEstados(); montarRodape(); montarTopo(); montarRevelar(); montarRios(); lerHash();
  window.addEventListener("hashchange", lerHash);
})();
