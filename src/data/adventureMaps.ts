export type AdventureMapPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "safe" | "danger" | "mystery" | "route" | "site";
  detail: string;
};

export type AdventureMapRoute = {
  id: string;
  d: string;
  label?: string;
  danger?: boolean;
};

export type AdventureMapRegion = {
  id: string;
  d: string;
  fill: string;
  stroke?: string;
  label?: string;
};

export type AdventureMap = {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  viewBox: string;
  type: "mundi" | "regiao" | "masmorra" | "cidade";
  summary: string;
  gmNotes: string[];
  regions: AdventureMapRegion[];
  routes: AdventureMapRoute[];
  points: AdventureMapPoint[];
};

export const adventureMaps: AdventureMap[] = [
  {
    id: "mirkasa-mundi",
    title: "Mapa Mundi de Mirkasa",
    subtitle: "Visao de campanha para ligar as aventuras guiadas",
    source:
      "Guia do Dungeon World, Confusoes em Nekesti, Desfiladeiro de Nemfalla, O Forte de Altai e O Formigueiro Infectado",
    viewBox: "0 0 1000 620",
    type: "mundi",
    summary:
      "Mapa de uso em mesa para situar as regioes citadas nos PDFs. Ele nao tenta substituir um mapa impresso oficial: organiza os locais jogaveis, estradas, fronteiras e zonas de pressao para o mestre navegar entre aventuras.",
    gmNotes: [
      "Use Nekesti como centro urbano de rumores, julgamentos e intriga templaria.",
      "Use Nemfalla como entrada vertical para a guerra subterranea entre gnomos e kobolds.",
      "Use Altai como regiao fria e remota, marcada por vilas montesas, ibex e retorno dos minotauros mortos-vivos.",
      "Use o Formigueiro como zigurate isolado em terras de dejetos, conectado a minas de magisita, elfos do deserto e ninhadas de aranhas.",
    ],
    regions: [
      {
        id: "westlands",
        label: "Terras de Mirkasa",
        fill: "#161a15",
        stroke: "#4d5d41",
        d: "M109 136 C222 61 344 84 433 144 C518 201 607 192 702 133 C803 71 923 96 944 198 C960 275 898 361 812 390 C710 425 652 518 534 539 C421 559 347 498 252 494 C153 490 64 428 58 326 C54 243 49 178 109 136 Z",
      },
      {
        id: "altai-range",
        label: "Montanhas de Altai",
        fill: "#253039",
        stroke: "#6f8ea0",
        d: "M628 103 C703 66 845 67 920 138 C896 184 841 212 774 209 C714 206 666 179 628 103 Z",
      },
      {
        id: "nemfalla-range",
        label: "Desfiladeiro de Nemfalla",
        fill: "#2a2520",
        stroke: "#94754a",
        d: "M394 250 C447 198 530 194 584 239 C552 301 489 337 421 321 C386 313 372 286 394 250 Z",
      },
      {
        id: "waste-antlands",
        label: "Dejetos e zigurates de formigas",
        fill: "#2a2415",
        stroke: "#9d8b55",
        d: "M111 305 C183 265 284 279 328 357 C293 441 199 470 112 427 C68 394 65 335 111 305 Z",
      },
      {
        id: "blood-forest",
        label: "Floresta Sanguinea",
        fill: "#173123",
        stroke: "#3f7d53",
        d: "M660 366 C728 338 811 354 848 414 C813 485 735 512 668 476 C627 454 620 396 660 366 Z",
      },
    ],
    routes: [
      {
        id: "road-kostromo-nekesti-nosjad",
        label: "Estrada templaria",
        d: "M641 331 C580 303 534 301 486 327 C430 357 383 391 314 404",
      },
      {
        id: "north-road-altai",
        label: "Caminho montes",
        d: "M611 291 C654 241 701 211 770 184",
        danger: true,
      },
      {
        id: "desert-track",
        label: "Trilha dos dejetos",
        d: "M327 405 C273 372 222 352 168 367",
        danger: true,
      },
    ],
    points: [
      {
        id: "nekesti",
        label: "Nekesti",
        x: 604,
        y: 328,
        type: "site",
        detail:
          "Cidade pobre com guarda templaria, madeira, graos, julgamento popular, bairro gnomico e a residencia do magistrado Kalareth.",
      },
      {
        id: "kostromo",
        label: "Kostromo",
        x: 704,
        y: 323,
        type: "route",
        detail:
          "Cidade jurada a Nekesti; aparece como direcao de fuga, favela e conexao politica.",
      },
      {
        id: "nosjad",
        label: "Nosjad",
        x: 488,
        y: 329,
        type: "route",
        detail:
          "Rota citada em Nekesti, ligada a engenheiros, torres abandonadas e intrigas arcanas.",
      },
      {
        id: "nemfalla",
        label: "Nemfalla",
        x: 487,
        y: 277,
        type: "danger",
        detail:
          "Desfiladeiro e complexo subterraneo disputado por gnomos Bobinas Lampejantes e kobolds Luz de Velas.",
      },
      {
        id: "altai",
        label: "Forte de Altai",
        x: 779,
        y: 159,
        type: "danger",
        detail:
          "Fortaleza congelada nas montanhas, ligada aos minotauros mortos-vivos, Molekh e vilas montesas desaparecidas.",
      },
      {
        id: "uryl",
        label: "Uryl",
        x: 721,
        y: 213,
        type: "safe",
        detail:
          "Vila montesa de ibex, vigiada e ameaçada pelo retorno dos lordes minotauros.",
      },
      {
        id: "formigueiro",
        label: "Formigueiro Infectado",
        x: 186,
        y: 366,
        type: "danger",
        detail:
          "Zigurate de formigas gigantes, minas de magisita, esporos fungicos e guias elficos em panico.",
      },
      {
        id: "spider-brood",
        label: "Ninhada Aranha",
        x: 256,
        y: 430,
        type: "mystery",
        detail:
          "Intermediarios comerciais entre elfos e formigas; abrigo possivel se Pii'treb sobreviver.",
      },
    ],
  },
  {
    id: "forte-altai",
    title: "Forte de Altai",
    subtitle: "Mapa de masmorra guiada",
    source: "O Forte de Altai",
    viewBox: "0 0 900 620",
    type: "masmorra",
    summary:
      "Organiza os oito pontos do mapa do PDF em um fluxo jogavel: entrada, recepcao, saloes, bloqueios congelados, criptas e altar final.",
    gmNotes: [
      "Comece pela entrada principal e deixe o frio apagar tochas, tornar piso escorregadio e anunciar os mortos.",
      "Use o salao de banquete impecavel como pista de sangue recente antes do despertar dos minotauros.",
      "Coloque a espada do Diacono Gorric presa no gelo entre rota bloqueada e confronto final.",
      "Quando a ficcao pedir pressao, faca mais minotauros surgirem das criptas ou lacaios formarem bloqueio.",
    ],
    regions: [
      {
        id: "keep",
        fill: "#171613",
        stroke: "#7b6b55",
        d: "M133 94 H733 Q774 94 774 135 V489 Q774 530 733 530 H133 Q92 530 92 489 V135 Q92 94 133 94 Z",
      },
      {
        id: "ice",
        fill: "#1a2b33",
        stroke: "#5fb6c4",
        d: "M252 176 H595 V229 H252 Z M495 366 H704 V426 H495 Z",
      },
    ],
    routes: [
      { id: "main-axis", d: "M435 526 L435 441 L435 344 L435 248 L435 149" },
      { id: "banquet-crypt", d: "M435 344 C320 333 254 290 254 211", danger: true },
      { id: "guest-altar", d: "M435 344 C555 347 649 389 650 489", danger: true },
    ],
    points: [
      {
        id: "entrada",
        label: "5 Entrada principal",
        x: 435,
        y: 526,
        type: "route",
        detail:
          "Portao frio e imponente. Bom lugar para mostrar marcas de cascos, vento cortante e ausencia de vigias vivos.",
      },
      {
        id: "atrio",
        label: "2 Atrio",
        x: 435,
        y: 441,
        type: "site",
        detail:
          "Distribui o grupo para saloes, convidados e areas bloqueadas. Use ecos e respostas distantes dos mugidos.",
      },
      {
        id: "banquete",
        label: "4 Saloes de banquete",
        x: 254,
        y: 211,
        type: "mystery",
        detail:
          "Sala limpa demais, fria demais, com gosto de cobre no ar. Indica sangue recente e preparativos de uma corte morta-viva.",
      },
      {
        id: "convidados",
        label: "6 Salao dos convidados",
        x: 615,
        y: 300,
        type: "site",
        detail:
          "Acomodacoes e restos da ocupacao de Deanera; lacaios sanguineos podem implorar ou bloquear passagem.",
      },
      {
        id: "criptas",
        label: "1 Criptas",
        x: 255,
        y: 415,
        type: "danger",
        detail:
          "Selos se rompem e minotauros carniciais acordam. Use como fonte recorrente de reforcos.",
      },
      {
        id: "trono",
        label: "3 Trono de Molekh",
        x: 435,
        y: 149,
        type: "danger",
        detail:
          "Centro da ambicao do Ceifador. Mostre tributos, ossos e sinais de comando sobre os outros minotauros.",
      },
      {
        id: "final",
        label: "7 Ultima resistencia",
        x: 651,
        y: 408,
        type: "danger",
        detail:
          "Ponto de cerco, bloqueio de lacaios e teto congelado instavel. Bom lugar para a espada contaminada no gelo.",
      },
      {
        id: "altar",
        label: "8 Altar da escuridao",
        x: 650,
        y: 489,
        type: "mystery",
        detail:
          "Origem ritual do retorno. Deanera, sangue roubado e a pergunta sobre quem trouxe os lordes de volta.",
      },
    ],
  },
  {
    id: "formigueiro-infectado",
    title: "Formigueiro Infectado",
    subtitle: "Zigurate, minas de magisita e rota da rainha",
    source: "O Formigueiro Infectado",
    viewBox: "0 0 900 620",
    type: "masmorra",
    summary:
      "Mapa para conduzir uma sessao de entrada direta: os personagens começam no fundo do zigurate, cercados por formigas doentes, esporos e rotas de fuga incertas.",
    gmNotes: [
      "A sala inicial tem quatro lajes: minerios, vegetais embolorados, fungo enorme e sombras de formigas no corredor sul.",
      "Use a magisita para motivar os guias elficos e tensionar a relacao entre elfos, formigas e aranhas.",
      "Pii'treb pode transformar um mapa de fuga em acordo politico com as aranhas.",
      "A rainha infectada deve ficar no ponto mais quente, umido e protegido do zigurate.",
    ],
    regions: [
      {
        id: "ziggurat",
        fill: "#201b12",
        stroke: "#9d8b55",
        d: "M446 68 L772 250 L654 536 H238 L120 250 Z",
      },
      {
        id: "fungus",
        fill: "#20311f",
        stroke: "#6f9f67",
        d: "M363 195 C426 143 515 158 558 225 C522 283 423 299 362 250 Z",
      },
      {
        id: "mines",
        fill: "#1d2830",
        stroke: "#5fb6c4",
        d: "M159 352 C246 336 316 376 331 471 C260 515 172 488 137 424 Z",
      },
    ],
    routes: [
      { id: "south-hall", d: "M446 336 L446 475", danger: true },
      { id: "mine-track", d: "M446 336 C360 365 295 402 225 438" },
      { id: "spider-route", d: "M446 336 C536 370 610 407 694 452" },
      { id: "elf-route", d: "M446 184 C371 138 289 125 203 142" },
    ],
    points: [
      {
        id: "entrada-esporos",
        label: "Entrada com esporos",
        x: 203,
        y: 142,
        type: "danger",
        detail:
          "Ponto para a rolagem inicial de DES. Quem evita esporos tambem evita deteccao ou exposicao.",
      },
      {
        id: "sala-lajes",
        label: "Sala das quatro lajes",
        x: 446,
        y: 336,
        type: "site",
        detail:
          "Inicio da aventura: arenito, minerios, vegetais embolorados e fungo do tamanho de arvore.",
      },
      {
        id: "fungo-arvore",
        label: "Fungo gigante",
        x: 462,
        y: 218,
        type: "mystery",
        detail:
          "Sinal visual da infecção. Use luminescencia palida, calor umido e ar pesado de esporos.",
      },
      {
        id: "corredor-sul",
        label: "Corredor sul",
        x: 446,
        y: 475,
        type: "danger",
        detail:
          "Formigas doentes cambaleiam em massa. Bom ponto para separar grupo ou revelar que a colonia ja caiu.",
      },
      {
        id: "minas-magisita",
        label: "Minas de magisita",
        x: 225,
        y: 438,
        type: "mystery",
        detail:
          "Recurso que sustenta familias elficas do norte e explica parte da tensao com as formigas.",
      },
      {
        id: "armario-piitreb",
        label: "Esconderijo de Pii'treb",
        x: 600,
        y: 394,
        type: "safe",
        detail:
          "O enviado aranha pode oferecer abrigo, noticia e recompensa se escapar vivo.",
      },
      {
        id: "camara-rainha",
        label: "Camara da rainha",
        x: 692,
        y: 452,
        type: "danger",
        detail:
          "Fonte politica e biologica da crise: a rainha infectada transforma a colonia em vetor de pestilencia.",
      },
    ],
  },
  {
    id: "nekesti",
    title: "Nekesti e a Residencia Kalareth",
    subtitle: "Cidade, tumulto e casa assombrada do magistrado",
    source: "Confusoes em Nekesti",
    viewBox: "0 0 900 620",
    type: "cidade",
    summary:
      "Une os dois mapas pertinentes da aventura: a cidade pobre em tensao publica e a residencia do magistrado, onde pistas e assombracoes levam a novas complicacoes.",
    gmNotes: [
      "A praca de linchamento deve ser apertada: multidao, fogueira, estaca de ferro e templarios pressionando.",
      "A residencia Kalareth funciona como mapa de investigacao, nao como planta exata: cada sala puxa uma pergunta.",
      "Use rumores de rua para deslocar jogadores entre bairro gnomico, cidadela templaria, mercado e residencia.",
      "O magistrado deve poder desaparecer na multidao ou convocar o exercito dentado se encurralado.",
    ],
    regions: [
      {
        id: "city",
        fill: "#191611",
        stroke: "#806b47",
        d: "M108 120 H792 V500 H108 Z",
      },
      {
        id: "kalareth-house",
        fill: "#201515",
        stroke: "#8a4f4f",
        d: "M540 132 H765 V326 H540 Z",
      },
      {
        id: "gnome-quarter",
        fill: "#18272a",
        stroke: "#5fb6c4",
        d: "M151 332 H360 V475 H151 Z",
      },
    ],
    routes: [
      { id: "main-street", d: "M146 285 H754" },
      { id: "templar-road", d: "M455 285 C481 214 530 169 610 157" },
      { id: "secret", d: "M635 257 C571 342 472 388 336 406", danger: true },
    ],
    points: [
      {
        id: "praca",
        label: "Praca da fogueira",
        x: 438,
        y: 286,
        type: "danger",
        detail:
          "Inicio em midias res: multidao exigindo sangue, gnomo salvo e magistrado tentando virar a cidade contra os PJs.",
      },
      {
        id: "cidadela",
        label: "Cidadela templaria",
        x: 610,
        y: 157,
        type: "site",
        detail:
          "Defesa principal da cidade e origem de guardas, julgamentos e cacas a bruxas.",
      },
      {
        id: "bairro-gnomico",
        label: "Novo Bairro Gnomico",
        x: 254,
        y: 404,
        type: "safe",
        detail:
          "Sucta, comercio, engenheiros e esquemas malucos. Bom ponto para ajuda estranha e novas tarefas.",
      },
      {
        id: "residencia",
        label: "Residencia Kalareth",
        x: 650,
        y: 230,
        type: "mystery",
        detail:
          "Velho casarao com mordomo, escritorio, galeria, biblioteca, observatorio, estabulos e passagem secreta.",
      },
      {
        id: "observatorio",
        label: "Biblioteca e observatorio",
        x: 708,
        y: 177,
        type: "danger",
        detail:
          "Telescopio dourado e armadilha ornamental de luz solar focada.",
      },
      {
        id: "sotao",
        label: "Sotao dos ratos",
        x: 586,
        y: 179,
        type: "danger",
        detail:
          "Dominio de Skumm, o Rei dos Ratos, e de ruidos que parecem pequenos demais ate atacarem.",
      },
      {
        id: "passagem",
        label: "Armario passagem",
        x: 635,
        y: 292,
        type: "mystery",
        detail:
          "Passagem secreta: use para revelar para onde o plano contra os gnomos realmente seguia.",
      },
      {
        id: "portoes",
        label: "Rotas para Kostromo, Nosjad e Floresta",
        x: 132,
        y: 286,
        type: "route",
        detail:
          "Saidas para rumores maiores, juramentos da cidade e nomes citados nos julgamentos.",
      },
    ],
  },
  {
    id: "nemfalla",
    title: "Desfiladeiro de Nemfalla",
    subtitle: "Mapa vertical da guerra subterranea",
    source: "Desfiladeiro de Nemfalla",
    viewBox: "0 0 900 620",
    type: "regiao",
    summary:
      "Mapa vertical para mesa: o grupo esta tres andares abaixo, entre territorio gnomo, emboscadas kobold, Vh'orr, trilhos de mina e a influencia sombria de Chaeron.",
    gmNotes: [
      "Use altura como pressao: luz distante acima, ar rarefeito embaixo e trilhos conectando lugares errados.",
      "A guerra entre Bobinas Lampejantes e Luz de Velas deve aparecer nos objetos: engrenagens, velas, sucata e trofeus.",
      "Se o grupo buscar direcao apos desmoronamento, use rajada de ar, agua pingando ou som de carrinho.",
      "Vh'orr pode reaparecer de direcoes incertas; Chaeron deve falar por sussurros antes de ser explicado.",
    ],
    regions: [
      {
        id: "chasm",
        fill: "#171411",
        stroke: "#6d5a42",
        d: "M292 64 C392 111 497 93 611 63 C660 197 638 363 583 547 C483 514 393 509 292 548 C236 365 226 203 292 64 Z",
      },
      {
        id: "gnome-side",
        fill: "#14272a",
        stroke: "#5fb6c4",
        d: "M173 180 C240 148 317 158 354 222 C315 286 232 303 166 258 Z",
      },
      {
        id: "kobold-side",
        fill: "#2a1d16",
        stroke: "#ad7847",
        d: "M556 201 C635 157 726 176 760 244 C703 310 614 320 552 273 Z",
      },
    ],
    routes: [
      { id: "mine-cart", label: "Trilhos de carrinho", d: "M247 225 C362 276 484 324 632 263" },
      { id: "vertical-drop", label: "Descida", d: "M444 92 L444 510", danger: true },
      { id: "blocked", label: "Desmoronamento", d: "M313 418 C425 379 519 379 613 421", danger: true },
    ],
    points: [
      {
        id: "surface",
        label: "Luz da superficie",
        x: 444,
        y: 92,
        type: "route",
        detail:
          "Sol ou lua fracos no alto. Lembre aos jogadores que a saida existe, mas esta longe.",
      },
      {
        id: "ogre-midden",
        label: "Sambaqui ogro",
        x: 444,
        y: 510,
        type: "danger",
        detail:
          "Inicio tres andares abaixo: restos de Chaeron, Vh'orr chegando, cavalo inconsciente e chao de ossos.",
      },
      {
        id: "gnome-generator",
        label: "Gerador gnomo",
        x: 247,
        y: 225,
        type: "safe",
        detail:
          "Eletricidade tremeluzente, engenhocas e os Bobinas Lampejantes tentando tomar o desfiladeiro.",
      },
      {
        id: "kobold-shrine",
        label: "Velas kobold",
        x: 632,
        y: 263,
        type: "danger",
        detail:
          "Territorio Luz de Velas. A chama e sagrada; roubar ou apagar luz muda a cena imediatamente.",
      },
      {
        id: "luminous-flower",
        label: "Flor luminosa",
        x: 513,
        y: 363,
        type: "mystery",
        detail:
          "Pequena luz azul no escuro. Bela, util e heretica aos olhos kobold.",
      },
      {
        id: "explosives",
        label: "Explosivos superiores",
        x: 326,
        y: 347,
        type: "route",
        detail:
          "Necessarios para abrir beco sem saida. Otimo motivo para voltar sob pressao.",
      },
      {
        id: "canaries",
        label: "Ninho dos canarios",
        x: 567,
        y: 454,
        type: "danger",
        detail:
          "Criaturas deformadas em area de ar ruim; podem mergulhar de cima ou carregar comida.",
      },
      {
        id: "chaeron",
        label: "Fenda de Chaeron",
        x: 445,
        y: 408,
        type: "mystery",
        detail:
          "Sussurros, medo verdadeiro e tentativa de trazer algo antigo das profundezas.",
      },
    ],
  },
];
