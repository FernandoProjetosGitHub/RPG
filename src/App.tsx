import { useMemo, useState } from 'react'
import heroImage from './assets/zine-hero.png'
import frontierImage from './assets/zine-frontier.png'
import tableImage from './assets/zine-table.png'

type ZinePage = {
  id: string
  number: string
  title: string
  kicker: string
  description: string
  image: string
  palette: string
  notes: string[]
}

type AdventurerClass = {
  id: string
  name: string
  archetype: string
  hook: string
  stat: string
  hp: string
  load: string
  equipment: string
  moves: string[]
}

type MoveCard = {
  name: string
  stat: string
  trigger: string
  result: string
  gmCue: string
}

type Spell = {
  name: string
  tradition: 'Clerigo' | 'Mago'
  level: string
  summary: string
}

const pages: ZinePage[] = [
  {
    id: 'mesa',
    number: '01',
    title: 'Mesa em Movimento',
    kicker: 'Guia do jogo',
    description:
      'Dungeon World funciona como conversa de mesa: a ficcao chama o movimento, os dados mudam a situacao e o MJ devolve consequencias claras.',
    image: heroImage,
    palette: 'Carvao / Ouro velho',
    notes: ['Ficcao primeiro', '10+, 7-9 e 6-', 'MJ nao rola ataques'],
  },
  {
    id: 'movimentos',
    number: '02',
    title: 'Cartas de Movimento',
    kicker: 'Referencia rapida',
    description:
      'Os movimentos mais usados ficam em cards curtos, com gatilho, atributo e leitura de resultado para consulta durante a sessao.',
    image: tableImage,
    palette: 'Pergaminho / Teal gasto',
    notes: ['Gatilho claro', 'Parcial interessante', 'Consequencia visivel'],
  },
  {
    id: 'fronteira',
    number: '03',
    title: 'Frentes & Perigos',
    kicker: 'Mestre',
    description:
      'Ameacas, pressagios e locais perigosos entram como combustivel para improvisar sem perder coerencia com a aventura.',
    image: frontierImage,
    palette: 'Verde frio / Sangue seco',
    notes: ['Pressagios', 'Perigos ativos', 'Perguntas abertas'],
  },
]

const adventurerClasses: AdventurerClass[] = [
  {
    id: 'bardo',
    name: 'Bardo',
    archetype: 'voz, memoria e mentira bonita',
    hook:
      'Transforma historias em vantagem, abre portas com charme e reconhece criaturas, lugares e lendas antes dos demais.',
    stat: 'Carisma',
    hp: '6 + Constituicao',
    load: '9 + FOR',
    equipment: 'Instrumento, roupa marcante, arma leve e provisoes de viagem',
    moves: ['Arte Arcana', 'Conhecimento de Bardo', 'Charmoso e Receptivo', 'Um Porto na Tempestade'],
  },
  {
    id: 'clerigo',
    name: 'Clerigo',
    archetype: 'fe, dominio e custo sagrado',
    hook:
      'Serve a uma divindade, recebe preces, afasta mortos-vivos e transforma crenca em risco concreto na ficcao.',
    stat: 'Sabedoria',
    hp: '8 + Constituicao',
    load: '10 + FOR',
    equipment: 'Simbolo sagrado, armadura, arma simples e suprimentos',
    moves: ['Divindade', 'Comunhao', 'Conjurar Magia', 'Expulsar Mortos-Vivos'],
  },
  {
    id: 'druida',
    name: 'Druida',
    archetype: 'territorio vivo e pele trocada',
    hook:
      'Pertence a uma terra, fala com espiritos naturais e assume formas que mudam o tipo de problema que o grupo consegue enfrentar.',
    stat: 'Sabedoria',
    hp: '6 + Constituicao',
    load: '6 + FOR',
    equipment: 'Totem natural, peles, ervas e arma rustica',
    moves: ['Nascido do Solo', 'Mudanca de Forma', 'Falar com Espiritos', 'Estudo da Essencia'],
  },
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    archetype: 'aco, cicatriz e resposta direta',
    hook:
      'E a linha entre o grupo e a morte. Sua arma assinatura resolve problemas, mas tambem cria reputacao.',
    stat: 'Forca',
    hp: '10 + Constituicao',
    load: '12 + FOR',
    equipment: 'Arma assinatura, armadura, escudo ou arma secundaria',
    moves: ['Arma Assinatura', 'Dobrar Barras', 'Aparar o Golpe', 'Ataque Implacavel'],
  },
  {
    id: 'ladrao',
    name: 'Ladrao',
    archetype: 'sombra, veneno e segunda saida',
    hook:
      'Encontra armadilhas, abre fechaduras, prepara venenos e transforma descuido inimigo em golpe decisivo.',
    stat: 'Destreza',
    hp: '6 + Constituicao',
    load: '9 + FOR',
    equipment: 'Ferramentas, venenos, adaga, arma curta e roupas discretas',
    moves: ['Especialista em Armadilhas', 'Ataque Furtivo', 'Preparar Veneno', 'Flexivel Moralmente'],
  },
  {
    id: 'mago',
    name: 'Mago',
    archetype: 'grimorio, preparo e poder instavel',
    hook:
      'Prepara magias no grimorio, usa rituais quando tem tempo e paga o preco quando a realidade resiste.',
    stat: 'Inteligencia',
    hp: '4 + Constituicao',
    load: '7 + FOR',
    equipment: 'Grimorio, componentes, cajado ou adaga ritual',
    moves: ['Grimorio', 'Preparar Magias', 'Conjurar Magia', 'Ritual'],
  },
  {
    id: 'paladino',
    name: 'Paladino',
    archetype: 'juramento, julgamento e presenca sagrada',
    hook:
      'Impoe votos, protege aliados e transforma sua causa em uma forca que precisa ser honrada em cena.',
    stat: 'Carisma',
    hp: '10 + Constituicao',
    load: '12 + FOR',
    equipment: 'Armadura pesada, simbolo sagrado, arma nobre e provisoes',
    moves: ['Impor as Maos', 'Questao', 'Eu Sou a Lei', 'Defensor Juramentado'],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    archetype: 'trilha, presa e companheiro animal',
    hook:
      'Le rastros, guia jornadas perigosas e luta ao lado de um companheiro animal com instinto proprio.',
    stat: 'Destreza',
    hp: '8 + Constituicao',
    load: '11 + FOR',
    equipment: 'Arco, arma de corpo a corpo, equipamento de viagem e provisoes',
    moves: ['Cacar e Rastrear', 'Disparo Chamado', 'Companheiro Animal', 'Meio Selvagem'],
  },
]

const moveCards: MoveCard[] = [
  {
    name: 'Atacar e Retalhar',
    stat: 'FOR',
    trigger: 'Quando atacar um inimigo em combate corpo a corpo.',
    result: '10+ causa dano e evita resposta direta; 7-9 causa dano, mas sofre contra-ataque ou custo imediato.',
    gmCue: 'Mostre a troca de golpes, posicao, armadura, alcance e o que fica exposto.',
  },
  {
    name: 'Disparar',
    stat: 'DES',
    trigger: 'Quando mirar e atacar a distancia.',
    result:
      '10+ acerta limpo; 7-9 exige escolha: gastar municao, aceitar perigo ou causar menos impacto.',
    gmCue: 'Use cobertura, linha de visao, municao e aproximacao inimiga.',
  },
  {
    name: 'Desafiar o Perigo',
    stat: 'Variavel',
    trigger: 'Quando agir apesar de risco iminente ou sofrer uma calamidade.',
    result: '10+ supera o perigo; 7-9 passa com hesitacao, custo ou escolha dificil.',
    gmCue: 'Escolha o atributo pelo metodo narrado, nao pela ficha mais alta.',
  },
  {
    name: 'Defender',
    stat: 'CON',
    trigger: 'Quando se colocar em defesa de pessoa, item ou local.',
    result:
      '10+ recebe reservas para reduzir dano, redirecionar ataque, abrir vantagem ou causar dano; 7-9 recebe menos reservas.',
    gmCue: 'Pressione aquilo que esta sendo protegido.',
  },
  {
    name: 'Discernir Realidades',
    stat: 'SAB',
    trigger: 'Quando estudar uma situacao ou lugar com atencao.',
    result:
      '10+ faz varias perguntas; 7-9 faz uma. As respostas devem apontar para acao concreta.',
    gmCue: 'Responda honestamente e mostre algo util, perigoso ou vulneravel.',
  },
  {
    name: 'Parlamentar',
    stat: 'CAR',
    trigger: 'Quando negociar com alguem usando uma alavanca real.',
    result:
      '10+ a pessoa aceita se receber o prometido; 7-9 exige garantia, prova ou concessao antes.',
    gmCue: 'A alavanca precisa importar para o alvo.',
  },
  {
    name: 'Ajudar ou Interferir',
    stat: 'Vinculo',
    trigger: 'Quando usar seu relacionamento para apoiar ou atrapalhar outro personagem.',
    result:
      '10+ modifica a rolagem do aliado; 7-9 tambem modifica, mas voce se expoe a perigo ou custo.',
    gmCue: 'Peca para o jogador dizer como o vinculo aparece na cena.',
  },
  {
    name: 'Ultimo Suspiro',
    stat: 'Nenhum',
    trigger: 'Quando chegar as portas da morte.',
    result:
      '10+ escapa por pouco; 7-9 a morte oferece barganha; 6- o destino cobra sem suavidade.',
    gmCue: 'Faca a morte ser pessoal, estranha e memoravel.',
  },
]

const spells: Spell[] = [
  {
    name: 'Luz',
    tradition: 'Clerigo',
    level: 'Oracao',
    summary: 'Faz um objeto brilhar com claridade sagrada por tempo util a exploracao.',
  },
  {
    name: 'Santificar',
    tradition: 'Clerigo',
    level: 'Oracao',
    summary: 'Marca comida, agua ou gesto simples como consagrado a divindade.',
  },
  {
    name: 'Orientacao',
    tradition: 'Clerigo',
    level: 'Oracao',
    summary: 'A divindade oferece um sinal breve sobre o que merece atencao.',
  },
  {
    name: 'Curar Ferimentos Leves',
    tradition: 'Clerigo',
    level: '1',
    summary: 'Restaura vitalidade de um alvo tocado, com efeito direto e imediato.',
  },
  {
    name: 'Detectar Alinhamento',
    tradition: 'Clerigo',
    level: '1',
    summary: 'Percebe uma inclinacao moral ou espiritual relevante em criatura proxima.',
  },
  {
    name: 'Falar com os Mortos',
    tradition: 'Clerigo',
    level: '3',
    summary: 'Permite uma conversa breve com um cadaver que ainda tenha algo a revelar.',
  },
  {
    name: 'Revelacao',
    tradition: 'Clerigo',
    level: '5',
    summary: 'Pede a divindade uma verdade importante sobre pessoa, lugar ou objeto.',
  },
  {
    name: 'Curar Ferimentos Criticos',
    tradition: 'Clerigo',
    level: '7',
    summary: 'Fecha ferimentos severos e devolve alguem ao centro da cena.',
  },
  {
    name: 'Tempestade da Vinganca',
    tradition: 'Clerigo',
    level: '9',
    summary: 'Invoca furia divina em escala grande, adequada a batalha decisiva.',
  },
  {
    name: 'Prestidigitacao',
    tradition: 'Mago',
    level: 'Truque',
    summary: 'Produz pequenos efeitos visuais, sonoros ou praticos sem grande peso dramatico.',
  },
  {
    name: 'Luz',
    tradition: 'Mago',
    level: 'Truque',
    summary: 'Cria luz magica controlada, util em masmorras e sinais improvisados.',
  },
  {
    name: 'Misseis Magicos',
    tradition: 'Mago',
    level: '1',
    summary: 'Dispara energia arcana contra um alvo visivel, confiavel para combate.',
  },
  {
    name: 'Alarme',
    tradition: 'Mago',
    level: '1',
    summary: 'Prepara uma protecao simples que avisa quando alguem cruza o limite.',
  },
  {
    name: 'Invisibilidade',
    tradition: 'Mago',
    level: '3',
    summary: 'Oculta uma criatura ate que ela ataque, conjure ou chame atencao demais.',
  },
  {
    name: 'Bola de Fogo',
    tradition: 'Mago',
    level: '3',
    summary: 'Explode chamas em area, excelente para perigo aberto e consequencias colaterais.',
  },
  {
    name: 'Contato com Outro Plano',
    tradition: 'Mago',
    level: '5',
    summary: 'Busca conhecimento alem do mundo comum, sempre com risco de resposta pesada.',
  },
  {
    name: 'Dominar',
    tradition: 'Mago',
    level: '7',
    summary: 'Assume controle momentaneo de uma mente vulneravel a sua vontade.',
  },
  {
    name: 'Abrigo',
    tradition: 'Mago',
    level: '9',
    summary: 'Cria um refugio arcano seguro o bastante para mudar o ritmo da aventura.',
  },
]

const rituals = [
  'Siga a ficcao: se nada perigoso ou incerto acontece, nao ha rolagem.',
  'Em 7-9, ofereca sucesso com custo real, escolha dificil ou nova ameaca.',
  'Use movimentos do MJ para devolver pressao, pistas e consequencias ao grupo.',
]

export default function App() {
  const [activePageId, setActivePageId] = useState(pages[0].id)
  const [isCodexOpen, setIsCodexOpen] = useState(false)
  const [codexMode, setCodexMode] = useState<'page' | 'class'>('page')
  const [selectedClassId, setSelectedClassId] = useState(adventurerClasses[0].id)
  const [spellTradition, setSpellTradition] = useState<'Todos' | 'Clerigo' | 'Mago'>('Todos')

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId],
  )

  const selectedClass = useMemo(
    () => adventurerClasses.find((heroClass) => heroClass.id === selectedClassId) ?? adventurerClasses[0],
    [selectedClassId],
  )

  const filteredSpells = useMemo(
    () =>
      spellTradition === 'Todos'
        ? spells
        : spells.filter((spell) => spell.tradition === spellTradition),
    [spellTradition],
  )

  function openClass(classId: string) {
    setSelectedClassId(classId)
    setCodexMode('class')
    setIsCodexOpen(true)
  }

  function openPage() {
    setCodexMode('page')
    setIsCodexOpen(true)
  }

  return (
    <main className="zine-shell">
      <nav className="site-menu" aria-label="Menu principal">
        <a href="#inicio">Inicio</a>
        <a href="#movimentos">Movimentos</a>
        <a href="#classes">Classes</a>
        <a href="#magias">Magias</a>
        <a href="#mesa">Mesa</a>
      </nav>

      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero__veil" />
        <div className="hero__content" id="inicio">
          <p className="eyebrow">Dungeon World digital</p>
          <h1>Referencia viva para aventuras perigosas</h1>
          <p>
            Consulta mobile-first para movimentos, classes e magias, adaptada dos PDFs em
            formato de zine jogavel para uso direto na mesa.
          </p>
          <div className="hero__actions" aria-label="Acoes principais">
            <a href="#movimentos">Movimentos</a>
            <a href="#classes">Classes</a>
            <a href="#magias">Magias</a>
          </div>
        </div>
        <div className="hero__sigil" aria-hidden="true">
          DW
        </div>
      </section>

      <section className="intro-band" aria-label="Principios de leitura">
        {rituals.map((ritual, index) => (
          <article key={ritual}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{ritual}</p>
          </article>
        ))}
      </section>

      <section className="reader" id="paginas" aria-label="Paginas coloridas do zine">
        <div className="reader__copy">
          <p className="eyebrow">Guia do Dungeon World</p>
          <h2>{activePage.title}</h2>
          <p>{activePage.description}</p>
          <dl>
            <div>
              <dt>Capitulo</dt>
              <dd>{activePage.kicker}</dd>
            </div>
            <div>
              <dt>Paleta</dt>
              <dd>{activePage.palette}</dd>
            </div>
          </dl>
        </div>

        <div className="reader__stage">
          <button
            className="feature-image"
            type="button"
            onClick={openPage}
            aria-label={`Abrir detalhes de ${activePage.title}`}
          >
            <img src={activePage.image} alt="" />
            <span>{activePage.number}</span>
          </button>
          <div className="note-stack" aria-label="Marcadores da pagina">
            {activePage.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-grid" aria-label="Selecao de capitulos">
        {pages.map((page) => (
          <button
            className={page.id === activePage.id ? 'page-card page-card--active' : 'page-card'}
            type="button"
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            aria-pressed={page.id === activePage.id}
          >
            <img src={page.image} alt="" />
            <span>{page.number}</span>
            <strong>{page.title}</strong>
            <small>{page.kicker}</small>
          </button>
        ))}
      </section>

      <section className="move-reference" id="movimentos" aria-label="Cartas de movimento">
        <div className="section-title">
          <p className="eyebrow">Cartas de movimento</p>
          <h2>Gatilhos claros, consequencias rapidas</h2>
          <p>
            Cards resumidos e parafraseados para consulta em mesa. Use o texto completo dos
            PDFs quando precisar resolver uma excecao fina.
          </p>
        </div>
        <div className="move-grid">
          {moveCards.map((move) => (
            <article className="move-card" key={move.name}>
              <span>{move.stat}</span>
              <h3>{move.name}</h3>
              <p>{move.trigger}</p>
              <strong>{move.result}</strong>
              <small>{move.gmCue}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="class-manual" id="classes" aria-label="Manual de classes">
        <div className="section-title">
          <p className="eyebrow">Manual de classes</p>
          <h2>Escolha o papel antes da masmorra escolher voce</h2>
          <p>
            Consulta rapida baseada nas fichas de classe: arquétipo, atributo-chave,
            PV, carga, equipamento e movimentos iniciais.
          </p>
        </div>
        <div className="class-grid">
          {adventurerClasses.map((heroClass) => (
            <button
              className="class-card"
              type="button"
              key={heroClass.id}
              onClick={() => openClass(heroClass.id)}
            >
              <span>{heroClass.stat}</span>
              <strong>{heroClass.name}</strong>
              <small>{heroClass.archetype}</small>
              <p>{heroClass.hook}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="spellbook" id="magias" aria-label="Guia de magias">
        <div className="section-title">
          <p className="eyebrow">Guia de magias</p>
          <h2>Preces, truques e feitiços preparados</h2>
          <p>
            Magias organizadas por tradição e nivel, com resumo funcional para lembrar o papel
            de cada efeito sem interromper a conversa da mesa.
          </p>
        </div>
        <div className="spell-filters" aria-label="Filtro de magias">
          {(['Todos', 'Clerigo', 'Mago'] as const).map((tradition) => (
            <button
              className={spellTradition === tradition ? 'is-active' : ''}
              type="button"
              key={tradition}
              onClick={() => setSpellTradition(tradition)}
            >
              {tradition}
            </button>
          ))}
        </div>
        <div className="spell-grid">
          {filteredSpells.map((spell) => (
            <article className="spell-card" key={`${spell.tradition}-${spell.level}-${spell.name}`}>
              <span>
                {spell.tradition} · {spell.level}
              </span>
              <h3>{spell.name}</h3>
              <p>{spell.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="play-aid" id="mesa" aria-label="Auxilio de mesa">
        <div>
          <p className="eyebrow">Para usar na mesa</p>
          <h2>Fiel ao ritmo: ficcao, movimento, consequencia</h2>
        </div>
        <div className="play-aid__columns">
          <p>
            A pagina evita copiar blocos longos dos PDFs e transforma o material em referencia
            operacional: nomes, gatilhos e resumos para consulta rapida.
          </p>
          <p>
            Classes e magias foram organizadas para acelerar criacao de personagem, preparo de
            sessoes e consulta durante rolagens importantes.
          </p>
        </div>
      </section>

      <nav className="mobile-dock" aria-label="Menu mobile">
        <a href="#inicio">Inicio</a>
        <a href="#movimentos">Moves</a>
        <a href="#classes">Classes</a>
        <a href="#magias">Magias</a>
      </nav>

      {isCodexOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="codex-title">
          <button
            className="modal__backdrop"
            type="button"
            onClick={() => setIsCodexOpen(false)}
            aria-label="Fechar detalhes"
          />
          <article className="modal__panel">
            <button className="modal__close" type="button" onClick={() => setIsCodexOpen(false)}>
              Fechar
            </button>
            {codexMode === 'class' ? (
              <>
                <img src={tableImage} alt="" />
                <div>
                  <p className="eyebrow">{selectedClass.name}</p>
                  <h2 id="codex-title">{selectedClass.archetype}</h2>
                  <p>{selectedClass.hook}</p>
                  <dl className="class-sheet">
                    <div>
                      <dt>Atributo</dt>
                      <dd>{selectedClass.stat}</dd>
                    </div>
                    <div>
                      <dt>PV</dt>
                      <dd>{selectedClass.hp}</dd>
                    </div>
                    <div>
                      <dt>Carga</dt>
                      <dd>{selectedClass.load}</dd>
                    </div>
                    <div>
                      <dt>Equipamento</dt>
                      <dd>{selectedClass.equipment}</dd>
                    </div>
                  </dl>
                  <ul>
                    {selectedClass.moves.map((move) => (
                      <li key={move}>{move}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <img src={activePage.image} alt="" />
                <div>
                  <p className="eyebrow">{activePage.kicker}</p>
                  <h2 id="codex-title">{activePage.title}</h2>
                  <p>{activePage.description}</p>
                  <ul>
                    {activePage.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  )
}
