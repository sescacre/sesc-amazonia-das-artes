/* Modelo "Palco" — monta a página a partir de js/data.js */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const { L, E, P, icone, esc, ling, estado, idYoutube, imagemDe, reduz, botoesLinks, videoEmbed, revelar } = window.BASE;
  const $ = (s, c) => (c || document).querySelector(s);
  const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
  const ordem = new Map(P.map((p, i) => [p.id, String(i + 1).padStart(3, "0")]));

  /* ---------- Cortina: abre sozinha e some; clique pula ---------- */
  const cortina = $("#cortina");
  const tirar = () => cortina.classList.add("fim");
  if (reduz) tirar();
  else { cortina.lastElementChild.addEventListener("animationend", tirar); setTimeout(tirar, 2400); }

  /* ---------- Refletor ---------- */
  function montarLuz() {
    const luz = $("#luz"), palco = $("#palco");
    if (reduz) return;
    let alvo = null, x = 50, y = 45, t = 0, visivel = true;
    palco.addEventListener("pointermove", (e) => { const r = palco.getBoundingClientRect(); alvo = [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; });
    palco.addEventListener("pointerleave", () => { alvo = null; });
    new IntersectionObserver((e) => { visivel = e[0].isIntersecting; if (visivel) requestAnimationFrame(passo); }).observe(palco);
    function passo() {
      if (!visivel) return;
      t += 0.006;
      const [ax, ay] = alvo || [50 + Math.sin(t * 1.3) * 26, 42 + Math.sin(t * 2.1) * 12];
      x += (ax - x) * 0.06; y += (ay - y) * 0.06;
      luz.style.setProperty("--mx", x.toFixed(2) + "%"); luz.style.setProperty("--my", y.toFixed(2) + "%");
      requestAnimationFrame(passo);
    }
  }

  /* ---------- Menu ---------- */
  function montarMenu() {
    const menu = $("#menu"), botao = $("#abrirMenu"), mq = matchMedia("(max-width: 1000px)");
    menu.innerHTML = L.map((l) => `<a href="#${l.slug}" style="--cor:${l.cor}">${esc(l.nome)}</a>`).join("") + `<a href="#circuito">Turnê</a>`;
    const ajusta = () => { const ab = botao.getAttribute("aria-expanded") === "true"; menu.hidden = mq.matches && !ab; botao.textContent = ab ? "Fechar" : "Menu"; };
    const fechar = () => { botao.setAttribute("aria-expanded", "false"); ajusta(); };
    botao.addEventListener("click", () => { botao.setAttribute("aria-expanded", String(botao.getAttribute("aria-expanded") !== "true")); ajusta(); });
    menu.addEventListener("click", (e) => { if (e.target.closest("a") && mq.matches) fechar(); });
    mq.addEventListener("change", fechar); ajusta();
    const links = [...menu.querySelectorAll("a")];
    const obs = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-30% 0px -65% 0px" });
    document.querySelectorAll(".painel, #circuito").forEach((s) => obs.observe(s));
  }

  /* ---------- Ingresso ---------- */
  function capa(p) {
    const l = ling(p.linguagem), img = imagemDe(p), vid = idYoutube(p.video);
    return `<span class="ingresso__capa" style="--cor:${l.cor}"><span class="holofote"></span>${icone(l.icone)}` +
      (img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : "") +
      (vid ? `<span class="ingresso__play">${icone("play")}</span>` : "") +
      (p.exemplo ? '<span class="selo">Exemplo</span>' : "") + "</span>";
  }
  function ingresso(p) {
    const est = estado(p.estado);
    return `<button type="button" class="ingresso revela" data-id="${esc(p.id)}">${capa(p)}` +
      `<span class="ingresso__corpo"><span class="ingresso__meta">${esc(est.nome)} · ${esc(p.grupo)}</span>` +
      `<span class="ingresso__titulo">${esc(p.titulo)}</span><span class="ingresso__resumo">${esc(p.resumo)}</span></span>` +
      `<span class="ingresso__canhoto"><span>Nº ${ordem.get(p.id)}</span><b>${esc(est.uf)}</b></span></button>`;
  }

  /* ---------- Atos (um painel por linguagem) ---------- */
  function montarPaineis() {
    $("#numLing").textContent = L.length;
    $("#avisoExemplo").hidden = !P.some((p) => p.exemplo);
    $("#paineis").innerHTML = L.map((l, i) => {
      const lista = P.filter((p) => p.linguagem === l.slug);
      return `<section class="painel" id="${l.slug}" style="--cor:${l.cor}" aria-labelledby="ato-${l.slug}">` +
        `<div class="wrap"><div class="painel__cab">` +
        `<p class="painel__ato">Ato ${ROMANOS[i] || i + 1} · ${lista.length} ${lista.length === 1 ? "projeto" : "projetos"}</p>` +
        `<h3 class="painel__nome" id="ato-${l.slug}" data-nome="${esc(l.nome)}">${esc(l.nome)}</h3>` +
        `<p class="painel__desc">${esc(l.desc)}</p>${icone(l.icone, "painel__icone")}</div>` +
        `<div class="ingressos">${lista.length ? lista.map(ingresso).join("") : '<p class="ingressos__vazio">Em breve</p>'}</div>` +
        `</div></section>`;
    }).join("");
    $("#paineis").addEventListener("click", (e) => { const b = e.target.closest(".ingresso"); if (b) abrir(b.dataset.id); });

    // painéis mais altos que a tela grudam pelo rodapé, para que tudo possa ser lido antes do próximo ato cobrir
    const ajustaTopo = () => {
      const topo = $("#topo").offsetHeight;
      document.querySelectorAll(".painel").forEach((pn) => { pn.style.top = Math.min(topo, innerHeight - pn.offsetHeight) + "px"; });
    };
    ajustaTopo(); addEventListener("resize", ajustaTopo);
    document.fonts && document.fonts.ready.then(ajustaTopo);
  }

  /* ---------- Turnê ---------- */
  function montarTurne() {
    $("#turne").innerHTML = E.map((e) => {
      const n = P.filter((p) => p.estado === e.uf).length;
      return `<li class="revela"><span class="turne__uf">${esc(e.uf)}</span><span class="turne__nome">${esc(e.nome)}${e.convidado ? "<small>Convidado</small>" : ""}</span>` +
        `<span class="turne__pontos" aria-hidden="true"></span><span class="turne__qtd">${n} ${n === 1 ? "projeto selecionado" : "projetos selecionados"}</span></li>`;
    }).join("");
  }

  /* ---------- Detalhes ---------- */
  const modal = $("#modal");
  function abrir(id) {
    const p = P.find((x) => x.id === id); if (!p) return;
    const l = ling(p.linguagem), est = estado(p.estado), vid = idYoutube(p.video);
    const ficha = `<dl class="ficha"><div><dt>Origem</dt><dd>${esc(est.nome)}</dd></div>` +
      Object.entries(p.ficha || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") + "</dl>";
    const botoes = botoesLinks(p, "botao botao--cor", "botao botao--fio");
    $("#modalCorpo").innerHTML = (vid ? `<div class="modal__video">${videoEmbed(p)}</div>` : capa(p)) +
      `<div class="modal__info" style="--cor:${l.cor}"><p class="rotulo">${esc(l.nome)} · Nº ${ordem.get(p.id)}</p>` +
      `<h2 id="modalTitulo">${esc(p.titulo)}</h2><p><strong>${esc(p.grupo)}</strong></p>` +
      `<p class="modal__sinopse">${esc(p.sinopse || p.resumo)}</p>${ficha}` +
      (botoes ? `<div class="modal__links">${botoes}</div>` : "") + "</div>";
    modal.showModal ? modal.showModal() : modal.setAttribute("open", "");
  }
  const fechar = () => (modal.close ? modal.close() : modal.removeAttribute("open"));
  modal.addEventListener("close", () => { $("#modalCorpo").innerHTML = ""; });
  modal.addEventListener("click", (e) => { if (e.target === modal) fechar(); });
  $("#fecharModal").addEventListener("click", fechar);

  montarLuz(); montarPaineis(); montarTurne(); montarMenu(); revelar();
  const h = location.hash.slice(1);
  if (h && document.getElementById(h)) setTimeout(() => document.getElementById(h).scrollIntoView(), 60);
})();
