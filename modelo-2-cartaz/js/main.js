/* Modelo "Cartaz" — monta a página a partir de js/data.js */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const { L, E, P, icone, esc, ling, estado, idYoutube, imagemDe, hash, aleatorio, reduz, botoesLinks, videoEmbed, revelar } = window.BASE;
  const $ = (s, c) => (c || document).querySelector(s);
  const FORMAS = ["c", "m", "q", "f", "r"];
  const qtd = (slug) => P.filter((p) => p.linguagem === slug).length;

  /* ---------- Menu do topo ---------- */
  function montarMenu() {
    $("#menu").innerHTML =
      L.map((l) => `<a href="#${l.slug}" style="--cor:${l.cor}">${esc(l.nome)}</a>`).join("") +
      `<span class="sep" aria-hidden="true"></span><a href="#sobre">O projeto</a><a href="#circuito">Circuito</a>`;
    const topo = $("#topo"), botao = $("#abrirMenu"), menu = $("#menu");
    const mq = matchMedia("(max-width: 1100px)");
    const ajusta = () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      menu.hidden = mq.matches && !aberto;
      document.body.style.overflow = mq.matches && aberto ? "hidden" : "";
      $(".topo__abrir-txt").textContent = aberto ? "Fechar" : "Menu";
    };
    const fechar = () => { botao.setAttribute("aria-expanded", "false"); ajusta(); };
    ajusta(); mq.addEventListener("change", fechar);
    botao.addEventListener("click", () => { botao.setAttribute("aria-expanded", String(botao.getAttribute("aria-expanded") !== "true")); ajusta(); });
    menu.addEventListener("click", (e) => { if (e.target.closest("a") && mq.matches) fechar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && botao.getAttribute("aria-expanded") === "true") fechar(); });

    // logo do topo aparece quando a logo grande sai da tela
    const heroLogo = $(".hero__logo");
    const att = () => {
      topo.classList.toggle("rolou", scrollY > 10);
      topo.classList.toggle("mostra", heroLogo.getBoundingClientRect().bottom < 70);
    };
    addEventListener("scroll", att, { passive: true }); att();

    // link ativo
    const links = [...menu.querySelectorAll("a")];
    const obs = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".capitulo, #sobre, #circuito").forEach((s) => obs.observe(s));
  }

  /* ---------- Mosaico do hero ---------- */
  function montarMosaico() {
    const r = aleatorio(2026);
    const tiles = L.slice(0, 8).map((l) => ({ cor: l.cor, nome: l.nome, slug: l.slug }));
    tiles.splice(Math.min(4, tiles.length), 0, { cor: "#153525", cor2: "#E4A57A" });
    while (tiles.length < 9) tiles.push({ cor: "#E4A57A", cor2: "#9B491D" });
    $("#mosaico").innerHTML = tiles.slice(0, 9).map((t, i) => {
      const f = FORMAS[Math.floor(r() * FORMAS.length)], rot = Math.floor(r() * 4) * 90;
      const cor2 = t.cor2 || (i % 2 ? "#F3F1E8" : "#153525");
      const tag = t.slug ? "a" : "div";
      return `<${tag} class="tile" ${t.slug ? `href="#${t.slug}"` : 'aria-hidden="true"'} style="--cor:${t.cor};--cor2:${cor2};animation-delay:${200 + i * 70}ms">` +
        `<span class="forma" data-f="${f}" data-rot="${rot}" style="transform:rotate(${rot}deg)"></span>` +
        (t.nome ? `<span class="tile__nome">${esc(t.nome)}</span>` : "") + `</${tag}>`;
    }).join("");

    if (reduz) return;
    let visivel = true;
    new IntersectionObserver((e) => { visivel = e[0].isIntersecting; }).observe($("#mosaico"));
    const formas = [...document.querySelectorAll(".forma")];
    let ultima = -1;
    setInterval(() => {
      if (!visivel || document.hidden) return;
      let i; do { i = Math.floor(Math.random() * formas.length); } while (i === ultima);
      ultima = i;
      const s = formas[i], atual = s.dataset.f;
      let nova; do { nova = FORMAS[Math.floor(Math.random() * FORMAS.length)]; } while (nova === atual);
      const rot = Number(s.dataset.rot) + (Math.random() < .5 ? 90 : -90);
      s.dataset.f = nova; s.dataset.rot = rot; s.style.transform = `rotate(${rot}deg)`;
    }, 1100);
  }

  /* ---------- Faixa ---------- */
  function montarFaixa() {
    const itens = L.map((l) => `<span>${esc(l.nome)}</span>`).join("");
    $("#faixa").innerHTML = itens + itens;
  }

  /* ---------- Cartaz ---------- */
  function formas(seed) {
    const r = aleatorio(hash(seed));
    let h = '<span class="cartaz__formas" aria-hidden="true">';
    for (let i = 0; i < 3; i++) {
      const s = 50 + r() * 50;
      h += `<span class="f" data-f="${FORMAS[Math.floor(r() * FORMAS.length)]}" style="width:${s.toFixed(0)}%;left:${(r() * 100 - s / 2).toFixed(0)}%;top:${(r() * 60 - 12).toFixed(0)}%;transform:rotate(${Math.floor(r() * 4) * 90}deg);--cor2:${i % 2 ? "rgba(255,255,255,.17)" : "rgba(0,0,0,.15)"}"></span>`;
    }
    return h + "</span>";
  }
  function cartaz(p, comoDiv) {
    const l = ling(p.linguagem), est = estado(p.estado), img = imagemDe(p), vid = idYoutube(p.video);
    const tag = comoDiv ? "div" : "button";
    return `<${tag} ${comoDiv ? "" : 'type="button" '}class="cartaz" data-id="${esc(p.id)}" style="--cor:${l.cor}" ${comoDiv ? "" : `aria-label="${esc(p.titulo)}, ${esc(p.grupo)}, ${esc(est.nome)}"`}>` +
      formas(p.id || p.titulo) +
      (img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : "") +
      `<span class="cartaz__topo"><span class="cartaz__uf">${esc(est.uf)}</span>${vid ? `<span class="cartaz__play">${icone("play")}</span>` : ""}${p.exemplo ? '<span class="selo">Exemplo</span>' : ""}</span>` +
      `<span class="cartaz__base"><span class="cartaz__grupo">${esc(p.grupo)}</span><span class="cartaz__titulo">${esc(p.titulo)}</span>${comoDiv ? "" : `<span class="cartaz__resumo">${esc(p.resumo)}</span>`}</span>` +
      `</${tag}>`;
  }

  /* ---------- Capítulos (um por linguagem) ---------- */
  function montarCapitulos() {
    $("#atalhos").innerHTML = L.map((l) => `<a href="#${l.slug}" style="--cor:${l.cor}">${icone(l.icone)}${esc(l.nome)}<small>${qtd(l.slug)}</small></a>`).join("");
    $("#avisoExemplo").hidden = !P.some((p) => p.exemplo);
    $("#numLinguagens").textContent = L.length;
    $("#numProjetos").textContent = P.length;

    $("#capitulos").innerHTML = L.map((l) => {
      const lista = P.filter((p) => p.linguagem === l.slug);
      const cards = lista.length ? lista.map((p) => cartaz(p)).join("") : '<div class="cartaz cartaz--vazio">Programação em breve</div>';
      return `<section class="capitulo" id="${l.slug}" style="--cor:${l.cor}" aria-labelledby="cap-${l.slug}">` +
        `<div class="wrap capitulo__cabeca revela">` +
        `<div class="capitulo__nome">${icone(l.icone, "capitulo__icone")}<h3 id="cap-${l.slug}">${esc(l.nome)}</h3><sup>${lista.length}</sup></div>` +
        `<p>${esc(l.desc)}</p>` +
        `<div class="setas"><button type="button" class="seta" data-dir="-1" aria-label="Voltar em ${esc(l.nome)}">${icone("seta")}</button><button type="button" class="seta" data-dir="1" aria-label="Avançar em ${esc(l.nome)}">${icone("seta")}</button></div>` +
        `</div><div class="trilho" tabindex="0" aria-label="Projetos de ${esc(l.nome)}">${cards}</div></section>`;
    }).join("");

    document.querySelectorAll(".capitulo").forEach((cap) => {
      const trilho = $(".trilho", cap), setas = cap.querySelectorAll(".seta");
      const atualiza = () => {
        const max = trilho.scrollWidth - trilho.clientWidth - 2;
        setas[0].disabled = trilho.scrollLeft <= 2;
        setas[1].disabled = trilho.scrollLeft >= max;
        $(".setas", cap).hidden = max <= 0;
      };
      setas.forEach((b) => b.addEventListener("click", () => trilho.scrollBy({ left: Number(b.dataset.dir) * trilho.clientWidth * .8, behavior: reduz ? "auto" : "smooth" })));
      trilho.addEventListener("scroll", atualiza, { passive: true });
      addEventListener("resize", atualiza); atualiza();
    });

    $("#capitulos").addEventListener("click", (e) => { const c = e.target.closest("button.cartaz"); if (c) abrir(c.dataset.id); });
  }

  /* ---------- Circuito ---------- */
  function montarEstados() {
    const cores = ["#9B491D", "#466430", "#2E5B5E", "#A8741C", "#153525"];
    $("#estados").innerHTML = E.map((e, i) => {
      const n = P.filter((p) => p.estado === e.uf).length;
      return `<li class="estado revela" style="--cor:${cores[i % cores.length]}"><span class="estado__uf">${esc(e.uf)}</span>` +
        `<span><span class="estado__nome">${esc(e.nome)}${e.convidado ? '<span class="estado__conv">Convidado</span>' : ""}</span>` +
        `<span class="estado__qtd">${n} ${n === 1 ? "projeto selecionado" : "projetos selecionados"}</span></span></li>`;
    }).join("");
    $("#rodapeLinks").innerHTML = L.map((l) => `<li><a href="#${l.slug}">${esc(l.nome)}</a></li>`).join("");
  }

  /* ---------- Janela de detalhes ---------- */
  const modal = $("#modal");
  function abrir(id) {
    const p = P.find((x) => x.id === id); if (!p) return;
    const l = ling(p.linguagem), est = estado(p.estado), vid = idYoutube(p.video);
    const topo = vid ? `<div class="modal__video">${videoEmbed(p)}</div>` : cartaz(p, true);
    const ficha = `<dl class="ficha"><div><dt>Origem</dt><dd>${esc(est.nome)}</dd></div>` +
      Object.entries(p.ficha || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") + "</dl>";
    const botoes = botoesLinks(p, "botao botao--cor", "botao botao--borda");
    $("#modalCorpo").innerHTML = `<div class="modal__grade" style="--cor:${l.cor}">${topo}<div class="modal__info">` +
      `<p class="rotulo">${esc(l.nome)} · ${esc(est.uf)}</p><h2 id="modalTitulo">${esc(p.titulo)}</h2>` +
      `<p class="modal__grupo">${esc(p.grupo)}</p><p class="modal__sinopse">${esc(p.sinopse || p.resumo)}</p>${ficha}` +
      (botoes ? `<div class="modal__links">${botoes}</div>` : "") + "</div></div>";
    modal.showModal ? modal.showModal() : modal.setAttribute("open", "");
  }
  const fechar = () => (modal.close ? modal.close() : modal.removeAttribute("open"));
  modal.addEventListener("close", () => { $("#modalCorpo").innerHTML = ""; });
  modal.addEventListener("click", (e) => { if (e.target === modal) fechar(); });
  $("#fecharModal").addEventListener("click", fechar);

  /* ---------- Iniciar ---------- */
  montarMosaico(); montarFaixa(); montarCapitulos(); montarEstados(); montarMenu(); revelar();
  const h = location.hash.slice(1);
  if (h && document.getElementById(h)) setTimeout(() => document.getElementById(h).scrollIntoView(), 50);
})();
