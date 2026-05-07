export type DwDice = "d4" | "d6" | "d8" | "d10";

export type DwSkill = {
  id: string;

  name: string;

  description: string;

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
  characteristics: string[];
  races: DwRaceOption[];
  startingSkills: DwSkill[];
  advancedSkillsLevel2To5: DwSkill[];
  advancedSkillsLevel6To10: DwSkill[];
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
  },

  {
    id: "clerigo",
    name: "Clérigo",
    baseHp: 8,
    damageDice: "d6",
    loadBase: 10,
    mainAttribute: "sabedoria",
    usesSpells: true,
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
        description:
          "Quando conjurar uma magia concedida por sua divindade, role +SAB e aceite os riscos espirituais de canalizar poder sagrado.",
      },
      {
        id: "expulsar-mortos-vivos",
        name: "Expulsar Mortos-Vivos",
        description:
          "Quando erguer seu símbolo sagrado e invocar sua divindade contra mortos-vivos, role +SAB para afastá-los ou destruí-los.",
      },
    ],
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
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
    name: "Ladrão",
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
        description:
          "Quando dedicar um momento para examinar uma área perigosa, role +DES para encontrar armadilhas, mecanismos ou perigos ocultos.",
      },
      {
        id: "truques-do-oficio",
        name: "Truques do Ofício",
        description:
          "Quando arrombar fechaduras, desarmar armadilhas ou manipular mecanismos delicados, role +DES.",
      },
      {
        id: "ataque-furtivo",
        name: "Ataque Furtivo",
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
  },

  {
    id: "mago",
    name: "Mago",
    baseHp: 4,
    damageDice: "d4",
    loadBase: 7,
    mainAttribute: "inteligencia",
    usesSpells: true,
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
  },

  {
    id: "ranger",
    name: "Ranger",
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
        description:
          "Quando seguir uma trilha de pistas deixada por criaturas, role +SAB para descobrir informações e manter o rastro.",
      },
      {
        id: "disparo-chamado",
        name: "Disparo Chamado",
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
    advancedSkillsLevel2To5: [],
advancedSkillsLevel6To10: [],
  },
];