/* Utilidades compartilhadas: ícones, busca de dados e geradores. Não precisa editar. */
window.BASE = (function () {
  "use strict";
  const ICONES = {
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
  const ROTULO_LINK = { youtube: "Assistir no YouTube", vimeo: "Assistir no Vimeo", instagram: "Instagram", spotify: "Ouvir no Spotify", drive: "Ver material", site: "Site oficial" };

  const L = window.LINGUAGENS || [], E = window.ESTADOS || [], P = window.PROJETOS || [];

  const icone = (nome, classe) =>
    `<svg class="${classe || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome] || ICONES.estrela}</svg>`;
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normal = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const ling = (slug) => L.find((l) => l.slug === slug) || { slug, nome: slug, cor: "#466430", icone: "estrela", desc: "" };
  const estado = (uf) => E.find((e) => e.uf === uf) || { uf, nome: uf };
  const idYoutube = (url) => { const m = String(url || "").match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : ""; };
  const imagemDe = (p) => { const v = idYoutube(p.video); return p.imagem || (v ? `https://img.youtube.com/vi/${v}/hqdefault.jpg` : ""); };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const aleatorio = (semente) => { let a = semente; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Botões de link do projeto (o vídeo entra primeiro, se houver) */
  const botoesLinks = (p, classePrimario, classeSecundario) => {
    const links = (p.links || []).slice();
    if (p.video && !links.some((k) => k.url === p.video)) links.unshift({ tipo: "youtube", url: p.video });
    return links.map((k, i) =>
      `<a class="${i === 0 ? classePrimario : classeSecundario}" href="${esc(k.url)}" target="_blank" rel="noopener">${icone(k.tipo)}${esc(k.rotulo || ROTULO_LINK[k.tipo] || "Abrir link")}</a>`).join("");
  };
  const videoEmbed = (p) => {
    const v = idYoutube(p.video);
    return v ? `<iframe src="https://www.youtube-nocookie.com/embed/${v}?rel=0" title="${esc(p.titulo)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>` : "";
  };

  /* Revela elementos .revela ao entrar na tela (já visíveis em repouso) */
  const revelar = (seletor) => {
    if (reduz || !("IntersectionObserver" in window)) return;
    const vistos = new WeakSet();
    const obs = new IntersectionObserver((ents) => ents.forEach((en, i) => {
      if (!en.isIntersecting || vistos.has(en.target)) return;
      vistos.add(en.target);
      if (en.target.getBoundingClientRect().top < window.innerHeight * 0.2) return;
      en.target.style.animationDelay = (i % 6) * 70 + "ms";
      en.target.classList.add("entrou");
      en.target.querySelectorAll("[data-conta]").forEach(contar);
    }), { threshold: 0.12 });
    document.querySelectorAll(seletor || ".revela").forEach((el) => obs.observe(el));
  };
  const contar = (el) => {
    const fim = parseInt(el.dataset.conta, 10); if (isNaN(fim)) return;
    const ini = fim > 1000 ? fim - 18 : 0; let t0 = null;
    const passo = (t) => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(ini + (fim - ini) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  };

  return { L, E, P, icone, esc, normal, ling, estado, idYoutube, imagemDe, hash, aleatorio, reduz, botoesLinks, videoEmbed, revelar };
})();
