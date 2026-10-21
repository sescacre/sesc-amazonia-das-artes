# Sesc Amazônia das Artes — Entre amazônias 2026

Site estático (HTML, CSS e JavaScript puros). Não usa banco de dados nem API: basta publicar a pasta em qualquer hospedagem (Apache, Nginx, Dokploy, GitHub Pages etc.) ou abrir o `index.html` no navegador.

## Estrutura

```
index.html          página
css/style.css       visual e animações
js/data.js          CONTEÚDO: linguagens, estados e projetos  ← edite aqui
js/main.js          comportamento (menus, filtros, janela de detalhes, animações)
assets/img/         logos (colorida, preta e branca) e fotos dos projetos
```

## Adicionar um projeto

Em `js/data.js`, copie um bloco da lista `PROJETOS` e preencha:

```js
{
  id: "nome-unico-sem-espacos",
  titulo: "Nome do espetáculo",
  grupo: "Nome do grupo ou artista",
  estado: "AC",                 // UF de origem
  linguagem: "teatro",          // slug de uma linguagem
  resumo: "Uma ou duas frases para o card.",
  sinopse: "Texto completo para a janela de detalhes.",
  video: "https://www.youtube.com/watch?v=XXXXXXXXXXX", // opcional: gera capa e player
  imagem: "assets/img/projetos/foto.jpg",               // opcional: capa própria
  ficha: { "Duração": "60 min", "Classificação": "Livre" },
  links: [
    { tipo: "instagram", url: "https://instagram.com/..." },
    { tipo: "drive", url: "https://drive.google.com/...", rotulo: "Release e fotos" }
  ]
}
```

Tipos de link aceitos: `youtube`, `vimeo`, `instagram`, `spotify`, `drive`, `site`.

Apague os projetos de exemplo (os que têm `exemplo: true`); o aviso de exemplo some sozinho quando não restar nenhum.

## Adicionar um menu (linguagem)

Copie um bloco da lista `LINGUAGENS` em `js/data.js`. A nova linguagem aparece automaticamente na barra de menus, nos cards, nos filtros e no rodapé. Cada linguagem tem link direto: `seusite.com/#teatro`, `seusite.com/#circo` etc.

Ícones disponíveis: `teatro`, `circo`, `danca`, `musica`, `literatura`, `audiovisual`, `artes-visuais`, `oficina`, `estrela`.
