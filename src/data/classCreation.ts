import type { PlayerProfileSummary } from "../types/character";
import { spells } from "./spells";

export type CreationChoiceKind = "select" | "text";
export type CreationChoiceCategory = "identity" | "bond";

export type CreationChoiceOption = {
  value: string;
  label: string;
  description: string;
};

export type CreationChoiceRule = {
  id: string;
  label: string;
  helper: string;
  kind: CreationChoiceKind;
  category?: CreationChoiceCategory;
  required?: boolean;
  options?: CreationChoiceOption[];
  optionSource?: "players";
  classIds?: string[];
  raceIds?: string[];
  grantsSpellFrom?: "clerigo" | "mago";
  maxSpellLevel?: number;
};

export type AppliedCreationBenefit = {
  label: string;
  value: string;
};

const opt = (
  value: string,
  label: string,
  description: string,
): CreationChoiceOption => ({ value, label, description });

const lookOptions = [
  opt(
    "olhar-sabio",
    "Olhar sabio",
    "Passa calma e experiencia. NPCs costumam pedir conselho ou tentar arrancar respostas.",
  ),
  opt(
    "olhar-selvagem",
    "Olhar selvagem",
    "Parece sempre pronto para agir. NPCs cautelosos mantem distancia; impulsivos testam seus limites.",
  ),
  opt(
    "olhar-triste",
    "Olhar triste",
    "Carrega perda ou culpa. NPCs compassivos se aproximam, enquanto oportunistas tentam explorar essa dor.",
  ),
  opt(
    "olhar-afiado",
    "Olhar afiado",
    "Observa detalhes e mentiras. NPCs sentem que estao sendo avaliados antes mesmo de falar.",
  ),
  opt(
    "olhar-alegre",
    "Olhar alegre",
    "Facilita conversa e confiança. NPCs relaxam mais rapido, mas podem subestimar seu perigo.",
  ),
  opt(
    "olhar-assombrado",
    "Olhar assombrado",
    "Sugere que voce viu coisas demais. NPCs supersticiosos ficam inquietos ou respeitosos.",
  ),
];

const presenceOptions = [
  opt(
    "presenca-imponente",
    "Presenca imponente",
    "Corpo, postura ou voz ocupam espaco. NPCs notam voce primeiro em tavernas, cortes e campos de batalha.",
  ),
  opt(
    "presenca-discreta",
    "Presenca discreta",
    "Facil de ignorar ate ser tarde. NPCs distraidos deixam passar pistas e movimentos seus.",
  ),
  opt(
    "presenca-elegante",
    "Presenca elegante",
    "Roupas, gestos ou cuidado pessoal sugerem refinamento. NPCs esperam boas maneiras ou segundas intencoes.",
  ),
  opt(
    "presenca-marcada",
    "Presenca marcada",
    "Cicatriz, tatuagem, simbolo ou costume incomum chama atencao. NPCs fazem perguntas ou criam boatos.",
  ),
  opt(
    "presenca-gasta",
    "Presenca gasta",
    "Parece vindo de estrada, guerra ou ruina. NPCs praticos confiam na sua experiencia; nobres torcem o nariz.",
  ),
];

const alignmentOptions = [
  opt(
    "bom",
    "Bom",
    "Voce ganha XP quando se coloca em risco para proteger, curar ou ajudar alguem de verdade.",
  ),
  opt(
    "neutro",
    "Neutro",
    "Voce ganha XP quando resolve algo importante preservando equilibrio, segredo ou sobrevivencia.",
  ),
  opt(
    "caotico",
    "Caotico",
    "Voce ganha XP quando quebra uma ordem estabelecida e empurra a historia para um rumo perigoso.",
  ),
  opt(
    "ordeiro",
    "Ordeiro",
    "Voce ganha XP quando segue voto, lei, igreja, disciplina ou codigo mesmo sob pressao.",
  ),
  opt(
    "mau",
    "Mau",
    "Voce ganha XP quando prejudica alguem para provar dominio, superioridade ou ambicao. Use com acordo da mesa.",
  ),
];

export const creationChoiceRules: CreationChoiceRule[] = [
  {
    id: "look-eyes",
    label: "Olhar",
    helper: "Escolha como seu personagem encara o mundo e como as pessoas leem essa primeira impressao.",
    kind: "select",
    required: true,
    options: lookOptions,
  },
  {
    id: "look-body",
    label: "Corpo e presenca",
    helper: "Escolha a silhueta social do personagem: o que os NPCs percebem antes do nome.",
    kind: "select",
    required: true,
    options: presenceOptions,
  },
  {
    id: "alignment",
    label: "Personalidade/alinhamento",
    helper: "Escolha a motivacao que rende XP quando orientar suas acoes em Dungeon World.",
    kind: "select",
    required: true,
    options: alignmentOptions,
  },
  {
    id: "bond-player",
    label: "Personagem vinculado",
    helper: "Vinculos devem apontar para outro jogador da mesa, nao para NPCs.",
    kind: "select",
    category: "bond",
    required: true,
    optionSource: "players",
  },
  {
    id: "bond-tone",
    label: "Tipo de vinculo",
    helper: "Escolha como esse vinculo aparece em jogo. O detalhe final pode ser combinado em cena.",
    kind: "select",
    category: "bond",
    required: true,
    options: [
      opt("divida", "Divida", "Voce deve algo a esse personagem ou acredita que ele deve algo a voce."),
      opt("protecao", "Protecao", "Voce se sente responsavel por esse personagem, mesmo que ele nao tenha pedido."),
      opt("desconfianca", "Desconfianca", "Voce viu algo estranho nele e ainda nao sabe se pode confiar."),
      opt("admiracao", "Admiracao", "Voce reconhece talento, coragem ou poder nele e quer ver ate onde isso vai."),
      opt("segredo", "Segredo compartilhado", "Voces dividem uma verdade que pode complicar a mesa se vier a tona."),
    ],
  },
  {
    id: "bard-knowledge",
    label: "Conhecimento de Bardo",
    helper: "Area em que o MJ deve revelar informacao util quando ela aparecer.",
    kind: "select",
    required: true,
    classIds: ["bardo"],
    options: [
      opt("magias", "Magias e feiticos", "Voce reconhece tradicoes arcanas, rituais e efeitos sobrenaturais."),
      opt("mortos", "Mortos e mortos-vivos", "Voce sabe historias sobre tumulos, almas inquietas e necromancia."),
      opt("historias", "Grandes historias", "Voce liga acontecimentos atuais a lendas, cancoes e derrotas antigas."),
      opt("bestiario", "Bestiario", "Voce lembra fraquezas, habitos e rumores sobre criaturas perigosas."),
      opt("planos", "Esferas planares", "Voce conhece portais, entidades e sinais de mundos alem deste."),
      opt("deuses", "Deuses e seus servos", "Voce reconhece simbolos, cultos, santos, tabus e rivalidades divinas."),
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
      opt("bandolim", "Bandolim restaurado", "Tem historia familiar; NPCs sensiveis percebem afeto e saudade."),
      opt("flauta", "Bela flauta nobre", "Chama atencao em cortes e saloes; tambem sugere patronos ou roubo elegante."),
      opt("gaita", "Gaita do primeiro amor", "Traz intimidade e melancolia; funciona bem em cenas de descanso."),
      opt("corneta", "Corneta roubada", "Soa como provocacao. Guardas, soldados e nobres podem reconhecer seu timbre."),
      opt("rabeca", "Rabeca intocada", "Parece misteriosa ou amaldiçoada; NPCs perguntam por que nunca foi tocada."),
      opt("livro", "Livro de cancoes esquecidas", "Abre portas com estudiosos, bardos e cultos que conhecem a lingua."),
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
      opt("destruicao", "Pura destruicao", "Voce brilha quando derruba muralhas, monstros e certezas sociais."),
      opt("poder", "Poder sobre outros", "Voce busca comando, temor ou obediencia. NPCs fortes disputam espaco com voce."),
      opt("prazer", "Prazeres mortais", "Comida, bebida, amor e excesso movem suas escolhas entre aventuras."),
      opt("conquista", "Conquista", "Voce quer tomar lugares, trofeus ou reputacoes, nao apenas sobreviver."),
      opt("riqueza", "Riquezas e propriedades", "Tesouros significam respeito, liberdade e prova concreta de vitoria."),
      opt("gloria", "Fama e gloria", "Voce quer que sobreviventes contem seu nome depois da poeira baixar."),
    ],
  },
  {
    id: "barbarian-origin",
    label: "Terra natal distante",
    helper: "Escolha um ponto de origem para o MJ perguntar costumes e verdades da sua terra.",
    kind: "select",
    required: true,
    classIds: ["barbaro"],
    options: [
      opt("estepe", "Estepe dos ceus abertos", "Seu povo valoriza cavalgadas, juramentos publicos e memoria oral."),
      opt("geleiras", "Geleiras do fim do mapa", "Voce vem de frio, escassez e sobrevivencia brutal."),
      opt("selva", "Selvas devoradoras", "Tudo em sua terra respira, caça ou envenena. NPCs acham seus costumes intensos."),
      opt("ilhas", "Ilhas de fogo e mar", "Voce conhece navegacao, tempestades e duelos por honra."),
      opt("ruinas", "Ruinas de um imperio morto", "Sua cultura vive sobre ossos de grandeza antiga."),
    ],
  },
  {
    id: "cleric-deity",
    label: "Divindade",
    helper: "Exemplos do manual e nomes prontos para manter a criacao rapida.",
    kind: "select",
    required: true,
    classIds: ["clerigo"],
    options: [
      opt("helferth", "Helferth, a Mao que Restaura", "Favorece cura, abrigo, misericordia e sacrificio pelos feridos."),
      opt("sucellus", "Sucellus, o Guardiao do Limiar", "Protege passagens, mortos honrados, juramentos e ciclos naturais."),
      opt("zorica", "Zorica, a Voz Oculta", "Revela segredos, sonhos, pressagios e conhecimento proibido."),
      opt("krugon", "Krugon, o Cruel", "Exige dominio, punicao e prova de forca contra fracos e rivais."),
    ],
  },
  {
    id: "cleric-domain",
    label: "Dominio divino",
    helper: "Dominio principal da divindade, conforme a ficha do clerigo.",
    kind: "select",
    required: true,
    classIds: ["clerigo"],
    options: [
      opt("cura", "Cura e restauracao", "Milagres protegem corpos, almas e comunidades feridas."),
      opt("conquista", "Conquista sangrenta", "A fe avanca por vitoria, disciplina e inimigos derrotados."),
      opt("civilizacao", "Civilizacao", "Leis, muralhas, comercio e ritos mantem o caos fora dos portoes."),
      opt("conhecimento", "Conhecimento e coisas ocultas", "Perguntas proibidas sao caminhos sagrados."),
      opt("oprimidos", "Oprimidos e esquecidos", "Sua fe se inclina aos que nao tem voz, nome ou protecao."),
      opt("abaixo", "O que existe abaixo", "Cavernas, raizes, tumbas e coisas enterradas pertencem ao seu misterio."),
    ],
  },
  {
    id: "cleric-human-wizard-spell",
    label: "Feitico de mago concedido",
    helper: "Beneficio de clerigo humano: escolha um feitico de mago de nivel permitido para tratar como clerical.",
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
      opt("floresta", "Grande floresta", "Arvores antigas, predadores silenciosos e caminhos que mudam."),
      opt("planicies", "Planicies sussurrantes", "Vento, rebanhos, ceu enorme e sinais vistos de longe."),
      opt("desertos", "Vastos desertos", "Calor, miragens, ruinas enterradas e vida que economiza cada gota."),
      opt("montanhas", "Montanhas elevadas", "Altitude, pedra, cabras, aguias e avalanches."),
      opt("pantano", "Pantano fedorento", "Lama, insetos, venenos, neblina e coisas que afundam devagar."),
      opt("rios", "Delta dos rios", "Correntes, crocodilos, pesca, barcos e fronteiras moveis."),
      opt("ilhas", "Ilhas de safira", "Recifes, aves marinhas, tempestades e espiritos de agua salobra."),
      opt("mar", "Mar aberto", "Profundezas, baleias, monstros e pressagios nas ondas."),
      opt("subterraneo", "Profundezas da terra", "Fungos, ecos, raizes, veios minerais e criaturas sem sol."),
    ],
  },
  {
    id: "druid-token",
    label: "Lembranca da terra",
    helper: "Objeto que marca seu vinculo espiritual com a terra.",
    kind: "select",
    required: true,
    classIds: ["druida"],
    options: [
      opt("semente", "Semente antiga", "NPCs ligados a natureza sentem respeito; nobres veem apenas sujeira no bolso."),
      opt("osso", "Osso entalhado", "Parece amuleto ou aviso. Predadores e xamas podem reconhecer seu significado."),
      opt("pedra", "Pedra marcada por runas naturais", "Ancora memoria e territorio; pesa mais em cena do que na mochila."),
      opt("pena", "Pena de ave rara", "Sugere pressagios, altura e liberdade. Crianças e caçadores perguntam sobre ela."),
      opt("frasco", "Frasco com agua ou terra natal", "Um lembrete visivel de que seu poder vem de um lugar especifico."),
    ],
  },
  {
    id: "fighter-signature-weapon",
    label: "Arma assinatura",
    helper: "Escolha a forma da arma unica do guerreiro.",
    kind: "select",
    required: true,
    classIds: ["guerreiro"],
    options: [
      opt("espada", "Espada com historia", "Reconhecivel e honrada; NPCs marciais avaliam sua postura imediatamente."),
      opt("machado", "Machado brutal", "Promete dano e intimidacao. Portas e escudos parecem temporarios perto dele."),
      opt("martelo", "Martelo de guerra", "Passa peso, julgamento e impacto. Ferreiros e soldados respeitam sua escolha."),
      opt("lanca", "Lanca de veterano", "Controla distancia e forma linhas. Guardas entendem que voce sabe manter terreno."),
      opt("corrente", "Corrente ou arma exotica", "Imprevisivel e teatral. NPCs nao sabem bem como se defender dela."),
    ],
  },
  {
    id: "fighter-elf-precise-weapon",
    label: "Arma precisa",
    helper: "Beneficio de guerreiro elfo: escolha uma arma para sempre tratar como precisa.",
    kind: "select",
    required: true,
    classIds: ["guerreiro"],
    raceIds: ["elfo"],
    options: [
      opt("florete", "Florete", "Rapido, elegante e tecnico."),
      opt("espada-curta", "Espada curta", "Confiavel em corredores, duelos e emboscadas."),
      opt("lanca-leve", "Lanca leve", "Precisa quando usada com movimento e distancia."),
      opt("arco", "Arco", "A precisao elfica transforma distancia em controle."),
    ],
  },
  {
    id: "rogue-bond",
    label: "Vinculo do ladino",
    helper: "Escolha qual jogador esta preso ao seu submundo. Nao use NPC aqui.",
    kind: "select",
    category: "bond",
    required: true,
    optionSource: "players",
    classIds: ["ladrao"],
  },
  {
    id: "rogue-poison",
    label: "Veneno conhecido",
    helper: "Escolha o veneno inicial que o ladino sabe preparar com seguranca.",
    kind: "select",
    required: true,
    classIds: ["ladrao"],
    options: [
      opt("tagit", "Oleo de tagit", "Derruba ou entorpece; perfeito para captura, fuga e cenas discretas."),
      opt("raiz-dourada", "Raiz dourada", "Forca verdade, desejo ou obediencia temporaria conforme a ficcao permitir."),
      opt("sangue-negro", "Sangue negro", "Ameaçador e cruel; deixa sinais que curandeiros podem reconhecer."),
      opt("serpenteira", "Serpenteira", "Rapido e elegante; combina com laminas pequenas e ataques oportunistas."),
    ],
  },
  {
    id: "wizard-spellbook-style",
    label: "Grimorio",
    helper: "Escolha como suas magias ficam registradas.",
    kind: "select",
    required: true,
    classIds: ["mago"],
    options: [
      opt("tomo", "Tomo pesado de couro", "Classico, respeitado e facil de reconhecer como perigoso."),
      opt("cartas", "Baralho de formulas", "Portatil e estranho; cada carta parece querer ser puxada na hora certa."),
      opt("tatuagens", "Tatuagens arcanas", "Magia escrita no corpo; NPCs religiosos podem temer ou condenar."),
      opt("laminas", "Laminas de metal gravadas", "Frio, duravel e cerimonial. Ferreiros e anoes prestam atencao."),
      opt("diario", "Diario cheio de notas", "Parece confuso para todos menos voce; otimo para segredos e margem rabiscada."),
    ],
  },
  {
    id: "wizard-human-cleric-spell",
    label: "Feitico clerical aprendido",
    helper: "Beneficio de mago humano: escolha um feitico de clerigo de nivel permitido para tratar como arcano.",
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
    helper: "Escolha a missao atual que justifica votos e bencaos do paladino.",
    kind: "select",
    required: true,
    classIds: ["paladino"],
    options: [
      opt("matar-ameaca", "Destruir uma ameaca profana", "A mesa sabe quem deve cair, mas o custo moral pode crescer."),
      opt("proteger-inocente", "Proteger inocentes em perigo", "Sua prioridade e manter pessoas vivas mesmo quando seria mais facil vencer."),
      opt("recuperar-reliquia", "Recuperar uma reliquia sagrada", "A aventura ganha um objeto central e rivais interessados nele."),
      opt("expor-corrupcao", "Expor corrupcao ou mentira", "Voce carrega luz para lugares que preferem permanecer fechados."),
    ],
  },
  {
    id: "paladin-boon",
    label: "Bencao da questao",
    helper: "Escolha a bencao recebida enquanto cumprir a questao.",
    kind: "select",
    required: true,
    classIds: ["paladino"],
    options: [
      opt("direcao", "Senso inabalavel de direcao", "Voce sempre sabe o caminho geral para cumprir a missao."),
      opt("invulnerabilidade", "Invulnerabilidade a um tipo de dano", "Escolha ficcional com o MJ quando a questao comecar."),
      opt("autoridade", "Marca de autoridade divina", "Aliados reconhecem o peso sagrado; inimigos sabem que foram julgados."),
    ],
  },
  {
    id: "ranger-animal",
    label: "Companheiro animal",
    helper: "Escolha um animal comum de Patrulheiro.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: [
      opt("lobo", "Lobo", "Rastreador leal e ameaçador. NPCs comuns ficam cautelosos perto dele."),
      opt("puma", "Puma", "Silencioso e explosivo. Bom para emboscadas, escalada e caça."),
      opt("urso", "Urso", "Grande, resistente e intimidador. Dificil esconder, facil impor respeito."),
      opt("aguia", "Aguia", "Olhos no ceu. Ajuda em reconhecimento, pressagios e perseguiçoes."),
      opt("cao", "Cao", "Proximo de pessoas, guarda acampamento e fareja perigo social ou fisico."),
      opt("falcao", "Falcao", "Rapido e preciso. Excelente para sinais, caça menor e vigilancia."),
    ],
  },
  {
    id: "ranger-animal-strength",
    label: "Forca do companheiro",
    helper: "O que o animal faz melhor quando age junto com voce.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: [
      opt("rapido", "Rapido", "Chega antes, intercepta fugas e muda de posicao com facilidade."),
      opt("feroz", "Feroz", "Assusta inimigos e aumenta o peso ficcional de ataques coordenados."),
      opt("enorme", "Enorme", "Move peso, bloqueia passagem e intimida sem precisar atacar."),
      opt("calmo", "Calmo", "Nao entra em panico diante de magia, sangue ou multidoes."),
      opt("adaptavel", "Adaptavel", "Aprende comandos novos e se ajusta a terreno estranho."),
      opt("astuto", "Astuto", "Percebe armadilhas simples, rotas e intencoes de criaturas."),
    ],
  },
  {
    id: "ranger-animal-training",
    label: "Treinamento do companheiro",
    helper: "Como ele foi treinado para ajudar em aventura.",
    kind: "select",
    required: true,
    classIds: ["ranger"],
    options: [
      opt("cacar", "Cacar", "Segue presas, pressiona alvos e reconhece cheiro de sangue."),
      opt("procurar", "Procurar", "Encontra objetos, rastros ou pessoas perdidas."),
      opt("batedor", "Batedor", "Vai na frente e volta com sinais de perigo."),
      opt("guardar", "Guardar", "Protege acampamento, aliados caidos e entradas."),
      opt("monstros", "Lutar contra monstros", "Nao hesita diante de criaturas maiores ou antinaturais."),
      opt("viajar", "Viajar", "Ajuda em jornadas, clima ruim e travessias longas."),
    ],
  },
  {
    id: "engineer-codex",
    label: "Codex arcano",
    helper: "Escolha a forma do codex magitecnico.",
    kind: "select",
    required: true,
    classIds: ["engenheiro-arcano"],
    options: [
      opt("manual-engrenagens", "Manual de engrenagens vivas", "Parece tecnico, mas algumas paginas pulsam como orgaos."),
      opt("cubo-runas", "Cubo de runas reconfiguraveis", "Otimo para cenas visuais; NPCs veem tecnologia impossivel."),
      opt("luva-cristal", "Luva de cristal e cobre", "O codex fica no corpo e acende quando efeitos sao preparados."),
      opt("maleta", "Maleta de instrumentos arcanos", "Pratica e suspeita; guardas querem saber o que ha dentro."),
    ],
  },
  {
    id: "engineer-effect-origin",
    label: "Metodo magitecnico",
    helper: "Como seus efeitos parecem quando ativados.",
    kind: "select",
    required: true,
    classIds: ["engenheiro-arcano"],
    options: [
      opt("runas", "Runas projetadas", "Simbolos surgem no ar e deixam claro que algo foi calculado."),
      opt("vapor", "Vapor alquimico", "Chiado, cheiro forte e risco de chamar atencao."),
      opt("cristais", "Cristais resonantes", "Som, luz e vibraçao denunciam energia concentrada."),
      opt("biotecnologia", "Biotecnologia arcana", "Efeitos parecem vivos; curandeiros e clerigos podem se incomodar."),
    ],
  },
];

export function getCreationRulesFor(
  classId: string,
  raceId: string,
  category: CreationChoiceCategory | "all" = "all",
) {
  return creationChoiceRules.filter((rule) => {
    const categoryMatches = category === "all" || (rule.category ?? "identity") === category;
    const classMatches = !rule.classIds || rule.classIds.includes(classId);
    const raceMatches = !rule.raceIds || rule.raceIds.includes(raceId);
    return categoryMatches && classMatches && raceMatches;
  });
}

export function getOptionsForCreationRule(
  rule: CreationChoiceRule,
  playerProfiles: PlayerProfileSummary[] = [],
  selectedPlayerIndex?: number,
) {
  if (rule.optionSource === "players") {
    return playerProfiles
      .filter((profile) => profile.index !== selectedPlayerIndex)
      .map((profile) =>
        opt(
          `player-${profile.index}`,
          `${profile.label}: ${profile.name || "Sem nome"}`,
          `${profile.className}. Vinculo permitido por ser outro jogador da mesa, nao um NPC.`,
        ),
      );
  }

  if (rule.grantsSpellFrom) {
    return spells
      .filter(
        (spell) =>
          spell.tradition === rule.grantsSpellFrom &&
          spell.level <= (rule.maxSpellLevel ?? 1),
      )
      .map((spell) =>
        opt(
          spell.id,
          `${spell.name} (${spell.levelLabel})`,
          spell.summary,
        ),
      );
  }

  return rule.options ?? [];
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
