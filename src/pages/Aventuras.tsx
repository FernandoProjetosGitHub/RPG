import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MapSvg } from "../components/AdventureMapsDialog";
import PublicPageShell from "../components/public/PublicPageShell";
import type { PublicView } from "../components/public/PublicPageShell";
import { adventureMaps } from "../data/adventureMaps";

type PlayerCount = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type EncounterKind = "start" | "npc" | "danger" | "mystery" | "choice" | "reward";

type EncounterNode = {
  id: string;
  label: string;
  kind: EncounterKind;
  x: number;
  y: number;
  note: string;
};

type SceneBeat = {
  title: string;
  location: string;
  readAloud: string;
  gmGuidance: string;
  forSeven: string;
  lowerPlayerReserve: string;
  pressure: number;
  decisions: string[];
};

type AdventureThreat = {
  name: string;
  role: string;
  stats: string;
  instinct: string;
  moves: string[];
};

type AdventureNpc = {
  name: string;
  role: string;
  useAtTable: string;
};

type AdventureGuide = {
  id: string;
  title: string;
  source: string;
  mapId: string;
  accent: string;
  tone: string;
  format: string;
  baseDangerBudget: number;
  premise: string;
  start: string;
  objectives: string[];
  fronts: string[];
  stakes: string[];
  gmPrinciples: string[];
  customMoves: string[];
  npcs: AdventureNpc[];
  threats: AdventureThreat[];
  scenes: SceneBeat[];
  branches: string[];
  rewards: string[];
  nodes: EncounterNode[];
  links: Array<[string, string]>;
};

const playerCounts: PlayerCount[] = [7, 6, 5, 4, 3, 2, 1];

const encounterStyles: Record<
  EncounterKind,
  { label: string; fill: string; stroke: string }
> = {
  start: { label: "inicio", fill: "#24706d", stroke: "#9ee8dd" },
  npc: { label: "PNJ", fill: "#5f7f4f", stroke: "#d8efbd" },
  danger: { label: "perigo", fill: "#8f2637", stroke: "#ffb2b8" },
  mystery: { label: "misterio", fill: "#7f6fd9", stroke: "#d8d1ff" },
  choice: { label: "decisao", fill: "#c59b4b", stroke: "#f7edd9" },
  reward: { label: "recompensa", fill: "#5fb6c4", stroke: "#dff7ff" },
};

// A tabela abaixo e a regra de escala da pagina. O app sempre escreve a
// aventura para 7 jogadores, depois calcula quanta pressao deve sobrar quando
// a mesa tem menos gente. Para ajustar depois, mude somente multiplicador e
// nota; todos os cards recalculam automaticamente.
const playerScale: Record<
  PlayerCount,
  {
    multiplier: number;
    label: string;
    simultaneous: string;
    reserve: string;
  }
> = {
  7: {
    multiplier: 1,
    label: "mesa cheia",
    simultaneous: "3 pressoes simultaneas",
    reserve:
      "Use a cena completa: ameaca principal, reforcos menores e perigo ambiental ao mesmo tempo.",
  },
  6: {
    multiplier: 0.88,
    label: "quase cheia",
    simultaneous: "2 a 3 pressoes",
    reserve:
      "Remova 1 inimigo menor ou atrase um reforco ate alguem falhar uma rolagem.",
  },
  5: {
    multiplier: 0.74,
    label: "grupo forte",
    simultaneous: "2 pressoes",
    reserve:
      "Corte 2 inimigos menores, reduza uma horda ou deixe o ambiente como aviso antes de dano.",
  },
  4: {
    multiplier: 0.6,
    label: "grupo classico",
    simultaneous: "1 a 2 pressoes",
    reserve:
      "Use uma ameaca principal por cena; reforcos entram so quando o grupo ignora perigo claro.",
  },
  3: {
    multiplier: 0.45,
    label: "grupo pequeno",
    simultaneous: "1 pressao",
    reserve:
      "Troque hordas por obstaculos, fuga, negociacao ou uma criatura ferida com objetivo claro.",
  },
  2: {
    multiplier: 0.32,
    label: "dupla",
    simultaneous: "1 pressao leve",
    reserve:
      "Transforme combate longo em duelo, perseguicao ou roubo de objetivo; evite duas lutas seguidas.",
  },
  1: {
    multiplier: 0.2,
    label: "solo",
    simultaneous: "1 pressao narrativa",
    reserve:
      "Trate encontros como cena dramatica: um inimigo, uma escolha, uma saida e consequencia clara.",
  },
};

// Dados jogaveis das aventuras. Cada bloco fica isolado por PDF para evitar
// misturar monstros, PNJs ou locais de materiais diferentes.
const adventures: AdventureGuide[] = [
  {
    id: "nekesti",
    title: "Confusoes em Nekesti",
    source: "Confusoes em Nekesti",
    mapId: "nekesti",
    accent: "#c59b4b",
    tone: "intriga urbana, perseguicao religiosa e investigacao assombrada",
    format:
      "Comeco em midias res, depois investigacao aberta na cidade e na residencia Kalareth.",
    baseDangerBudget: 14,
    premise:
      "Nekesti coloca os personagens diante de um linchamento publico. O magistrado Kalareth tenta transformar medo popular em poder politico, enquanto templarios, gnomos e uma casa cheia de segredos empurram a mesa para escolhas morais rapidas.",
    start:
      "Abra na praca: um gnomo ferido acabou de ser salvo ou interrompido, a multidao exige sangue e Kalareth tenta virar a cidade contra os herois.",
    objectives: [
      "Proteger o gnomo acusado sem transformar toda a praca em massacre.",
      "Descobrir por que Kalareth e as familias nobres querem os gnomos mortos.",
      "Explorar a residencia do magistrado para encontrar provas, passagem secreta e origem dos espiritos.",
      "Decidir se a verdade sera exposta publicamente, entregue aos templarios ou usada para negociar a paz.",
    ],
    fronts: [
      "Kalareth consolida poder usando medo, julgamento e a multidao.",
      "Os templarios seguem a aparencia da virtude, mesmo quando ela protege injustica.",
      "A residencia guarda rancores antigos que podem apagar provas ou atacar testemunhas.",
    ],
    stakes: [
      "A cidade vai escolher justica, vinganca ou conveniencia?",
      "Os gnomos serao protegidos, expulsos ou usados como bode expiatorio?",
      "A passagem secreta leva a fuga de Kalareth, a provas ou a uma ameaca maior?",
    ],
    gmPrinciples: [
      "Mostre Nekesti como apertada: gente demais, ruas estreitas, janelas fechando e boatos se espalhando.",
      "Nao trate a multidao como monstro sem rosto; de a ela medo, fome, raiva e alguem manipulando tudo.",
      "Use a residencia como investigacao assombrada: cada sala revela uma pergunta, nao uma resposta pronta.",
    ],
    customMoves: [
      "Quando alguem ouvir seu nome sussurrado e confrontar o problema, role+CAR: 10+ permite uma pergunta ao sussurrador; 7-9 tambem, mas atrai atencao indesejada; 6- entrega o personagem a rumor, acusacao ou cerco.",
      "Quando a multidao fechar passagem, resolva como Desafiar Perigo. Em 7-9, escolha entre perder tempo, abandonar alguem ou aceitar dano/roubo.",
    ],
    npcs: [
      {
        name: "Magistrado Kalareth",
        role: "vilao social e politico",
        useAtTable:
          "Ele nao precisa vencer no braco; ele vence quando faz a cidade acreditar que os herois sao o problema.",
      },
      {
        name: "Gnomo acusado",
        role: "estopim da primeira cena",
        useAtTable:
          "Use-o para humanizar a disputa: ele sabe uma pista, mas esta machucado, com medo e cercado.",
      },
      {
        name: "Mordomo da residencia",
        role: "porta viva para a casa",
        useAtTable:
          "Ele treme porque sabe que a casa nao esta vazia. Pode mentir por lealdade, medo ou culpa.",
      },
      {
        name: "Skumm, Rei dos Ratos",
        role: "perigo estranho do sotao",
        useAtTable:
          "Ele pode aceitar oferta de comida, riqueza ou lealdade. Bom para mostrar que nem todo perigo pede espada.",
      },
    ],
    threats: [
      {
        name: "Guarda Templario",
        role: "horda de ordem religiosa",
        stats: "3 PV, armadura 1, porretes 1d6 corpo a corpo",
        instinct: "Esconjurar pecadores.",
        moves: [
          "Seguir ordens dos justos e virtuosos.",
          "Julgar ou queimar uma bruxa.",
          "Bloquear fuga em nome da fe.",
        ],
      },
      {
        name: "Magistrado Kalareth",
        role: "solitario, inteligente e traicoeiro",
        stats: "15 PV, armadura 2, p[2d4] corpo a corpo",
        instinct: "Consolidar seu poder.",
        moves: [
          "Voltar o povo contra seus inimigos.",
          "Desaparecer na multidao.",
          "Convocar o exercito dentado se encurralado.",
        ],
      },
      {
        name: "Exercito Dentado",
        role: "grupo arcano",
        stats: "6 PV, armadura 0, laminas 1d6, 1 penetrante",
        instinct: "Servir quem segurar a bolsa.",
        moves: [
          "Seguir comando simples.",
          "Assumir forma de dentes convocados.",
          "Guardar passagem ou prova importante.",
        ],
      },
      {
        name: "Ancestral Espectral",
        role: "grupo grande e insubstancial",
        stats: "9 PV, armadura 0, toque d8",
        instinct: "Garantir a santidade de seu povo.",
        moves: [
          "Voltar o ambiente contra o grupo.",
          "Tornar uma visao do passado realidade.",
        ],
      },
      {
        name: "Armadilha Ornamental do Observatorio",
        role: "armadilha solitaria",
        stats: "6 PV, armadura 2, raios d10, ignora armadura",
        instinct: "Destruir testemunhas e evidencias.",
        moves: [
          "Transformar a sala em cinzas.",
          "Forcar escolha entre prova e seguranca.",
        ],
      },
    ],
    scenes: [
      {
        title: "Linchamento a moda antiga",
        location: "Praca da fogueira",
        readAloud:
          "A multidao empurra o grupo contra calor, ferro e acusacoes. Um gnomo sangra no chao, Kalareth treme de furia e cada janela aberta parece escolher um lado.",
        gmGuidance:
          "Comece perguntando como os herois sabiam que o gnomo era inocente e por que nao confiam em Kalareth.",
        forSeven:
          "Use multidao, 2 blocos de guardas templarios, Kalareth discursando e um acidente de carroca ou fogo subindo.",
        lowerPlayerReserve:
          "Com 4 ou menos, deixe a multidao como obstaculo narrativo e use apenas guardas suficientes para pressionar saidas.",
        pressure: 5,
        decisions: [
          "Resgatar o gnomo em publico ou tirar ele dali em segredo?",
          "Debater com Kalareth ou expor sua violencia?",
          "Proteger civis quando a cena piorar ou correr atras do responsavel?",
        ],
      },
      {
        title: "Ruas, rumores e bairro gnomico",
        location: "Novo Bairro Gnomico",
        readAloud:
          "Sucata, bancas fechadas e olhos inchados acompanham os personagens. Em cada esquina alguem sabe algo, mas ninguem quer ser o proximo na fogueira.",
        gmGuidance:
          "Use Falar Dificil, Discernir Realidades e Parlamentar. Dê pistas para residencia, bolsa de dentes, passagem ou observatorio.",
        forSeven:
          "Divida o grupo entre tres pistas: templarios, gnomos e nobres. Cada pista sofre uma pressao diferente.",
        lowerPlayerReserve:
          "Com grupo menor, entregue uma pista forte por cena e evite separar personagens sem consentimento claro.",
        pressure: 3,
        decisions: [
          "Buscar provas legais ou aliados populares?",
          "Confiar nos gnomos que acumulam sucata?",
          "Apostar na ajuda templaria mesmo sabendo que eles tem medo da casa?",
        ],
      },
      {
        title: "Residencia do magistrado",
        location: "Casa Kalareth",
        readAloud:
          "O velho casarao cheira a vomito doce, carpete recem-limpo e festa que nunca aconteceu. O mordomo nao se move, mas sua testa denuncia panico.",
        gmGuidance:
          "Trate cada sala como pergunta: escritorio, galeria, estabulos, biblioteca, sotao, armario grande e passagem secreta.",
        forSeven:
          "Use dois focos simultaneos: um grupo investiga a biblioteca enquanto outro segura ancestral espectral, ratos ou armadilha.",
        lowerPlayerReserve:
          "Com 3 ou menos, transforme a casa em tensao de escolhas e coloque um unico perigo ativo por vez.",
        pressure: 6,
        decisions: [
          "Interrogar o mordomo ou seguir a porta que abriu sozinha?",
          "Salvar prova do fogo arcano ou salvar alguem preso?",
          "Entrar na passagem secreta agora ou terminar a busca?",
        ],
      },
      {
        title: "Kalareth encurralado",
        location: "Passagem secreta ou praca",
        readAloud:
          "Quando a verdade chega perto, Kalareth para de parecer autoridade e vira sobrevivente. A bolsa de dentes pesa na mao dele como uma sentenca.",
        gmGuidance:
          "Nao faca chefe final obrigatorio. Ele pode fugir, negociar, usar multidao, invocar dentes ou ser entregue a justica.",
        forSeven:
          "Use Kalareth, Exercito Dentado e uma pressao social: guardas chegando, povo assistindo ou casa pegando fogo.",
        lowerPlayerReserve:
          "Com menos de 5, use o Exercito Dentado como obstaculo curto e foque a escolha publica sobre o destino dele.",
        pressure: 5,
        decisions: [
          "Prender, expor, exilar ou executar Kalareth?",
          "Entregar as provas aos templarios ou aos gnomos?",
          "Salvar a cidade de si mesma ou deixar que ela escolha?",
        ],
      },
    ],
    branches: [
      "Se os jogadores salvam o gnomo sem matar guardas, a cidade fica dividida e investigavel.",
      "Se matam templarios em publico, Nekesti vira caca urbana e Kalareth ganha narrativa de martir.",
      "Se entram primeiro na residencia, a praca vira relogio: a execucao ou julgamento continua sem eles.",
      "Se negociam com Kalareth, exija prova publica, refem ou promessa concreta; ele nao confia em heroismo.",
    ],
    rewards: [
      "Provas contra Kalareth, favor do bairro gnomico ou acesso a engenhocas.",
      "Bolsa de dentes como item perigoso, se a mesa aceitar lidar com seus comandos simples.",
      "Aliados urbanos para futuras viagens a Kostromo, Nosjad ou outras regioes de Mirkasa.",
    ],
    nodes: [
      {
        id: "square",
        label: "Praca",
        kind: "start",
        x: 16,
        y: 32,
        note: "linchamento, fogueira e primeira decisao publica",
      },
      {
        id: "templars",
        label: "Templarios",
        kind: "danger",
        x: 32,
        y: 18,
        note: "bloqueiam saidas e amplificam acusacoes",
      },
      {
        id: "gnomes",
        label: "Bairro gnomo",
        kind: "npc",
        x: 35,
        y: 47,
        note: "rumores, ajuda tecnica e medo de represalia",
      },
      {
        id: "house",
        label: "Residencia",
        kind: "mystery",
        x: 58,
        y: 30,
        note: "salas assombradas e provas contra Kalareth",
      },
      {
        id: "observatory",
        label: "Observatorio",
        kind: "danger",
        x: 76,
        y: 18,
        note: "armadilha de luz e evidencia em risco",
      },
      {
        id: "passage",
        label: "Passagem",
        kind: "choice",
        x: 78,
        y: 45,
        note: "fuga, confronto ou prova secreta",
      },
    ],
    links: [
      ["square", "templars"],
      ["square", "gnomes"],
      ["gnomes", "house"],
      ["house", "observatory"],
      ["house", "passage"],
    ],
  },
  {
    id: "nemfalla",
    title: "Desfiladeiro de Nemfalla",
    source: "Desfiladeiro de Nemfalla",
    mapId: "nemfalla",
    accent: "#5fb6c4",
    tone: "exploracao vertical, guerra subterranea e horror de perseguidor",
    format:
      "Inicio preso no subsolo, depois escolhas abertas entre fuga, guerra gnomo-kobold e Vh'orr.",
    baseDangerBudget: 15,
    premise:
      "O grupo esta tres andares abaixo da superficie, no centro de um sambaqui ogro, com os restos de Ludekai Chaeron e um ogro faminto prestes a perceber os intrusos. A guerra entre gnomos Bobinas Lampejantes e kobolds Luz de Velas torna cada rota uma escolha politica.",
    start:
      "Abra com Vh'orr bloqueando a saida, um cavalo inconsciente preso as costas dele, ossos por todos os lados e uma luz azul fraca vindo de buracos no chao.",
    objectives: [
      "Sobreviver ao primeiro encontro com Vh'orr sem perder o caminho para a superficie.",
      "Decidir como lidar com a morte de Ludekai Chaeron e com o que ele deixou para tras.",
      "Entender ou encerrar a guerra entre gnomos e kobolds sem assumir que um lado e simples vilao.",
      "Encontrar uma rota de saida ou uma nova razao para descer ainda mais.",
    ],
    fronts: [
      "A guerra subterranea consome territorio, recursos e memoria.",
      "Vh'orr transforma qualquer pausa em risco de ser encontrado.",
      "Chaeron continua relevante por sussurros, magia negra e acordos que ninguem quer admitir.",
    ],
    stakes: [
      "Qual acordo os gnomos selaram com Chaeron?",
      "Os gnomos participaram da criacao das criaturas mutantes do desfiladeiro?",
      "Quantas perdas os dois lados sofrerão antes de alguem encerrar a guerra?",
    ],
    gmPrinciples: [
      "Use altura como personagem: luz distante acima, calor abaixo, ar ruim e trilhos que conectam lugares errados.",
      "Vh'orr nao e encontro unico. Ele e pressao recorrente: som, buraco novo, parede que racha, cutelo arrastando.",
      "Os kobolds veneram luz; os gnomos veneram engenhosidade. Faça as duas culturas parecerem jogaveis.",
    ],
    customMoves: [
      "Quando Vh'orr tiver 'morrido' e a mesa se distrair com outra coisa, role+SAB. 10+: ele vira em breve e voce sabe de onde; 7-9: ele vira em breve, mas ha duas direcoes possiveis; 6-: ele sai da parede bem na frente.",
      "Quando preparar acampamento ou iniciar sessao com Ozzy, Felix e Sassi, role+CAR. 10+: dominio 3; 7-9: dominio 2; 6-: dominio 2 para os jogadores e dominio 2 para o MJ gastar em complicacoes dos gnomos.",
    ],
    npcs: [
      {
        name: "Ozzy, Felix e Sassi Bobinas Lampejantes",
        role: "companheiros gnomos",
        useAtTable:
          "Eles criam vantagem, equipamento, distracao e caos. Use-os como apoio com preco, nao como solucao automatica.",
      },
      {
        name: "Ipmeek Luta e Morde",
        role: "campeao kobold",
        useAtTable:
          "Ele transforma trofeus em identidade. Pode emboscar, negociar por honra ou provar que os kobolds tem memoria.",
      },
      {
        name: "Ludekai Chaeron",
        role: "morto que ainda move a aventura",
        useAtTable:
          "Faca perguntas sobre caridade, corrupcao, rito funerario e sinais de magia negra antes de explicar demais.",
      },
    ],
    threats: [
      {
        name: "Vh'orr, o Voraz",
        role: "solitario, enorme, inteligente, organizado, terrivel",
        stats: "9 PV, armadura 4, cutelo d10, alcance, grotesco",
        instinct: "Esmagar, comer e repetir.",
        moves: [
          "Arrancar um pedaco com uma mordida.",
          "Atravessar rocha solida.",
          "Voltar depois de ter morrido.",
        ],
      },
      {
        name: "Ninhada de 'Canarios'",
        role: "grupo grande, aterrorizante e mesquinho",
        stats: "9 PV, ataque m[2d8], alcance",
        instinct: "Acumular comida e proteger o ninho.",
        moves: [
          "Cantar docemente.",
          "Mergulhar vindo de cima.",
          "Voar com comida para o ninho.",
        ],
      },
      {
        name: "Guardioes-da-Fagulha Kobolds",
        role: "pequenos, solitarios e organizados",
        stats: "6 PV, armadura 1, vela em haste d4, alcance, 1 penetrante",
        instinct: "Proteger a luz.",
        moves: [
          "Iluminar um local.",
          "Queimar objeto ou pessoa.",
          "Fugir se a luz sagrada for ameacada.",
        ],
      },
      {
        name: "Tocados pela Escuridao",
        role: "horda pequena e organizada",
        stats: "3 PV, ataque p[2d6] corpo a corpo",
        instinct: "Cambalear rumo ao perigo.",
        moves: [
          "Balbuciar de maneira incompreensivel.",
          "Fugir de ajuda.",
          "Levar alguem a perigo ainda maior.",
        ],
      },
    ],
    scenes: [
      {
        title: "Sambaqui ogro",
        location: "Tres andares abaixo",
        readAloud:
          "O chao e osso, o ar cheira a feno molhado e carne velha. Vh'orr ainda nao viu voces, mas a luz azul tremula no corte do cutelo.",
        gmGuidance:
          "Pergunte o que ouviram sobre o apetite do ogro e por que Chaeron precisava ser resgatado.",
        forSeven:
          "Use Vh'orr, cavalo inconsciente, gnomos tentando ajudar e risco de desmoronamento ou trilho rangendo.",
        lowerPlayerReserve:
          "Com 3 ou menos, faca Vh'orr bloquear a saida e force escolha de fuga, barganha ou distracao, nao luta direta.",
        pressure: 6,
        decisions: [
          "Salvar o cavalo ou escapar sem fazer barulho?",
          "Enfrentar Vh'orr agora ou marcar rota para embosca-lo depois?",
          "Levar os restos de Chaeron ou deixar o morto para tras?",
        ],
      },
      {
        title: "Trilhos e luzes rivais",
        location: "Rotas gnomicas e kobolds",
        readAloud:
          "Um carrinho de mina range sozinho. A esquerda, bulbos eletricos tremem; a direita, velas pequenas iluminam trofeus feitos de engrenagens.",
        gmGuidance:
          "Deixe os jogadores escolherem qual cultura entender primeiro. Ambas tem razoes para desconfiar.",
        forSeven:
          "Rode diplomacia e perigo ao mesmo tempo: gnomos pedem ajuda tecnica enquanto kobolds armam tocaia.",
        lowerPlayerReserve:
          "Com 4 ou menos, use uma unica patrulha e uma chance real de conversa antes do combate.",
        pressure: 4,
        decisions: [
          "Apagar uma vela sagrada para escapar?",
          "Entregar tecnologia gnoma aos kobolds em troca de passagem?",
          "Prometer territorio sem saber a historia inteira?",
        ],
      },
      {
        title: "Fenda de Chaeron",
        location: "Escuro vivo",
        readAloud:
          "O nome de Chaeron volta em sussurros que nao fazem eco. Cada personagem ouve uma versao diferente do proprio medo.",
        gmGuidance:
          "Pergunte quais sinais de magia negra eles notaram e quem ainda quer cumprir um rito pelo morto.",
        forSeven:
          "Combine sussurros, Tocados pela Escuridao e risco de Vh'orr reaparecer quando todos olham para baixo.",
        lowerPlayerReserve:
          "Com menos de 5, use a fenda como decisao moral e guarde monstros para consequencias de falha.",
        pressure: 5,
        decisions: [
          "Fechar a fenda ou usar seu poder contra Vh'orr?",
          "Contar aos gnomos o que Chaeron fez?",
          "Responder honestamente ao maior medo que a voz pergunta?",
        ],
      },
      {
        title: "Saida ou guerra",
        location: "Luz da superficie",
        readAloud:
          "La em cima existe ar frio e mundo aberto. Aqui embaixo, alguem ainda vai perder casa, luz ou familia se voces forem embora agora.",
        gmGuidance:
          "Nao exija resolver tudo. Dungeon World funciona bem quando a saida custa uma pendencia interessante.",
        forSeven:
          "Use tres relogios: Vh'orr retornando, kobolds pressionando e gnomos pedindo decisao final.",
        lowerPlayerReserve:
          "Com 2 ou 1, encerre com escolha clara e consequencia; deixe a guerra como frente futura.",
        pressure: 4,
        decisions: [
          "Subir agora ou ficar para negociar cessar-fogo?",
          "Deixar Vh'orr preso, morto ou livre para outro lado?",
          "Qual mentira sobre Chaeron sera levada a superficie?",
        ],
      },
    ],
    branches: [
      "Se os jogadores se aliam aos gnomos, kobolds viram guardioes do territorio e nao monstros aleatorios.",
      "Se tratam com kobolds, gnomos podem acusar traicao e gastar dominio contra eles.",
      "Se matam Vh'orr cedo, use o movimento de retorno para manter medo sem negar a vitoria.",
      "Se fogem sem lidar com Chaeron, a fenda vira pressagio para outra sessao.",
    ],
    rewards: [
      "Favor dos Bobinas Lampejantes: equipamentos improvisados, bandagens ou distracoes.",
      "Trégua com Luz de Velas: passagem segura por areas iluminadas.",
      "Tesouros de ninho, minerio e historias suficientes para mudar reputacao na superficie.",
    ],
    nodes: [
      {
        id: "midden",
        label: "Sambaqui",
        kind: "start",
        x: 18,
        y: 34,
        note: "comece cercado por ossos, Vh'orr e cavalo inconsciente",
      },
      {
        id: "vhorr",
        label: "Vh'orr",
        kind: "danger",
        x: 34,
        y: 17,
        note: "perseguidor recorrente, nao apenas combate",
      },
      {
        id: "gnomes",
        label: "Bobinas",
        kind: "npc",
        x: 43,
        y: 48,
        note: "engenhocas, dominio e complicacoes",
      },
      {
        id: "kobolds",
        label: "Velas",
        kind: "choice",
        x: 63,
        y: 28,
        note: "luz sagrada, trofeus e fronteira territorial",
      },
      {
        id: "chaeron",
        label: "Chaeron",
        kind: "mystery",
        x: 74,
        y: 46,
        note: "sussurros e perguntas sobre magia negra",
      },
      {
        id: "surface",
        label: "Saida",
        kind: "reward",
        x: 85,
        y: 14,
        note: "rota para escapar ou voltar com acordo",
      },
    ],
    links: [
      ["midden", "vhorr"],
      ["midden", "gnomes"],
      ["gnomes", "kobolds"],
      ["kobolds", "chaeron"],
      ["chaeron", "surface"],
      ["vhorr", "chaeron"],
    ],
  },
  {
    id: "forte-altai",
    title: "O Forte de Altai",
    source: "O Forte de Altai",
    mapId: "forte-altai",
    accent: "#aa263d",
    tone: "fortaleza congelada, mortos-vivos minotauros e horror de retorno",
    format:
      "Exploracao de masmorra guiada por objetivos claros e escolha de rotas internas.",
    baseDangerBudget: 16,
    premise:
      "O Forte de Altai ficou abandonado desde que os templarios derrotaram os lordes minotauros. Agora pastores somem, vilas desaparecem e ha sinais de que Molekh, o Ceifador, voltou a reunir seus companheiros chifrudos.",
    start:
      "Abra em Uryl ou diante do portao congelado. O povo sabe que a montanha voltou a mugir e precisa de herois para descobrir quem retornou, recuperar a espada do Diacono Gorric e manter Molekh morto.",
    objectives: [
      "Descobrir quem retornou para o forte e com quais intencoes.",
      "Descobrir o que aconteceu com os habitantes das vilas desaparecidas.",
      "Recuperar a espada do Diacono Gorric.",
      "Garantir que Molekh e os lordes minotauros permanecam mortos.",
    ],
    fronts: [
      "O Retorno do Ceifador: Molekh recupera forca, tributos e exercito.",
      "Princesa Deanera transforma corredores frios em corte vampirica.",
      "Criptas e gelo tornam cada descanso uma chance de reforco morto-vivo.",
    ],
    stakes: [
      "Uryl sera destruida ou tera tempo de fugir?",
      "Deanera controla os minotauros ou apenas acredita controlar?",
      "A espada do Diacono Gorric purifica o mal ou espalha contaminacao?",
    ],
    gmPrinciples: [
      "Mostre frio como ameaca: tochas apagando, piso escorregadio, teto cedendo e metal colando na pele.",
      "Molekh e ambicioso; faca-o exigir tributo, acordo ou submissao antes de apenas atacar.",
      "Deanera representa luxo parasita. O forte esta morto, mas ela quer torna-lo confortavel.",
    ],
    customMoves: [
      "Quando alguem tentar redirecionar a investida de um minotauro, role+CON. Em sucesso, direcione-o para uma parede, inimigo ou alvo proximo; com 10+, tambem evita tomar dano.",
      "Quando o vento frio apagar tochas, pergunte quem segura a luz e que coisa importante ficou invisivel por um instante.",
    ],
    npcs: [
      {
        name: "Habitantes de Uryl",
        role: "povoado em risco",
        useAtTable:
          "Use pastores, leite de ibex, vigias cansados e nomes de desaparecidos para dar peso antes do forte.",
      },
      {
        name: "Princesa Deanera",
        role: "sacerdotisa vampirica e manipuladora",
        useAtTable:
          "Ela quer viver luxuosamente e roubar essencia. Pode oferecer acordo se os herois servirem melhor que seus lacaios.",
      },
      {
        name: "Diacono Gorric",
        role: "legado templario congelado",
        useAtTable:
          "O corpo e a espada sao prova, tentacao e ferramenta. Retirar a lamina deve ter custo ou pressagio.",
      },
    ],
    threats: [
      {
        name: "Molekh, o Ceifador",
        role: "solitario, grande e inteligente",
        stats: "18 PV, armadura 1, foice 1d10+2, alcance, grotesca",
        instinct: "Ver seus inimigos caidos diante de si.",
        moves: [
          "Atropelar inimigos sob seus pes.",
          "Exigir tributos dos derrotados.",
          "Fazer acordo para ganhar mais poder.",
        ],
      },
      {
        name: "Princesa Deanera",
        role: "solitaria, inteligente, terrivel e mesquinha",
        stats: "15 PV, armadura 2, rajada m[d10], poderoso, ignora armadura",
        instinct: "Viver luxuosamente.",
        moves: [
          "Roubar sangue, magia ou emocao.",
          "Amaldicoar com fragilidade, furia ou estupidez.",
          "Invocar lacaios mortos-vivos.",
        ],
      },
      {
        name: "Minotauro Carnical",
        role: "grupo grande morto-vivo",
        stats: "12 PV, armadura 0, chifres e garras 1d8+1, alcance",
        instinct: "Destruir em nome dos mestres.",
        moves: [
          "Mugir um grito selvagem.",
          "Danificar algo delicado.",
          "Empurrar alguem para gelo ou cripta.",
        ],
      },
      {
        name: "Lacaio Sanguineo",
        role: "horda organizada",
        stats: "3 PV, armadura 0, talheres p[d6]",
        instinct: "Obedecer a vontade dos mestres.",
        moves: [
          "Prover sustento e entretenimento.",
          "Implorar por liberdade.",
          "Formar bloqueio com medo e obediencia.",
        ],
      },
    ],
    scenes: [
      {
        title: "Uryl e a subida",
        location: "Vila montesa",
        readAloud:
          "Entre ibex, neve e vigias sem sono, as familias contam nomes de pastores que foram para a montanha e nao voltaram.",
        gmGuidance:
          "Use Uryl para estabelecer risco humano. Pergunte quem tem parente, divida ou supersticao sobre Altai.",
        forSeven:
          "Divida tarefas: investigar desaparecidos, preparar frio, lidar com panico e rastrear pegadas.",
        lowerPlayerReserve:
          "Com 3 ou menos, entregue uma pista forte e pule preparacao longa para manter ritmo.",
        pressure: 3,
        decisions: [
          "Levar moradores como guias ou protege-los ficando sozinhos?",
          "Subir rapido antes de outro sequestro ou preparar equipamento?",
          "Prometer matar Molekh ou descobrir a verdade primeiro?",
        ],
      },
      {
        title: "Entrada, atrio e banquete impecavel",
        location: "Forte congelado",
        readAloud:
          "O portao abre para frio de tumulo. O salao de jantar esta impecavel demais; o fogo apagado e o gosto de cobre denunciam sangue recente.",
        gmGuidance:
          "Use movimentos de masmorra do PDF: salao impecavel, vento frio, teto congelado e lacaios formando bloqueio.",
        forSeven:
          "Use lacaios sanguineos, uma rota bloqueada por gelo e sinais de minotauros despertando nas criptas.",
        lowerPlayerReserve:
          "Com 4 ou menos, mantenha lacaios como pressao social e deixe minotauro como rugido distante.",
        pressure: 5,
        decisions: [
          "Ir pelas criptas, pelo salao dos convidados ou tentar abrir caminho congelado?",
          "Poupar lacaios que imploram por liberdade?",
          "Investigar sangue recente ou correr para o trono?",
        ],
      },
      {
        title: "Criptas e espada de Gorric",
        location: "Criptas / bloqueio de gelo",
        readAloud:
          "O selo da cripta parte como gelo sob martelo. Uma cabeca coroada de chifres ergue olhos mortos enquanto uma lamina templaria brilha presa no corpo congelado de Gorric.",
        gmGuidance:
          "A espada deve ser ferramenta e problema. Retira-la pode chamar mortos, revelar memoria ou contaminar quem a carrega.",
        forSeven:
          "Use minotauro carnical, teto instavel, lacaios bloqueando e escolha sobre a espada ao mesmo tempo.",
        lowerPlayerReserve:
          "Com grupo pequeno, use um minotauro ferido e o bloqueio de gelo como obstaculo principal.",
        pressure: 7,
        decisions: [
          "Arrancar a espada agora ou garantir saida primeiro?",
          "Redirecionar investida para abrir caminho?",
          "Usar a espada contaminada contra mortos-vivos?",
        ],
      },
      {
        title: "Trono de Molekh e altar da escuridao",
        location: "Trono / altar",
        readAloud:
          "Molekh nao parece faminto; parece certo. Deanera sorri como anfitria, e o altar responde aos passos como se reconhecesse donos antigos.",
        gmGuidance:
          "Deixe Molekh falar de poder e tributo. Deanera pode trair, negociar ou invocar lacaios se perder controle.",
        forSeven:
          "Use Molekh, Deanera, reforcos das criptas e altar alterando a arena em falhas.",
        lowerPlayerReserve:
          "Com menos de 5, escolha Molekh ou Deanera como foco fisico e deixe o outro como complicacao/relógio.",
        pressure: 8,
        decisions: [
          "Fazer acordo para salvar Uryl ou recusar qualquer poder do forte?",
          "Matar Deanera primeiro ou tentar quebrar controle sobre minotauros?",
          "Destruir altar, purificar ou selar para templarios?",
        ],
      },
    ],
    branches: [
      "Se os jogadores priorizam Uryl, o forte ganha tempo para preparar emboscada.",
      "Se aceitam acordo de Molekh, ele exige tributo real e testa submissao em cena.",
      "Se libertam lacaios, eles podem abrir rota ou revelar o custo dos sequestros.",
      "Se levam a espada sem purificar, transforme-a em promessa de poder e fome por massacre.",
    ],
    rewards: [
      "Foice do Ceifador, se a mesa aceitar uma arma que recompensa massacre recente.",
      "Elmo Cartografico ou Cajado Sanguineo de Deanera, com custo sombrio claro.",
      "Reputacao em Uryl, juramento com Dzhambul ou favor cauteloso da Fe Roubada.",
    ],
    nodes: [
      {
        id: "uryl",
        label: "Uryl",
        kind: "start",
        x: 12,
        y: 33,
        note: "vila, ibex e desaparecimentos",
      },
      {
        id: "gate",
        label: "Portao",
        kind: "mystery",
        x: 28,
        y: 34,
        note: "frio, pegadas e pressagio",
      },
      {
        id: "banquet",
        label: "Banquete",
        kind: "choice",
        x: 45,
        y: 18,
        note: "sangue recente e rotas internas",
      },
      {
        id: "crypts",
        label: "Criptas",
        kind: "danger",
        x: 45,
        y: 49,
        note: "minotauros despertam",
      },
      {
        id: "sword",
        label: "Gorric",
        kind: "reward",
        x: 63,
        y: 40,
        note: "espada contaminada no gelo",
      },
      {
        id: "throne",
        label: "Molekh",
        kind: "danger",
        x: 81,
        y: 25,
        note: "trono, tributo e confronto",
      },
      {
        id: "altar",
        label: "Altar",
        kind: "mystery",
        x: 84,
        y: 48,
        note: "escuridao e decisao final",
      },
    ],
    links: [
      ["uryl", "gate"],
      ["gate", "banquet"],
      ["gate", "crypts"],
      ["banquet", "sword"],
      ["crypts", "sword"],
      ["sword", "throne"],
      ["throne", "altar"],
    ],
  },
  {
    id: "formigueiro-infectado",
    title: "O Formigueiro Infectado",
    source: "O Formigueiro Infectado",
    mapId: "formigueiro-infectado",
    accent: "#7f6fd9",
    tone: "survival horror, fungo parasita e diplomacia entre especies",
    format:
      "Aventura de uma sessao: jogue o grupo no fundo do zigurate e guie pela fuga ou cura impossivel.",
    baseDangerBudget: 15,
    premise:
      "A colonia de formigas cultivava fungos para dominar trolls, mas uma cepa se espalhou para as proprias formigas. A rainha foi infectada, elfos precisam de magisita e uma aranha mercadora esta presa no meio do desastre.",
    start:
      "Comece na sala de distribuicao, cercada por lajes de minerios, vegetais embolorados, fungo imenso e operarias infectadas vindo do corredor sul.",
    objectives: [
      "Sobreviver a infestacao e impedir que a cepa saia do zigurate.",
      "Decidir se a rainha sera destruida, estudada ou usada como prova politica.",
      "Proteger, desconfiar ou confrontar Nostarion e Eleniel sobre a magisita.",
      "Resgatar Pii'treb e transformar fuga em alianca com o povo aranha.",
    ],
    fronts: [
      "A Colonia Infectada se espalha para outra colonia, especie ou regiao.",
      "A Vantagem Elfica transforma fungo secreto em arma ou moeda politica.",
      "A rainha continua nutrindo filhotes e guardas infectadas.",
    ],
    stakes: [
      "A infecção passara das formigas para outras especies?",
      "Os elfos esconderao o fungo para ganhar vantagem?",
      "Pii'treb sobrevivera para contar ao povo aranha quem ajudou?",
    ],
    gmPrinciples: [
      "Comece em acao. Explique a regra 10+, 7-9 e 6- durante o perigo, nao antes de uma palestra.",
      "Use cheiro, calor umido, esporos coloridos e corpos cambaleantes para manter pressao sensorial.",
      "A infecção e biologica e politica. Magisita, elfos, formigas e aranhas querem coisas diferentes.",
    ],
    customMoves: [
      "Na entrada com esporos, todos rolam+DES; quem tem Especialista em Armadilhas recebe +1 adiante. 10+: evita exposicao silenciosamente; 7-9: evita exposicao ou deteccao; 6-: nao evita nenhuma.",
      "Quando respirar esporos amarelos, role+CON. 10+: tosse, mas sobrevive; 7-9: passa apenas quando montar acampamento; 6-: nao passa sem ajuda medica.",
      "Quando esporos vermelhos voarem em sua direcao, role+DES. 10+: desvia; 7-9: desvia, mas perde algo importante; 6-: um esporo cai no olho e exige agua limpa agora.",
      "Quando examinar alguem por sinais de infeccao, role+INT. 10+: descubra estado e tempo; 7-9: escolha uma dessas respostas; 6-: a observacao chega tarde demais.",
      "Ao escapar, role com bonus por seguidores vivos e rainha derrotada. 10+: sobreviventes agradecem; 7-9: alguem ou algo sai marcado; 6-: um broto acompanha o grupo.",
    ],
    npcs: [
      {
        name: "Nostarion",
        role: "guia elfico arqueiro e covarde",
        useAtTable:
          "Ele adiciona dano a disparos quando ajuda, mas seu medo e desejo por magisita podem quebrar confianca.",
      },
      {
        name: "Eleniel",
        role: "guia elfica de combate corpo a corpo",
        useAtTable:
          "Ela e estoica e leal ao povo dela. Use-a para proteger alguem ou defender escolhas duras.",
      },
      {
        name: "Pii'treb",
        role: "enviado do povo aranha",
        useAtTable:
          "Escondido nas salas de cura, ataca por medo no inicio. Se salvo, oferece abrigo, noticia e recompensa.",
      },
    ],
    threats: [
      {
        name: "Troll das Cinzas Fungico",
        role: "grupo grande, organizado e poderoso",
        stats: "18 PV, armadura 4, mao estufada 1d8+5, alcance, poderoso",
        instinct: "Garantir o crescimento do fungo.",
        moves: [
          "Ignorar ferimentos horriveis.",
          "Distribuir mais esporos.",
          "Enraizar-se em local umido e quente.",
        ],
      },
      {
        name: "Guarda Real",
        role: "horda pequena, cuidadosa e inteligente",
        stats: "4 PV, armadura 1, lancas 1d6, alcance, 1 penetrante",
        instinct: "Proteger o fungo brotando.",
        moves: [
          "Liberar um troll feroz.",
          "Colapsar em nuvem de esporos.",
          "Imobilizar criatura para ser infectada.",
        ],
      },
      {
        name: "Rainha Fungica",
        role: "solitaria, grande e terrivel",
        stats: "18 PV, armadura 2, spray 1d12 proximo, ignora armadura",
        instinct: "Nutrir o fungo.",
        moves: [
          "Revelar hordas de filhotes fungicos.",
          "Brotar tentaculos por toda parte.",
          "Invocar remanescentes da guarda real.",
        ],
      },
      {
        name: "Filhotes Fungicos",
        role: "horda minuscula, terrivel e traicoeira",
        stats: "3 PV, armadura 0, crescimento 1d4, ignora armadura",
        instinct: "Enraizar-se em algo quentinho.",
        moves: [
          "Sobrepujar criatura maior.",
          "Enraizar-se e brotar rapidamente.",
          "Brotar bem depois da fuga.",
        ],
      },
    ],
    scenes: [
      {
        title: "Sala de distribuicao",
        location: "Fundo do zigurate",
        readAloud:
          "Quatro lajes dividem a sala: minerios, vegetais cobertos de mofo, fungo enorme e um corredor sul cheio de sombras formigas cambaleantes.",
        gmGuidance:
          "Faça as perguntas iniciais do PDF e peca a rolagem de esporos da entrada em flashback ou na primeira pressao.",
        forSeven:
          "Use operarias infectadas, guias elficos nervosos, fungo ambiental e uma rota sul se fechando.",
        lowerPlayerReserve:
          "Com grupo menor, reduza operarias a pressao de cerco e deixe uma saida clara se agirem rapido.",
        pressure: 6,
        decisions: [
          "Cortar caminho pelo corredor sul ou investigar lajes?",
          "Confiar nos guias elficos depois de perceber o interesse em magisita?",
          "Queimar fungo e arriscar fumaça de esporos?",
        ],
      },
      {
        title: "Entrada coberta de musgo e salao vazio",
        location: "Escada de arenito",
        readAloud:
          "Paredes esculpidas com precisao desaparecem sob musgo amarelo. Hieroglifos mostram formigas e trolls circulando oferendas para a rainha.",
        gmGuidance:
          "Use esporos amarelos, sinais historicos e a pergunta: as formigas eram vitimas, carcereiras ou ambas?",
        forSeven:
          "Divida cuidado: alguns lidam com esporos, outros leem hieroglifos e outros seguram formigas atrasadas.",
        lowerPlayerReserve:
          "Com menos de 5, entregue os hieroglifos como pista forte e use esporos como custo, nao bloqueio.",
        pressure: 4,
        decisions: [
          "Subir para fora ou voltar para impedir propagacao?",
          "Levar amostra do fungo?",
          "Acreditar que existe cura para a colonia?",
        ],
      },
      {
        title: "Salas de cura e Pii'treb",
        location: "Camara dos trolls",
        readAloud:
          "Correntes e marcas de garras contam uma historia pior que a palavra cura. Debaixo de trapos sujos, algo aracnideo se prepara para atacar.",
        gmGuidance:
          "Pii'treb ataca por medo, nao maldade. Os elfos entendem seu idioma e isso cria dependencia social.",
        forSeven:
          "Use Pii'treb, sinais de experimentos em trolls e primeira pista forte de esporos diferentes.",
        lowerPlayerReserve:
          "Com 3 ou menos, faca Pii'treb virar aliado rapido se acalmado; o drama deve ser comunicacao.",
        pressure: 3,
        decisions: [
          "Matar a aranha assustada ou tentar acalmar?",
          "Contar aos elfos tudo que Pii'treb diz?",
          "Investigar sinais de infeccao em seguidores?",
        ],
      },
      {
        title: "Minas fungicas e saloes da ninhada",
        location: "Magisita e ninho",
        readAloud:
          "Magisita brilha sob cogumelos luminescentes. Cadaveres de trolls ainda se movem, e no teto ha um tunel recem-escavado demais para trazer conforto.",
        gmGuidance:
          "Use esporos vermelhos, corrosao em metal, trolls fungicos e a ganancia por minerio magico.",
        forSeven:
          "Use troll fungico, guarda real, esporos vermelhos e conflito dos elfos por magisita.",
        lowerPlayerReserve:
          "Com 4 ou menos, escolha troll ou guarda; deixe esporos como consequencia de falha, nao encontro paralelo.",
        pressure: 7,
        decisions: [
          "Salvar metal/equipamento ou correr da nuvem?",
          "Permitir que os elfos peguem magisita?",
          "Fechar tunel novo ou seguir o som de escavacao?",
        ],
      },
      {
        title: "Lar da Rainha",
        location: "Camara bloqueada",
        readAloud:
          "Uma laje pesada espera mandibulas de guarda real como chave. La dentro, a rainha vive no centro de raizes e tentaculos, gerando algo que nao deveria nascer.",
        gmGuidance:
          "A porta exige decisao corporal e moral. A rainha deve ser terrivel, mas tambem evidenciar a tragedia da colonia.",
        forSeven:
          "Use Rainha Fungica, filhotes, guarda real e tentaculos mudando posicoes.",
        lowerPlayerReserve:
          "Com menos de 5, use a rainha como relogio e filhotes como complicacao de 7-9 ou 6-, nao horda constante.",
        pressure: 8,
        decisions: [
          "Matar a rainha ou tentar conter o fungo?",
          "Usar a mandibula de uma guarda viva, morta ou improvisar outro metodo?",
          "Queimar ovos sabendo que talvez existam formigas nao perdidas?",
        ],
      },
    ],
    branches: [
      "Se Nostarion ou Eleniel desertam por magisita, faca isso em momento de vitoria aparente.",
      "Se Pii'treb sobrevive, a fuga pode virar ponte com a ninhada aranha em vez de simples recompensa.",
      "Se a rainha escapa viva, a frente Pestilencia avanca para outra colonia.",
      "Se o grupo leva amostras, marque quem guarda e cobre consequencia no epilogo.",
    ],
    rewards: [
      "Geleia real: cura 1d6+6 PV, com consequencia estranha a criterio do MJ.",
      "Pocao de cura, ataduras, couraca da tranquilidade, especiarias seladas, obsidiana ou pedra infundida.",
      "Abrigo e suprimentos do povo aranha se Pii'treb sair vivo.",
    ],
    nodes: [
      {
        id: "distribution",
        label: "Distribuicao",
        kind: "start",
        x: 17,
        y: 33,
        note: "inicio no fundo do zigurate com formigas doentes",
      },
      {
        id: "yellow",
        label: "Esporos",
        kind: "danger",
        x: 31,
        y: 14,
        note: "entrada coberta de musgo amarelo",
      },
      {
        id: "piitreb",
        label: "Pii'treb",
        kind: "npc",
        x: 45,
        y: 44,
        note: "armario, medo e traducao pelos elfos",
      },
      {
        id: "mines",
        label: "Minas",
        kind: "mystery",
        x: 58,
        y: 21,
        note: "magisita, trolls e esporos vermelhos",
      },
      {
        id: "nest",
        label: "Ninhada",
        kind: "danger",
        x: 70,
        y: 43,
        note: "guardas, corrosao e tunel no teto",
      },
      {
        id: "queen",
        label: "Rainha",
        kind: "choice",
        x: 88,
        y: 30,
        note: "matar, conter ou carregar consequencia",
      },
    ],
    links: [
      ["distribution", "yellow"],
      ["distribution", "piitreb"],
      ["piitreb", "mines"],
      ["mines", "nest"],
      ["nest", "queen"],
      ["yellow", "mines"],
    ],
  },
];

function getScale(players: PlayerCount) {
  return playerScale[players];
}

function calculateDangerBudget(baseBudget: number, players: PlayerCount) {
  const scale = getScale(players);

  // O arredondamento para cima evita que uma cena vire inofensiva demais. O
  // valor final nao e "numero de monstros"; e um orcamento de pressao para o
  // mestre distribuir entre inimigos, ambiente, tempo e custo narrativo.
  return Math.max(1, Math.ceil(baseBudget * scale.multiplier));
}

function getAdventureById(adventureId: string) {
  return adventures.find((adventure) => adventure.id === adventureId) ?? adventures[0];
}

export default function Aventuras({
  onNavigate,
}: {
  onNavigate: (view: PublicView) => void;
}) {
  const [selectedAdventureId, setSelectedAdventureId] = useState(adventures[0].id);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerCount>(7);
  const selectedAdventure = getAdventureById(selectedAdventureId);
  const selectedBudget = calculateDangerBudget(
    selectedAdventure.baseDangerBudget,
    selectedPlayers,
  );

  return (
    <PublicPageShell active="aventuras" onNavigate={onNavigate}>
      <Stack spacing={2.4}>
        <HeroSection />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "300px minmax(0, 1fr)" },
            gap: 1.6,
            alignItems: "start",
          }}
        >
          <Stack
            spacing={1.2}
            sx={{
              position: { xs: "static", lg: "sticky" },
              top: { lg: 92 },
            }}
          >
            <AdventurePicker
              selectedAdventureId={selectedAdventure.id}
              onSelect={setSelectedAdventureId}
            />
            <ScaleSelector
              selectedPlayers={selectedPlayers}
              onSelect={setSelectedPlayers}
              baseBudget={selectedAdventure.baseDangerBudget}
            />
          </Stack>

          <AdventureDetail
            adventure={selectedAdventure}
            selectedPlayers={selectedPlayers}
            selectedBudget={selectedBudget}
          />
        </Box>
      </Stack>
    </PublicPageShell>
  );
}

function HeroSection() {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor:
          "linear-gradient(135deg, rgba(197,155,75,.14), rgba(95,182,196,.08)), rgba(255,255,255,.035)",
        p: { xs: 1.5, md: 2.2 },
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.8}>
          <Chip label="Aventuras separadas por PDF" />
          <Chip label="Base: 7 jogadores" />
          <Chip label="Escala 7 > 6 > 5 > 4 > 3 > 2 > 1" />
          <Chip label="Mapas de encontro" />
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3.4rem" },
            lineHeight: 1,
            fontWeight: 900,
            maxWidth: 980,
          }}
        >
          Aventuras guiadas para Dungeon World
        </Typography>

        <Typography sx={{ color: "#d7c59d", lineHeight: 1.7, maxWidth: 930 }}>
          Cada aventura abaixo fica isolada pelo seu PDF de origem, com objetivos,
          frentes, PNJs, monstros, cenas e mapas pensados para uma mesa de 7
          jogadores. A escala mostra como reduzir pressao quando houver menos
          pessoas sem descaracterizar a ficcao.
        </Typography>

        <Alert
          severity="warning"
          sx={{
            bgcolor: "rgba(197,155,75,.12)",
            color: "#f7edd9",
            border: "1px solid rgba(197,155,75,.24)",
            "& .MuiAlert-icon": { color: "#f2c76c" },
          }}
        >
          Conteudo de mestre: esta pagina contem segredos, monstros, rotas e
          consequencias das aventuras.
        </Alert>
      </Stack>
    </Paper>
  );
}

function AdventurePicker({
  selectedAdventureId,
  onSelect,
}: {
  selectedAdventureId: string;
  onSelect: (adventureId: string) => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
        Escolha a aventura
      </Typography>
      <Stack spacing={0.8}>
        {adventures.map((adventure) => (
          <Button
            key={adventure.id}
            variant={selectedAdventureId === adventure.id ? "contained" : "outlined"}
            onClick={() => onSelect(adventure.id)}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              borderColor: `${adventure.accent}66`,
            }}
          >
            {adventure.title}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}

function ScaleSelector({
  selectedPlayers,
  onSelect,
  baseBudget,
}: {
  selectedPlayers: PlayerCount;
  onSelect: (players: PlayerCount) => void;
  baseBudget: number;
}) {
  // O seletor mostra a mesma conta em todos os degraus de jogadores. Assim o
  // mestre consegue comparar rapidamente o peso da aventura cheia contra uma
  // mesa menor antes de abrir cenas especificas.
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(95,182,196,.16)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#5fb6c4", fontWeight: 900, mb: 1 }}>
        Escala da mesa
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.7}>
        {playerCounts.map((players) => {
          const active = selectedPlayers === players;

          return (
            <Button
              key={players}
              size="small"
              variant={active ? "contained" : "outlined"}
              onClick={() => onSelect(players)}
              sx={{ minWidth: 42 }}
            >
              {players}
            </Button>
          );
        })}
      </Stack>

      <Divider sx={{ borderColor: "rgba(217,200,159,.12)", my: 1.2 }} />

      <Stack spacing={0.7}>
        {playerCounts.map((players) => {
          const scale = getScale(players);
          const budget = calculateDangerBudget(baseBudget, players);
          const active = selectedPlayers === players;

          return (
            <Box key={players}>
              <Stack
                direction="row"
                spacing={0.8}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: active ? "#f7edd9" : "#b9a98b",
                }}
              >
                <Typography sx={{ fontSize: ".82rem", fontWeight: active ? 900 : 500 }}>
                  {players} jogador{players > 1 ? "es" : ""}: {budget} pressao
                </Typography>
                <Typography sx={{ fontSize: ".76rem" }}>
                  {scale.label}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(budget / baseBudget) * 100}
                sx={{
                  height: 5,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,.07)",
                  ".MuiLinearProgress-bar": {
                    bgcolor: active ? "#f2c76c" : "#5fb6c4",
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

function AdventureDetail({
  adventure,
  selectedPlayers,
  selectedBudget,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
  selectedBudget: number;
}) {
  const map = useMemo(
    () => adventureMaps.find((currentMap) => currentMap.id === adventure.mapId),
    [adventure.mapId],
  );
  const scale = getScale(selectedPlayers);

  // Esta composicao e a "ficha da aventura": primeiro orienta escala e mapas,
  // depois entrega blocos expansivos de PNJs, monstros, cenas e recompensas.
  // A ordem favorece uso em sessao, onde o mestre consulta rapido sem ler tudo.
  return (
    <Stack spacing={1.6}>
      <Card
        variant="outlined"
        sx={{
          borderColor: `${adventure.accent}66`,
          bgcolor: "rgba(17,17,15,.94)",
          color: "#f7edd9",
        }}
      >
        <CardContent>
          <Stack spacing={1.4}>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.8}>
              <Chip label={adventure.source} />
              <Chip label={adventure.tone} sx={{ bgcolor: `${adventure.accent}22` }} />
              <Chip label={`Perigo ${selectedBudget}/${adventure.baseDangerBudget}`} />
            </Stack>

            <Typography
              component="h2"
              sx={{
                color: adventure.accent,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {adventure.title}
            </Typography>

            <Typography sx={{ color: "#d7c59d", lineHeight: 1.7 }}>
              {adventure.premise}
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                borderColor: "rgba(95,182,196,.18)",
                bgcolor: "rgba(95,182,196,.07)",
                p: 1.4,
              }}
            >
              <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                Formato de conducao
              </Typography>
              <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.6 }}>
                {adventure.format}
              </Typography>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      <ScaleSummary
        adventure={adventure}
        selectedPlayers={selectedPlayers}
        scaleReserve={scale.reserve}
        simultaneous={scale.simultaneous}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 1.4,
          alignItems: "stretch",
        }}
      >
        <MapCard title="Mapa reimaginado de encontros">
          <EncounterMap adventure={adventure} />
        </MapCard>

        <MapCard title="Mapa do atlas da aventura">
          {map ? (
            <Stack spacing={1}>
              <Box sx={{ overflowX: "auto" }}>
                <MapSvg mapId={map.id} revealSecrets />
              </Box>
              <Typography sx={{ color: "#b9a98b", fontSize: ".86rem", lineHeight: 1.45 }}>
                {map.summary}
              </Typography>
            </Stack>
          ) : (
            <Typography sx={{ color: "#b9a98b" }}>
              Mapa ainda nao cadastrado no atlas.
            </Typography>
          )}
        </MapCard>
      </Box>

      <QuickStart adventure={adventure} />

      <InfoGrid
        title="Objetivos da sessao"
        items={adventure.objectives}
        accent={adventure.accent}
      />

      <InfoGrid title="Frentes em movimento" items={adventure.fronts} accent="#aa263d" />

      <InfoGrid title="O que esta em jogo" items={adventure.stakes} accent="#f2c76c" />

      <AccordionBlock title="PNJs principais" defaultExpanded>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 1,
          }}
        >
          {adventure.npcs.map((npc) => (
            <Paper key={npc.name} variant="outlined" sx={cardSx("#5f7f4f")}>
              <Typography sx={{ color: "#d8efbd", fontWeight: 900 }}>
                {npc.name}
              </Typography>
              <Chip size="small" label={npc.role} sx={{ mt: 0.7 }} />
              <Typography sx={{ color: "#d7c59d", mt: 0.8, lineHeight: 1.55 }}>
                {npc.useAtTable}
              </Typography>
            </Paper>
          ))}
        </Box>
      </AccordionBlock>

      <AccordionBlock title="Monstros, perigos e como usar" defaultExpanded>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            gap: 1,
          }}
        >
          {adventure.threats.map((threat) => (
            <Paper key={threat.name} variant="outlined" sx={cardSx("#8f2637")}>
              <Stack spacing={0.8}>
                <Typography sx={{ color: "#ffb2b8", fontWeight: 900 }}>
                  {threat.name}
                </Typography>
                <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.6}>
                  <Chip size="small" label={threat.role} />
                  <Chip size="small" label={threat.stats} />
                </Stack>
                <Typography sx={{ color: "#f7edd9", fontSize: ".9rem" }}>
                  <strong>Instinto:</strong> {threat.instinct}
                </Typography>
                <Stack component="ul" spacing={0.4} sx={{ m: 0, pl: 2.1 }}>
                  {threat.moves.map((move) => (
                    <Typography
                      key={move}
                      component="li"
                      sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.45 }}
                    >
                      {move}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Box>
      </AccordionBlock>

      <AccordionBlock title="Cenas guiadas e escala por jogadores" defaultExpanded>
        <Stack spacing={1.2}>
          {adventure.scenes.map((scene, index) => (
            <SceneCard
              key={scene.title}
              scene={scene}
              index={index}
              selectedPlayers={selectedPlayers}
              accent={adventure.accent}
            />
          ))}
        </Stack>
      </AccordionBlock>

      <AccordionBlock title="Movimentos personalizados e regras da aventura">
        <Stack spacing={1}>
          {adventure.customMoves.map((move) => (
            <Paper key={move} variant="outlined" sx={cardSx("#7f6fd9")}>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
                {move}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </AccordionBlock>

      <AccordionBlock title="Decisoes, ramos e finais abertos">
        <InfoGrid title="Ramos provaveis" items={adventure.branches} accent="#c59b4b" />
        <Box sx={{ mt: 1.2 }}>
          <InfoGrid title="Recompensas e consequencias" items={adventure.rewards} accent="#5fb6c4" />
        </Box>
      </AccordionBlock>

      <AccordionBlock title="Principios de conducao do mestre">
        <InfoGrid title="Use durante a sessao" items={adventure.gmPrinciples} accent="#f2c76c" />
      </AccordionBlock>
    </Stack>
  );
}

function ScaleSummary({
  adventure,
  selectedPlayers,
  scaleReserve,
  simultaneous,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
  scaleReserve: string;
  simultaneous: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(242,199,108,.2)",
        bgcolor: "rgba(197,155,75,.08)",
        p: 1.4,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.8}>
          <Chip label={`Selecionado: ${selectedPlayers} jogador${selectedPlayers > 1 ? "es" : ""}`} />
          <Chip label={simultaneous} />
          <Chip
            label={`calculo: ${calculateDangerBudget(
              adventure.baseDangerBudget,
              selectedPlayers,
            )} / ${adventure.baseDangerBudget}`}
          />
        </Stack>

        <Typography sx={{ color: "#f7edd9", lineHeight: 1.6 }}>
          {scaleReserve}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".86rem", lineHeight: 1.55 }}>
          Regra pratica: para 7 jogadores use tudo. A cada degrau abaixo, reduza
          quantidade de inimigos, simultaneidade e dano ambiental antes de cortar
          decisoes importantes. Acima de 7 nao e recomendado: divida objetivos
          em duas frentes ou transforme parte do grupo em apoio fora de cena.
        </Typography>
      </Stack>
    </Paper>
  );
}

function MapCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(0,0,0,.2)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 1.2, borderBottom: "1px solid rgba(217,200,159,.12)" }}>
        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 1,
          bgcolor:
            "radial-gradient(circle at 50% 20%, rgba(197,155,75,.1), transparent 16rem), #090907",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

function EncounterMap({ adventure }: { adventure: AdventureGuide }) {
  const nodesById = new Map(adventure.nodes.map((node) => [node.id, node]));

  // O mapa de encontros nao tenta reproduzir planta exata do PDF. Ele mostra
  // fluxo de mesa: onde comeca, para onde as escolhas levam e onde estao PNJs,
  // inimigos e misterios. Para alterar, mexa nos nodes/links da aventura.
  return (
    <Stack spacing={1}>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox="0 0 100 60"
          role="img"
          aria-label={`Mapa de encontros de ${adventure.title}`}
          style={{
            width: "100%",
            minWidth: 640,
            display: "block",
            borderRadius: 8,
          }}
        >
          <defs>
            <linearGradient id={`encounter-bg-${adventure.id}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#10100d" />
              <stop offset="55%" stopColor="#17120e" />
              <stop offset="100%" stopColor="#090907" />
            </linearGradient>
            <filter id={`encounter-shadow-${adventure.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>

          <rect width="100" height="60" fill={`url(#encounter-bg-${adventure.id})`} />
          <path
            d="M4 51 C20 39 18 19 38 16 C55 13 62 34 78 28 C87 24 91 13 97 9"
            fill="none"
            stroke="rgba(197,155,75,.16)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {adventure.links.map(([fromId, toId]) => {
            const from = nodesById.get(fromId);
            const to = nodesById.get(toId);
            if (!from || !to) return null;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(247,237,217,.38)"
                strokeWidth="0.9"
                strokeDasharray="2 2"
              />
            );
          })}

          {adventure.nodes.map((node, index) => {
            const style = encounterStyles[node.kind];

            return (
              <g key={node.id} filter={`url(#encounter-shadow-${adventure.id})`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4.6"
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="0.9"
                />
                <text
                  x={node.x}
                  y={node.y + 1.25}
                  fill="#f7edd9"
                  fontSize="3.2"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {index + 1}
                </text>
                <text
                  x={node.x}
                  y={node.y + 8}
                  fill="#f7edd9"
                  fontSize="3"
                  fontWeight="900"
                  textAnchor="middle"
                  paintOrder="stroke"
                  stroke="#070706"
                  strokeWidth="1.2"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.7}>
        {Object.entries(encounterStyles).map(([kind, style]) => (
          <Chip
            key={kind}
            size="small"
            label={style.label}
            sx={{
              bgcolor: `${style.fill}55`,
              border: `1px solid ${style.stroke}55`,
              color: "#f7edd9",
            }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {adventure.nodes.map((node, index) => {
          const style = encounterStyles[node.kind];

          return (
            <Paper
              key={node.id}
              variant="outlined"
              sx={{
                borderColor: `${style.stroke}44`,
                bgcolor: "rgba(255,255,255,.035)",
                p: 0.9,
              }}
            >
              <Typography sx={{ color: style.stroke, fontWeight: 900 }}>
                {index + 1}. {node.label}
              </Typography>
              <Typography sx={{ color: "#d7c59d", fontSize: ".84rem", lineHeight: 1.45 }}>
                {node.note}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
}

function QuickStart({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}44`,
        bgcolor: `${adventure.accent}12`,
        p: 1.4,
      }}
    >
      <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
        Comeco da mesa
      </Typography>
      <Typography sx={{ color: "#f7edd9", mt: 0.8, lineHeight: 1.65 }}>
        {adventure.start}
      </Typography>
    </Paper>
  );
}

function SceneCard({
  scene,
  index,
  selectedPlayers,
  accent,
}: {
  scene: SceneBeat;
  index: number;
  selectedPlayers: PlayerCount;
  accent: string;
}) {
  const scaledPressure = calculateDangerBudget(scene.pressure, selectedPlayers);

  // Cada cena tem dois textos de escala: o encontro completo para 7 jogadores
  // e a ressalva de reducao. O chip "pressao" aplica a conta escolhida no topo.
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        p: { xs: 1.2, md: 1.5 },
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.7}>
          <Chip label={`Cena ${index + 1}`} sx={{ bgcolor: `${accent}22` }} />
          <Chip label={scene.location} />
          <Chip label={`pressao ${scaledPressure}/${scene.pressure}`} />
        </Stack>

        <Typography sx={{ color: accent, fontWeight: 900, fontSize: "1.05rem" }}>
          {scene.title}
        </Typography>

        <Typography sx={{ color: "#f7edd9", lineHeight: 1.65 }}>
          {scene.readAloud}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 1,
          }}
        >
          <Paper variant="outlined" sx={cardSx("#5fb6c4")}>
            <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
              Para 7 jogadores
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.55 }}>
              {scene.forSeven}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={cardSx("#f2c76c")}>
            <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
              Ressalva para mesa menor
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.55 }}>
              {scene.lowerPlayerReserve}
            </Typography>
          </Paper>
        </Box>

        <Typography sx={{ color: "#b9a98b", lineHeight: 1.55 }}>
          <strong>Mestre:</strong> {scene.gmGuidance}
        </Typography>

        <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.7}>
          {scene.decisions.map((decision) => (
            <Chip
              key={decision}
              label={decision}
              sx={{
                maxWidth: "100%",
                height: "auto",
                py: 0.7,
                bgcolor: "rgba(255,255,255,.055)",
                color: "#f7edd9",
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function InfoGrid({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${accent}33`,
        bgcolor: "rgba(255,255,255,.035)",
        p: 1.3,
      }}
    >
      <Typography sx={{ color: accent, fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {items.map((item) => (
          <Box
            key={item}
            sx={{
              borderLeft: `3px solid ${accent}`,
              pl: 1,
              minWidth: 0,
            }}
          >
            <Typography sx={{ color: "#d7c59d", lineHeight: 1.55 }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function AccordionBlock({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        bgcolor: "rgba(17,17,15,.92)",
        color: "#f7edd9",
        border: "1px solid rgba(217,200,159,.16)",
        borderRadius: "10px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
            +
          </Typography>
        }
      >
        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

function cardSx(accent: string) {
  return {
    borderColor: `${accent}33`,
    bgcolor: "rgba(255,255,255,.035)",
    color: "#f7edd9",
    p: 1.2,
  };
}
