export type SpellTradition = "clerigo" | "mago" | "engenheiro-arcano";

export type SpellRisk = {
  attention: string;
  penalty: string;
  losePrepared: string;
};

export type DwSpell = {
  id: string;
  name: string;
  tradition: SpellTradition;
  level: number;
  levelLabel: string;
  summary: string;
  fullText?: string;
  tags?: string[];
  damageDice?: string;
  isOngoing?: boolean;
  risk?: SpellRisk;
};

export const defaultSpellRisks: Record<SpellTradition, SpellRisk> = {
  clerigo: {
    attention: "Voce atrai atencao indesejada ou se coloca em evidencia; o MJ descreve como.",
    penalty:
      "Sua conexao espiritual vacila: receba -1 constante para conjurar ate comungar novamente.",
    losePrepared:
      "Sua divindade revoga o feitico; ele fica indisponivel ate a proxima comunhao.",
  },
  mago: {
    attention: "Voce atrai atencao indesejada ou se coloca em uma situacao complicada; o MJ descreve como.",
    penalty:
      "A trama da realidade se perturba: receba -1 constante para conjurar ate preparar feiticos novamente.",
    losePrepared:
      "Voce esquece o feitico; ele fica indisponivel ate preparar feiticos novamente.",
  },
  "engenheiro-arcano": {
    attention: "A ativacao chama atencao, solta faiscas ou coloca voce em uma situacao complicada; o MJ descreve como.",
    penalty:
      "Um bug entra no sistema: receba -1 constante para ativar efeitos ate preparar dispositivos novamente.",
    losePrepared:
      "O dispositivo gasta toda a energia desse efeito; ele fica indisponivel ate preparar dispositivos novamente.",
  },
};

export const spells: DwSpell[] = [
  {
    id: "clerigo-luz",
    name: "Luz",
    tradition: "clerigo",
    level: 0,
    levelLabel: "Oracao",
    summary:
      "Faz um objeto tocado emitir luz sagrada suficiente para guiar a exploracao.",
  },
  {
    id: "clerigo-santificar",
    name: "Santificar",
    tradition: "clerigo",
    level: 0,
    levelLabel: "Oracao",
    summary:
      "Abençoa comida, agua ou um local pequeno, marcando-o como protegido pela fe.",
  },
  {
    id: "clerigo-orientacao",
    name: "Orientacao",
    tradition: "clerigo",
    level: 0,
    levelLabel: "Oracao",
    summary:
      "Pede direcao divina e recebe um sinal util, ainda que aberto a interpretacao.",
  },
  {
    id: "clerigo-curar-ferimentos-leves",
    name: "Curar Ferimentos Leves",
    tradition: "clerigo",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Restaura vitalidade de uma criatura tocada, mantendo o clerigo no centro do risco.",
  },
  {
    id: "clerigo-detectar-alinhamento",
    name: "Detectar Alinhamento",
    tradition: "clerigo",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Revela uma aura ligada a uma forca moral ou espiritual presente na cena.",
  },
  {
    id: "clerigo-causar-medo",
    name: "Causar Medo",
    tradition: "clerigo",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Faz uma criatura sentir pavor diante da autoridade divina invocada.",
    tags: ["mental", "medo"],
  },
  {
    id: "clerigo-abencoar",
    name: "Abencoar",
    tradition: "clerigo",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Concede favor divino a um aliado, tornando sua proxima acao mais segura ou significativa na ficcao.",
  },
  {
    id: "clerigo-falar-com-mortos",
    name: "Falar com Mortos",
    tradition: "clerigo",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Permite fazer perguntas a um cadaver recente ou espiritualmente presente, se a morte ainda tiver algo a dizer.",
  },
  {
    id: "clerigo-animar-mortos",
    name: "Animar Mortos",
    tradition: "clerigo",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Ergue um corpo como servo profano ou sagrado, trazendo uma criatura util e um peso moral evidente.",
  },
  {
    id: "clerigo-curar-ferimentos-moderados",
    name: "Curar Ferimentos Moderados",
    tradition: "clerigo",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Restaura ferimentos mais graves e pode recolocar um aliado de pe quando ainda ha esperanca na cena.",
    tags: ["cura"],
  },
  {
    id: "clerigo-escuridao",
    name: "Escuridao",
    tradition: "clerigo",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Invoca trevas sobrenaturais que ocultam, separam ou anunciam a presenca de uma forca divina sombria.",
    isOngoing: true,
  },
  {
    id: "clerigo-revelacao",
    name: "Revelacao",
    tradition: "clerigo",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Pede a divindade que revele uma verdade importante, normalmente acompanhada de exigencia ou consequencia.",
  },
  {
    id: "clerigo-curar-ferimentos-criticos",
    name: "Curar Ferimentos Criticos",
    tradition: "clerigo",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Fecha danos severos e devolve alguem a luta, desde que a ficcao aceite intervencao divina tao forte.",
  },
  {
    id: "clerigo-praga",
    name: "Praga",
    tradition: "clerigo",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Amaldicoa um alvo com doenca, fraqueza ou sinal divino que exige acao para ser removido.",
  },
  {
    id: "clerigo-palavra-do-retorno",
    name: "Palavra do Retorno",
    tradition: "clerigo",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Transporta o clerigo e aliados para um santuario preparado, desde que o vinculo sagrado esteja intacto.",
  },
  {
    id: "clerigo-ressurreicao",
    name: "Ressurreicao",
    tradition: "clerigo",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Tenta trazer uma alma de volta, abrindo negociacao direta com morte, divindade ou destino.",
  },
  {
    id: "clerigo-tempestade-da-vinganca",
    name: "Tempestade da Vinganca",
    tradition: "clerigo",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Convoca julgamento divino em escala devastadora, alterando o campo de batalha e cobrando um preco narrativo.",
    damageDice: "2d8",
    tags: ["area", "divino"],
  },
  {
    id: "clerigo-reparar",
    name: "Reparar",
    tradition: "clerigo",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Restaura algo quebrado, corrompido ou perdido quando a divindade aceita que ainda existe proposito ali.",
  },
  {
    id: "mago-luz",
    name: "Luz",
    tradition: "mago",
    level: 0,
    levelLabel: "Truque",
    summary:
      "Cria uma fonte arcana de iluminacao simples, util para exploracao e sinais.",
  },
  {
    id: "mago-prestidigitacao",
    name: "Prestidigitacao",
    tradition: "mago",
    level: 0,
    levelLabel: "Truque",
    summary:
      "Produz pequenos efeitos sensoriais ou manipulacoes menores sem grande peso dramatico.",
  },
  {
    id: "mago-servo-invisivel",
    name: "Servo Invisivel",
    tradition: "mago",
    level: 0,
    levelLabel: "Truque",
    summary:
      "Conjura uma presenca simples para carregar, buscar ou manipular objetos leves.",
  },
  {
    id: "mago-misseis-magicos",
    name: "Misseis Magicos",
    tradition: "mago",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Dispara energia arcana contra um alvo visivel, confiavel quando a ficcao permite ataque direto.",
    damageDice: "2d4",
    tags: ["dano", "arcano"],
  },
  {
    id: "mago-contatar-espiritos",
    name: "Contatar Espiritos",
    tradition: "mago",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Chama uma entidade para responder perguntas, abrindo espaco para custo e consequencia.",
  },
  {
    id: "mago-invisibilidade",
    name: "Invisibilidade",
    tradition: "mago",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Oculta uma criatura da visao comum ate que a ficcao quebre o efeito.",
    isOngoing: true,
  },
  {
    id: "mago-detectar-magia",
    name: "Detectar Magia",
    tradition: "mago",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Revela presencas arcanas, encantamentos e rastros magicos perceptiveis ao estudo do mago.",
  },
  {
    id: "mago-alarme",
    name: "Alarme",
    tradition: "mago",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Marca uma area ou objeto para avisar quando alguem cruza, toca ou viola o limite definido.",
  },
  {
    id: "mago-dissipar-magia",
    name: "Dissipar Magia",
    tradition: "mago",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Interrompe ou enfraquece um efeito magico ativo, se o mago conseguir entender o que esta enfrentando.",
  },
  {
    id: "mago-bola-de-fogo",
    name: "Bola de Fogo",
    tradition: "mago",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Explode chamas arcanas em uma area visivel, causando devastacao e efeitos colaterais no ambiente.",
    damageDice: "2d6",
    tags: ["dano", "area", "fogo"],
  },
  {
    id: "mago-mimetismo",
    name: "Mimetismo",
    tradition: "mago",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Altera aparencia ou sinais externos para enganar observadores enquanto a ficcao sustentar a ilusao.",
  },
  {
    id: "mago-contato-com-outro-plano",
    name: "Contato com Outro Plano",
    tradition: "mago",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Busca respostas em entidades distantes, recebendo conhecimento perigoso, incompleto ou interessado.",
  },
  {
    id: "mago-polimorfia",
    name: "Polimorfia",
    tradition: "mago",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Transforma uma criatura em outra forma, mudando capacidades, limites e problemas da cena.",
  },
  {
    id: "mago-invocar-monstro",
    name: "Invocar Monstro",
    tradition: "mago",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Chama uma criatura para agir, mas sua obediencia, natureza e permanencia dependem da ficcao e dos riscos.",
  },
  {
    id: "mago-visao-verdadeira",
    name: "Visao Verdadeira",
    tradition: "mago",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Permite enxergar atraves de ilusoes, disfarces e ocultamentos magicos que possam ser percebidos pela verdade arcana.",
  },
  {
    id: "mago-caminhar-nas-sombras",
    name: "Caminhar nas Sombras",
    tradition: "mago",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Usa sombras como passagem, deslocando o mago e talvez aliados entre lugares ligados pela escuridao.",
  },
  {
    id: "mago-dominacao",
    name: "Dominacao",
    tradition: "mago",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Impoe vontade arcana sobre uma mente, criando controle instavel e consequencias morais imediatas.",
    isOngoing: true,
    tags: ["mental", "continuo"],
  },
  {
    id: "mago-prisao-da-alma",
    name: "Prisao da Alma",
    tradition: "mago",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Aprisiona essencia espiritual ou vital em um recipiente, exigindo condicoes raras e gerando perigos duradouros.",
  },
  {
    id: "mago-abrigo",
    name: "Abrigo",
    tradition: "mago",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Cria um refugio extradimensional ou arcano para proteger, esconder ou preparar algo fora do alcance comum.",
  },
  {
    id: "mago-antipatia",
    name: "Antipatia",
    tradition: "mago",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Marca lugar ou objeto com rejeicao magica, afastando tipos de criaturas ou forcas definidas.",
    isOngoing: true,
  },
  {
    id: "engenheiro-detectar-magia-maquinas",
    name: "Detectar Magia e Maquinas",
    tradition: "engenheiro-arcano",
    level: 0,
    levelLabel: "Rotina",
    summary:
      "Escaneia energia arcana, mecanismos, tecnologia antiga e falhas evidentes em uma area ou objeto.",
    tags: ["rotina", "sensor"],
  },
  {
    id: "engenheiro-luz-fria",
    name: "Luz Fria",
    tradition: "engenheiro-arcano",
    level: 0,
    levelLabel: "Rotina",
    summary:
      "Aciona uma fonte luminosa magitecnica presa a um objeto ou dispositivo pequeno.",
    tags: ["rotina", "utilidade"],
  },
  {
    id: "engenheiro-braco-fantasma",
    name: "Braco Fantasma",
    tradition: "engenheiro-arcano",
    level: 0,
    levelLabel: "Rotina",
    summary:
      "Projeta um manipulador instavel capaz de empurrar, puxar ou operar algo leve a curta distancia.",
    tags: ["rotina", "utilidade"],
  },
  {
    id: "engenheiro-projetil-arcano",
    name: "Projetil Arcano",
    tradition: "engenheiro-arcano",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Dispara energia concentrada de um dispositivo contra um alvo visivel.",
    damageDice: "2d4",
    tags: ["dano", "magitecnica"],
  },
  {
    id: "engenheiro-campo-de-deflexao",
    name: "Campo de Deflexao",
    tradition: "engenheiro-arcano",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Ergue um campo instavel que desvia golpes e projeteis enquanto houver carga suficiente.",
    isOngoing: true,
    tags: ["continuo", "defesa"],
  },
  {
    id: "engenheiro-reparo-cicatrizante",
    name: "Reparo Cicatrizante",
    tradition: "engenheiro-arcano",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Usa suturas, reagentes e pulsos arcanos para estabilizar e restaurar ferimentos leves.",
    tags: ["cura", "biotecnologia"],
  },
  {
    id: "engenheiro-alarme-autonomo",
    name: "Alarme Autonomo",
    tradition: "engenheiro-arcano",
    level: 1,
    levelLabel: "Nivel 1",
    summary:
      "Instala um sensor que avisa quando alguem cruza, toca ou viola o limite programado.",
    isOngoing: true,
    tags: ["sensor", "continuo"],
  },
  {
    id: "engenheiro-dissipador-xpto",
    name: "Dissipador XPTO",
    tradition: "engenheiro-arcano",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Tenta conter ou enfraquecer um efeito magico ativo por cancelamento de frequencia.",
    tags: ["anti-magia"],
  },
  {
    id: "engenheiro-granada-solar",
    name: "Granada Solar",
    tradition: "engenheiro-arcano",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Detona calor e luz comprimidos em area visivel, com risco de dano colateral no cenario.",
    damageDice: "2d6",
    tags: ["dano", "area", "fogo"],
  },
  {
    id: "engenheiro-mimetizador",
    name: "Mimetizador",
    tradition: "engenheiro-arcano",
    level: 3,
    levelLabel: "Nivel 3",
    summary:
      "Projeta mascara, voz e sinais falsos para alterar aparencia enquanto a ilusao tecnica sustentar.",
    isOngoing: true,
    tags: ["ilusao", "continuo"],
  },
  {
    id: "engenheiro-drone-planar",
    name: "Drone Planar",
    tradition: "engenheiro-arcano",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Abre um canal para uma entidade, maquina antiga ou plano distante responder perguntas perigosas.",
    tags: ["consulta", "planar"],
  },
  {
    id: "engenheiro-polimorfia-induzida",
    name: "Polimorfia Induzida",
    tradition: "engenheiro-arcano",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Forca uma transformacao fisica por mutagenos e padroes arcanos, mudando capacidades e problemas da cena.",
    isOngoing: true,
    tags: ["biotecnologia", "transformacao"],
  },
  {
    id: "engenheiro-automato-invocado",
    name: "Automato Invocado",
    tradition: "engenheiro-arcano",
    level: 5,
    levelLabel: "Nivel 5",
    summary:
      "Monta ou chama um automato temporario para agir, com autonomia limitada e risco de comportamento inesperado.",
    isOngoing: true,
    tags: ["invocacao", "maquina"],
  },
  {
    id: "engenheiro-visao-de-diagnostico",
    name: "Visao de Diagnostico",
    tradition: "engenheiro-arcano",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Revela ilusoes, falhas estruturais, encantamentos e disfarces por leitura tecnica profunda.",
    isOngoing: true,
    tags: ["sensor"],
  },
  {
    id: "engenheiro-ponte-de-sombras",
    name: "Ponte de Sombras",
    tradition: "engenheiro-arcano",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Usa sombra, cabos etereos e coordenadas impossiveis para deslocar o grupo entre pontos conectados.",
    tags: ["movimento", "planar"],
  },
  {
    id: "engenheiro-interface-neural",
    name: "Interface Neural",
    tradition: "engenheiro-arcano",
    level: 7,
    levelLabel: "Nivel 7",
    summary:
      "Impoe comandos a uma mente por sinais arcanos, criando controle instavel e consequencias morais.",
    isOngoing: true,
    tags: ["mental", "continuo"],
  },
  {
    id: "engenheiro-prisao-de-essencia",
    name: "Prisao de Essencia",
    tradition: "engenheiro-arcano",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Aprisiona energia vital, alma ou consciencia em um recipiente preparado, exigindo condicoes raras.",
    isOngoing: true,
    tags: ["alma", "artefato"],
  },
  {
    id: "engenheiro-bunker-dimensional",
    name: "Bunker Dimensional",
    tradition: "engenheiro-arcano",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Abre um refugio extradimensional calibrado para proteger, esconder ou preparar um projeto impossivel.",
    tags: ["refugio", "dimensional"],
  },
  {
    id: "engenheiro-campo-de-antipatia",
    name: "Campo de Antipatia",
    tradition: "engenheiro-arcano",
    level: 9,
    levelLabel: "Nivel 9",
    summary:
      "Programa um lugar ou objeto para repelir tipos de criaturas, tecnologias ou forcas definidas.",
    isOngoing: true,
    tags: ["continuo", "area"],
  },
];
