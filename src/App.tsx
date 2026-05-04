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
  equipment: string
  moves: string[]
}

const pages: ZinePage[] = [
  {
    id: 'mesa',
    number: '01',
    title: 'Mesa em Chamas',
    kicker: 'Abertura',
    description:
      'Uma entrada sombria para o zine, com clima de campanha viva, escolhas perigosas e mapas que parecem mudar quando a vela baixa.',
    image: heroImage,
    palette: 'Crimson / Ouro velho',
    notes: ['Ganchos imediatos', 'Tom de sessao', 'Promessas sombrias'],
  },
  {
    id: 'movimentos',
    number: '02',
    title: 'Movimentos & Pressagios',
    kicker: 'Sistema',
    description:
      'Blocos de regras tratados como paginas de grimorio: leitura rapida, contraste alto e microinteracoes para revelar detalhes.',
    image: tableImage,
    palette: 'Teal / Pergaminho',
    notes: ['Rolagens dramaticas', 'Consequencias claras', 'Foco em ficcao'],
  },
  {
    id: 'fronteira',
    number: '03',
    title: 'Fronteira Negra',
    kicker: 'Cenario',
    description:
      'Locais, rumores e ameacas em uma paisagem colorida por neblina fria, brasas vermelhas e o brilho gasto de velhas reliquias.',
    image: frontierImage,
    palette: 'Verde frio / Sangue',
    notes: ['Ruinas clicaveis', 'Perigos latentes', 'Segredos de mestre'],
  },
]

const adventurerClasses: AdventurerClass[] = [
  {
    id: 'bardo',
    name: 'Bardo',
    archetype: 'voz, memoria e mentira bonita',
    hook: 'Transforma historias em vantagem, abre portas com charme e deixa a mesa mais perigosa quando canta verdades antigas.',
    stat: 'Carisma',
    equipment: 'Instrumento marcado, roupa chamativa, adaga escondida',
    moves: ['Conhecimento bardico', 'Arte arcana', 'Encantar multidoes'],
  },
  {
    id: 'clerigo',
    name: 'Clerigo',
    archetype: 'fe, pressagio e custo sagrado',
    hook: 'Carrega uma divindade para dentro da dungeon: cura, condena, expulsa horrores e cobra promessas.',
    stat: 'Sabedoria',
    equipment: 'Simbolo sagrado, cota gasta, martelo ou maca',
    moves: ['Divindade', 'Expulsar mortos-vivos', 'Comunhao'],
  },
  {
    id: 'druida',
    name: 'Druida',
    archetype: 'pele trocada e territorio vivo',
    hook: 'Lê a terra como um livro, assume formas selvagens e lembra ao grupo que a natureza tambem negocia.',
    stat: 'Sabedoria',
    equipment: 'Totem natural, peles, ervas, cajado bruto',
    moves: ['Nascido do solo', 'Mudanca de forma', 'Falar com espiritos'],
  },
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    archetype: 'aco, cicatriz e solucao direta',
    hook: 'É a linha entre o grupo e a morte. Quando a conversa falha, transforma posicao, arma e coragem em resposta.',
    stat: 'Forca',
    equipment: 'Arma assinatura, armadura pesada, trofeu de batalha',
    moves: ['Arma assinatura', 'Dobrar barras', 'Aparar o golpe'],
  },
  {
    id: 'ladino',
    name: 'Ladino',
    archetype: 'sombra, veneno e segunda saida',
    hook: 'Abre fechaduras, corta gargantas e encontra a rota que ninguem deveria conhecer.',
    stat: 'Destreza',
    equipment: 'Ferramentas, venenos, capa escura, punhais',
    moves: ['Especialista em armadilhas', 'Ataque furtivo', 'Preparar veneno'],
  },
  {
    id: 'mago',
    name: 'Mago',
    archetype: 'livro proibido e poder instavel',
    hook: 'Dobra a realidade em troca de risco. Cada magia resolve um problema e cria outro mais interessante.',
    stat: 'Inteligencia',
    equipment: 'Grimorio, bolsa de componentes, cajado ou adaga ritual',
    moves: ['Grimorio', 'Preparar magias', 'Ritual'],
  },
]

const rituals = [
  'Escolha uma imagem e deixe a pagina responder com cor, foco e detalhe.',
  'Use cada bloco como uma pagina do zine: curto, visual e pronto para mesa.',
  'A paleta escura segura a atmosfera, enquanto os acentos coloridos separam capitulos.',
]

export default function App() {
  const [activePageId, setActivePageId] = useState(pages[0].id)
  const [isCodexOpen, setIsCodexOpen] = useState(false)
  const [codexMode, setCodexMode] = useState<'page' | 'class'>('page')
  const [selectedClassId, setSelectedClassId] = useState(adventurerClasses[0].id)

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId],
  )

  const selectedClass = useMemo(
    () => adventurerClasses.find((heroClass) => heroClass.id === selectedClassId) ?? adventurerClasses[0],
    [selectedClassId],
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
        <a href="#paginas">Paginas</a>
        <a href="#classes">Classes</a>
        <a href="#mesa">Mesa</a>
      </nav>

      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero__veil" />
        <div className="hero__content" id="inicio">
          <p className="eyebrow">DW+ Zine digital</p>
          <h1>Um grimorio jogavel para noites perigosas</h1>
          <p>
            Pagina web inspirada no PDF, agora com cor, textura, imagens de contexto e uma
            leitura mais imersiva para campanha dark fantasy.
          </p>
          <div className="hero__actions" aria-label="Acoes principais">
            <a href="#paginas">Folhear</a>
            <a href="#classes">Manual de classes</a>
          </div>
        </div>
        <div className="hero__sigil" aria-hidden="true">
          DW+
        </div>
      </section>

      <section className="intro-band" aria-label="Ritual de leitura">
        {rituals.map((ritual, index) => (
          <article key={ritual}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{ritual}</p>
          </article>
        ))}
      </section>

      <section className="reader" id="paginas" aria-label="Paginas coloridas do zine">
        <div className="reader__copy">
          <p className="eyebrow">Paginas coloridas</p>
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

      <section className="class-manual" id="classes" aria-label="Manual de classes">
        <div className="section-title">
          <p className="eyebrow">Manual de classes</p>
          <h2>Escolha o papel antes da masmorra escolher voce</h2>
          <p>
            Consulta rapida inspirada no manual de classes: arquétipo, atributo-chave,
            equipamento e movimentos para abrir uma ficha sem quebrar o clima.
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

      <section className="play-aid" id="mesa" aria-label="Auxilio de mesa">
        <div>
          <p className="eyebrow">Para usar na mesa</p>
          <h2>Leitura rapida, clima pesado, clique com recompensa</h2>
        </div>
        <div className="play-aid__columns">
          <p>
            O layout assume paginas de zine como artefatos: cada imagem funciona como portal
            para um detalhe, e cada bloco preserva o ritmo de consulta durante a sessao.
          </p>
          <p>
            A camada visual usa textura, contraste e movimento suave para parecer impressa,
            mas ainda se comportar como uma web app moderna em React.
          </p>
        </div>
      </section>

      <nav className="mobile-dock" aria-label="Menu mobile">
        <a href="#inicio">Inicio</a>
        <a href="#paginas">Zine</a>
        <a href="#classes">Classes</a>
        <a href="#mesa">Mesa</a>
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
