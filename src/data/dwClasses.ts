import type { AttributeKey } from "../types/character";

export type DwDice = "d4" | "d6" | "d8" | "d10";

export type DwSkill = {
  id: string;

  name: string;

  description: string;
  rollAttribute?: AttributeKey;

  levelRequirement?: number;

  requiresSkillId?: string;

  replacesSkillId?: string;
};

export type DwRaceOption = {
  id: string;
  name: string;
  description: string;
};

export type DwClass = {
  id: string;
  name: string;
  description: string;
  baseHp: number;
  damageDice: DwDice;
  loadBase: number;
  mainAttribute?:
    | "forca"
    | "destreza"
    | "constituicao"
    | "inteligencia"
    | "sabedoria"
    | "carisma";
  usesSpells?: boolean;
  spellCastingAttribute?:
    | "forca"
    | "destreza"
    | "constituicao"
    | "inteligencia"
    | "sabedoria"
    | "carisma";
  spellcastingLabel?: string;
  characteristics: string[];
  races: DwRaceOption[];
  startingSkills: DwSkill[];
  advancedSkillsLevel2To5: DwSkill[];
  advancedSkillsLevel6To10: DwSkill[];
};

export const unselectedClass: DwClass = {
  id: "",
  name: "Classe nao selecionada",
  description:
    "Escolha uma classe para liberar detalhes, movimentos, itens iniciais, combate e progresso da ficha.",
  baseHp: 0,
  damageDice: "d4",
  loadBase: 0,
  usesSpells: false,
  characteristics: ["Escolha pendente"],
  races: [],
  startingSkills: [],
  advancedSkillsLevel2To5: [],
  advancedSkillsLevel6To10: [],
};

export const dwClasses: DwClass[] = [
  {
    id: "barbaro",
    name: "Bárbaro",
    baseHp: 8,
    damageDice: "d10",
    loadBase: 8,
    mainAttribute: "forca",
    usesSpells: false,
    description:
      "Um forasteiro brutal, movido por apetites, força e presença selvagem.",
    characteristics: [
      "Muito resistente",
      "Dano alto",
      "Movido por apetites e glória",
    ],
    races: [
      {
        id: "forasteiro",
        name: "Forasteiro",
        description:
          "Você pode ser elfo, anão, halfling ou humano, mas seu povo não é dessas redondezas. No início de cada sessão, o MJ pergunta algo sobre sua terra natal; se responder, marque XP.",
      },
    ],
    startingSkills: [
      {
        id: "forasteiro",
        name: "Forasteiro",
        description:
          "Você vem de terras distantes. Seu povo, costumes e aparência causam estranhamento, respeito ou medo onde quer que chegue.",
      },
      {
        id: "apetites-herculeos",
        name: "Apetites Hercúleos",
        description:
          "Escolha apetites que guiam suas ações, como conquista, prazer, riqueza, fama ou destruição. Quando buscar um apetite, você se expõe ao perigo e à glória.",
      },
      {
        id: "musculos-sobre-cerebro",
        name: "Músculos Sobre Cérebro",
        description:
          "Quando usar força bruta em vez de sutileza, você pode resolver problemas de forma direta, violenta e memorável.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "barbaro-continuo-faminto",
        name: "Continuo Faminto",
        levelRequirement: 2,
        description:
          "Escolha mais um apetite para guiar suas acoes e criar novas oportunidades de XP e complicacao.",
      },
      {
        id: "barbaro-apetite-por-destruicao",
        name: "Apetite por Destruicao",
        levelRequirement: 2,
        description:
          "Escolha um movimento de guerreiro, bardo ou ladino, sem pegar movimentos de multiclasse.",
      },
      {
        id: "barbaro-impressionar-pela-forca",
        name: "Meu Amor por Voce e Como um Caminhao",
        levelRequirement: 2,
        description:
          "Quando realizar um feito brutal de forca, marque quem ficou impressionado para ganhar vantagem social adiante.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "barbaro-apetite-insaciavel",
        name: "Apetite Insaciavel",
        levelRequirement: 6,
        requiresSkillId: "barbaro-continuo-faminto",
        description:
          "Seu apetite se torna lendario. Quando agir para satisfaze-lo, a ficcao deve oferecer uma recompensa maior ou uma complicacao mais perigosa.",
      },
      {
        id: "barbaro-destruicao-perfeita",
        name: "Destruicao Perfeita",
        levelRequirement: 6,
        requiresSkillId: "barbaro-apetite-por-destruicao",
        description:
          "Quando destruir algo importante pela forca, voce tambem revela uma fraqueza, passagem ou oportunidade escondida.",
      },
      {
        id: "barbaro-forca-de-tita",
        name: "Forca de Tita",
        levelRequirement: 6,
        description:
          "Quando executar um feito fisico absurdo, trate obstaculos comuns como detalhe narrativo e force o MJ a mostrar o verdadeiro custo.",
      },
      {
        id: "barbaro-riso-diante-da-morte",
        name: "Riso Diante da Morte",
        levelRequirement: 6,
        description:
          "Quando sobreviver a dano brutal ou perigo impossivel, marque sua presenca na cena e ganhe vantagem ficcional contra quem testemunhou.",
      },
    ],
  },

  {
    id: "bardo",
    name: "Bardo",
    baseHp: 6,
    damageDice: "d6",
    loadBase: 9,
    mainAttribute: "carisma",
    usesSpells: false,
    description:
      "Um artista, diplomata e manipulador de histórias, magia e influência social.",
    characteristics: [
      "Suporte versátil",
      "Arte Arcana",
      "Conhecimento de Bardo",
    ],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Quando entrar em um local importante, você pode pedir ao MJ que conte um fato sobre a história daquele lugar.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando entrar pela primeira vez em um local civilizado, alguém que respeita a hospitalidade aos menestréis irá recebê-lo como convidado.",
      },
    ],
    startingSkills: [
      {
        id: "arte-arcana",
        name: "Arte Arcana",
        rollAttribute: "carisma",
        description:
          "Quando usar uma apresentação para criar um efeito mágico, escolha efeitos como curar, causar dano adicional, encantar ou reforçar aliados.",
      },
      {
        id: "conhecimento-de-bardo",
        name: "Conhecimento de Bardo",
        description:
          "Escolha uma área de conhecimento. Quando encontrar algo relacionado a ela, o MJ lhe dirá algo útil sobre o assunto.",
      },
      {
        id: "charmoso-e-receptivo",
        name: "Charmoso e Receptivo",
        description:
          "Quando conversar francamente com alguém, você pode fazer perguntas e receber respostas sinceras ou reveladoras.",
      },
      {
        id: "um-porto-na-tempestade",
        name: "Um Porto na Tempestade",
        description:
          "Quando retornar a um local civilizado que já visitou, você pode encontrar abrigo, contatos ou alguém disposto a ouvir suas histórias.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "bardo-cura-arcana",
        name: "Cura Arcana",
        levelRequirement: 2,
        description:
          "Sua Arte Arcana pode restaurar mais vitalidade quando voce usa musica, palavra ou performance para ajudar.",
      },
      {
        id: "bardo-vicioso",
        name: "Vicioso",
        levelRequirement: 2,
        description:
          "Quando usar Arte Arcana para causar dano extra, o efeito se torna mais perigoso.",
      },
      {
        id: "bardo-multiclasse-diletante",
        name: "Multiclasse Diletante",
        levelRequirement: 2,
        description:
          "Escolha um movimento de outra classe como se seu nivel fosse menor para esse movimento.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "bardo-coro-de-guerra",
        name: "Coro de Guerra",
        levelRequirement: 6,
        requiresSkillId: "bardo-cura-arcana",
        description:
          "Sua Arte Arcana sustenta mais de um aliado na mesma cena, desde que sua performance continue fazendo sentido na ficcao.",
      },
      {
        id: "bardo-palavras-cortantes",
        name: "Palavras Cortantes",
        levelRequirement: 6,
        requiresSkillId: "bardo-vicioso",
        description:
          "Quando sua arte fere ou enfraquece um inimigo, ela tambem abala sua postura, reputacao ou coragem.",
      },
      {
        id: "bardo-multiclasse-mestre",
        name: "Multiclasse Mestre",
        levelRequirement: 6,
        requiresSkillId: "bardo-multiclasse-diletante",
        description:
          "Escolha outro movimento de uma classe diferente, tratando seu nivel como menor para respeitar os limites de multiclasse.",
      },
      {
        id: "bardo-lenda-viva",
        name: "Lenda Viva",
        levelRequirement: 6,
        description:
          "Quando chegar a um lugar onde historias importam, alguem ja ouviu uma versao exagerada de seus feitos.",
      },
    ],
  },

  {
    id: "clerigo",
    name: "Clérigo",
    baseHp: 8,
    damageDice: "d6",
    loadBase: 10,
    mainAttribute: "sabedoria",
    usesSpells: true,
    spellCastingAttribute: "sabedoria",
    spellcastingLabel: "Conjurar feiticos",
    description:
      "Um servo divino que conjura feitiços concedidos por sua divindade.",
    characteristics: ["Feitiços divinos", "Cura", "Expulsar mortos-vivos"],
    races: [
      {
        id: "anao",
        name: "Anão",
        description:
          "Quando comungar, receba como uma oração uma versão especial de Palavras dos Silenciosos que só funciona com pedras.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Escolha um feitiço de mago: você pode recebê-lo e conjurá-lo como se fosse um feitiço de clérigo.",
      },
    ],
    startingSkills: [
      {
        id: "divindade",
        name: "Divindade",
        description:
          "Você serve e cultua uma divindade. Defina seus domínios, preceitos, símbolos e o que ela exige de seus fiéis.",
      },
      {
        id: "prece",
        name: "Prece",
        description:
          "Você conhece orações simples concedidas por sua divindade, usadas para pequenos milagres, sinais e manifestações de fé.",
      },
      {
        id: "comungar",
        name: "Comungar",
        description:
          "Quando passar tempo em oração, você prepara magias clericais de acordo com seu nível e vínculo divino.",
      },
      {
        id: "conjurar-magia-clerigo",
        name: "Conjurar Magia",
        rollAttribute: "sabedoria",
        description:
          "Quando conjurar uma magia concedida por sua divindade, role +SAB e aceite os riscos espirituais de canalizar poder sagrado.",
      },
      {
        id: "expulsar-mortos-vivos",
        name: "Expulsar Mortos-Vivos",
        rollAttribute: "sabedoria",
        description:
          "Quando erguer seu símbolo sagrado e invocar sua divindade contra mortos-vivos, role +SAB para afastá-los ou destruí-los.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "clerigo-o-escolhido",
        name: "O Escolhido",
        levelRequirement: 2,
        description:
          "Escolha um feitico que sua divindade concede com mais facilidade, tratado como se fosse de nivel menor.",
      },
      {
        id: "clerigo-revigorar",
        name: "Revigorar",
        levelRequirement: 2,
        description:
          "Quando curar alguem, a pessoa tambem recebe impulso para causar dano em seguida.",
      },
      {
        id: "clerigo-equilibrio-vida-morte",
        name: "O Equilibrio entre a Vida e a Morte",
        levelRequirement: 2,
        description:
          "Sua presenca ajuda alguem que encara o ultimo suspiro a resistir ao chamado da morte.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "clerigo-escolhido-maior",
        name: "Escolhido Maior",
        levelRequirement: 6,
        requiresSkillId: "clerigo-o-escolhido",
        description:
          "A magia favorecida pela sua divindade se torna ainda mais facil de preparar e justificar dentro da ficcao sagrada.",
      },
      {
        id: "clerigo-cura-poderosa",
        name: "Cura Poderosa",
        levelRequirement: 6,
        requiresSkillId: "clerigo-revigorar",
        description:
          "Quando curar alguem, a cura tambem remove fraqueza, medo ou outro peso espiritual quando a ficcao permitir.",
      },
      {
        id: "clerigo-senhor-da-fronteira",
        name: "Senhor da Fronteira",
        levelRequirement: 6,
        requiresSkillId: "clerigo-equilibrio-vida-morte",
        description:
          "Sua presenca torna o ultimo suspiro mais favoravel para aliados que ainda tenham algo sagrado a cumprir.",
      },
      {
        id: "clerigo-voz-da-divindade",
        name: "Voz da Divindade",
        levelRequirement: 6,
        description:
          "Quando proclamar a vontade divina diante de fieis, inimigos ou mortos-vivos, a cena deve responder com temor, obediencia ou desafio claro.",
      },
    ],
  },

  {
    id: "druida",
    name: "Druida",
    baseHp: 6,
    damageDice: "d6",
    loadBase: 6,
    mainAttribute: "sabedoria",
    usesSpells: false,
    description:
      "Um guardião espiritual da natureza, capaz de assumir formas animais.",
    characteristics: [
      "Metamorfose",
      "Ligação com a terra",
      "Espíritos da natureza",
    ],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "A Grande Floresta é sempre considerada sua terra, além de quaisquer outras ligações.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Você sempre será capaz de assumir a forma de qualquer animal domesticado, além de suas opções normais.",
      },
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando montar acampamento, você e seus aliados curam +1d6.",
      },
    ],
    startingSkills: [
      {
        id: "nascido-do-solo",
        name: "Nascido do Solo",
        description:
          "Escolha sua terra natal. Você está ligado aos espíritos, animais e formas naturais desse território.",
      },
      {
        id: "estudo-da-essencia",
        name: "Estudo da Essência",
        description:
          "Quando estudar ou observar um espírito, animal ou fenômeno natural, você pode entender sua natureza e comportamento.",
      },
      {
        id: "metamorfose",
        name: "Metamorfose",
        rollAttribute: "sabedoria",
        description:
          "Quando invocar os espíritos da natureza para assumir outra forma, role +SAB e ganhe domínio temporário daquela forma.",
      },
      {
        id: "lingua-dos-espiritos",
        name: "Língua dos Espíritos",
        description:
          "Você pode falar com os espíritos da natureza e criaturas ligadas à sua terra.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "druida-irmao-do-cacador",
        name: "Irmao do Cacador",
        levelRequirement: 2,
        description:
          "Escolha um movimento da lista do patrulheiro, ligando sua natureza ao instinto de caca.",
      },
      {
        id: "druida-garras-dentes-vermelhos",
        name: "Garras e Dentes Vermelhos",
        levelRequirement: 2,
        description:
          "Em uma forma animal perigosa, seu dano aumenta e sua presenca se torna mais ameacadora.",
      },
      {
        id: "druida-comunhao-dos-sussurros",
        name: "Comunhao dos Sussurros",
        levelRequirement: 2,
        rollAttribute: "sabedoria",
        description:
          "Ao observar os espiritos de um lugar, voce pode fazer perguntas sobre a area e seus perigos.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "druida-pele-do-predador",
        name: "Pele do Predador",
        levelRequirement: 6,
        requiresSkillId: "druida-garras-dentes-vermelhos",
        description:
          "Suas formas animais perigosas ganham presença dominante; quando atacar nelas, o ambiente reage como se um predador maior tivesse chegado.",
      },
      {
        id: "druida-conselho-dos-espiritos",
        name: "Conselho dos Espiritos",
        levelRequirement: 6,
        requiresSkillId: "druida-comunhao-dos-sussurros",
        description:
          "Quando consultar os espiritos de um local, eles tambem indicam o que desejam, temem ou protegem.",
      },
      {
        id: "druida-sangue-da-terra",
        name: "Sangue da Terra",
        levelRequirement: 6,
        description:
          "Quando defender sua terra ou algo natural ameacado, receba permissao ficcional para feitos impossiveis a um corpo comum.",
      },
      {
        id: "druida-muitas-peles",
        name: "Muitas Peles",
        levelRequirement: 6,
        description:
          "Voce alterna formas conhecidas com mais liberdade quando a cena esta ligada aos seus espiritos, instintos ou territorio.",
      },
    ],
  },

  {
    id: "engenheiro-arcano",
    name: "Engenheiro Arcano",
    baseHp: 4,
    damageDice: "d4",
    loadBase: 7,
    mainAttribute: "inteligencia",
    usesSpells: true,
    spellCastingAttribute: "inteligencia",
    spellcastingLabel: "Ativar efeitos",
    description:
      "Um inventor magitecnico que registra efeitos em um codex e os ativa por dispositivos instaveis.",
    characteristics: ["Codex", "Dispositivos", "Magitecnologia"],
    races: [
      {
        id: "pesquisa-desenvolvimento",
        name: "Pesquisa e Desenvolvimento",
        description:
          "Detectar Magia e Maquinas e tratado como rotina. Seu olhar tecnico percebe energia, engrenagens e falhas ocultas.",
      },
      {
        id: "biotecnologia",
        name: "Biotecnologia",
        description:
          "Escolha um feitico de clerigo: voce pode explica-lo como efeito de engenheiro quando estiver registrado no codex.",
      },
    ],
    startingSkills: [
      {
        id: "codex-arcano",
        name: "Codex",
        description:
          "Voce registra rotinas e efeitos em um codex de peso 1. Comece com todas as rotinas e tres efeitos de nivel 1.",
      },
      {
        id: "preparar-dispositivos",
        name: "Preparar Dispositivos",
        description:
          "Quando passar cerca de uma hora conectando dispositivos ao codex, desative efeitos antigos e prepare efeitos cujo total de niveis nao supere seu nivel + 1. Rotinas nao contam nesse limite.",
      },
      {
        id: "ativar-efeitos",
        name: "Ativar Efeitos",
        rollAttribute: "inteligencia",
        description:
          "Quando ativar um efeito preparado, role +INT. Com 10+, funciona sem defeitos. Com 7-9, funciona, mas escolha bug, atencao indesejada ou gasto de energia do dispositivo.",
      },
      {
        id: "escudo-eletromagnetico",
        name: "Escudo Eletromagnetico",
        description:
          "Voce pode encerrar um efeito continuo para defletir um ataque, subtraindo o nivel do efeito do dano recebido.",
      },
      {
        id: "invencoes-fantasticas",
        name: "Invencoes Fantasticas",
        description:
          "Quando usar energia de um local de alta tecnologia ou magia para criar uma invencao, diga o efeito desejado; o MJ dira custos, riscos, tempo, materiais ou limitacoes.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "engenheiro-prodigio",
        name: "Prodigio",
        levelRequirement: 2,
        description:
          "Escolha um efeito. Ele conta como 1 nivel menor quando voce prepara dispositivos.",
      },
      {
        id: "engenheiro-efeito-potencializado",
        name: "Efeito Potencializado",
        levelRequirement: 2,
        description:
          "Quando ativar efeitos com 10+, voce pode aceitar uma escolha de 7-9 para maximizar o efeito ou dobrar seus alvos.",
      },
      {
        id: "engenheiro-fonte-de-conhecimento",
        name: "Fonte de Conhecimento",
        levelRequirement: 2,
        description:
          "Quando falar dificil sobre algo que ninguem mais sabe, receba +1 adiante se agir de acordo com essa explicacao.",
      },
      {
        id: "engenheiro-codex-expandido",
        name: "Codex Expandido",
        levelRequirement: 2,
        description:
          "Adicione um efeito inspirado em outra classe ao seu codex, traduzindo magia em magitecnologia.",
      },
      {
        id: "engenheiro-logica",
        name: "Logica",
        levelRequirement: 2,
        rollAttribute: "inteligencia",
        description:
          "Quando analisar os arredores por deducao pura, voce pode discernir realidades com INT no lugar de SAB.",
      },
      {
        id: "engenheiro-protecao-eletrostatica",
        name: "Protecao Eletrostatica",
        levelRequirement: 2,
        description:
          "Enquanto tiver pelo menos um efeito de nivel 1 ou superior preparado, receba armadura +2.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "engenheiro-mestre",
        name: "Mestre",
        levelRequirement: 6,
        requiresSkillId: "engenheiro-prodigio",
        description:
          "Escolha um segundo efeito para contar como 1 nivel menor quando preparar dispositivos.",
      },
      {
        id: "engenheiro-efeito-potencializado-superior",
        name: "Efeito Potencializado Superior",
        levelRequirement: 6,
        requiresSkillId: "engenheiro-efeito-potencializado",
        description:
          "Com 12+ ao ativar efeitos, voce pode ampliar efeitos ou alvos sem pagar o custo de uma escolha de 7-9.",
      },
      {
        id: "engenheiro-logica-extrema",
        name: "Logica Extrema",
        levelRequirement: 6,
        requiresSkillId: "engenheiro-logica",
        rollAttribute: "inteligencia",
        description:
          "Quando discernir realidades por deducao pura e tirar 12+, faca quaisquer tres perguntas ao MJ.",
      },
      {
        id: "engenheiro-armadura-magitronica",
        name: "Armadura Magitronica",
        levelRequirement: 6,
        requiresSkillId: "engenheiro-protecao-eletrostatica",
        description:
          "Enquanto tiver pelo menos um efeito de nivel 1 ou superior preparado, receba armadura +4.",
      },
      {
        id: "engenheiro-domo-de-nulificacao",
        name: "Domo de Nulificacao",
        levelRequirement: 6,
        description:
          "Quando um aliado em sua linha de visao for alvo de feitico, voce pode tentar nulifica-lo como se fosse o alvo.",
      },
      {
        id: "engenheiro-autossuficiente",
        name: "Autossuficiente",
        levelRequirement: 6,
        description:
          "Com tempo, pecas, materiais arcanos e seguranca, voce pode criar seu proprio local de poder magitecnico.",
      },
    ],
  },

  {
    id: "guerreiro",
    name: "Guerreiro",
    baseHp: 10,
    damageDice: "d10",
    loadBase: 12,
    mainAttribute: "forca",
    usesSpells: false,
    description:
      "Um combatente resistente, feito para segurar a linha de frente.",
    characteristics: ["Alta resistência", "Dano alto", "Arma assinatura"],
    races: [
      {
        id: "anao",
        name: "Anão",
        description:
          "Quando compartilhar uma bebida com alguém, você pode parlamentar usando CON no lugar de CAR.",
      },
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Escolha uma arma. Você sempre a trata como se tivesse o rótulo precisa.",
      },
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando desafiar o perigo usando seu tamanho pequeno como vantagem, receba +1.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Uma vez por batalha, você pode rolar novamente uma única rolagem de dano sua ou contra você.",
      },
    ],
    startingSkills: [
      {
        id: "arma-assinatura",
        name: "Arma Assinatura",
        description:
          "Você possui uma arma única e especial. Escolha seu tipo, aparência e propriedades. Ela representa sua história e estilo de combate.",
      },
      {
        id: "dobrar-barras-levantar-portoes",
        name: "Dobrar Barras, Levantar Portões",
        rollAttribute: "forca",
        description:
          "Quando usar força bruta para destruir uma barreira, dobrar metal, quebrar portas ou superar obstáculos físicos, role +FOR.",
      },
    ],
    advancedSkillsLevel2To5: [
  {
    id: "sanguinario",
    name: "Sanguinário",
    description:
      "Quando causar dano, cause +1d4 adicional.",
    levelRequirement: 2,
  },

  {
    id: "armadura-mestra",
    name: "Armadura Mestra",
    description:
      "Você ignora a desajeitada de qualquer armadura que vestir.",
    levelRequirement: 2,
  },

  {
    id: "aparar",
    name: "Aparar",
    description:
      "Quando sofrer dano corpo a corpo, você pode reduzir o dano usando sua arma.",
    levelRequirement: 2,
  },

  {
    id: "multiclasse-diletante",
    name: "Multiclasse: Diletante",
    description:
      "Escolha um movimento inicial de outra classe.",
    levelRequirement: 2,
  },
],

advancedSkillsLevel6To10: [
  {
    id: "olho-mortal",
    name: "Olho Mortal",
    description:
      "Quando entrar em combate, escolha um inimigo. Contra ele, seus ataques são especialmente devastadores.",
    levelRequirement: 6,
    requiresSkillId: "sanguinario",
  },

  {
    id: "superioridade-metalica",
    name: "Superioridade Metálica",
    description:
      "Sua armadura se torna uma extensão natural do seu corpo.",
    levelRequirement: 6,
    requiresSkillId: "armadura-mestra",
  },

  {
    id: "mestre-da-guerra",
    name: "Mestre da Guerra",
    description:
      "Quando comandar aliados em combate, receba vantagens táticas claras.",
    levelRequirement: 6,
  },

  {
    id: "multiclasse-mestre",
    name: "Multiclasse: Mestre",
    description:
      "Escolha um movimento avançado de outra classe.",
    levelRequirement: 6,
    requiresSkillId: "multiclasse-diletante",
  },
],
  },

  {
    id: "ladrao",
    name: "Ladino",
    baseHp: 6,
    damageDice: "d8",
    loadBase: 9,
    mainAttribute: "destreza",
    usesSpells: false,
    description:
      "Um especialista em furtividade, venenos, armadilhas e ataques precisos.",
    characteristics: ["Furtividade", "Ataque surpresa", "Armadilhas e venenos"],
    races: [
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando atacar com uma arma de longo alcance, cause dano +2.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando falar difícil ou discernir realidades com relação a atividades criminosas, receba +1.",
      },
    ],
    startingSkills: [
      {
        id: "especialista-em-armadilhas",
        name: "Especialista em Armadilhas",
        rollAttribute: "destreza",
        description:
          "Quando dedicar um momento para examinar uma área perigosa, role +DES para encontrar armadilhas, mecanismos ou perigos ocultos.",
      },
      {
        id: "truques-do-oficio",
        name: "Truques do Ofício",
        rollAttribute: "destreza",
        description:
          "Quando arrombar fechaduras, desarmar armadilhas ou manipular mecanismos delicados, role +DES.",
      },
      {
        id: "ataque-furtivo",
        name: "Ataque Furtivo",
        rollAttribute: "destreza",
        description:
          "Quando atacar um inimigo surpreso ou indefeso com uma arma corpo a corpo, você pode escolher causar dano extra ou obter vantagem tática.",
      },
      {
        id: "flexivel-moralmente",
        name: "Flexível Moralmente",
        description:
          "Quando alguém tentar detectar seu alinhamento ou moralidade, você pode responder como se fosse de outro alinhamento.",
      },
      {
        id: "preparar-veneno",
        name: "Preparar Veneno",
        description:
          "Você sabe preparar e usar venenos com segurança, aplicando-os em armas ou situações adequadas.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "ladrao-golpe-desonesto",
        name: "Golpe Desonesto",
        levelRequirement: 2,
        rollAttribute: "destreza",
        description:
          "Quando atacar pelas costas com arma precisa ou de mao, seu dano furtivo se torna mais letal.",
      },
      {
        id: "ladrao-cauteloso",
        name: "Cauteloso",
        levelRequirement: 2,
        rollAttribute: "destreza",
        description:
          "Ao avaliar armadilhas, voce sempre conserva algum dominio da situacao, mesmo quando as coisas pioram.",
      },
      {
        id: "ladrao-riqueza-bom-gosto",
        name: "Riqueza e Bom Gosto",
        levelRequirement: 2,
        description:
          "Ao ostentar valor ou estilo, voce atrai atencao util e descobre quem deseja aquilo que carrega.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "ladrao-golpe-mortal",
        name: "Golpe Mortal",
        levelRequirement: 6,
        requiresSkillId: "ladrao-golpe-desonesto",
        rollAttribute: "destreza",
        description:
          "Quando atacar um alvo vulneravel, seu golpe tambem cria uma vantagem decisiva: fuga, refem, silencio ou posicao.",
      },
      {
        id: "ladrao-impossivel-de-prender",
        name: "Impossivel de Prender",
        levelRequirement: 6,
        requiresSkillId: "ladrao-cauteloso",
        description:
          "Quando armadilhas, correntes ou guardas deveriam conter voce, diga qual detalhe havia preparado para ter uma saida.",
      },
      {
        id: "ladrao-mestre-dos-venenos",
        name: "Mestre dos Venenos",
        levelRequirement: 6,
        description:
          "Seus venenos sao mais confiaveis e podem carregar efeitos mais sutis, desde que voce tenha tempo e ingredientes adequados.",
      },
      {
        id: "ladrao-reputacao-perigosa",
        name: "Reputacao Perigosa",
        levelRequirement: 6,
        requiresSkillId: "ladrao-riqueza-bom-gosto",
        description:
          "Quando entrar no submundo de uma cidade, alguem conhece seu nome e oferece respeito, medo ou uma divida antiga.",
      },
    ],
  },

  {
    id: "mago",
    name: "Mago",
    baseHp: 4,
    damageDice: "d4",
    loadBase: 7,
    mainAttribute: "inteligencia",
    usesSpells: true,
    spellCastingAttribute: "inteligencia",
    spellcastingLabel: "Conjurar feiticos",
    description:
      "Um estudioso arcano que prepara e conjura feitiços através de grimório.",
    characteristics: ["Grimório", "Preparar feitiços", "Ritual"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description: "Detectar Magia é considerado um truque para você.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Escolha um feitiço de clérigo. Você pode conjurá-lo como se fosse um feitiço de mago.",
      },
    ],
    startingSkills: [
      {
        id: "grimorio",
        name: "Grimório",
        description:
          "Você possui um grimório contendo suas magias. Ele é a fonte do seu preparo arcano e deve ser protegido.",
      },
      {
        id: "preparar-magias",
        name: "Preparar Magias",
        description:
          "Quando passar tempo estudando seu grimório, você prepara magias de acordo com seu nível e inteligência.",
      },
      {
        id: "conjurar-magia-mago",
        name: "Conjurar Magia",
        rollAttribute: "inteligencia",
        description:
          "Quando liberar uma magia preparada, role +INT e aceite as consequências de manipular forças arcanas instáveis.",
      },
      {
        id: "defesa-arcana",
        name: "Defesa Arcana",
        description:
          "Enquanto tiver ao menos uma magia preparada de primeiro círculo ou superior, você recebe proteção mágica contra dano.",
      },
      {
        id: "ritual",
        name: "Ritual",
        description:
          "Quando recorrer a um local de poder para criar um efeito mágico maior, o MJ dirá o que é necessário, custoso ou perigoso.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "mago-prodigio",
        name: "Prodigio",
        levelRequirement: 2,
        description:
          "Escolha um feitico que voce prepara com mais facilidade, tratando-o como se fosse de nivel menor.",
      },
      {
        id: "mago-magia-potencializada",
        name: "Magia Potencializada",
        levelRequirement: 2,
        description:
          "Quando conjurar com grande controle, voce pode aceitar risco extra para ampliar efeito ou alvos.",
      },
      {
        id: "mago-fonte-de-conhecimento",
        name: "Fonte de Conhecimento",
        levelRequirement: 2,
        rollAttribute: "inteligencia",
        description:
          "Quando explicar algo obscuro, voce pode transformar estudo arcano em informacao util para a cena.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "mago-prodigio-maior",
        name: "Prodigio Maior",
        levelRequirement: 6,
        requiresSkillId: "mago-prodigio",
        description:
          "Seu feitico favorecido exige ainda menos preparo e pode ser explicado como assinatura arcana do seu grimorio.",
      },
      {
        id: "mago-magia-maximizada",
        name: "Magia Maximizada",
        levelRequirement: 6,
        requiresSkillId: "mago-magia-potencializada",
        description:
          "Quando aceitar consequencias ao conjurar, o efeito pode atingir escala, alcance ou intensidade muito superior.",
      },
      {
        id: "mago-erudito-arcano",
        name: "Erudito Arcano",
        levelRequirement: 6,
        requiresSkillId: "mago-fonte-de-conhecimento",
        rollAttribute: "inteligencia",
        description:
          "Quando consultar seu grimorio ou memoria sobre magia antiga, o MJ deve revelar uma verdade util e um perigo associado.",
      },
      {
        id: "mago-ritualista",
        name: "Ritualista",
        levelRequirement: 6,
        description:
          "Quando realizar Ritual, voce pode propor uma exigencia aceitavel antes do MJ listar custos, materiais ou perigos.",
      },
    ],
  },

  {
    id: "paladino",
    name: "Paladino",
    baseHp: 10,
    damageDice: "d10",
    loadBase: 12,
    mainAttribute: "carisma",
    usesSpells: false,
    description:
      "Um guerreiro sagrado movido por juramentos, proteção e julgamento.",
    characteristics: ["Imposição de mãos", "Quest", "Autoridade divina"],
    races: [
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando rezar por orientação, mesmo que por um momento, e perguntar 'O que é maligno aqui?', o MJ lhe dirá honestamente.",
      },
    ],
    startingSkills: [
      {
        id: "imposicao-de-maos",
        name: "Imposição de Mãos",
        rollAttribute: "carisma",
        description:
          "Quando tocar alguém pele com pele e rezar por seu bem, role +CAR para curar ou compartilhar sofrimento.",
      },
      {
        id: "armado-pela-fe",
        name: "Armado Pela Fé",
        description:
          "Sua causa, juramento e presença sagrada tornam sua autoridade visível diante de aliados e inimigos.",
      },
      {
        id: "eu-sou-a-lei",
        name: "Eu Sou a Lei",
        rollAttribute: "carisma",
        description:
          "Quando ordenar algo a uma criatura em nome de sua autoridade divina, role +CAR.",
      },
      {
        id: "questao",
        name: "Questão",
        description:
          "Quando dedicar-se a uma missão sagrada por meio de oração e purificação, escolha bênçãos e votos que guiarão sua jornada.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "paladino-favor-divino",
        name: "Favor Divino",
        levelRequirement: 2,
        description:
          "Dedique-se a uma divindade e passe a acessar comunhao e conjuracao como um clerigo iniciante.",
      },
      {
        id: "paladino-investida-sangrenta",
        name: "Investida Sangrenta",
        levelRequirement: 2,
        description:
          "Quando mergulhar no combate em nome da sua causa, seu dano aumenta ao custo de maior exposicao.",
      },
      {
        id: "paladino-exterminatus",
        name: "Exterminatus",
        levelRequirement: 2,
        description:
          "Quando declarar um inimigo como alvo de sua missao sagrada, sua violencia ganha peso ritual.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "paladino-santo-armado",
        name: "Santo Armado",
        levelRequirement: 6,
        requiresSkillId: "paladino-favor-divino",
        description:
          "Sua causa sagrada se manifesta em combate; quando agir conforme seus votos, sua autoridade divina pesa na cena.",
      },
      {
        id: "paladino-martelo-do-julgamento",
        name: "Martelo do Julgamento",
        levelRequirement: 6,
        requiresSkillId: "paladino-investida-sangrenta",
        description:
          "Quando ferir alguem marcado por sua missao, o golpe tambem o empurra para rendicao, fuga ou revelacao.",
      },
      {
        id: "paladino-campeao-da-questao",
        name: "Campeao da Questao",
        levelRequirement: 6,
        requiresSkillId: "paladino-exterminatus",
        description:
          "Enquanto seguir sua missao sagrada, aliados reconhecem sua determinacao e inimigos entendem o custo de enfrenta-lo.",
      },
      {
        id: "paladino-aura-de-coragem",
        name: "Aura de Coragem",
        levelRequirement: 6,
        description:
          "Quando liderar aliados contra medo, tentacao ou desespero, sua presenca oferece uma escolha clara para resistir.",
      },
    ],
  },

  {
    id: "ranger",
    name: "Patrulheiro",
    baseHp: 8,
    damageDice: "d8",
    loadBase: 11,
    mainAttribute: "destreza",
    usesSpells: false,
    description:
      "Um caçador, rastreador e sobrevivente com ligação forte com a natureza.",
    characteristics: ["Rastrear", "Companheiro animal", "Caçador experiente"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Quando empreender uma jornada perigosa através de ermos, trate um resultado 6- como 7-9.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando montar acampamento em uma masmorra ou cidade, não precisa consumir ração.",
      },
    ],
    startingSkills: [
      {
        id: "cacar-e-rastrear",
        name: "Caçar e Rastrear",
        rollAttribute: "sabedoria",
        description:
          "Quando seguir uma trilha de pistas deixada por criaturas, role +SAB para descobrir informações e manter o rastro.",
      },
      {
        id: "disparo-chamado",
        name: "Disparo Chamado",
        rollAttribute: "destreza",
        description:
          "Quando atacar um alvo indefeso ou surpreso à distância, escolha uma parte do corpo e aplique um efeito apropriado.",
      },
      {
        id: "companheiro-animal",
        name: "Companheiro Animal",
        description:
          "Você possui um companheiro animal leal, com instintos, treinamento e forças próprias.",
      },
      {
        id: "comando",
        name: "Comando",
        description:
          "Quando agir em conjunto com seu companheiro animal, ele contribui com seus pontos fortes e treinamento.",
      },
    ],
    advancedSkillsLevel2To5: [
      {
        id: "ranger-empatia-selvagem",
        name: "Empatia Selvagem",
        levelRequirement: 2,
        rollAttribute: "sabedoria",
        description:
          "Voce se comunica melhor com animais e percebe intencoes por postura, som e instinto.",
      },
      {
        id: "ranger-presa",
        name: "Presa",
        levelRequirement: 2,
        rollAttribute: "sabedoria",
        description:
          "Ao estudar uma criatura ou rastro, voce sabe como perseguir, cercar ou pressionar sua presa.",
      },
      {
        id: "ranger-companheiro-aprimorado",
        name: "Companheiro Aprimorado",
        levelRequirement: 2,
        description:
          "Seu companheiro animal recebe mais destaque na ficcao e se torna mais confiavel em sua funcao.",
      },
    ],
    advancedSkillsLevel6To10: [
      {
        id: "ranger-senhor-das-ferase",
        name: "Senhor das Feras",
        levelRequirement: 6,
        requiresSkillId: "ranger-companheiro-aprimorado",
        description:
          "Seu companheiro animal age com autonomia heroica quando seus instintos e treinamento apontam a mesma direcao.",
      },
      {
        id: "ranger-cacador-implacavel",
        name: "Cacador Implacavel",
        levelRequirement: 6,
        requiresSkillId: "ranger-presa",
        rollAttribute: "sabedoria",
        description:
          "Quando marcar uma presa, ela nao consegue se esconder de voce sem deixar um custo, rastro ou vulnerabilidade.",
      },
      {
        id: "ranger-voz-da-mata",
        name: "Voz da Mata",
        levelRequirement: 6,
        requiresSkillId: "ranger-empatia-selvagem",
        description:
          "Animais e sinais naturais podem levar mensagens, avisos ou pressagios quando voce respeita seus limites.",
      },
      {
        id: "ranger-trilha-impossivel",
        name: "Trilha Impossivel",
        levelRequirement: 6,
        description:
          "Quando seguir uma trilha que deveria ter se perdido, diga que sinal pequeno ainda aponta o caminho.",
      },
    ],
  },
];
