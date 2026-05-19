import type { IconType } from "react-icons";
import {
  GiCampfire,
  GiOpenBook,
  GiScrollQuill,
  GiTabletopPlayers,
  GiTreasureMap,
} from "react-icons/gi";

export type PlayerCount = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AdventureSection = "resumo" | "mapas" | "cenas" | "elenco" | "regras";

export type EncounterKind = "start" | "npc" | "danger" | "mystery" | "choice" | "reward";

export type EncounterNode = {
  id: string;
  label: string;
  kind: EncounterKind;
  x: number;
  y: number;
  note: string;
};

export type SceneBeat = {
  title: string;
  location: string;
  readAloud: string;
  gmGuidance: string;
  forSeven: string;
  lowerPlayerReserve: string;
  pressure: number;
  decisions: string[];
};

export type AdventureThreat = {
  name: string;
  role: string;
  stats: string;
  instinct: string;
  moves: string[];
};

export type AdventureNpc = {
  name: string;
  role: string;
  useAtTable: string;
  motivation?: string;
  secret?: string;
  tableCue?: string;
};

export type AdventurePlotBeat = {
  title: string;
  purpose: string;
  escalation: string;
  question: string;
  tableDynamics: string[];
  gmNotes: string[];
};

export type AdventureActGuide = {
  title: string;
  focus: string;
  tableSteps: string[];
  reveal: string;
  noviceTip: string;
};

export type AdventureEnding = {
  title: string;
  outcome: string;
  consequence: string;
};

export type AdventureGuide = {
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
  secretTruth: string;
  conductorNotes: string[];
  actGuides: AdventureActGuide[];
  escalationClock: string[];
  sceneSeeds: string[];
  endings: AdventureEnding[];
  plot: AdventurePlotBeat[];
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

export const playerCounts: PlayerCount[] = [7, 6, 5, 4, 3, 2, 1];

export const adventureSections: Array<{
  value: AdventureSection;
  label: string;
  helper: string;
  Icon: IconType;
}> = [
  {
    value: "resumo",
    label: "Resumo",
    helper: "enredo, objetivos e frentes",
    Icon: GiOpenBook,
  },
  {
    value: "mapas",
    label: "Mapas",
    helper: "fluxo e atlas",
    Icon: GiTreasureMap,
  },
  {
    value: "cenas",
    label: "Cenas",
    helper: "sessao guiada",
    Icon: GiCampfire,
  },
  {
    value: "elenco",
    label: "Elenco",
    helper: "PNJs e ameacas",
    Icon: GiTabletopPlayers,
  },
  {
    value: "regras",
    label: "Regras",
    helper: "movimentos e escala",
    Icon: GiScrollQuill,
  },
];

export const encounterStyles: Record<
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
export const playerScale: Record<
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

export const smoothOverflowSx = {
  overscrollBehavior: "contain",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  scrollbarColor: "#6f5a36 #0b0a08",
  WebkitOverflowScrolling: "touch",
};

// Dados jogaveis das aventuras. Cada bloco fica isolado por PDF para evitar
// misturar monstros, PNJs ou locais de materiais diferentes.
export const adventures: AdventureGuide[] = [
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
    secretTruth:
      "Kalareth usa a residencia e o observatorio da propria linhagem para amplificar medo coletivo. A casa nao e apenas assombrada: ela tenta restaurar uma ordem aristocratica obediente, usando o magistrado como instrumento.",
    conductorNotes: [
      "Mostre Nekesti como cansada e manipulada, nao como uma cidade formada apenas por viloes. Pessoas comuns devem repetir mentiras porque estao com medo.",
      "Separe boato, pista fisica e confissao. Entregue boatos cedo, provas no meio e admissoes tarde, para o mestre novato nao resolver tudo em uma cena.",
      "Sempre que o grupo descansar, hesitar ou escolher uma rota segura, avance um pressagio: a cidade tambem se move quando os herois param.",
    ],
    actGuides: [
      {
        title: "Ato I - Praca da fogueira",
        focus:
          "Abrir com linchamento publico e mostrar que salvar Verren Tosk muda a relacao do grupo com a cidade.",
        tableSteps: [
          "Coloque Verren amarrado, ferido e acusado enquanto Kalareth fala como administrador sereno, nao como lunatico.",
          "Reaja ao metodo dos jogadores: violencia gera odio, discurso exige contradicoes e fuga transforma o grupo em criminoso aos olhos da guarda.",
          "Antes de Verren sair de cena, entregue uma pista curta sobre o observatorio: luz que queima sem fogo, lentes ou sol falso.",
        ],
        reveal:
          "O medo da multidao foi cultivado; ele tem direcao, linguagem repetida e alguem lucrando com a urgencia.",
        noviceTip:
          "Se a mesa travar, aponte tres focos visiveis: Verren, Kalareth e uma saida bloqueada por templarios.",
      },
      {
        title: "Ato II - Bairro gnomo",
        focus:
          "Transformar a fuga em investigacao social, com oficinas vigiadas, humor nervoso e registros comprometedores.",
        tableSteps: [
          "Descreva oficinas fechadas, luzes acesas demais e moradores olhando por frestas antes de qualquer conversa.",
          "Use engenhocas gnomicas como alivio tenso: uma solucao pode funcionar, explodir ou revelar fiscalizacao criminosa.",
          "Entregue registros de lentes, espelhos e pagamentos ligados a reforma da residencia Kalareth.",
        ],
        reveal:
          "Os gnomos nao sao a origem da ameaca, mas alguns foram forcados ou pagos para fornecer pecas do mecanismo.",
        noviceTip:
          "Quando os jogadores perguntarem com quem falar, ofereca uma testemunha, um artesao e um gnomo apavorado com versoes incompletas.",
      },
      {
        title: "Ato III - Residencia Kalareth",
        focus:
          "Fazer a mansao parecer viva, limpa demais e moralmente apodrecida, revelando pecados antigos da familia.",
        tableSteps: [
          "Mostre relogios parados em horarios diferentes, retratos atentos e corredores limpos onde deveria haver abandono.",
          "Use Odrik como porta viva: ele ajuda se prometerem nao queimar a casa, mas sempre teme que as paredes escutem.",
          "Cada sala deve revelar uma culpa: contratos de fome, casamentos forcados, tuneis, listas de bodes expiatorios ou ordens templarias falhas.",
        ],
        reveal:
          "A casa molda obediencia ha geracoes; Kalareth acredita controlar a linhagem, mas tambem e controlado por ela.",
        noviceTip:
          "Trate cada comodo como uma pergunta simples: quem sofreu aqui, quem se beneficiou e que prova ainda pode sumir?",
      },
      {
        title: "Ato IV - Observatorio e mortos",
        focus:
          "Levar a aventura para julgamento sobrenatural, escolha publica e barganha com os ancestrais.",
        tableSteps: [
          "No observatorio, espelhos projetam luz fria sobre simbolos de julgamento e recriam papeis do passado.",
          "Kalareth tenta destruir provas e justifica a mentira dizendo que a cidade precisa de um inimigo comum.",
          "Os ancestrais oferecem prosperidade e ordem em troca de sacrificios periodicos e obediencia silenciosa.",
        ],
        reveal:
          "O climax nao e apenas derrotar Kalareth, mas decidir se Nekesti sera curada, controlada ou abandonada a outro tipo de violencia.",
        noviceTip:
          "Se os jogadores descobrirem tudo cedo, transforme o final em julgamento publico, nao em combate extra.",
      },
    ],
    escalationClock: [
      "Janelas se fecham quando gnomos passam.",
      "Novas estacas aparecem na praca antes de haver condenados.",
      "Moradores comecam a repetir as mesmas frases como se ensaiadas.",
      "Logan autoriza uma purga preventiva contra o bairro gnomo.",
      "Desastre: o observatorio transforma Nekesti em maquina de execucao.",
    ],
    sceneSeeds: [
      "Uma crianca acusa um gnomo porque ouviu os pais repetirem a mentira, mas chora ao ve-lo apanhar.",
      "Um templario novato pede que os herois provem que ele nao serviu a um monstro.",
      "Skumm oferece uma chave enferrujada em troca de uma promessa absurda e solene.",
      "Um ancestral chama cada personagem pelo nome de alguem que sua familia decepcionou.",
    ],
    endings: [
      {
        title: "A cidade respira",
        outcome:
          "O observatorio e destruido, Kalareth cai e os gnomos sobrevivem.",
        consequence:
          "Nekesti nao vira justa de imediato; vizinhos que quase queimaram inocentes precisam encarar reparacao.",
      },
      {
        title: "Justica de cinzas",
        outcome:
          "Kalareth morre em publico sem prova suficiente para quebrar a narrativa.",
        consequence:
          "A multidao pode transforma-lo em martir e Logan assume a cidade com rigidez maior.",
      },
      {
        title: "O acordo dos mortos",
        outcome:
          "Os herois aceitam a ordem espectral para garantir prosperidade.",
        consequence:
          "A cidade melhora por fora, mas desaparecimentos periodicos mantem a casa alimentada.",
      },
      {
        title: "Exodo gnomo",
        outcome:
          "Os gnomos fogem com tecnologia, ouro e registros.",
        consequence:
          "A histeria esfria, mas Nekesti entra em declinio economico e culpa os ausentes.",
      },
    ],
    plot: [
      {
        title: "A cidade escolhe um culpado",
        purpose:
          "Colocar os jogadores no centro de um julgamento injusto antes que eles tenham tempo de se organizar.",
        escalation:
          "Kalareth usa cada hesitacao como prova contra os gnomos e contra os proprios herois.",
        question:
          "Quem os personagens protegem quando a multidao exige uma resposta simples?",
        tableDynamics: [
          "Comece com tres focos claros: o gnomo no chao, Kalareth falando para a multidao e uma saida que esta sendo fechada por guardas.",
          "Peça para cada jogador declarar onde esta na praca antes da primeira rolagem; isso ajuda novatos a entenderem que posicao importa.",
          "Se alguem atacar primeiro, mostre medo real nos civis e faca Kalareth usar isso como propaganda contra o grupo.",
          "Se alguem falar primeiro, deixe a multidao reagir em ondas: curiosidade, duvida, raiva e depois uma pessoa especifica mudando de lado.",
        ],
        gmNotes: [
          "Use falhas para separar pessoas, derrubar a prova, ferir o gnomo ou colocar um guarda entre um personagem e a saida.",
          "Em 7-9, ofereca escolhas concretas: salvar o gnomo agora ou impedir Kalareth de nomear os herois como cumplices.",
        ],
      },
      {
        title: "Rumores apontam para a casa",
        purpose:
          "Transformar a confusao publica em investigacao urbana com aliados, testemunhas e portas fechadas.",
        escalation:
          "Guardas e moradores passam a reconhecer os personagens; quanto mais perguntam, mais Nekesti se fecha.",
        question:
          "Eles buscam verdade legal, apoio popular ou uma prova que ninguem possa negar?",
        tableDynamics: [
          "Divida a investigacao em contatos curtos: uma testemunha na janela, um guarda cansado, um mercador gnomo escondido e um templario desconfortavel.",
          "Cada pista deve apontar para a residencia, mas por motivos diferentes: culpa, medo, suborno, cheiro de mofo ou uma chave incomum.",
          "Quando a mesa travar, traga um boato errado com um pedaco verdadeiro para manter a energia sem entregar resposta pronta.",
          "Deixe os jogadores escolherem o metodo: persuadir, seguir alguem, arrombar arquivo, confrontar Kalareth ou proteger os gnomos.",
        ],
        gmNotes: [
          "Falhas nao devem bloquear a investigacao; elas custam tempo, reputacao, recurso ou colocam alguem inocente em perigo.",
          "Use nomes de ruas e rostos recorrentes para Nekesti parecer viva, nao apenas uma lista de testes.",
        ],
      },
      {
        title: "A residencia revela o passado",
        purpose:
          "Fazer a casa agir como personagem: cada sala mostra culpa antiga, medo e evidencia.",
        escalation:
          "Espiritos, ratos e armadilhas destroem provas se os jogadores demorarem ou falharem.",
        question:
          "O que vale mais: sair com vida, salvar a prova ou entender o que Kalareth tentou esconder?",
        tableDynamics: [
          "Trate cada comodo como pergunta jogavel: quem morreu aqui, o que foi escondido e por que a casa ainda protege o magistrado.",
          "Misture risco fisico e revelacao: rato, espirito, porta trancada ou piso cedendo sempre deve revelar algo alem de causar dano.",
          "Se a mesa procurar com calma, deixe encontrar sinais antes da ameaca; se correr, faca a ameaca aparecer antes da prova.",
          "A casa deve reagir ao barulho e a luz, criando escolhas sobre furtividade, velocidade e protecao do grupo.",
        ],
        gmNotes: [
          "Em mesa com 7, coloque dois problemas simultaneos na casa para envolver todos; em mesas menores, foque em uma sala por vez.",
          "Toda prova precisa ter consequencia social: quem acredita nela, quem tenta compra-la e quem morre se ela sumir.",
        ],
      },
      {
        title: "A verdade precisa de publico",
        purpose:
          "Encerrar com consequencia social, nao apenas com combate.",
        escalation:
          "Kalareth tenta fugir, convocar dentes ou virar a cidade pela ultima vez.",
        question:
          "A justica de Nekesti sera reparacao, vinganca ou outro acordo imperfeito?",
        tableDynamics: [
          "Volte para um espaco publico: praca, templo, tribunal improvisado ou porta da residencia em chamas.",
          "De a Kalareth uma ultima ferramenta que nao seja espada: refem, mentira convincente, documento falso ou apoio templario.",
          "Convide cada jogador a dizer que prova, promessa ou ameaca ele coloca diante da cidade.",
          "Feche com consequencias visiveis: gnomos escoltados, templarios divididos, multidao silenciosa ou um culpado tentando fugir.",
        ],
        gmNotes: [
          "Nao transforme o final em absolvição facil; Dungeon World gosta de vitorias com marcas e novas perguntas.",
          "Se houver combate, faca a luta acontecer em volta de testemunhas e escolhas morais, nao em uma arena limpa.",
        ],
      },
    ],
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
        motivation:
          "Manter o controle da cidade provando que somente ele consegue separar puros de culpados.",
        secret:
          "Ele precisa que a multidao tema os gnomos para que ninguem olhe tempo demais para sua residencia.",
        tableCue:
          "Fale baixo, sempre como se estivesse lamentando a violencia que ele mesmo provoca.",
        useAtTable:
          "Ele nao precisa vencer no braco; ele vence quando faz a cidade acreditar que os herois sao o problema.",
      },
      {
        name: "Gnomo acusado",
        role: "estopim da primeira cena",
        motivation:
          "Sobreviver tempo suficiente para contar quem realmente se beneficia da acusacao.",
        secret:
          "Ele viu ou carregou uma pista pequena demais para entender sozinho: um dente, uma chave, uma carta ou uma marca da casa.",
        tableCue:
          "Responda em frases curtas, com medo de cada rosto na multidao.",
        useAtTable:
          "Use-o para humanizar a disputa: ele sabe uma pista, mas esta machucado, com medo e cercado.",
      },
      {
        name: "Mordomo da residencia",
        role: "porta viva para a casa",
        motivation:
          "Manter a rotina da casa intacta porque rotina e a unica coisa que ainda impede o panico.",
        secret:
          "Ele sabe qual porta abre sozinha e qual sala nunca deve ficar sem luz.",
        tableCue:
          "Olhe para as portas antes de responder, como se pedisse permissao para mentir.",
        useAtTable:
          "Ele treme porque sabe que a casa nao esta vazia. Pode mentir por lealdade, medo ou culpa.",
      },
      {
        name: "Skumm, Rei dos Ratos",
        role: "perigo estranho do sotao",
        motivation:
          "Ser reconhecido como soberano das pragas e receber tributo digno de seu titulo absurdo.",
        secret:
          "Ele sabe por onde criaturas pequenas entram, fogem e escutam conversas que nobres ignoram.",
        tableCue:
          "Trate cada oferta como negociacao de corte real, mesmo que seja por queijo velho.",
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
    secretTruth:
      "Chaeron prometeu vantagens diferentes a gnomos e kobolds, morreu antes de concluir o plano e agora usa medo, fome e guerra como cortina para abrir uma porta sob a montanha.",
    conductorNotes: [
      "Conduza Nemfalla como pressao fisica constante: ar ruim, tuneis instaveis, mapas falhos e barulho atraindo Vh'orr.",
      "Gnomos e kobolds devem ter orgulho, mortos, fe e medo. Evite transformar qualquer lado em certo ou errado automatico.",
      "A fome de Vh'orr e a voz de Chaeron devem voltar quando a mesa relaxa, cura feridas ou tenta resolver politica em seguranca.",
    ],
    actGuides: [
      {
        title: "Ato I - Restos no sambaqui",
        focus:
          "Comecar no deposito de ossos de Vh'orr, com restos de Chaeron e uma saida bloqueada por perigo imediato.",
        tableSteps: [
          "Mostre ossos, documentos mordidos, caixa-segredo danificada e o cavalo usado como lanche futuro.",
          "Pergunte se salvam o cavalo, escondem-se, fogem ou tentam emboscar Vh'orr; qualquer escolha deve mexer no terreno.",
          "Entregue uma carta prometendo aos Bobinas Lampejantes o fim da supersticao kobold.",
        ],
        reveal:
          "Chaeron ja manipulava a guerra antes de morrer, e seus acordos ainda podem incendiar as faccoes.",
        noviceTip:
          "Mantenha a primeira cena tridimensional: buracos no chao, trilhos acima, paredes que quebram e luz distante.",
      },
      {
        title: "Ato II - Luzes em guerra",
        focus:
          "Apresentar kobolds e gnomos como povos vivos, com fe, tecnologia, trofeus e medo real.",
        tableSteps: [
          "Kobolds atacam das sombras, mas param se os herois respeitam a luz sagrada.",
          "Gnomos oferecem explosivos, elixir e carrinhos, minimizando o acordo feito com Chaeron.",
          "Sassi revela que novos tuneis nao foram feitos por gnomos, kobolds ou Vh'orr.",
        ],
        reveal:
          "A guerra foi alimentada por promessas contraditorias, e a montanha tem uma terceira vontade acordando.",
        noviceTip:
          "Dê a cada lado um pedido concreto e um limite sagrado. Isso ajuda mestre novo a conduzir negociacao sem palestra.",
      },
      {
        title: "Ato III - A fome que volta",
        focus:
          "Trazer Vh'orr de volta como perseguidor inteligente, enquanto mutacoes indicam corrupcao subterranea.",
        tableSteps: [
          "Faça Vh'orr retornar quando o grupo estiver distraido com cura, politica ou investigacao.",
          "Use canarios deformados e criaturas mutantes para mostrar que a magia de Chaeron afetou o ecossistema.",
          "Ipmeek oferece cessar-fogo se trofeus sagrados forem devolvidos e a ofensa gnoma for reconhecida.",
        ],
        reveal:
          "A fome do ogro aumenta perto da fenda, como se algo antigo chamasse predadores e desesperados.",
        noviceTip:
          "Vh'orr nao precisa lutar ate cair. Sequestrar um PNJ ou destruir rota costuma ser mais interessante.",
      },
      {
        title: "Ato IV - Porta sob a montanha",
        focus:
          "Concluir com selamento, diplomacia ou violencia imperfeita diante da fenda fria de Chaeron.",
        tableSteps: [
          "Chaeron aparece como fantasma elegante, oferecendo fim da guerra por meio de um poder superior.",
          "A Chave do Demonio pode prender a entidade, mas exige alguem sustentando o triangulo perfeito sob risco.",
          "Force escolha entre paz dificil, colapso das minas, selamento com sacrificio ou fuga com a fenda viva.",
        ],
        reveal:
          "A entidade nao precisa de devotos fieis; precisa de medo, morte e passagens abertas.",
        noviceTip:
          "Quando faltar decisao, pergunte o que cada faccao perde se a fenda for selada agora.",
      },
    ],
    escalationClock: [
      "Desmoronamentos isolam rotas conhecidas.",
      "Vh'orr destrói um enclave secundario.",
      "Gnomos preparam explosivos para colapsar tuneis kobolds.",
      "Chaeron convence um lider desesperado a abrir a fenda.",
      "Desastre: a entidade da rocha desperta e transforma guerra em culto de sobrevivencia.",
    ],
    sceneSeeds: [
      "Um kobold oferece uma vela quebrada como pedido formal de conversa.",
      "Ozzy apresenta uma engenhoca capaz de salvar todos ou explodir o teto.",
      "Chaeron imita a voz de alguem amado por um personagem.",
      "Vh'orr deixa um corredor coberto de marcas de cutelo para conduzir o grupo a uma emboscada.",
    ],
    endings: [
      {
        title: "Paz das velas e engrenagens",
        outcome:
          "Gnomos e kobolds aceitam cessar-fogo ritual com garantias publicas.",
        consequence:
          "A montanha segue perigosa, mas a guerra deixa de alimentar Chaeron.",
      },
      {
        title: "Colapso controlado",
        outcome:
          "Os herois soterram a fenda e parte das minas.",
        consequence:
          "Sobreviventes chamam de vitoria, mas familias perdem lares e memoria.",
      },
      {
        title: "A chave gira",
        outcome:
          "A Chave do Demonio prende entidade e Chaeron.",
        consequence:
          "Ecos de mortos inocentes tambem ficam presos e passam a cantar nos tuneis.",
      },
      {
        title: "A fome reina",
        outcome:
          "Vh'orr devora um lider e vira terror comum das faccoes.",
        consequence:
          "A guerra pode cessar por medo, nao por justica.",
      },
    ],
    plot: [
      {
        title: "A fuga comeca embaixo do mundo",
        purpose:
          "Comecar com perigo fisico imediato e uma saida que nao pode ser simplesmente atravessada.",
        escalation:
          "Vh'orr aproxima, o cavalo pesa como refem e os gnomos tentam ajudar do jeito mais barulhento possivel.",
        question:
          "Os personagens salvam recursos, aliados ou silencio?",
        tableDynamics: [
          "Abra com contagem curta: passos de Vh'orr, cavalo respirando mal, luz azul abaixo e ossos se mexendo sob os pes.",
          "Peça a cada jogador uma acao imediata; quem hesitar percebe uma nova rota, mas tambem chama atencao.",
          "Use o cavalo como peso dramatico: salvar a criatura, usa-la como distração ou abandona-la muda o tom da fuga.",
          "Mostre que a saida existe, mas nunca esta limpa: cordas, trilhos, buracos e passagens baixas exigem escolhas de carga.",
        ],
        gmNotes: [
          "Vh'orr deve parecer inevitavel, nao invencivel; ele perde tempo, quebra parede e volta por outro caminho.",
          "Em 7-9, cobre um custo de mochila, luz, posicao ou ruido antes de cobrar PV.",
        ],
      },
      {
        title: "A guerra tem dois lados vivos",
        purpose:
          "Apresentar gnomos e kobolds como culturas em conflito, nao como faccoes descartaveis.",
        escalation:
          "Cada ajuda dada a um lado vira suspeita no outro e altera rotas seguras.",
        question:
          "Que promessa eles fazem antes de conhecer toda a historia?",
        tableDynamics: [
          "Apresente gnomos e kobolds com necessidades praticas: luz, comida, territorio, mortos, honra e medo de traicao.",
          "Cada lado oferece ajuda parcial e pede algo que prejudica a outra faccao, criando decisoes em vez de quest linear.",
          "Use Ozzy, Felix e Sassi para empurrar solucoes engenhosas que podem explodir a diplomacia.",
          "Deixe Ipmeek reconhecer bravura mesmo quando ameaca; isso abre negociacao para jogadores que nao querem apenas lutar.",
        ],
        gmNotes: [
          "Evite vilao simples. Mesmo uma emboscada kobold deve ter razao: trofeu, vinganca, luz ou protecao de rota.",
          "Quando os jogadores escolherem lado, anote quem fica em divida e quem passa a caçar o grupo.",
        ],
      },
      {
        title: "Chaeron ainda cobra resposta",
        purpose:
          "Puxar o enredo para magia negra, medo pessoal e consequencias de acordos antigos.",
        escalation:
          "Sussurros e criaturas tocadas pela escuridao tornam a saida menos importante que a verdade.",
        question:
          "Que mentira sobre Chaeron seria mais conveniente levar para a superficie?",
        tableDynamics: [
          "Solte lembrancas de Chaeron como eco: um nome em pedra, uma ferramenta abandonada, um corpo que nao deveria estar ali.",
          "Faca os sussurros oferecerem explicacao facil e moralmente confortavel, depois mostre uma prova que complica essa versao.",
          "Associe magia negra a escolhas de atalho: abrir porta sem chave, calar criatura, salvar alguem com custo suspeito.",
          "Permita que personagens religiosos, arcanos ou curiosos leiam pistas diferentes do mesmo vestigio.",
        ],
        gmNotes: [
          "O segredo de Chaeron deve servir a mesa atual; escolha a verdade que mais pressiona os vinculos dos personagens.",
          "Falhas aqui podem criar uma promessa fantasma, uma visao falsa ou um aliado acreditando na pior interpretacao.",
        ],
      },
      {
        title: "Subir nao encerra a guerra",
        purpose:
          "Fechar a sessao com decisao sobre pendencias, nao com limpeza total do complexo.",
        escalation:
          "Vh'orr pode voltar, os kobolds exigem luz, os gnomos exigem futuro.",
        question:
          "O grupo foge, arbitra a disputa ou deixa uma frente pronta para explodir depois?",
        tableDynamics: [
          "No final, coloque tres relogios ficcionais na mesa: Vh'orr chegando, uma faccao exigindo resposta e a saida ficando instavel.",
          "Se tentarem paz, faca cada lado pedir uma garantia concreta que alguem do grupo precise bancar.",
          "Se escolherem fugir, mostre quem fica para tras e qual promessa ainda ecoa no desfiladeiro.",
          "Se escolherem guerra, deixe a vitoria abrir uma consequencia politica para a proxima sessao.",
        ],
        gmNotes: [
          "Nao encerre todas as frentes se isso matar o interesse; Dungeon World funciona bem com uma pendencia viva.",
          "Em mesa pequena, reduza inimigos e aumente pressao de escolha; em mesa cheia, use o caos de faccoes ao mesmo tempo.",
        ],
      },
    ],
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
        motivation:
          "Provar que os Bobinas Lampejantes merecem controlar o desfiladeiro e sobreviver para contar vantagem.",
        secret:
          "Eles sabem mais sobre o acordo com Chaeron do que admitem quando estao assustados.",
        tableCue:
          "Interrompa a cena com uma ideia brilhante demais, perigosa demais ou barulhenta demais.",
        useAtTable:
          "Eles criam vantagem, equipamento, distracao e caos. Use-os como apoio com preco, nao como solucao automatica.",
      },
      {
        name: "Ipmeek Luta e Morde",
        role: "campeao kobold",
        motivation:
          "Reivindicar trofeus dos caidos e provar que a luz das velas nao sera tomada de novo.",
        secret:
          "Ele respeita coragem visivel, mas nunca dira isso diante de outros kobolds.",
        tableCue:
          "Fale como alguem pequeno tentando ocupar o dobro do proprio tamanho.",
        useAtTable:
          "Ele transforma trofeus em identidade. Pode emboscar, negociar por honra ou provar que os kobolds tem memoria.",
      },
      {
        name: "Ludekai Chaeron",
        role: "morto que ainda move a aventura",
        motivation:
          "Continuar influenciando vivos por culpa, rito, promessa ou medo mesmo depois da morte.",
        secret:
          "Sua caridade e sua corrupcao podem ser verdadeiras ao mesmo tempo; escolha a versao que fere mais a mesa.",
        tableCue:
          "Nunca explique tudo. Deixe uma frase incompleta voltar em sussurro quando alguem falhar.",
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
    secretTruth:
      "Deanera veio reerguer uma corte vampirica, mas encontrou Molekh consciente e ambicioso. A espada de Gorric carrega culpa templaria e pode reacender a mesma violencia que um dia selou Altai.",
    conductorNotes: [
      "Conduza Altai como guerra antiga voltando em forma de corte: frio, soberania, tributo e necromancia devem aparecer antes do combate final.",
      "Molekh nao e fera sem plano. Ele quer dominio, reconhecimento e submissao, e negocia como conquistador.",
      "Deanera e refinada e insegura. Use etiqueta absurda, servos quebrados e luxo parasita para tornar a fortaleza memoravel.",
    ],
    actGuides: [
      {
        title: "Ato I - Vilas sob a neve",
        focus:
          "Dar rosto humano ao retorno de Altai antes do grupo entrar na masmorra.",
        tableSteps: [
          "Comece em Uryl com pastores desaparecidos, ibex mutilados e marcas enormes de casco na neve.",
          "Faça uma crianca cantar uma cantiga antiga antes de qualquer minotauro aparecer.",
          "Um sobrevivente sem sangue suficiente para estar vivo avisa que a corte esta preparando a mesa.",
        ],
        reveal:
          "As vilas temem os minotauros e tambem os templarios, porque a ultima salvacao trouxe execucoes e fome.",
        noviceTip:
          "Antes do forte, peça nomes de desaparecidos. Nome proprio torna resgate mais facil de narrar.",
      },
      {
        title: "Ato II - Subida ao forte",
        focus:
          "Transformar a viagem em parte da ameaca: o gelo ja serve a fortaleza.",
        tableSteps: [
          "Vento apaga tochas, pontes congelam, gargulas observam e ecos de mugidos respondem avalanches.",
          "Mostre organizacao: aldeoes carregam prataria, esqueletos limpam neve e minotauros reabrem saloes.",
          "Deanera envia convite formal, chamando o grupo de hospedes de reputacao duvidosa.",
        ],
        reveal:
          "Altai nao esta apenas desperta; esta sendo preparada para governar de novo.",
        noviceTip:
          "A cada trecho da subida, ofereca uma escolha de custo: tempo, calor, silencio ou carga.",
      },
      {
        title: "Ato III - Corte de sangue",
        focus:
          "Fazer o salao de jantar impecavel virar a cena central de horror social.",
        tableSteps: [
          "Descreva mesa limpa, frio elegante e aldeoes servindo uma refeicao que ninguem vivo deveria aceitar.",
          "Deanera oferece recompensas, aldeoes e segredos se o grupo permitir que Molekh marche contra vilas templarias.",
          "Molekh interrompe a etiqueta exigindo tributo, duelo ou submissao.",
        ],
        reveal:
          "Deanera precisa dos minotauros, mas teme perder controle; Molekh aceita sua ajuda enquanto ela for util.",
        noviceTip:
          "Se o grupo so quiser atacar, use um lacaio aldeao pedindo ajuda para lembrar que ha vitimas na sala.",
      },
      {
        title: "Ato IV - Criptas e espada de Gorric",
        focus:
          "Encerrar com reliquia contaminada, comando morto-vivo e destino politico da montanha.",
        tableSteps: [
          "Nas criptas, os minotauros despertam em cadeia; quebrar comando importa mais que matar todos.",
          "A espada de Gorric mostra memoria de coragem, medo e fanatismo misturados.",
          "A conclusao exige decidir destino da espada, de Deanera e de Molekh.",
        ],
        reveal:
          "Matar um antagonista pode fortalecer o outro se o grupo ignorar a relacao entre sangue, tributo e reliquia.",
        noviceTip:
          "No final, mantenha dois focos ativos por vez: vilao, refens, espada ou ambiente. Mais que isso pode confundir mesa novata.",
      },
    ],
    escalationClock: [
      "Pastores desaparecem durante a noite.",
      "Molekh reune lordes chifrudos nas criptas.",
      "Uma forca templaria e repelida e reanimada.",
      "Uryl recebe exigencia de tributo em sangue e ibex.",
      "Desastre: Altai retoma as montanhas e vilas viram currais humanos.",
    ],
    sceneSeeds: [
      "Um lacaio aldeao derruba vinho e sussurra que sua filha ainda esta na cozinha.",
      "Molekh oferece a um guerreiro a chance de governar uma vila em seu nome.",
      "Deanera critica a decoracao enquanto mortos-vivos arrastam corpos pelo corredor.",
      "A espada de Gorric chora sangue congelado quando um templario mente perto dela.",
    ],
    endings: [
      {
        title: "Sepultura selada",
        outcome:
          "Molekh e destruido e as criptas sao purificadas.",
        consequence:
          "Uryl sobrevive, mas a Fe Roubada tenta reivindicar gloria e controle politico.",
      },
      {
        title: "A princesa foge",
        outcome:
          "Deanera escapa com uma reliquia ou mapa de poder.",
        consequence:
          "Ela se torna antagonista recorrente e procura novo palacio.",
      },
      {
        title: "Tributo sombrio",
        outcome:
          "O grupo negocia paz temporaria com Molekh.",
        consequence:
          "As vilas vivem pagando tributo; alguns chamam isso de covardia, outros de sobrevivencia.",
      },
      {
        title: "A espada volta para a Fe",
        outcome:
          "Gorric vira simbolo santo e a espada contaminada e celebrada.",
        consequence:
          "Uma cruzada pode nascer, tao perigosa quanto o retorno de Altai.",
      },
    ],
    plot: [
      {
        title: "A montanha volta a reclamar tributo",
        purpose:
          "Dar rosto humano ao perigo antes da masmorra: familias, ibex, vigias e nomes de desaparecidos.",
        escalation:
          "Quanto mais o grupo prepara a subida, mais sinais mostram que Uryl pode ser a proxima.",
        question:
          "Eles prometem salvar todos ou assumem que alguem ficara para tras?",
        tableDynamics: [
          "Antes da subida, mostre Uryl por pessoas concretas: uma vigia sem dormir, um pastor sem rebanho, uma crianca repetindo o mugido da montanha.",
          "Deixe preparacao importar: corda, luz, comida, abrigo e boatos mudam como a primeira cena no gelo comeca.",
          "Cada pergunta feita pelos jogadores revela uma perda nova, deixando claro que esperar tambem e escolha.",
          "Se prometerem salvar todos, anote a promessa em voz alta e use-a quando o forte exigir sacrificio.",
        ],
        gmNotes: [
          "A aventura ganha mais peso quando Uryl nao e so contratante; ela e aquilo que o grupo pode falhar em proteger.",
          "Use falhas de preparacao para gastar recursos, congelar equipamento ou fazer alguem desaparecer antes do portao.",
        ],
      },
      {
        title: "O forte esta morto, mas organizado",
        purpose:
          "Criar contraste entre ruina congelada e saloes impecaveis de uma corte impossivel.",
        escalation:
          "Lacaios, gelo e saloes limpos demais revelam que Deanera ja reorganiza a fortaleza.",
        question:
          "Os personagens tratam lacaios como vitimas, inimigos ou pistas?",
        tableDynamics: [
          "Dentro do forte, contraste gelo bruto com ordem impossivel: mesa posta, corredor limpo, ossos alinhados e sangue ainda quente.",
          "Lacaios devem ter sinais de vontade quebrada; a mesa precisa decidir se os derruba, liberta ou interroga sob risco.",
          "Use portas, saloes e galerias para dar rotas alternativas, mas cada rota deve ter custo: frio, tempo, barulho ou encontro.",
          "Deanera deve ser sentida antes de aparecer: perfume, tecido fino, voz distante e servos organizando o horror.",
        ],
        gmNotes: [
          "Em 7 jogadores, divida o forte em problemas paralelos; dois personagens seguram porta, dois investigam, outros negociam ou protegem luz.",
          "Se a mesa tratar tudo como combate, responda com informacao perdida, refens assustados ou uma vantagem de Deanera.",
        ],
      },
      {
        title: "A espada de Gorric pede escolha",
        purpose:
          "Transformar o objetivo de recuperacao em dilema de poder contaminado.",
        escalation:
          "Retirar a lamina chama mortos, quebra gelo ou mostra memoria que muda a leitura dos templarios.",
        question:
          "O grupo aceita uma arma util se ela tambem deseja massacre?",
        tableDynamics: [
          "A espada deve ter cena propria: frio cessando, memoria templaria, sangue antigo e uma sensacao de estar sendo julgado.",
          "Deixe personagens marciais sentirem poder, personagens sagrados sentirem corrupcao e personagens curiosos perceberem historia incompleta.",
          "Retirar a lamina deve mudar o mapa: gelo racha, morto desperta, Deanera percebe ou Molekh faz uma oferta.",
          "Se ninguem quiser a espada, recompense a prudencia com outra pista e cobre o risco de deixar a reliquia ali.",
        ],
        gmNotes: [
          "A espada nao precisa controlar personagem; basta tornar toda solucao violenta mais tentadora.",
          "Em falha, nao negue a reliquia. Entregue-a com marca, custo, ruido ou uma nova divida espiritual.",
        ],
      },
      {
        title: "Molekh negocia como conquistador",
        purpose:
          "Encerrar com ambicao e tributo, nao so com luta contra um monstro grande.",
        escalation:
          "Deanera, altar e minotauros oferecem acordos inaceitaveis quando a violencia nao basta.",
        question:
          "Que preco os personagens recusam mesmo que isso torne a vitoria mais dificil?",
        tableDynamics: [
          "Molekh deve falar como senhor de terra, nao como fera: ele oferece tributo, posto, fuga segura ou inimigo em comum.",
          "Coloque Deanera e Molekh em tensao; se os herois perceberem, podem explorar a rachadura entre luxo e conquista.",
          "Durante a luta, use investidas, pilares, gelo e refens para a cena mudar a cada rolagem.",
          "No epilogo, mostre Uryl reagindo ao que foi salvo, perdido ou escondido sobre a espada.",
        ],
        gmNotes: [
          "Para mesa cheia, mantenha Molekh, Deanera e ambiente ativos. Para mesa menor, escolha apenas dois focos por rodada ficcional.",
          "A vitoria mais interessante deixa uma pergunta: quem herdara Altai, o que fazer com a espada e quem ouviu o chamado do Ceifador.",
        ],
      },
    ],
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
        motivation:
          "Sobreviver sem abandonar as montanhas que sustentam leite, pele e memoria familiar.",
        secret:
          "Alguem viu um desaparecido voltar diferente, mas tem medo de admitir que abriu a porta.",
        tableCue:
          "Use nomes simples e pedidos concretos: uma filha, um rebanho, uma promessa antiga.",
        useAtTable:
          "Use pastores, leite de ibex, vigias cansados e nomes de desaparecidos para dar peso antes do forte.",
      },
      {
        name: "Princesa Deanera",
        role: "sacerdotisa vampirica e manipuladora",
        motivation:
          "Transformar a fortaleza brutal em uma corte digna, alimentada por sangue, magia e obediencia.",
        secret:
          "Ela acredita controlar os minotauros, mas Molekh aceita sua ajuda apenas enquanto ela amplia seu poder.",
        tableCue:
          "Seja cordial demais. Chame horrores de inconvenientes domesticos.",
        useAtTable:
          "Ela quer viver luxuosamente e roubar essencia. Pode oferecer acordo se os herois servirem melhor que seus lacaios.",
      },
      {
        name: "Diacono Gorric",
        role: "legado templario congelado",
        motivation:
          "Mesmo morto, representar a pergunta sobre o que os templarios sacrificaram para vencer Altai.",
        secret:
          "A espada nao e apenas reliquia: ela lembra sangue, ordem e contaminacao pelo mal que atravessou.",
        tableCue:
          "Mostre por imagem, nao fala: heráldica no gelo, sangue brilhando e um corpo velho demais para a ferida.",
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
    secretTruth:
      "A colonia usava fungos para domesticar trolls e proteger interesses economicos. Uma cepa trazida por troll de carga infectou a rainha, que agora usa memoria coletiva e rotas comerciais para tentar escapar do zigurate.",
    conductorNotes: [
      "Conduza como horror de sobrevivencia com dilema moral: a colonia tinha cultura, comercio e culpa antes de virar vetor.",
      "Nostarion e Eleniel nao sao apenas guias; eles carregam interesses elficos sobre magisita e podem tensionar a decisao final.",
      "Dê sinais antes do dano. Esporos, tosse, calor e corrosao ensinam o mestre novato a pedir rolagens quando a ficcao dispara.",
    ],
    actGuides: [
      {
        title: "Ato I - Entrada amarela",
        focus:
          "Comecar ja dentro da ameaca, com sala de distribuicao, lajes e operarias cambaleantes.",
        tableSteps: [
          "Descreva minerios, vegetais embolorados, fungo enorme e sombras vindas do corredor sul.",
          "Use esporos amarelos para criar paranoia: quem tossiu, quem esconde sintomas, quem chegou perto demais.",
          "Os elfos insistem em ir mais fundo para confirmar o destino da rainha e da magisita.",
        ],
        reveal:
          "A missao nao e simples limpeza; ha recurso, interesse politico e risco de contaminacao.",
        noviceTip:
          "Pergunte quem segura a frente, quem observa os elfos e quem protege a rota de fuga. Isso organiza mesa cheia.",
      },
      {
        title: "Ato II - Salas de cura e enviado aranha",
        focus:
          "Revelar que o fungo original domesticava trolls e que Pii'treb pode mudar a reputacao do grupo.",
        tableSteps: [
          "Nas salas de cura, mostre restos de trolls tratados como ferramenta biologica.",
          "Pii'treb ataca por medo, depois tenta negociar fuga por gestos, desenhos ou traducao improvisada.",
          "Nostarion tenta recolher magisita demais e Eleniel o confronta diante dos personagens.",
        ],
        reveal:
          "As formigas tambem tinham pecados, e os elfos podem transformar tragedia em saque.",
        noviceTip:
          "Dê a cada aliado um desejo curto: sair vivo, manter honra, levar magisita ou impedir quarentena maior.",
      },
      {
        title: "Ato III - Minas fungicas",
        focus:
          "Escalar para corrosao, trolls cobertos de esporos e uma infectada tentando abrir caminho para a superficie.",
        tableSteps: [
          "Cadaveres de trolls se movem em ciclos lentos, metal corrói e tochas queimam em cores doentias.",
          "Uma operaria infectada cava para a superficie; se escapar, a infeccao deixa de ser local.",
          "A magisita pode queimar, alimentar ou atrair escolhas ruins, dependendo do uso dos jogadores.",
        ],
        reveal:
          "O fungo aprende rotas, funcoes e desejos; ele nao e apenas um mofo parado na masmorra.",
        noviceTip:
          "Quando houver falha, avance a infeccao ou separe alguem, em vez de repetir dano seco.",
      },
      {
        title: "Ato IV - Lar da Rainha",
        focus:
          "Encerrar com rainha viva, ovos, chave de mandibula e decisao entre queimar, selar, curar ou estudar.",
        tableSteps: [
          "A entrada exige mandibula de guarda real, misturando ritual, violencia e urgencia.",
          "A Rainha Fungica alterna ordens de mae, dor coletiva e fome parasita.",
          "O final deve perguntar se a mesa aceita destruir um povo para conter a praga.",
        ],
        reveal:
          "A rainha ainda tem lampejos de consciencia; a ameaca e biologica, politica e tragica.",
        noviceTip:
          "Se criarem uma solucao inteligente, permita cura parcial ou selamento com custo alto em vez de forcar combate total.",
      },
    ],
    escalationClock: [
      "Tosse e olhos inchados aparecem em alguem vulneravel.",
      "Uma operaria infectada alcanca tuneis superiores.",
      "Nostarion rouba magisita e se perde.",
      "A Rainha libera ovos fungicos moveis.",
      "Desastre: a infeccao escapa do zigurate e torna quarentena regional inevitavel.",
    ],
    sceneSeeds: [
      "Uma formiga infectada oferece vegetais embolorados como se ainda recebesse visitantes.",
      "Eleniel levanta a espada contra Nostarion quando ele tenta esconder magisita.",
      "Pii'treb desenha uma rota de fuga em teia tremula.",
      "A Rainha fala em plural, misturando fome, maternidade e arrependimento.",
    ],
    endings: [
      {
        title: "Queima misericordiosa",
        outcome:
          "O zigurate e incendiado ou colapsado para conter a praga.",
        consequence:
          "A ameaca imediata acaba, mas qualquer sobrevivente formiga morre junto.",
      },
      {
        title: "Cura improvavel",
        outcome:
          "Rainha e fungo sao separados com magisita, Pii'treb e risco alto.",
        consequence:
          "A colonia vive, mas nunca volta a confiar plenamente nos elfos.",
      },
      {
        title: "Arma roubada",
        outcome:
          "Nostarion ou outra faccao leva amostra do fungo.",
        consequence:
          "A vitoria parece limpa, mas vira gancho de guerra biologica.",
      },
      {
        title: "Exilio das formigas",
        outcome:
          "Sobreviventes deixam o zigurate rumo a outra colonia.",
        consequence:
          "O grupo ganha aliados e culpa politica por expor fraquezas da colonia.",
      },
    ],
    plot: [
      {
        title: "O grupo ja esta no fundo do problema",
        purpose:
          "Eliminar preparacao lenta e colocar jogadores novatos em acao, escolhas e perguntas imediatas.",
        escalation:
          "Operarias chegam do corredor sul enquanto os elfos cobram que a rainha seja destruida.",
        question:
          "A prioridade e escapar, entender a infeccao ou cumprir o pedido dos guias?",
        tableDynamics: [
          "Comece sem explicacao longa: descreva fungo, calor, minerio, operarias vindo do sul e pergunte quem segura a frente.",
          "Nostarion e Eleniel devem discordar logo cedo para mostrar que os aliados nao sao manual de instrucao.",
          "Use cheiro, poeira e lajes para tornar movimento fisico importante mesmo antes do primeiro ataque.",
          "Quando um jogador perguntar o que sabe, responda com risco e opcao: da para descobrir, mas ficando perto demais.",
        ],
        gmNotes: [
          "Para novatos, traduza cada movimento em ficcao: primeiro diga o perigo, depois peça a rolagem quando a acao disparar.",
          "Em 7 jogadores, espalhe ameaças em tres entradas; em mesa menor, mantenha todos vendo a mesma ameaca.",
        ],
      },
      {
        title: "A colonia foi vitima e carcereira",
        purpose:
          "Revelar que o fungo usado contra trolls saiu de controle e tornou as formigas prisioneiras da propria arma.",
        escalation:
          "Cada pista util tambem aumenta risco de esporos, corrosao ou conflito entre aliados.",
        question:
          "Os personagens ainda chamam isso de missao simples depois de saber como a cura funcionava?",
        tableDynamics: [
          "As pistas devem mostrar engenharia biologica: jardins de fungo, trolls marcados, formigas hesitando e ferramentas de cultivo.",
          "Deixe alguem perceber que exterminar tudo pode resolver hoje e criar outro problema politico amanha.",
          "A infeccao deve alterar comportamento, nao apenas aparencia: tremor, obediencia quebrada, fome e cuidado com filhotes.",
          "Se os jogadores tentarem curar, permita progresso parcial com custos de tempo, magisita, agua limpa ou exposicao.",
        ],
        gmNotes: [
          "Nao puna curiosidade automaticamente; de sinais antes de dano para que jogadores aprendam a ler ambiente.",
          "Falhas boas aqui espalham esporos, isolam um aliado ou revelam que uma cura salva alguem e condena outro.",
        ],
      },
      {
        title: "Aliados querem coisas diferentes",
        purpose:
          "Fazer Nostarion, Eleniel e Pii'treb puxarem a aventura para politica e sobrevivencia.",
        escalation:
          "Magisita, idioma da aranha e medo de infeccao podem quebrar a cooperacao no pior momento.",
        question:
          "Quem o grupo protege quando todos os aliados escondem uma necessidade real?",
        tableDynamics: [
          "Nostarion quer magisita, Eleniel quer controle e Pii'treb quer sair vivo; coloque esses desejos em conflito na mesma sala.",
          "Permita conversa com Pii'treb por gesto, desenho, magia, comida ou interprete improvisado para valorizar criatividade.",
          "Quando aliados mentirem, nao revele como traicao simples; revele como medo, dever ou sobrevivencia.",
          "Use o mapa para separar temporariamente interesses: um corredor leva a magisita, outro a saida, outro a rainha.",
        ],
        gmNotes: [
          "Jogadores novatos entendem melhor dilemas quando cada PNJ pede algo curto, concreto e urgente.",
          "Em 7 jogadores, de a cada subgrupo um aliado para tensionar. Em mesa pequena, deixe os PNJs discutirem diante do grupo.",
        ],
      },
      {
        title: "A rainha e o broto final",
        purpose:
          "Encerrar com decisao sobre exterminio, contencao e consequencia biologica.",
        escalation:
          "Mesmo vencendo a rainha, o epilogo pode carregar um broto para fora.",
        question:
          "O que eles aceitam destruir para impedir que a praga aprenda novos hospedeiros?",
        tableDynamics: [
          "A rainha deve ser tragica e perigosa: mae, vetor, vitima e ameaca ao mesmo tempo.",
          "Use brotos, ovos, guardas e teto organico para que o combate tenha objetivos alem de zerar PV.",
          "Ofereca saidas diferentes: queimar tudo, selar a camara, levar amostra, negociar com aranhas ou confiar nos elfos.",
          "No fim, mostre uma consequencia sensorial pequena: espora no cabelo, formiga curvada, aranha agradecida ou magisita pulsando.",
        ],
        gmNotes: [
          "Se os jogadores vencerem com plano inteligente, nao force luta final completa; cobre o preco adequado e deixe a decisao pesar.",
          "O broto final funciona melhor como pergunta para proxima sessao, nao como castigo inevitavel.",
        ],
      },
    ],
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
        motivation:
          "Voltar vivo com magisita suficiente para justificar o horror que aceitou enfrentar.",
        secret:
          "Ele pode desertar para consumir ou recolher magisita se achar que a missao esta perdida.",
        tableCue:
          "Fale rapido, olhe para saidas e ofereca ajuda a distancia antes de chegar perto.",
        useAtTable:
          "Ele adiciona dano a disparos quando ajuda, mas seu medo e desejo por magisita podem quebrar confianca.",
      },
      {
        name: "Eleniel",
        role: "guia elfica de combate corpo a corpo",
        motivation:
          "Proteger o povo elfico e manter Nostarion vivo, nessa ordem quando a pressao sobe.",
        secret:
          "Ela entende que destruir tudo talvez seja mais seguro que salvar qualquer prova.",
        tableCue:
          "Responda pouco. Quando agir, descreva peso, espada e uma decisao sem pedir permissao.",
        useAtTable:
          "Ela e estoica e leal ao povo dela. Use-a para proteger alguem ou defender escolhas duras.",
      },
      {
        name: "Pii'treb",
        role: "enviado do povo aranha",
        motivation:
          "Escapar vivo e levar noticia confiavel para sua ninhada antes que os dejetos virem tumba.",
        secret:
          "Ele sabe que a sobrevivencia dele pode mudar comercio e abrigo para o grupo depois da fuga.",
        tableCue:
          "Comece hostil por medo; depois comunique gratidao em gestos, objetos e repeticao de nomes.",
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

export function getScale(players: PlayerCount) {
  return playerScale[players];
}

export function calculateDangerBudget(baseBudget: number, players: PlayerCount) {
  const scale = getScale(players);

  // O arredondamento para cima evita que uma cena vire inofensiva demais. O
  // valor final nao e "numero de monstros"; e um orcamento de pressao para o
  // mestre distribuir entre inimigos, ambiente, tempo e custo narrativo.
  return Math.max(1, Math.ceil(baseBudget * scale.multiplier));
}

export function getAdventureById(adventureId: string) {
  return adventures.find((adventure) => adventure.id === adventureId) ?? adventures[0];
}
