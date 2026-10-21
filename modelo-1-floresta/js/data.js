/* =====================================================================
   DADOS DO SITE — edite apenas este arquivo para mudar o conteúdo.
   ---------------------------------------------------------------------
   LINGUAGENS: cada item vira uma aba no menu, um card na seção
   "Linguagens" e um filtro na programação.
     slug  -> usado no link (ex.: site.com/#teatro). Sem acentos/espaços.
     cor   -> cor da linguagem (capas e destaques).
     icone -> um dos ícones definidos em main.js (ICONES):
              teatro, circo, danca, musica, literatura, audiovisual,
              artes-visuais, oficina, estrela
   Para criar uma nova linguagem, copie um bloco e ajuste.
   ===================================================================== */
window.LINGUAGENS = [
  { slug: "teatro",        nome: "Teatro",        grupo: "Artes cênicas", cor: "#9B491D", icone: "teatro",
    desc: "Espetáculos de grupos e companhias que pesquisam a cena a partir das histórias, corpos e paisagens da região." },
  { slug: "circo",         nome: "Circo",         grupo: "Artes cênicas", cor: "#A8741C", icone: "circo",
    desc: "Malabares, acrobacias, palhaçaria e números aéreos de trupes que mantêm vivo o picadeiro amazônico." },
  { slug: "danca",         nome: "Dança",         grupo: "Artes cênicas", cor: "#8A3A4C", icone: "danca",
    desc: "Do contemporâneo às danças populares, trabalhos que fazem do movimento um modo de contar a Amazônia." },
  { slug: "musica",        nome: "Música",        grupo: "Música",        cor: "#466430", icone: "musica",
    desc: "Shows e concertos que vão das guitarradas e do carimbó ao jazz, ao rock e à música autoral." },
  { slug: "literatura",    nome: "Literatura",    grupo: "Literatura",    cor: "#2E5B5E", icone: "literatura",
    desc: "Recitais, contações de histórias e encontros com escritores e escritoras da região." },
  { slug: "audiovisual",   nome: "Audiovisual",   grupo: "Audiovisual",   cor: "#3D4A73", icone: "audiovisual",
    desc: "Filmes e documentários exibidos em mostra em cada estado do circuito." },
  { slug: "artes-visuais", nome: "Artes Visuais", grupo: "Artes visuais", cor: "#5E6E22", icone: "artes-visuais",
    desc: "Exposições que viajam pela região, com pinturas, fotografias, instalações e gravuras." }
];

/* =====================================================================
   ESTADOS do circuito. "convidado: true" mostra a marcação de convidado.
   ===================================================================== */
window.ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "PA", nome: "Pará" },
  { uf: "PI", nome: "Piauí", convidado: true },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "TO", nome: "Tocantins" }
];

/* =====================================================================
   PROJETOS da programação.
     linguagem   -> slug de uma das LINGUAGENS acima
     estado      -> UF de origem (de ESTADOS)
     video       -> link do YouTube (watch, youtu.be ou shorts). Gera
                    a capa automaticamente e o player na janela.
     imagem      -> caminho de uma foto (ex.: "assets/img/projetos/x.jpg").
                    Se houver imagem, ela é usada como capa.
     links       -> botões extras. tipo: youtube, vimeo, instagram,
                    site, drive, spotify (muda só o ícone/rótulo).
     ficha       -> pares livres exibidos na janela de detalhes.
     exemplo     -> true mostra o selo "Exemplo". Apague nos reais.

   ATENÇÃO: os itens abaixo são EXEMPLOS de layout. Troque pelos
   projetos selecionados pela curadoria.
   ===================================================================== */
window.PROJETOS = [
  {
    id: "rio-de-dentro",
    titulo: "O Rio de Dentro",
    grupo: "Grupo a confirmar",
    estado: "AC",
    linguagem: "teatro",
    resumo: "Uma família ribeirinha espera a cheia que nunca termina. Espetáculo sobre memória, partida e retorno.",
    sinopse: "Exemplo de sinopse. Escreva aqui de três a cinco frases sobre o espetáculo: do que trata, como é a encenação e o que o público pode esperar. Este texto aparece na janela de detalhes.",
    ficha: { "Duração": "60 min", "Classificação": "Livre", "Formato": "Palco italiano" },
    links: [{ tipo: "youtube", url: "https://www.youtube.com/results?search_query=Sesc+Amaz%C3%B4nia+das+Artes" }],
    exemplo: true
  },
  {
    id: "lona-do-norte",
    titulo: "Lona do Norte",
    grupo: "Trupe a confirmar",
    estado: "PA",
    linguagem: "circo",
    resumo: "Palhaços e acrobatas reinventam o circo de lona que passava pelas cidades do interior.",
    sinopse: "Exemplo de sinopse para um espetáculo de circo. Substitua pelo release enviado pelo grupo.",
    ficha: { "Duração": "50 min", "Classificação": "Livre", "Formato": "Rua ou palco" },
    links: [],
    exemplo: true
  },
  {
    id: "corpo-varzea",
    titulo: "Corpo Várzea",
    grupo: "Companhia a confirmar",
    estado: "AM",
    linguagem: "danca",
    resumo: "Um solo de dança contemporânea que acompanha o vai e vem das águas na várzea.",
    sinopse: "Exemplo de sinopse para um trabalho de dança.",
    ficha: { "Duração": "40 min", "Classificação": "Livre" },
    links: [],
    exemplo: true
  },
  {
    id: "guitarrada-de-fronteira",
    titulo: "Guitarrada de Fronteira",
    grupo: "Artista a confirmar",
    estado: "AP",
    linguagem: "musica",
    resumo: "Show autoral que mistura guitarrada, marabaixo e batuques da fronteira norte.",
    sinopse: "Exemplo de texto de apresentação de um show.",
    ficha: { "Duração": "75 min", "Classificação": "Livre", "Formação": "Quarteto" },
    links: [{ tipo: "spotify", url: "https://open.spotify.com/" }],
    exemplo: true
  },
  {
    id: "vozes-do-cerrado",
    titulo: "Vozes do Cerrado e da Mata",
    grupo: "Coletivo a confirmar",
    estado: "TO",
    linguagem: "musica",
    resumo: "Concerto que une viola, rabeca e canto em repertório da transição entre cerrado e floresta.",
    sinopse: "Exemplo de texto de apresentação de um concerto.",
    ficha: { "Duração": "60 min", "Classificação": "Livre" },
    links: [],
    exemplo: true
  },
  {
    id: "palavra-de-beira",
    titulo: "Palavra de Beira",
    grupo: "Autora a confirmar",
    estado: "MA",
    linguagem: "literatura",
    resumo: "Recital de poesia e contação de histórias com narrativas recolhidas nas beiras de rio.",
    sinopse: "Exemplo de texto para uma proposta de literatura.",
    ficha: { "Duração": "45 min", "Classificação": "Livre" },
    links: [],
    exemplo: true
  },
  {
    id: "estrada-br364",
    titulo: "Estrada 364",
    grupo: "Realizador a confirmar",
    estado: "RO",
    linguagem: "audiovisual",
    resumo: "Documentário sobre quem vive e trabalha às margens da rodovia que liga o Norte ao resto do país.",
    sinopse: "Exemplo de sinopse de documentário.",
    ficha: { "Duração": "72 min", "Classificação": "Livre", "Gênero": "Documentário" },
    links: [],
    exemplo: true
  },
  {
    id: "ceu-de-roraima",
    titulo: "Céu de Lavrado",
    grupo: "Realizadora a confirmar",
    estado: "RR",
    linguagem: "audiovisual",
    resumo: "Curta de ficção ambientado no lavrado de Roraima, entre a seca e a primeira chuva.",
    sinopse: "Exemplo de sinopse de curta-metragem.",
    ficha: { "Duração": "18 min", "Classificação": "Livre", "Gênero": "Ficção" },
    links: [],
    exemplo: true
  },
  {
    id: "pigmentos",
    titulo: "Pigmentos da Terra",
    grupo: "Artista a confirmar",
    estado: "MT",
    linguagem: "artes-visuais",
    resumo: "Exposição de pinturas feitas com tintas de urucum, jenipapo, argila e carvão.",
    sinopse: "Exemplo de apresentação de exposição: conceito, técnicas e número de obras.",
    ficha: { "Obras": "18", "Técnica": "Pigmentos naturais sobre tela", "Montagem": "Galeria" },
    links: [],
    exemplo: true
  },
  {
    id: "terreiro-de-cena",
    titulo: "Terreiro de Cena",
    grupo: "Grupo a confirmar",
    estado: "PI",
    linguagem: "teatro",
    resumo: "Teatro de rua que convida o público para dentro da roda a partir de festas populares.",
    sinopse: "Exemplo de sinopse de teatro de rua.",
    ficha: { "Duração": "55 min", "Classificação": "Livre", "Formato": "Rua" },
    links: [],
    exemplo: true
  }
];
