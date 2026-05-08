export type ClassGuide = {
  fantasy: string[];
  tableRole: string[];
  firstSession: string[];
  moveReading: string[];
  example: string;
  gmCue: string;
};

export type BeginnerConcept = {
  title: string;
  description: string;
};

export const beginnerSheetConcepts: BeginnerConcept[] = [
  {
    title: "A ficha acompanha a ficcao",
    description:
      "Em Dungeon World, o jogador descreve o que o personagem faz primeiro. A rolagem entra quando a acao encontra perigo, resistencia, custo ou incerteza real.",
  },
  {
    title: "Movimento nao e botao obrigatorio",
    description:
      "Um movimento dispara quando a descricao combina com a condicao escrita nele. Se o personagem apenas conversa, anda ou examina algo sem risco, o mestre pode responder direto.",
  },
  {
    title: "10+, 7-9 e 6- contam historias diferentes",
    description:
      "10+ costuma entregar o que o jogador queria. 7-9 entrega com escolha, custo ou complicacao. 6- nao e so erro: o mestre mostra perigo, muda a cena e normalmente o personagem marca XP.",
  },
  {
    title: "Atributos explicam como voce age",
    description:
      "Forca resolve impacto fisico, Destreza cobre agilidade e mira, Constituicao mede resistencia, Inteligencia lida com estudo, Sabedoria percebe e intui, Carisma influencia pessoas.",
  },
  {
    title: "Equipamento importa na cena",
    description:
      "Armas, armaduras, itens e carga nao sao apenas numeros. Eles dizem o que esta na mao, o que faz barulho, o que pesa, o que quebra e que solucao esta disponivel antes da rolagem.",
  },
];

const martialMoveReading = [
  "Leia primeiro a frase que comeca com 'quando'. Ela diz a situacao exata em que a habilidade entra na mesa.",
  "Depois veja qual atributo aparece na rolagem. Esse atributo deve combinar com a forma como o jogador descreveu a acao.",
  "Por fim leia as consequencias. Em Dungeon World, sucesso parcial ainda move a historia; ele so cobra um preco, revela perigo ou coloca uma escolha dificil.",
];

const magicMoveReading = [
  "Magia exige preparo, origem e risco. Antes de rolar, pergunte de onde vem o poder, que gesto ou foco o personagem usa e o que poderia dar errado.",
  "A magia preparada ou efeito escolhido define o que e possivel; a rolagem define o controle, o custo e a pressao da cena.",
  "Em um 7-9, use as opcoes da magia e os riscos do aplicativo para criar consequencias claras, como chamar atencao, perder preparo, sofrer interferencia ou aceitar efeito menor.",
];

export const classGuides: Record<string, ClassGuide> = {
  barbaro: {
    fantasy: [
      "O Barbaro e alguem de fora da ordem comum: grande demais, faminto demais, estranho demais ou livre demais para caber nas regras da civilizacao.",
      "O centro da classe sao apetites, instinto e presenca fisica. Ele nao precisa ser burro; ele e direto, intenso e disposto a pagar custos que outras pessoas evitam.",
      "Para um jogador iniciante, e uma boa classe quando a pessoa quer entrar em cena com escolhas fortes: quebrar, intimidar, proteger, desafiar ou transformar perigo em fama.",
    ],
    tableRole: [
      "No combate, o Barbaro abre caminho, chama atencao e resolve bloqueios fisicos com violencia ou coragem.",
      "Fora do combate, ele cria contraste cultural: costumes, tabus, desejos e perguntas sobre sua terra natal ajudam o mestre a construir o mundo com o jogador.",
      "Ele funciona melhor quando o jogador diz claramente o que deseja. O apetite nao e enfeite; ele aponta que tipo de problema o personagem vai perseguir.",
    ],
    firstSession: [
      "Escolha um apetite que voce realmente queira ver em jogo, como gloria, riqueza, prazer, conquista ou destruicao.",
      "Diga uma coisa marcante sobre sua terra: um ritual, uma comida, uma cicatriz, uma lei ou uma criatura que todos de la respeitam.",
      "Quando a mesa travar, pergunte: 'o que eu poderia quebrar, desafiar ou exigir agora?'. Essa pergunta costuma recolocar o Barbaro no centro da aventura.",
    ],
    moveReading: martialMoveReading,
    example:
      "Se uma ponte esta caindo e ha inimigos do outro lado, o Barbaro pode correr, saltar e agarrar a corrente principal. O mestre pode pedir Desafiar Perigo com Forca ou Constituicao; se a acao tambem envolver atacar, Hack and Slash pode entrar depois.",
    gmCue:
      "Dê ao Barbaro coisas grandes demais para personagens comuns: portas seladas, reis arrogantes, monstros que reconhecem forca, banquetes tentadores e escolhas em que satisfazer um apetite abre uma complicacao interessante.",
  },
  bardo: {
    fantasy: [
      "O Bardo transforma memoria, arte e presenca social em poder real. Ele nao e apenas musico: pode ser poeta, duelista elegante, contador de historias, diplomata, espião ou celebridade itinerante.",
      "A classe conversa com quase todas as partes do jogo. Ela cura, inspira, manipula, descobre informacao e cria conexoes em lugares onde o grupo seria tratado como estranho.",
      "Para novatos, o Bardo ensina que falar, lembrar, cantar, negociar e observar tambem sao acoes heroicas, nao pausas entre combates.",
    ],
    tableRole: [
      "Em combate, ele melhora aliados, atrapalha inimigos e usa Arte Arcana para virar a situacao sem precisar ser a linha de frente.",
      "Em cenas sociais, ele costuma descobrir desejos, segredos e fraquezas porque as pessoas baixam a guarda quando se sentem vistas.",
      "Em exploracao, Conhecimento de Bardo ajuda a transformar lore em vantagem pratica: uma canção antiga pode revelar o nome de uma tumba ou o costume de uma corte.",
    ],
    firstSession: [
      "Defina sua arte principal e como ela parece em cena: voz, alaude, tambor, dança, insultos rimados, cartas, teatro ou discurso.",
      "Escolha uma area de conhecimento que combine com a campanha. Uma area boa e aquela que o mestre consegue trazer com frequencia.",
      "Faca perguntas aos outros personagens. O Bardo brilha quando sabe quem ama quem, quem deve favores e quem esta escondendo medo.",
    ],
    moveReading: [
      "Quando uma habilidade mencionar performance, descreva a apresentacao e o publico antes da rolagem.",
      "Quando uma habilidade mencionar conversa franca, o alvo precisa participar de verdade da conversa; ameaca muda o movimento para outro tipo de pressao.",
      "Se uma habilidade concede informacao, transforme essa informacao em proxima acao: abrir passagem, evitar perigo, convencer alguem ou preparar o grupo.",
    ],
    example:
      "Diante de guardas nervosos, o Bardo nao precisa dizer apenas 'uso carisma'. Ele pode contar uma historia sobre o comandante deles, tocar uma marcha conhecida e entao negociar passagem com uma promessa concreta.",
    gmCue:
      "Ofereca plateias, rumores contraditorios, pessoas solitarias, rivais artisticos e lugares com historia. O Bardo deve sentir que palavras antigas e relacoes atuais mudam a aventura.",
  },
  clerigo: {
    fantasy: [
      "O Clerigo e a ponte entre pessoas mortais e uma divindade. Sua magia nao e tecnica neutra; ela carrega dogma, simbolos, deveres e sinais do sagrado.",
      "A classe funciona melhor quando a divindade tem desejos claros. Cura, protecao e milagres ganham peso quando tambem existe uma expectativa espiritual.",
      "Para iniciantes, o Clerigo e uma boa escolha para quem quer ajudar o grupo, lidar com mortos-vivos e ter uma bussola moral que cria cenas fortes.",
    ],
    tableRole: [
      "Em combate, ele sustenta aliados, repele mortos-vivos e usa magia para estabilizar cenas perigosas.",
      "Em exploracao, preces, rituais e sinais divinos ajudam a interpretar maldicoes, tumbas, templos e pressagios.",
      "Em drama, a pergunta central e: o que sua fe exige de voce quando a solucao facil parece errada?",
    ],
    firstSession: [
      "Defina nome, simbolo, dominio e tabu da divindade. Um bom tabu e algo que realmente possa aparecer na aventura.",
      "Prepare magias com intencao: uma para proteger, uma para investigar, uma para resolver crise e uma para expressar a identidade da divindade.",
      "Avise ao grupo como sua fe aparece. Pode ser acolhedora, severa, misteriosa, festiva, guerreira ou cheia de rituais pequenos.",
    ],
    moveReading: magicMoveReading,
    example:
      "Se um aliado cai envenenado em uma cripta, o Clerigo pode ajoelhar, erguer o simbolo sagrado e conjurar cura. Em 7-9, talvez a cura funcione, mas a presença divina tambem desperte algo antigo no templo.",
    gmCue:
      "Use santos, hereges, mortos-vivos, juramentos quebrados e pedidos de fieis. A magia do Clerigo deve parecer resposta de uma vontade maior, nao apenas um efeito automatico.",
  },
  druida: {
    fantasy: [
      "O Druida pertence a uma terra, a seus espiritos e a seus ciclos. Ele ve cidades, monstros e pessoas como partes de um ecossistema maior.",
      "Metamorfose e comunhao natural nao sao disfarces comuns: quando o Druida muda de forma, ele muda tambem a maneira de perceber, desejar e resolver problemas.",
      "Para novatos, a classe e ótima para quem gosta de criatividade. Muitas respostas vêm da pergunta: que forma, animal, sinal natural ou espirito faria sentido aqui?",
    ],
    tableRole: [
      "Em combate, o Druida pode controlar posicao, proteger aliados, assumir forma perigosa ou criar vantagem com o ambiente.",
      "Em exploracao, ele entende rastros, clima, plantas, comportamento animal e territorios de uma forma que outros personagens nao conseguem.",
      "Em cenas sociais, ele pode agir como estrangeiro aos costumes urbanos ou como mediador entre pessoas e forças naturais.",
    ],
    firstSession: [
      "Escolha sua terra com detalhes concretos: cheiro, clima, criaturas comuns, perigo sagrado e algo que os forasteiros sempre entendem errado.",
      "Anote tres formas animais que voce imagina usar. Pense no que cada uma faz bem, nao apenas em dano.",
      "Pergunte ao mestre que sinais naturais existem na cena. O Druida fica mais facil de jogar quando o ambiente tem textura.",
    ],
    moveReading: [
      "Ao usar Metamorfose, descreva qual espirito ou aspecto natural voce chama e o que essa forma quer fazer.",
      "Os movimentos da forma devem nascer da ficcao: garras escalam, asas observam, faro rastreia, casco resiste, veneno pressiona.",
      "Quando uma cena nao parecer natural, procure ainda assim por sinais: mofo, agua, insetos, vento, pedra, madeira, fome ou territorio.",
    ],
    example:
      "Em uma fortaleza tomada por cultistas, o Druida pode virar um rato para passar pelas fundacoes, mas talvez perceba que o lugar esta doente antes mesmo de encontrar o altar.",
    gmCue:
      "Coloque consequencias ecologicas nas aventuras. Queimadas, minas, pragas, espiritos deslocados e animais inquietos dao ao Druida informacao e responsabilidade.",
  },
  "engenheiro-arcano": {
    fantasy: [
      "O Engenheiro Arcano trata magia como projeto, prototipo e risco calculado. Ele combina estudo, ferramentas, codex, energia instavel e improviso tecnico.",
      "A classe nao precisa parecer um mago tradicional. Pode usar bobinas, lentes, runas, placas, reagentes, motores pequenos, luvas condutoras ou instrumentos de laboratorio.",
      "Para iniciantes, ela funciona bem quando o jogador gosta de explicar como um efeito acontece e aceita que invenções poderosas tambem trazem falhas interessantes.",
    ],
    tableRole: [
      "Em combate, o Engenheiro Arcano cria efeitos, barreiras, descargas e solucoes de cena que parecem dispositivos ativados sob pressao.",
      "Em exploracao, ele interpreta mecanismos, energia antiga, ruinas tecnologicas, armadilhas e objetos que misturam ciencia e arcano.",
      "Em suporte, ele prepara recursos antes do perigo e transforma equipamentos em vantagem narrativa.",
    ],
    firstSession: [
      "Defina a aparencia do seu codex: manual manchado, cristal de dados, caderno dobravel, cilindro mecanico ou prancheta cheia de diagramas.",
      "Escolha uma assinatura visual para seus efeitos. Isso ajuda todos a imaginarem quando voce ativa magia por meio de engenharia.",
      "Quando falhar, abrace a falha como parte do laboratorio em campo: fumaça, superaquecimento, curto, ruido, magnetismo, vazamento ou instabilidade planar.",
    ],
    moveReading: magicMoveReading,
    example:
      "Para conter uma horda em corredor estreito, o Engenheiro Arcano pode fixar tres pinos no chao e ativar um campo eletromagnetico. Em sucesso parcial, o campo segura os inimigos, mas drena uma celula rara ou atrai algo metalico demais.",
    gmCue:
      "Dê materia-prima, diagramas incompletos, maquinas antigas e custos de manutencao. O Engenheiro Arcano fica vivo quando preparar e improvisar parecem igualmente uteis.",
  },
  guerreiro: {
    fantasy: [
      "O Guerreiro e o especialista em violencia direta, armas e presenca no campo de batalha. Ele nao e apenas alguem forte; ele entende ritmo, alcance, vantagem e medo.",
      "A arma favorita e parte da identidade. Ela tem historia, marcas, estilo e reputacao, quase como uma extensao do personagem.",
      "Para novatos, e uma das classes mais claras: quando houver perigo fisico, o Guerreiro provavelmente tem uma resposta simples, forte e visivel.",
    ],
    tableRole: [
      "Em combate, ele segura a frente, protege espacos e transforma ataques em oportunidades para o grupo.",
      "Fora do combate, ele reconhece disciplina militar, ferimentos, armas, fortificacoes e pessoas que vivem pela espada.",
      "Em drama, o Guerreiro pergunta: por que eu luto, por quem eu aceito sangrar e que limite eu nao cruzo?",
    ],
    firstSession: [
      "Descreva sua arma favorita com tres detalhes: material, marca de uso e como ela chegou ate voce.",
      "Converse com o grupo sobre quem voce costuma proteger. Isso torna Defend e escolhas de posicionamento muito mais naturais.",
      "Nao espere sempre por iniciativa. Em Dungeon World, se voce avanca, derruba mesa, bloqueia porta ou desafia o chefe, a cena responde imediatamente.",
    ],
    moveReading: martialMoveReading,
    example:
      "Se um ogro ergue uma viga contra o Mago, o Guerreiro pode se jogar no caminho, levantar o escudo e segurar a pancada para comprar tempo. Isso pode disparar Defend ou Desafiar Perigo com Constituicao.",
    gmCue:
      "Mostre alcance, terreno e consequencias. Pontes estreitas, portas travadas, inimigos disciplinados e armas incomuns deixam o Guerreiro tomar decisoes alem de simplesmente causar dano.",
  },
  ladrao: {
    fantasy: [
      "O Ladrao vive de oportunidade, segredo e precisao. Ele pode ser criminoso, espião, explorador urbano, assassino, trapaceiro elegante ou sobrevivente de rua.",
      "A classe nao serve apenas para roubar. Ela descobre rotas, neutraliza armadilhas, prepara venenos, encontra contatos e transforma descuido alheio em vantagem.",
      "Para iniciantes, o Ladrao ensina a perguntar pelo ambiente: sombras, fechaduras, saidas, guardas, rotinas, objetos pequenos e quem esta prestando atencao.",
    ],
    tableRole: [
      "Em combate, ele prefere alvo vulneravel, posicao favoravel e ataque decisivo em vez de troca justa de golpes.",
      "Em exploracao, ele reduz o custo das escolhas do grupo ao lidar com armadilhas, trancas e riscos discretos.",
      "Em cenas sociais, ele percebe mentira, valor, desejo e medo porque esta acostumado a sobreviver lendo pessoas.",
    ],
    firstSession: [
      "Defina seu codigo: o que voce rouba, de quem nunca rouba e que tipo de promessa voce respeita.",
      "Sempre pergunte por entradas, saidas e detalhes tocaveis. Uma janela, cortina, moeda, anel ou copo pode virar plano.",
      "Use veneno com intencao narrativa. Veneno bom nao e so dano: pode dormir, enfraquecer, marcar, silenciar ou criar pressao.",
    ],
    moveReading: [
      "Quando um movimento falar de perigo escondido, descreva como voce examina antes de tocar.",
      "Quando atacar alguem vulneravel, explique por que o alvo esta vulneravel: surpresa, distracao, posicao, refem, escuridao ou confianca.",
      "Se a rolagem parcial pedir custo, pense em alarme, tempo perdido, ferramenta quebrada, exposicao ou escolha entre tesouro e seguranca.",
    ],
    example:
      "Ao encontrar uma porta com runas, o Ladrao pode observar poeira, dobradicas e marcas de ferramenta antes de mexer. O mestre pode revelar risco, pedir rolagem ou dizer o que custa desarmar sem chamar atencao.",
    gmCue:
      "Crie seguranca com camadas: pessoas, horarios, ruido, luz, fechaduras e consequencias. O Ladrao merece problemas que possam ser resolvidos com cuidado, audacia ou plano torto.",
  },
  mago: {
    fantasy: [
      "O Mago estuda a realidade ate encontrar as costuras dela. Grimorio, preparo e ritual sao tao importantes quanto o momento chamativo da magia.",
      "A classe e poderosa, mas frágil. Ela brilha quando o jogador pensa antes, escolhe magias com proposito e aceita que poder arcano atrai atencao.",
      "Para novatos, o Mago funciona melhor quando cada magia tem uma imagem clara: como soa, que cor tem, que simbolo aparece e o que o personagem teme perder.",
    ],
    tableRole: [
      "Em combate, ele muda a situacao com dano, controle, defesa ou solucao inesperada, mas precisa de protecao e posicionamento.",
      "Em investigacao, ele identifica fenomenos arcanos, consulta conhecimento e usa ritual para efeitos maiores que uma magia comum.",
      "Em drama, o Mago lida com curiosidade, ambicao e o peso de saber coisas que pessoas sensatas deixariam enterradas.",
    ],
    firstSession: [
      "Escolha magias preparadas pensando em problemas diferentes: uma ofensiva, uma defensiva, uma utilitaria e uma que mostre personalidade.",
      "Proteja seu grimorio. Diga onde ele fica, como e trancado e que anotacao estranha alguem veria se o abrisse.",
      "Quando quiser algo grande demais para uma magia comum, proponha Ritual e aceite que o mestre vai pedir local, material, tempo, ajuda ou custo.",
    ],
    moveReading: magicMoveReading,
    example:
      "Se a sala esta cheia de soldados, o Mago pode conjurar uma magia para bloquear a entrada com energia. Em 7-9, talvez a barreira funcione, mas a magia se desgaste rapido ou apague outra preparacao.",
    gmCue:
      "Dê bibliotecas perigosas, nomes verdadeiros, fenomenos instaveis e consequencias arcanas visiveis. O Mago deve sentir que conhecimento abre portas e tambem acorda coisas.",
  },
  paladino: {
    fantasy: [
      "O Paladino e vontade sagrada andando de armadura. Ele representa juramento, causa, autoridade e sacrificio.",
      "A classe nao precisa ser perfeita ou sem duvida. Ela fica mais interessante quando a missao e clara, mas o caminho ate ela cria conflitos humanos.",
      "Para iniciantes, o Paladino da direcao forte: proteger inocentes, punir horrores, resistir tentacao e declarar o que e inaceitavel.",
    ],
    tableRole: [
      "Em combate, ele ocupa a frente, chama inimigos perigosos para si e transforma fe em pressao real.",
      "Em cenas sociais, sua autoridade pode abrir portas ou fechar negociacoes, dependendo de como ele fala e de quem esta ouvindo.",
      "Em drama, votos e questoes fazem o jogador escolher entre eficiencia, compaixao, honra e consequencia.",
    ],
    firstSession: [
      "Escreva sua causa em uma frase curta. Ela deve ser especifica o bastante para orientar escolhas durante a aventura.",
      "Escolha um simbolo visivel de juramento: escudo, anel, cicatriz, faixa, espada, canto, lema ou gesto de oracao.",
      "Converse com o mestre sobre que tipo de mal sua ordem reconhece de imediato e que tipo de mal costuma se esconder melhor.",
    ],
    moveReading: [
      "Quando uma habilidade mencionar autoridade divina, diga em nome de quem ou de que causa voce age.",
      "Quando fizer uma Questao, trate votos como motores de cena. Eles nao existem para punir; existem para deixar suas escolhas mais dramaticas.",
      "Se uma cura ou ordem envolve outra pessoa, descreva contato, olhar, simbolo ou promessa. A cena deve sentir o peso do sagrado.",
    ],
    example:
      "Ao encarar um necromante que usa aldeoes como escudo, o Paladino pode declarar sua autoridade, exigir rendicao e prometer julgamento. A rolagem mede se a presenca sagrada dobra a vontade do inimigo ou cobra uma prova imediata.",
    gmCue:
      "Coloque inocentes, juramentos conflitantes, inimigos redimiveis e autoridades corruptas. O Paladino fica forte quando a pergunta nao e apenas 'posso vencer?', mas 'como devo vencer?'.",
  },
  ranger: {
    fantasy: [
      "O Ranger e guia, caçador e guardiao de fronteiras. Ele entende lugares perigosos antes que outras pessoas percebam que entraram em territorio hostil.",
      "Seu companheiro animal nao e acessorio. Ele tem instintos, treinamento, limites e personalidade que ajudam a resolver problemas de formas que humanos nao fariam.",
      "Para novatos, o Ranger e excelente quando o jogador quer explorar, rastrear, atirar, perceber ameaças e ter uma parceria constante em cena.",
    ],
    tableRole: [
      "Em combate, ele usa distancia, terreno, alvo marcado e coordenação com o companheiro para criar vantagem.",
      "Em viagem, ele reduz surpresa, encontra rotas, interpreta rastros e transforma o mapa em parte viva da historia.",
      "Em cenas sociais, ele pode reconhecer caçadores, fronteiricos, contrabandistas, guardas de estrada e pessoas que respeitam competencia no ermo.",
    ],
    firstSession: [
      "Defina nome, especie, treinamento e um defeito pequeno do companheiro animal. Defeito bom cria cenas, nao atrapalha o jogo toda hora.",
      "Pergunte sempre que marcas o ambiente mostra: pegadas, cheiro, silencio, galhos quebrados, aves fugindo ou fogo recente.",
      "Escolha seu estilo de caçada: paciente, feroz, tecnico, espiritual, militar ou protetor.",
    ],
    moveReading: [
      "Quando rastrear, diga que sinal voce segue. O mestre pode responder com distancia, numero, direcao, estado emocional ou perigo deixado para tras.",
      "Quando comandar o companheiro, use os pontos fortes dele e respeite o treinamento escolhido.",
      "Quando atirar, pense em cobertura, munição, linha de visao e posicao. O resultado parcial deve mexer com esses elementos.",
    ],
    example:
      "Se uma criatura levou uma crianca pela mata, o Ranger pode examinar lama, folhas e cheiro no ar. O companheiro fareja medo enquanto o Ranger decide se corre para alcançar ou segue com cuidado para evitar emboscada.",
    gmCue:
      "Use trilhas, clima, presas inteligentes, fronteiras politicas e sinais de passagem. O Ranger merece descobrir coisas antes do grupo, desde que esteja olhando para o lugar certo.",
  },
};

export const defaultClassGuide: ClassGuide = {
  fantasy: [
    "Esta classe representa um modo especifico de existir na aventura: nao apenas uma lista de numeros, mas uma promessa sobre que tipo de cena o personagem cria.",
    "Leia a descricao, as habilidades iniciais e o equipamento juntos. Eles indicam como o personagem resolve problemas, que riscos aceita e que imagem os outros tem dele.",
  ],
  tableRole: [
    "Use as habilidades iniciais para descobrir onde o personagem naturalmente toma iniciativa.",
    "Observe o atributo principal e o dado de dano para entender se a classe tende a agir pela frente, pelo suporte, pela magia, pela informacao ou pela oportunidade.",
  ],
  firstSession: [
    "Escolha um detalhe visual forte e uma motivacao simples para entrar na primeira aventura.",
    "Quando nao souber o que fazer, olhe as habilidades iniciais e descreva uma acao que pareca acionar uma delas.",
  ],
  moveReading: martialMoveReading,
  example:
    "Um bom uso da ficha começa com uma descricao concreta. Depois a mesa decide se aquilo dispara um movimento, que atributo entra e quais consequencias fazem sentido.",
  gmCue:
    "Mostre situacoes que conversem com as habilidades iniciais da classe e explique em voz alta por que uma rolagem foi chamada.",
};

export function getClassGuide(classId: string) {
  return classGuides[classId] ?? defaultClassGuide;
}
