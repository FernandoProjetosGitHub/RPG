export type GmReferenceSection = {
  id: string;
  title: string;
  source: string;
  bullets: string[];
};

export type MonsterReference = {
  id: string;
  name: string;
  source: string;
  tags: string[];
  hp: number;
  armor: number;
  damage: string;
  instinct: string;
  moves: string[];
  notes?: string;
};

export const gmReferenceSections: GmReferenceSection[] = [
  {
    id: "conversation",
    title: "Fluxo principal de Dungeon World",
    source: "Guia do Dungeon World",
    bullets: [
      "O mestre apresenta uma situacao perigosa ou incerta e pergunta o que os personagens fazem.",
      "Os jogadores descrevem a acao dentro da ficcao. A rolagem entra apenas quando a acao dispara um movimento.",
      "O mestre nao rola para PdMs. As rolagens dos jogadores determinam quando o mestre responde com consequencias, dano, custo ou nova pressao.",
      "Em 10+, entregue o sucesso de forma clara. Em 7-9, entregue com custo, escolha dificil, recurso gasto ou complicacao. Em 6-, avance a ameaca com mais forca e marque XP quando aplicavel.",
    ],
  },
  {
    id: "soft-hard",
    title: "Movimentos suaves e pesados",
    source: "Guia do Dungeon World",
    bullets: [
      "Movimento suave mostra o perigo antes da conclusao: barulho atras da porta, teto rangendo, guarda suspeitando, monstro preparando bote.",
      "Movimento pesado aplica a consequencia: dano, separacao, perda de item, captura, recurso gasto, revelar uma verdade ruim ou virar o movimento contra eles.",
      "Use movimentos suaves em 7-9 e quando ainda ha tempo para reagir. Use movimentos pesados em 6-, quando ignoram aviso ou quando a ficcao ja preparou a consequencia.",
      "Sempre termine com uma situacao que peca resposta: 'o que voces fazem?'.",
    ],
  },
  {
    id: "combat",
    title: "Combate sem iniciativa",
    source: "Guia do Dungeon World",
    bullets: [
      "Nao existe turno fixo. A camera vai para quem esta sob maior risco, para quem ainda nao agiu ou para quem tem uma escolha interessante.",
      "Mostre ataques inimigos como perigos em andamento. Se o personagem reage com violencia corpo a corpo, normalmente Matar e Pilhar. Se evita, protege, corre ou resiste, normalmente Desafiar Perigo ou Defender.",
      "Atacar inimigo indefeso ou surpreso pode causar dano direto sem Matar e Pilhar, se a ficcao sustentar.",
      "Depois de cada rolagem, transforme o resultado em nova posicao ficcional: derrubado, cercado, separado, sem escudo, com abertura, com refem, com vantagem ou em retirada.",
    ],
  },
  {
    id: "damage",
    title: "Regras de dano importantes",
    source: "Guia do Dungeon World e aventuras",
    bullets: [
      "Dano segue a ficcao: aplique quando o perigo ja acertou, quando a rolagem manda, ou quando o personagem ignora uma ameaca obvia.",
      "Contra varios monstros atacando um personagem, use o maior dado de dano entre eles e some +1 para cada atacante alem do primeiro.",
      "Contra um monstro pequeno ou incapaz de se defender de varios PJs, alguns personagens podem causar dano direto enquanto outro segura a atencao dele.",
      "Contra monstros grandes, rapidos ou treinados, eles podem responder a varios atacantes. Narre como giram, empurram, mordem, quebram terreno ou forcao separacao.",
      "Armadura reduz dano quando a fonte permite. Dano que ignora armadura deve ficar claro na ficha do monstro ou efeito.",
    ],
  },
  {
    id: "fronts",
    title: "Frentes, pressagios e mapas de aventura",
    source: "Guia do Dungeon World, Forte de Altai, Formigueiro, Nekesti e Nemfalla",
    bullets: [
      "Cada aventura guiada tem uma ameaca que piora se ninguem age: retorno dos minotauros, infeccao fungica, linchamento politico ou guerra subterranea.",
      "Use pressagios como relogio narrativo, nao como roteiro rigido. Quando os PJs perdem tempo, falham ou ignoram pistas, avance um pressagio.",
      "Mapas no painel do mestre mostram rotas, pontos de pressao e informacoes secretas. Os jogadores devem receber apenas o que viram ou descobriram.",
      "Quando estiver em duvida, escolha uma pergunta da aventura e transforme a proxima cena em chance de resposta.",
    ],
  },
  {
    id: "adventure-moves",
    title: "Movimentos de masmorra das aventuras",
    source: "PDFs de aventura",
    bullets: [
      "Altai: frio apaga tochas, teto congelado desaba, minotauros saem das criptas, lacaios bloqueiam passagem e a espada templaria contaminada chama atencao.",
      "Formigueiro: esporos amarelos, formigas cambaleantes, calor umido, fungos luminescentes, minas de magisita e risco da infeccao se espalhar.",
      "Nekesti: multidao pressiona, carruagem capota, chamas sobem, templarios julgam, o magistrado desaparece na multidao e a residencia assombrada reage.",
      "Nemfalla: passagem desmorona, carrinho de mina leva ao destino errado, kobolds atacam das sombras, flor luminosa vira heresia e Vh'orr reaparece.",
    ],
  },
  {
    id: "altai-history",
    title: "Historia e segredos: Forte de Altai",
    source: "O Forte de Altai",
    bullets: [
      "O forte ficou abandonado por seculos depois que templarios da Fe Roubada massacraram seus antigos donos.",
      "Os lordes minotauros de Altai reduziram dezenas de vilas a po antes de serem vencidos. O retorno deles ameaca fazendeiros, pastores e vilas montesas.",
      "Molekh, chamado de Ceifador, voltou com corpo e ambicao preservados. Ele nao e apenas uma fera: quer comando, tributo e poder.",
      "Princesa Deanera foi enviada para ressuscitar os minotauros nas criptas e transformar o forte em uma corte sombria digna dela.",
      "A vila de Uryl e ponto social importante: suja, equilibrada, com vigia, ibex como recurso, juramentos com Dzhambul e Fe Roubada, e necessidade urgente de herois.",
      "Pressagios: pastores somem a noite; Molekh reune minotauros; novo exercito templario e repelido; Uryl e destruida.",
      "Tesouros importantes: Foice do Ceifador, Elmo Cartografico, Cajado Sanguineo e a lamina templaria do Diacono Gorric contaminada pelo mal.",
      "Perguntas centrais: quem realmente trouxe os minotauros de volta, o que Deanera quer alem de luxo, e como garantir que Molekh permaneca morto.",
    ],
  },
  {
    id: "formigueiro-history",
    title: "Historia e segredos: Formigueiro Infectado",
    source: "O Formigueiro Infectado",
    bullets: [
      "A aventura comeca no fundo do zigurate de formigas gigantes, sem preparacao lenta: lajes, minerios, vegetais embolorados, fungo enorme e formigas doentes chegando.",
      "As formigas cultivavam fungo parasita que domava trolls. Uma cepa trazida por troll de carga mudou e passou a infectar as proprias formigas.",
      "Quando a rainha foi infectada, a colonia ficou comprometida. A maioria morreu, mas sobreviventes ainda vagam procurando vitimas.",
      "A infeccao ainda parece afetar apenas formigas, mas a ameaca real e ela se espalhar para outras colonias ou especies.",
      "Elfos precisam de magisita, mineral magico das minas controladas por formigas. A tensao entre elfos e formigas e antiga, e ataques pequenos podem escalar para guerra.",
      "Aranhas funcionam como intermediarias comerciais entre elfos e formigas. Pii'treb, enviado aranha, esta escondido e pode virar aliado politico se resgatado.",
      "Frentes: Colonia Infectada leva a pestilencia; Vantagem Elfica pode levar a caos caso o conselho use o fungo como arma.",
      "Povoados proximos podem ser outras colonias de formigas, ninhadas de aranhas ou clas elficos. Use esses locais como consequencia de fuga, quarentena ou recompensa.",
    ],
  },
  {
    id: "nekesti-history",
    title: "Historia e segredos: Nekesti",
    source: "Confusoes em Nekesti",
    bullets: [
      "A aventura abre com linchamento: magistrado furioso, gnomo ensanguentado salvo pelos PJs e multidao exigindo sangue.",
      "Nekesti e pobre, tem populacao equilibrada, guarda templaria, madeira e graos como recursos, e juramentos com Kostromo, Nosjad e Floresta Sanguinea.",
      "A cidade trata aventureiros como mal local. Use isso para justificar boatos, vigilancia, pessoas fechando janelas e julgamentos publicos.",
      "A residencia do magistrado e um mapa de investigacao: escritorio preparado para festa vazia, galeria de ancestrais, estabulos com velocipede, biblioteca com segredos, telescopio dourado, ratos no sotao e passagem secreta.",
      "Perguntas da residencia: por que nobres querem gnomos mortos, por que ha espiritos maus na casa, para onde a passagem leva e como o nobre mataria todos os gnomos.",
      "Rumores de rua podem puxar templarios recrutando, engenheiro gnomo emboscado, chuva negra, bairro gnomico, mafia, nobres, satiros e intromissao divina.",
      "A lista de aguardando julgamento serve como sementes de campanha: fugitivos, bruxas, engenheiros, escravagistas, elfos coagidos, templarios traidores e necromantes.",
      "Tesouros: bolsa de dentes que convoca guerreiros temporarios e sabre do magistrado que melhora com treino perigoso.",
    ],
  },
  {
    id: "nemfalla-history",
    title: "Historia e segredos: Desfiladeiro de Nemfalla",
    source: "Desfiladeiro de Nemfalla",
    bullets: [
      "As cavernas sob Nemfalla sao disputadas por gnomos e kobolds desde o surgimento dos gnomos.",
      "O grupo comeca tres andares abaixo, no sambaqui ogro, encontrando os restos de Ludekai Chaeron, que deveriam resgatar.",
      "Vh'orr chega com cavalo inconsciente nas costas; e uma pressao inicial para acao imediata, fuga, negociacao ou combate.",
      "Gnomos Bobinas Lampejantes querem tomar controle do desfiladeiro. Kobolds Luz de Velas consideram luz, especialmente velas, sagrada.",
      "Chaeron esta morto, mas seu espirito usa o conflito para tentar trazer uma consciencia antiga e maligna de volta ao plano.",
      "Elementos de cena: carrinho de mina, feno molhado, calor das profundezas, riso em corredor lateral, eletricidade gnomica, sangue e penas amarelas, ar rarefeito e bulbos tremeluzentes.",
      "Frente: guerra subterranea. Pressagios: guerra sangrenta por territorio, Vh'orr aniquila povoado gnomo, kobolds cercam enclave, gnomos encaram exilio.",
      "Regras especiais: orientar-se apos desmoronamento usa SAB; montar carrinho de mina usa CON; usar flor luminosa contra kobolds pode ser heresia grave.",
    ],
  },
  {
    id: "dw-zine-guidance",
    title: "Mestragem sensivel e ancestralidade",
    source: "DW Mais Zine",
    bullets: [
      "Evite tratar povos fantasticos como blocos fixos de comportamento, moralidade ou capacidade. Cultura, especie, etnia, memoria e tradicao podem ser combinadas com liberdade.",
      "Ao criar povos e cidades, prefira historias, praticas espirituais, tecnologia, ambiente, conflitos e escolhas politicas em vez de bonus raciais deterministas.",
      "Cidades podem ser multirraciais e complexas. Nao prenda anoes apenas ao subterraneo, elfos apenas a florestas ou orcs apenas a violencia.",
      "Movimentos de ancestralidade podem substituir movimentos de raca: o jogador escolhe herancas e ganha dominio para ativar movimentos ligados a sangue, tradicao, treinamento ou memoria.",
      "Use perguntas para enriquecer origem sem reduzir personagem: quem ensinou essa pratica, quem a considera monstruosa, que memoria sua familia protege, que tabu sua tradicao carrega.",
    ],
  },
];

export const monsterReferences: MonsterReference[] = [
  {
    id: "molekh",
    name: "Molekh, o Ceifador",
    source: "O Forte de Altai",
    tags: ["Solitario", "Grande", "Inteligente"],
    hp: 18,
    armor: 1,
    damage: "Foice manchada 1d10+2, alcance, grotesca",
    instinct: "Ver inimigos caidos diante de si.",
    moves: [
      "Atropelar inimigos sob os cascos.",
      "Exigir tributos dos derrotados.",
      "Fazer acordo para ganhar mais poder.",
    ],
    notes:
      "Use como chefe fisico e politico. Sua investida pode ser redirecionada com rolagem de CON quando a cena permitir.",
  },
  {
    id: "deanera",
    name: "Princesa Deanera",
    source: "O Forte de Altai",
    tags: ["Solitaria", "Inteligente", "Terrivel", "Mesquinha"],
    hp: 15,
    armor: 2,
    damage: "Rajada do caos m[d10], poderosa, ignora armadura",
    instinct: "Viver luxuosamente.",
    moves: [
      "Roubar essencia: sangue, magia ou emocao.",
      "Amaldicoar com fragilidade, furia ou estupidez.",
      "Invocar lacaios mortos-vivos.",
    ],
  },
  {
    id: "minotauro-carnical",
    name: "Minotauro Carnical",
    source: "O Forte de Altai",
    tags: ["Grupo", "Grande", "Morto-vivo"],
    hp: 12,
    armor: 0,
    damage: "Chifres e garras 1d8+1, alcance",
    instinct: "Destruir em nome dos mestres.",
    moves: ["Mugir um grito selvagem.", "Danificar algo delicado."],
  },
  {
    id: "kalareth",
    name: "Magistrado Kalareth",
    source: "Confusoes em Nekesti",
    tags: ["Solitario", "Inteligente", "Traicoeiro"],
    hp: 15,
    armor: 2,
    damage: "Pior surra da vida p[2d4]",
    instinct: "Consolidar seu poder.",
    moves: [
      "Voltar o povo contra inimigos.",
      "Desaparecer na multidao.",
      "Convocar o exercito dentado quando encurralado.",
    ],
  },
  {
    id: "guarda-templario",
    name: "Guarda Templario",
    source: "Confusoes em Nekesti",
    tags: ["Horda", "Templario"],
    hp: 3,
    armor: 1,
    damage: "Porretes de ferro 1d6",
    instinct: "Esconjurar pecadores.",
    moves: ["Seguir ordens dos justos.", "Julgar ou queimar uma bruxa."],
  },
  {
    id: "exercito-dentado",
    name: "Exercito Dentado",
    source: "Confusoes em Nekesti",
    tags: ["Grupo", "Arcano", "Convocado"],
    hp: 6,
    armor: 0,
    damage: "Laminas mordedoras 1d6, 1 penetrante",
    instinct: "Servir quem segura a bolsa.",
    moves: [
      "Seguir comandos simples.",
      "Assumir forma dos dentes usados no ritual.",
    ],
  },
  {
    id: "skumm",
    name: "Skumm, o Rei dos Ratos",
    source: "Confusoes em Nekesti",
    tags: ["Pequeno", "Solitario", "Mesquinho", "Cuidadoso"],
    hp: 3,
    armor: 4,
    damage: "Dentões p[2d10]",
    instinct: "Reinar sobre as pragas.",
    moves: [
      "Convocar sequito de ratos.",
      "Deslizar para local seguro.",
      "Aceitar oferta de riqueza, comida ou lealdade.",
    ],
  },
  {
    id: "vhorr",
    name: "Vh'orr, o Voraz",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Solitario", "Enorme", "Inteligente", "Organizado", "Terrivel"],
    hp: 9,
    armor: 4,
    damage: "Cutelo gigante 1d10, alcance, grotesco",
    instinct: "Esmagar, comer, esmagar e comer.",
    moves: [
      "Arrancar um pedaco com mordida.",
      "Amaciar o oponente-almoco.",
      "Atravessar rocha solida.",
      "Voltar depois de ter morrido.",
    ],
  },
  {
    id: "chaeron",
    name: "Chaeron",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Solitario", "Inteligente", "Arcano", "Incorporeo"],
    hp: 18,
    armor: 0,
    damage: "Frio sepulcral 1d8, distante, ignora armadura",
    instinct: "Invocar mais demonios das profundezas.",
    moves: [
      "Enganar ou zombar dos viajantes.",
      "Tentar mortais com sussurros sombrios.",
      "Abrir uma fenda para o vazio das profundezas.",
    ],
  },
  {
    id: "ipmeek",
    name: "Ipmeek Luta e Morde",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Pequeno", "Solitario", "Organizado", "Traicoeiro"],
    hp: 12,
    armor: 3,
    damage: "Morde-queixo m[2d8], grotesco",
    instinct: "Reivindicar trofeus dos caidos.",
    moves: [
      "Esperar escondido como pilha de lixo velho.",
      "Usar a escuridao em seu beneficio.",
      "Atacar com ferocidade incomum.",
    ],
  },
  {
    id: "guardioes-fagulha",
    name: "Guardioes da Fagulha Kobolds",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Pequenos", "Solitarios", "Organizados"],
    hp: 6,
    armor: 1,
    damage: "Vela em haste 1d4, alcance, 1 penetrante",
    instinct: "Proteger a luz.",
    moves: [
      "Iluminar um local.",
      "Queimar objeto ou pessoa.",
      "Fugir se a luz sagrada estiver ameacada.",
    ],
  },
  {
    id: "tocados-escuridao",
    name: "Tocados pela Escuridao",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Horda", "Pequeno", "Organizado"],
    hp: 3,
    armor: 0,
    damage: "Ataque aterrorizado p[2d6]",
    instinct: "Cambalear em direcao ao perigo.",
    moves: [
      "Balbuciar de maneira incompreensivel.",
      "Fugir de ajuda ou comunicacao.",
      "Andar cegamente para perigo maior.",
    ],
  },
  {
    id: "canarios",
    name: "Ninhada de Canarios",
    source: "Desfiladeiro de Nemfalla",
    tags: ["Grupo", "Grande", "Aterrorizante", "Mesquinho"],
    hp: 9,
    armor: 0,
    damage: "Graa  m[2d8], alcance",
    instinct: "Acumular comida e proteger o ninho.",
    moves: [
      "Cantar docemente.",
      "Mergulhar vindo de cima.",
      "Voar para longe com comida.",
      "Voar alto onde o ar e ruim.",
    ],
  },
  {
    id: "formigas-infectadas",
    name: "Formigas Infectadas",
    source: "O Formigueiro Infectado",
    tags: ["Horda", "Doentes", "Zigurate"],
    hp: 6,
    armor: 1,
    damage: "Mandibulas e peso do enxame 1d6",
    instinct: "Espalhar a infeccao da colonia.",
    moves: [
      "Cambalear em massa pelo corredor sul.",
      "Bloquear uma rota com corpos e esporos.",
      "Levar alguem para perto do fungo ou da rainha.",
    ],
    notes:
      "Valores adaptados para uso rapido, pois a aventura enfatiza impressões, infeccao e pressao ficcional.",
  },
  {
    id: "piitreb",
    name: "Pii'treb, enviado aranha",
    source: "O Formigueiro Infectado",
    tags: ["PNJ", "Aranha", "Mercador"],
    hp: 6,
    armor: 0,
    damage: "Presa curta 1d4",
    instinct: "Sobreviver e voltar a ninhada.",
    moves: [
      "Oferecer abrigo ou recompensa futura.",
      "Negociar em nome das aranhas.",
      "Revelar relacoes entre elfos, formigas e comercio.",
    ],
  },
];
