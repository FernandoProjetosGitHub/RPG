import { spells } from "./spells";

export type CreationChoiceKind = "select" | "text";

export type CreationChoiceRule = {
  id: string;
  label: string;
  helper: string;
  kind: CreationChoiceKind;
  required?: boolean;
  options?: string[];
  classIds?: string[];
  raceIds?: string[];
  grantsSpellFrom?: "clerigo" | "mago";
  maxSpellLevel?: number;
};

export type AppliedCreationBenefit = {
  label: string;
  value: string;
};

const commonLookRules: CreationChoiceRule[] = [
  {
    id: "look-eyes",
    label: "Olhar",
    helper: "Escolha como os olhos do personagem aparecem em cena.",
    kind: "text",
    required: true,
  },
  {
    id: "look-body",
    label: "Corpo e presença",
    helper: "Descreva o corpo, porte ou marca visual mais evidente.",
    kind: "text",
    required: true,
  },
];

export const creationChoiceRules: CreationChoiceRule[] = [
  ...commonLookRules,
  {
    id: "alignment",
    label: "Alinhamento",
    helper: "Escolha a motivacao que rende XP quando orientar suas acoes.",
    kind: "select",
    required: true,
    options: ["Bom", "Neutro", "Caotico", "Ordeiro", "Mau"],
  },
  {
    id: "bard-knowledge",
    label: "Conhecimento de Bardo",
    helper: "Area em que o MJ deve revelar informacao util quando ela aparecer.",
    kind: "select",
    required: true,
    classIds: ["bardo"],
    options: [
      "Magias e feiticos",
      "Mortos e mortos-vivos",
      "Grandes historias",
      "Bestiario",
      "Esferas planares",
      "Lendas de herois",
      "Deuses e seus servos",
    ],
  },
  {
    id: "bard-instrument",
    label: "Instrumento",
    helper: "Instrumento inicial do bardo; peso 0 para ele.",
    kind: "select",
    required: true,
    classIds: ["bardo"],
    options: [
      "Bandolim restaurado do pai",
      "Bela flauta presenteada por um nobre",
      "Gaita do primeiro amor",
      "Corneta roubada",
      "Rabeca nunca tocada",
      "Livro de cancoes em lingua esquecida",
    ],
  },
  {
    id: "barbarian-appetite",
    label: "Apetite herculeo",
    helper: "Escolha o desejo que empurra o barbaro para risco e gloria.",
    kind: "select",
    required: true,
    classIds: ["barbaro"],
    options: [
      "Pura destruicao",
      "Poder sobre outros",
      "Prazeres mortais",
      "Conquista",
      "Riquezas e propriedades",
      "Fama e gloria",
    ],
  },
  {
    id: "barbarian-origin",
    label: "Terra natal distante",
    helper: "Opcao aberta: descreva o povo, costume ou lugar de onde veio.",
    kind: "text",
    required: true,
    classIds: ["barbaro"],
  },
  {
    id: "cleric-deity",
    label: "Divindade",
    helper: "Nome da divindade, poder ou igreja que concede seus feiticos.",
    kind: "text",
    required: true,
    classIds: ["clerigo"],
  },
  {
    id: "cleric-domain",
    label: "Dominio divino",
    helper: "Dominio principal da divindade, conforme a ficha do clerigo.",
    kind: "select",
    required: true,
    classIds: ["clerigo"],
    options: [
      "Cura e restauracao",
      "Conquista sangrenta",
      "Civilizacao",
      "Conhecimento e coisas ocultas",
      "Oprimidos e esquecidos",
      "O que existe abaixo",
    ],
  },
  {
    id: "cleric-human-wizard-spell",
    label: "Feitico de mago concedido",
    helper:
      "Beneficio de clerigo humano: escolha um feitico de mago de nivel permitido para tratar como clerical.",
    kind: "select",
    required: true,
    classIds: ["clerigo"],
    raceIds: ["humano"],
    grantsSpellFrom: "mago",
    maxSpellLevel: 1,
  },
  {
    id: "druid-land",
    label: "Terra natal",
    helper: "A terra ligada aos espiritos que permitem a metamorfose.",
    kind: "select",
    required: true,
    classIds: ["druida"],
    options: [
      "Grande floresta",
      "Planicies sussurrantes",
      "Vastos desertos",
      "Montanhas elevadas",
      "Pantano fedorento",
      "Delta dos rios",
      "Ilhas de safira",
      "Mar aberto",
      "Profundezas da terra",
    ],
  },
  {
    id: "druid-token",
    label: "Lembranca da terra",
    helper: "Descreva o objeto, marca ou sinal que carrega de sua terra.",
    kind: "text",
    required: true,
    classIds: ["druida"],
  },
  {
    id: "fighter-signature-weapon",
    label: "Arma assinatura",
    helper: "Descreva tipo, aparencia e origem da arma unica do guerreiro.",
    kind: "text",
    required: true,
    classIds: ["guerreiro"],
  },
  {
    id: "fighter-elf-precise-weapon",
    label: "Arma precisa",
    helper: "Beneficio de guerreiro elfo: escolha uma arma para sempre tratar como precisa.",
    kind: "text",
    required: true,
    classIds: ["guerreiro"],
    raceIds: ["elfo"],
  },
  {
    id: "rogue-bond",
    label: "Vinculo do ladino",
    helper: "Escolha a pessoa ou grupo do submundo que ainda cobra algo de voce.",
    kind: "text",
    required: true,
    classIds: ["ladrao"],
  },
  {
    id: "rogue-poison",
    label: "Veneno conhecido",
    helper: "Escolha o veneno inicial que o ladino sabe preparar com seguranca.",
    kind: "select",
    required: true,
    classIds: ["ladrao"],
    options: ["Oleo de tagit", "Raiz dourada", "Sangue negro", "Serpenteira"],
  },
  {
    id: "wizard-spellbook-style",
    label: "Grimorio",
    helper: "Descreva o grimorio ou objeto onde suas magias estao registradas.",
    kind: "text",
    required: true,
    classIds: ["mago"],
  },
  {
    id: "wizard-human-cleric-spell",
    label: "Feitico clerical aprendido",
    helper:
      "Beneficio de mago humano: escolha um feitico de clerigo de nivel permitido para tratar como arcano.",
    kind: "select",
    required: true,
    classIds: ["mago"],
    raceIds: ["humano"],
    grantsSpellFrom: "clerigo",
    maxSpellLevel: 1,
  },
  {
    id: "paladin-quest",
    label: "Questao sagrada",
    helper: "Defina a missao atual que justifica votos e bencaos do paladino.",
    kind: "text",
    required: true,
    classIds: ["paladino"],
  },
  {
    id: "paladin-boon",
    label: "Bencao da questao",
    helper: "Escolha a bencao recebida enquanto cumprir a questao.",
    kind: "select",
    required: true,
    classIds: ["paladino"],
    options: [
      "Senso inabalavel de direcao",
      "Invulnerabilidade a um tipo de dano",
      "Marca de autoridade divina",
    ],
  },
  {
    id: "ranger-animal",
    label: "Companheiro animal",
    helper: "Escolha um animal comum ou descreva um companheiro aprovado pelo MJ.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: ["Lobo", "Puma", "Urso", "Aguia", "Cao", "Falcao", "Outro"],
  },
  {
    id: "ranger-animal-custom",
    label: "Companheiro animal personalizado",
    helper: "Preencha apenas se escolheu Outro.",
    kind: "text",
    classIds: ["ranger"],
  },
  {
    id: "ranger-animal-strength",
    label: "Forca do companheiro",
    helper: "O que o animal faz melhor quando age junto com voce.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: ["Rapido", "Feroz", "Enorme", "Calmo", "Adaptavel", "Astuto"],
  },
  {
    id: "ranger-animal-training",
    label: "Treinamento do companheiro",
    helper: "Como ele foi treinado para ajudar em aventura.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: ["Cacar", "Procurar", "Batedor", "Guardar", "Lutar contra monstros", "Viajar"],
  },
  {
    id: "engineer-codex",
    label: "Codex arcano",
    helper: "Descreva o codex, ferramenta ou dispositivo principal.",
    kind: "text",
    required: true,
    classIds: ["engenheiro-arcano"],
  },
  {
    id: "engineer-effect-origin",
    label: "Metodo magitecnico",
    helper: "Explique como seus efeitos parecem: runas, vapor, lentes, cristais ou biotecnologia.",
    kind: "text",
    required: true,
    classIds: ["engenheiro-arcano"],
  },
];

export function getCreationRulesFor(classId: string, raceId: string) {
  return creationChoiceRules.filter((rule) => {
    const classMatches = !rule.classIds || rule.classIds.includes(classId);
    const raceMatches = !rule.raceIds || rule.raceIds.includes(raceId);
    return classMatches && raceMatches;
  });
}

export function getOptionsForCreationRule(rule: CreationChoiceRule) {
  if (rule.grantsSpellFrom) {
    return spells
      .filter(
        (spell) =>
          spell.tradition === rule.grantsSpellFrom &&
          spell.level <= (rule.maxSpellLevel ?? 1),
      )
      .map((spell) => ({ value: spell.id, label: `${spell.name} (${spell.levelLabel})` }));
  }

  return (rule.options ?? []).map((option) => ({ value: option, label: option }));
}

export function getGrantedSpellIds(choices: Record<string, string>) {
  const grantRuleIds = creationChoiceRules
    .filter((rule) => rule.grantsSpellFrom)
    .map((rule) => rule.id);

  return grantRuleIds
    .map((ruleId) => choices[ruleId])
    .filter((spellId): spellId is string => Boolean(spellId));
}

export function getCreationBenefits(choices: Record<string, string>) {
  return getGrantedSpellIds(choices)
    .map((spellId) => spells.find((spell) => spell.id === spellId))
    .filter((spell): spell is (typeof spells)[number] => Boolean(spell))
    .map((spell) => ({
      label: "Magia extra",
      value: `${spell.name} (${spell.levelLabel})`,
    }));
}
