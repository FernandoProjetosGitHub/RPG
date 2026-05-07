import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import heroImage from "./assets/zine-hero.png";
import frontierImage from "./assets/zine-frontier.png";
import tableImage from "./assets/zine-table.png";
import CharacterAppPage from "./pages/CharacterAppPage";
import MasterAppPage from "./pages/MasterAppPage";
import { initialCharacter } from "./types/character";

type CurrentView =
  | "codex"
  | "playerCharacter"
  | "masterPanel"
  | "masterCharacter";

type ZinePage = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  palette: string;
  notes: string[];
};

type AdventurerClass = {
  id: string;
  name: string;
  archetype: string;
  hook: string;
  stat: string;
  hp: string;
  load: string;
  equipment: string;
  moves: string[];
};

type MoveCard = {
  name: string;
  stat: string;
  trigger: string;
  result: string;
  gmCue: string;
};

type Spell = {
  name: string;
  tradition: "Clerigo" | "Mago";
  level: string;
  summary: string;
};

const pages: ZinePage[] = [
  {
    id: "mesa",
    number: "01",
    title: "Mesa em Movimento",
    kicker: "Guia do jogo",
    description:
      "Dungeon World funciona como conversa de mesa: a ficcao chama o movimento, os dados mudam a situacao e o MJ devolve consequencias claras.",
    image: heroImage,
    palette: "Carvao / Ouro velho",
    notes: ["Ficcao primeiro", "10+, 7-9 e 6-", "MJ nao rola ataques"],
  },
  {
    id: "movimentos",
    number: "02",
    title: "Cartas de Movimento",
    kicker: "Referencia rapida",
    description:
      "Os movimentos mais usados ficam em cards curtos, com gatilho, atributo e leitura de resultado para consulta durante a sessao.",
    image: tableImage,
    palette: "Pergaminho / Teal gasto",
    notes: ["Gatilho claro", "Parcial interessante", "Consequencia visivel"],
  },
  {
    id: "fronteira",
    number: "03",
    title: "Frentes & Perigos",
    kicker: "Mestre",
    description:
      "Ameacas, pressagios e locais perigosos entram como combustivel para improvisar sem perder coerencia com a aventura.",
    image: frontierImage,
    palette: "Verde frio / Sangue seco",
    notes: ["Pressagios", "Perigos ativos", "Perguntas abertas"],
  },
];

const adventurerClasses: AdventurerClass[] = [
  {
    id: "bardo",
    name: "Bardo",
    archetype: "voz, memoria e mentira bonita",
    hook:
      "Transforma historias em vantagem, abre portas com charme e reconhece criaturas, lugares e lendas antes dos demais.",
    stat: "Carisma",
    hp: "6 + Constituicao",
    load: "9 + FOR",
    equipment: "Instrumento, roupa marcante, arma leve e provisoes de viagem",
    moves: [
      "Arte Arcana",
      "Conhecimento de Bardo",
      "Charmoso e Receptivo",
      "Um Porto na Tempestade",
    ],
  },
  {
    id: "clerigo",
    name: "Clerigo",
    archetype: "fe, dominio e custo sagrado",
    hook:
      "Serve a uma divindade, recebe preces, afasta mortos-vivos e transforma crenca em risco concreto na ficcao.",
    stat: "Sabedoria",
    hp: "8 + Constituicao",
    load: "10 + FOR",
    equipment: "Simbolo sagrado, armadura, arma simples e suprimentos",
    moves: ["Divindade", "Comunhao", "Conjurar Magia", "Expulsar Mortos-Vivos"],
  },
  {
    id: "druida",
    name: "Druida",
    archetype: "territorio vivo e pele trocada",
    hook:
      "Pertence a uma terra, fala com espiritos naturais e assume formas que mudam o tipo de problema que o grupo consegue enfrentar.",
    stat: "Sabedoria",
    hp: "6 + Constituicao",
    load: "6 + FOR",
    equipment: "Totem natural, peles, ervas e arma rustica",
    moves: [
      "Nascido do Solo",
      "Mudanca de Forma",
      "Falar com Espiritos",
      "Estudo da Essencia",
    ],
  },
  {
    id: "guerreiro",
    name: "Guerreiro",
    archetype: "aco, cicatriz e resposta direta",
    hook:
      "E a linha entre o grupo e a morte. Sua arma assinatura resolve problemas, mas tambem cria reputacao.",
    stat: "Forca",
    hp: "10 + Constituicao",
    load: "12 + FOR",
    equipment: "Arma assinatura, armadura, escudo ou arma secundaria",
    moves: [
      "Arma Assinatura",
      "Dobrar Barras",
      "Aparar o Golpe",
      "Ataque Implacavel",
    ],
  },
  {
    id: "ladrao",
    name: "Ladrao",
    archetype: "sombra, veneno e segunda saida",
    hook:
      "Encontra armadilhas, abre fechaduras, prepara venenos e transforma descuido inimigo em golpe decisivo.",
    stat: "Destreza",
    hp: "6 + Constituicao",
    load: "9 + FOR",
    equipment: "Ferramentas, venenos, adaga, arma curta e roupas discretas",
    moves: [
      "Especialista em Armadilhas",
      "Ataque Furtivo",
      "Preparar Veneno",
      "Flexivel Moralmente",
    ],
  },
  {
    id: "mago",
    name: "Mago",
    archetype: "grimorio, preparo e poder instavel",
    hook:
      "Prepara magias no grimorio, usa rituais quando tem tempo e paga o preco quando a realidade resiste.",
    stat: "Inteligencia",
    hp: "4 + Constituicao",
    load: "7 + FOR",
    equipment: "Grimorio, componentes, cajado ou adaga ritual",
    moves: ["Grimorio", "Preparar Magias", "Conjurar Magia", "Ritual"],
  },
  {
    id: "paladino",
    name: "Paladino",
    archetype: "juramento, julgamento e presenca sagrada",
    hook:
      "Impoe votos, protege aliados e transforma sua causa em uma forca que precisa ser honrada em cena.",
    stat: "Carisma",
    hp: "10 + Constituicao",
    load: "12 + FOR",
    equipment: "Armadura pesada, simbolo sagrado, arma nobre e provisoes",
    moves: ["Impor as Maos", "Questao", "Eu Sou a Lei", "Defensor Juramentado"],
  },
  {
    id: "ranger",
    name: "Ranger",
    archetype: "trilha, presa e companheiro animal",
    hook:
      "Le rastros, guia jornadas perigosas e luta ao lado de um companheiro animal com instinto proprio.",
    stat: "Destreza",
    hp: "8 + Constituicao",
    load: "11 + FOR",
    equipment: "Arco, arma de corpo a corpo, equipamento de viagem e provisoes",
    moves: [
      "Cacar e Rastrear",
      "Disparo Chamado",
      "Companheiro Animal",
      "Meio Selvagem",
    ],
  },
];

const moveCards: MoveCard[] = [
  {
    name: "Atacar e Retalhar",
    stat: "FOR",
    trigger: "Quando atacar um inimigo em combate corpo a corpo.",
    result:
      "10+ causa dano e evita resposta direta; 7-9 causa dano, mas sofre contra-ataque ou custo imediato.",
    gmCue:
      "Mostre a troca de golpes, posicao, armadura, alcance e o que fica exposto.",
  },
  {
    name: "Disparar",
    stat: "DES",
    trigger: "Quando mirar e atacar a distancia.",
    result:
      "10+ acerta limpo; 7-9 exige escolha: gastar municao, aceitar perigo ou causar menos impacto.",
    gmCue: "Use cobertura, linha de visao, municao e aproximacao inimiga.",
  },
  {
    name: "Desafiar o Perigo",
    stat: "Variavel",
    trigger: "Quando agir apesar de risco iminente ou sofrer uma calamidade.",
    result:
      "10+ supera o perigo; 7-9 passa com hesitacao, custo ou escolha dificil.",
    gmCue: "Escolha o atributo pelo metodo narrado, nao pela ficha mais alta.",
  },
];

const spells: Spell[] = [
  {
    name: "Luz",
    tradition: "Clerigo",
    level: "Oracao",
    summary:
      "Faz um objeto brilhar com claridade sagrada por tempo util a exploracao.",
  },
  {
    name: "Curar Ferimentos Leves",
    tradition: "Clerigo",
    level: "1",
    summary:
      "Restaura vitalidade de um alvo tocado, com efeito direto e imediato.",
  },
  {
    name: "Prestidigitacao",
    tradition: "Mago",
    level: "Truque",
    summary:
      "Produz pequenos efeitos visuais, sonoros ou praticos sem grande peso dramatico.",
  },
  {
    name: "Misseis Magicos",
    tradition: "Mago",
    level: "1",
    summary:
      "Dispara energia arcana contra um alvo visivel, confiavel para combate.",
  },
];

const rituals = [
  "Siga a ficcao: se nada perigoso ou incerto acontece, nao ha rolagem.",
  "Em 7-9, ofereca sucesso com custo real, escolha dificil ou nova ameaca.",
  "Use movimentos do MJ para devolver pressao, pistas e consequencias ao grupo.",
];

export default function App() {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentView, setCurrentView] = useState<CurrentView>("codex");
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [codexMode, setCodexMode] = useState<"page" | "class">("page");
  const [selectedClassId, setSelectedClassId] = useState(
    adventurerClasses[0].id,
  );
  const [spellTradition, setSpellTradition] = useState<
    "Todos" | "Clerigo" | "Mago"
  >("Todos");

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId],
  );

  const selectedClass = useMemo(
    () =>
      adventurerClasses.find((heroClass) => heroClass.id === selectedClassId) ??
      adventurerClasses[0],
    [selectedClassId],
  );

  const filteredSpells = useMemo(
    () =>
      spellTradition === "Todos"
        ? spells
        : spells.filter((spell) => spell.tradition === spellTradition),
    [spellTradition],
  );

  function openClass(classId: string) {
    setSelectedClassId(classId);
    setCodexMode("class");
    setIsCodexOpen(true);
  }

  function openPage() {
    setCodexMode("page");
    setIsCodexOpen(true);
  }

  if (currentView === "playerCharacter") {
    return (
      <CharacterAppPage
        mode="player"
        character={character}
        setCharacter={setCharacter}
        onBackToCodex={() => setCurrentView("codex")}
      />
    );
  }

  if (currentView === "masterPanel") {
    return (
      <MasterAppPage
        character={character}
        setCharacter={setCharacter}
        onBackToCodex={() => setCurrentView("codex")}
        onOpenCharacter={() => setCurrentView("masterCharacter")}
      />
    );
  }

  if (currentView === "masterCharacter") {
    return (
      <CharacterAppPage
        mode="master"
        character={character}
        setCharacter={setCharacter}
        onBackToMaster={() => setCurrentView("masterPanel")}
      />
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#070706", color: "#f7edd9", pb: 10 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          bgcolor: "rgba(7,7,6,.86)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(217,200,159,.18)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.2}
            sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" } }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Button href="#inicio">Início</Button>
              <Button href="#movimentos">Moves</Button>
              <Button href="#classes">Classes</Button>
              <Button href="#magias">Magias</Button>
              <Button href="#mesa">Mesa</Button>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCurrentView("playerCharacter")}
              >
                Jogador
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={() => setCurrentView("masterPanel")}
              >
                Mestre
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        id="inicio"
        sx={{
          minHeight: 520,
          display: "grid",
          placeItems: "center",
          px: 2,
          backgroundImage: `
            linear-gradient(180deg, rgba(7,7,6,.36), #070706 96%),
            radial-gradient(circle at 50% 0%, rgba(170,38,61,.25), transparent 55%),
            url(${heroImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2.2} sx={{ alignItems: "center" }}>
            <Chip label="Dungeon World digital" />
            <Typography variant="h2" sx={{ fontWeight: 900 }}>
              Referência viva para aventuras perigosas
            </Typography>
            <Typography sx={{ color: "#d7c59d", maxWidth: 720, fontSize: "1.05rem" }}>
              Consulta rápida para movimentos, classes, magias e apoio de mesa,
              adaptada para uso direto durante a sessão.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setCurrentView("playerCharacter")}
              >
                Abrir ficha do jogador
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => setCurrentView("masterPanel")}
              >
                Painel do mestre
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={2}>
          {rituals.map((ritual, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={ritual}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography sx={{ color: "#d7c59d", mt: 1 }}>{ritual}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" id="paginas" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1.5}>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                Guia do Dungeon World
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {activePage.title}
              </Typography>
              <Typography sx={{ color: "#d7c59d" }}>
                {activePage.description}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Chip label={activePage.kicker} />
                <Chip label={activePage.palette} />
              </Stack>

              <Button variant="outlined" onClick={openPage}>
                Abrir detalhes
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ overflow: "hidden" }}>
              <CardActionArea onClick={openPage}>
                <Box
                  component="img"
                  src={activePage.image}
                  alt=""
                  sx={{
                    width: "100%",
                    height: { xs: 260, md: 420 },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </CardActionArea>

              <CardContent>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {activePage.notes.map((note) => (
                    <Chip key={note} label={note} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2}>
          {pages.map((page) => (
            <Grid size={{ xs: 12, md: 4 }} key={page.id}>
              <Card
                sx={{
                  height: "100%",
                  borderColor:
                    page.id === activePage.id ? "#c59b4b" : "rgba(217,200,159,.15)",
                }}
              >
                <CardActionArea onClick={() => setActivePageId(page.id)}>
                  <Box
                    component="img"
                    src={page.image}
                    alt=""
                    sx={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                      {page.number}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {page.title}
                    </Typography>
                    <Typography sx={{ color: "#b9a98b" }}>{page.kicker}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" id="movimentos" sx={{ py: 5 }}>
        <SectionTitle
          eyebrow="Cartas de movimento"
          title="Gatilhos claros, consequências rápidas"
          description="Cards resumidos para consulta em mesa. Use o texto completo dos PDFs quando precisar resolver exceções finas."
        />

        <Grid container spacing={2}>
          {moveCards.map((move) => (
            <Grid size={{ xs: 12, md: 4 }} key={move.name}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Chip label={move.stat} />
                  <Typography variant="h6" sx={{ fontWeight: 900, mt: 1.5 }}>
                    {move.name}
                  </Typography>
                  <Typography sx={{ color: "#d7c59d", mt: 1 }}>
                    {move.trigger}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography sx={{ fontWeight: 900 }}>{move.result}</Typography>
                  <Typography sx={{ color: "#b9a98b", mt: 1, fontSize: ".9rem" }}>
                    {move.gmCue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" id="classes" sx={{ py: 5 }}>
        <SectionTitle
          eyebrow="Manual de classes"
          title="Escolha o papel antes da masmorra escolher você"
          description="Consulta rápida baseada nas fichas de classe: arquétipo, atributo-chave, PV, carga, equipamento e movimentos iniciais."
        />

        <Grid container spacing={2}>
          {adventurerClasses.map((heroClass) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={heroClass.id}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea onClick={() => openClass(heroClass.id)} sx={{ height: "100%" }}>
                  <CardContent>
                    <Chip label={heroClass.stat} />
                    <Typography variant="h6" sx={{ fontWeight: 900, mt: 1.5 }}>
                      {heroClass.name}
                    </Typography>
                    <Typography sx={{ color: "#c59b4b", fontSize: ".9rem" }}>
                      {heroClass.archetype}
                    </Typography>
                    <Typography sx={{ color: "#d7c59d", mt: 1 }}>
                      {heroClass.hook}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" id="magias" sx={{ py: 5 }}>
        <SectionTitle
          eyebrow="Guia de magias"
          title="Preces, truques e feitiços preparados"
          description="Magias organizadas por tradição e nível, com resumo funcional para lembrar o papel de cada efeito."
        />

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {(["Todos", "Clerigo", "Mago"] as const).map((tradition) => (
            <Button
              key={tradition}
              variant={spellTradition === tradition ? "contained" : "outlined"}
              onClick={() => setSpellTradition(tradition)}
            >
              {tradition}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={2}>
          {filteredSpells.map((spell) => (
            <Grid size={{ xs: 12, md: 3 }} key={`${spell.tradition}-${spell.level}-${spell.name}`}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Chip label={`${spell.tradition} · ${spell.level}`} />
                  <Typography variant="h6" sx={{ fontWeight: 900, mt: 1.5 }}>
                    {spell.name}
                  </Typography>
                  <Typography sx={{ color: "#d7c59d", mt: 1 }}>
                    {spell.summary}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" id="mesa" sx={{ py: 5 }}>
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                Para usar na mesa
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                Fiel ao ritmo: ficção, movimento, consequência
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Typography sx={{ color: "#d7c59d" }}>
                  A página evita copiar blocos longos dos PDFs e transforma o
                  material em referência operacional: nomes, gatilhos e resumos
                  para consulta rápida.
                </Typography>
                <Typography sx={{ color: "#d7c59d" }}>
                  Classes e magias foram organizadas para acelerar criação de
                  personagem, preparo de sessões e consulta durante rolagens
                  importantes.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          right: 12,
          bottom: 12,
          left: 12,
          display: { xs: "block", md: "none" },
          p: 1,
          zIndex: 30,
          bgcolor: "rgba(8,8,7,.94)",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="contained" onClick={() => setCurrentView("playerCharacter")}>
            Jogador
          </Button>
          <Button fullWidth variant="outlined" onClick={() => setCurrentView("masterPanel")}>
            Mestre
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {codexMode === "class" ? selectedClass.name : activePage.title}
        </DialogTitle>

        <DialogContent>
          {codexMode === "class" ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={tableImage}
                  alt=""
                  sx={{ width: "100%", borderRadius: 2 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={1.5}>
                  <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                    {selectedClass.archetype}
                  </Typography>
                  <Typography sx={{ color: "#d7c59d" }}>
                    {selectedClass.hook}
                  </Typography>

                  <Divider />

                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <InfoLabel label="Atributo" value={selectedClass.stat} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <InfoLabel label="PV" value={selectedClass.hp} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <InfoLabel label="Carga" value={selectedClass.load} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <InfoLabel label="Equipamento" value={selectedClass.equipment} />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {selectedClass.moves.map((move) => (
                      <Chip key={move} label={move} />
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={activePage.image}
                  alt=""
                  sx={{ width: "100%", borderRadius: 2 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={1.5}>
                  <Chip label={activePage.kicker} />
                  <Typography sx={{ color: "#d7c59d" }}>
                    {activePage.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {activePage.notes.map((note) => (
                      <Chip key={note} label={note} />
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
        {eyebrow}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "#d7c59d", maxWidth: 760 }}>
        {description}
      </Typography>
    </Stack>
  );
}

function InfoLabel({ label, value }: { label: string; value: string }) {
  return (
    <Paper sx={{ p: 1.5, height: "100%" }}>
      <Typography sx={{ color: "#b9a98b", fontSize: ".75rem" }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 900 }}>{value}</Typography>
    </Paper>
  );
}