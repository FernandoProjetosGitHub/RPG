import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PublicPageShell from "../components/public/PublicPageShell";
import type { PublicView } from "../components/public/PublicPageShell";

type AdventureMapPoint = {
  symbol: string;
  label: string;
  tone: string;
};

type Adventure = {
  id: string;
  title: string;
  tone: string;
  premise: string;
  hook: string;
  playerScale: string[];
  fronts: string[];
  npcs: string[];
  monsters: string[];
  decisions: string[];
  scenes: {
    title: string;
    text: string;
    danger: string;
  }[];
  map: AdventureMapPoint[];
  ending: string;
};

const dangerScale = [
  "7 players: use a aventura completa.",
  "6 players: remova 1 inimigo menor ou reduza uma pressão simultânea.",
  "5 players: remova 2 inimigos menores ou transforme uma ameaça em obstáculo narrativo.",
  "4 players: use apenas 1 ameaça principal por cena.",
  "3 players: reduza hordas pela metade e evite dois combates seguidos.",
  "2 players: mantenha combate curto, foque fuga, negociação e objetivos.",
  "1 player: transforme combates em perseguição, infiltração ou duelo dramático.",
];

const adventures: Adventure[] = [
  {
    id: "portao-branco",
    title: "A Luz Que Julga",
    tone: "Sombria, religiosa e moral",
    premise:
      "Um portão antigo foi encontrado sob gelo e pedra. Ele não leva ao inferno, mas a uma luz que julga sem piedade. O horror não é a escuridão: é uma salvação que não aceita falhas.",
    hook:
      "Os personagens chegam a uma vila onde ninguém dorme há três noites. Crianças repetem sentenças que nunca ouviram. Adultos confessam crimes pequenos como se aguardassem execução.",
    playerScale: dangerScale,
    fronts: [
      "O Colégio dos Arcanistas quer controlar o portão.",
      "Os Serafins Prateados querem executar julgamento absoluto.",
      "A vila quer sobreviver, mesmo que precise entregar inocentes.",
    ],
    npcs: [
      "Oren Balserus, arcanista exausto que finge controle.",
      "Hali’el, voz serena dos Serafins, incapaz de compreender misericórdia.",
      "Drudge, servo que viu o primeiro julgamento e ainda treme ao falar.",
    ],
    monsters: [
      "Serafins Prateados",
      "servos planares",
      "criaturas tocadas pela Luz do Além",
    ],
    decisions: [
      "Fechar o portão destrói a única cura para uma praga local?",
      "Entregar Oren aos Serafins salva a vila, mas entrega o controle moral do lugar.",
      "Negociar com Hali’el exige provar que mortais podem julgar a si mesmos.",
    ],
    scenes: [
      {
        title: "Chegada à vila de Cal Adro",
        text:
          "O mestre descreve ruas limpas demais, janelas abertas demais e moradores que falam baixo como acusados. Pergunte aos jogadores quem ali reconhece um deles e que dívida ficou pendente.",
        danger:
          "Nenhum combate imediato. Use Discernir Realidades, Parlamentar e perguntas pessoais.",
      },
      {
        title: "A cripta de vidro branco",
        text:
          "A entrada do portão fica sob uma capela quebrada. A luz não ilumina: ela expõe. Cada personagem vê uma lembrança que preferia não defender em voz alta.",
        danger:
          "Para 7 players, coloque dois focos simultâneos: proteger Drudge e impedir o ritual de Oren.",
      },
      {
        title: "Julgamento aberto",
        text:
          "Hali’el oferece ordem, fim da doença e paz. O preço é aceitar que toda culpa deve ser punida imediatamente.",
        danger:
          "Se houver combate, use servos planares como barreira, não como vilões caricatos.",
      },
    ],
    map: [
      { symbol: "V", label: "Vila sem sono", tone: "PNJs, confissões e medo" },
      { symbol: "C", label: "Capela partida", tone: "entrada para a cripta" },
      { symbol: "G", label: "Gelo rachado", tone: "perigo ambiental" },
      { symbol: "P", label: "Portão Branco", tone: "centro planar" },
      { symbol: "S", label: "Serafim", tone: "ameaça moral" },
      { symbol: "?", label: "Sala em branco", tone: "pergunta aos jogadores" },
    ],
    ending:
      "A aventura termina quando os jogadores escolhem o destino do portão: selar, negociar ou redirecionar sua luz. Nenhuma opção deve ser limpa; todas mudam a vila.",
  },
  {
    id: "profundezas",
    title: "Os Degraus Sob o Mundo",
    tone: "Exploração perigosa e combate intenso",
    premise:
      "Ruínas antigas escondem cavernas tão grandes que parecem países enterrados. Ali, grupos rivais disputam passagem para algo chamado de coração do mundo.",
    hook:
      "Um mapa incompleto chega às mãos do grupo. Ele não mostra tesouro: mostra nomes riscados. Todos pertenciam a exploradores que voltaram mudos ou não voltaram.",
    playerScale: dangerScale,
    fronts: [
      "Elfos negros rancorosos guardam uma rota subterrânea.",
      "Gigantes de pedra despertam quando juramentos antigos são quebrados.",
      "Algo abaixo respira como se sonhasse com o sol.",
    ],
    npcs: [
      "Maera dos Sinos, guia que marca túneis com pequenos sinos de osso.",
      "Irvak, emissário subterrâneo que prefere barganha a massacre.",
      "Tollen, mineiro sobrevivente que sabe o caminho, mas perdeu a coragem.",
    ],
    monsters: [
      "elfos negros",
      "gigantes de pedra",
      "ameaças das Profundezas",
    ],
    decisions: [
      "Ajudar Maera a salvar prisioneiros atrasa a chegada ao coração da ruína.",
      "Negociar com Irvak evita combate, mas exige revelar o que o grupo procura.",
      "Despertar um gigante abre caminho e também chama tudo que dormia abaixo.",
    ],
    scenes: [
      {
        title: "A boca da ruína",
        text:
          "O mestre apresenta três entradas: uma com marcas recentes, uma inundada e uma silenciosa demais. Deixe os jogadores escolherem o risco.",
        danger:
          "Para 7 players, duas entradas podem estar ativas ao mesmo tempo, dividindo atenção.",
      },
      {
        title: "Ponte dos sinos",
        text:
          "Centenas de sinos pendem sobre um abismo. Cada som acorda algo. Maera pede silêncio; Tollen entra em pânico no meio da travessia.",
        danger:
          "Use Desafiar o Perigo. Falhas não precisam derrubar alguém; podem acordar patrulhas.",
      },
      {
        title: "Câmara das colunas vivas",
        text:
          "Gigantes de pedra parecem pilares até que uma promessa seja quebrada. Eles não odeiam os vivos; apenas cumprem uma regra antiga.",
        danger:
          "Combate pesado. Para menos de 5 players, use um gigante como obstáculo, não como luta direta.",
      },
    ],
    map: [
      { symbol: "E", label: "Entrada quebrada", tone: "escolha inicial" },
      { symbol: "A", label: "Abismo dos sinos", tone: "travessia tensa" },
      { symbol: "M", label: "Mercado subterrâneo", tone: "PNJs e barganha" },
      { symbol: "G", label: "Gigante de pedra", tone: "ameaça colossal" },
      { symbol: "R", label: "Rota dos elfos negros", tone: "emboscada ou acordo" },
      { symbol: "?", label: "Caverna vazia", tone: "deixe em branco" },
    ],
    ending:
      "A conclusão ideal não é matar tudo. É decidir quem terá passagem pelas Profundezas e qual juramento antigo será mantido ou quebrado.",
  },
  {
    id: "torre-distorcida",
    title: "A Torre Que Sonhou Carne",
    tone: "Horror arcano e tragédia",
    premise:
      "Uma torre de magos caiu há décadas. Agora suas salas continuam funcionando sem mestres, gerando criaturas que não pediram para existir.",
    hook:
      "Uma caravana de refugiados chega trazendo um golem protetor carregando uma criança viva nos braços. O golem não deixa ninguém se aproximar, mas também não sabe para onde ir.",
    playerScale: dangerScale,
    fronts: [
      "A torre cria novas formas de vida distorcidas.",
      "Um golem protetor segue uma ordem antiga de proteger algo que já não entende.",
      "Uma quimera venenosa caça qualquer um com cheiro de magia.",
    ],
    npcs: [
      "Sena, aprendiz sobrevivente que conhece senhas incompletas da torre.",
      "Golem protetor sem nome, preso a uma ordem antiga.",
      "Velha Ibara, curandeira que quer salvar as criações em vez de destruí-las.",
    ],
    monsters: [
      "quimera venenosa",
      "golem protetor",
      "gorilas mutantes",
    ],
    decisions: [
      "Destruir o núcleo da torre mata as criaturas instáveis que ainda dependem dele.",
      "Salvar o golem pode colocar os refugiados em risco.",
      "A quimera pode ser atraída por magia, mas alguém precisará servir de isca.",
    ],
    scenes: [
      {
        title: "Campo dos refugiados",
        text:
          "Não comece com combate. Comece com choro, fome e desconfiança. A pergunta central é: quem merece ser salvo primeiro?",
        danger:
          "Use o desastre como comoção, não espetáculo. Os jogadores devem sentir urgência.",
      },
      {
        title: "Jardim dos órgãos de vidro",
        text:
          "Dentro da torre, raízes transparentes pulsam com memórias de antigos experimentos. Sena reconhece nomes gravados nelas.",
        danger:
          "Falhas podem liberar veneno, ecos mágicos ou chamar a quimera.",
      },
      {
        title: "A sala do comando antigo",
        text:
          "O golem recebe duas ordens conflitantes. Proteger a criança. Proteger a torre. Ele espera que alguém explique qual vida importa mais.",
        danger:
          "Para 7 players, combine quimera + instabilidade da sala. Para 4 ou menos, use só a instabilidade.",
      },
    ],
    map: [
      { symbol: "F", label: "Refugiados", tone: "drama e escolhas" },
      { symbol: "T", label: "Torre caída", tone: "entrada arcana" },
      { symbol: "V", label: "Vidro vivo", tone: "perigo mágico" },
      { symbol: "Q", label: "Quimera", tone: "predador venenoso" },
      { symbol: "G", label: "Golem", tone: "guardião trágico" },
      { symbol: "?", label: "Laboratório apagado", tone: "espaço em branco" },
    ],
    ending:
      "A aventura termina quando o grupo decide se a torre será destruída, purificada ou transformada em refúgio. O golem deve ter um destino emocional, não apenas mecânico.",
  },
  {
    id: "portao-basal",
    title: "O Portão Basal",
    tone: "Combate brutal e ameaça planar",
    premise:
      "Uma escavação abriu um portão negro coberto de runas derretidas. Do outro lado, salamandras atravessam em disciplina militar, como se a invasão já tivesse sido planejada há séculos.",
    hook:
      "O único soldado que voltou da escavação repete: 'o sargento ouviu a pedra respirando'. Quando o grupo chega, o chão ainda está quente.",
    playerScale: dangerScale,
    fronts: [
      "As Salamandras querem consumir e ocupar as galerias.",
      "O portão cresce quanto mais metal é derretido.",
      "A companhia de escavação tenta esconder sua culpa.",
    ],
    npcs: [
      "Sargento Calver, morto ou transformado, dependendo das escolhas do mestre.",
      "Nima, engenheira que sabe fechar o portão, mas assinou a ordem da escavação.",
      "O soldado Edras, único sobrevivente e testemunha quebrada.",
    ],
    monsters: [
      "Salamandras",
      "criaturas planares flamejantes",
      "ameaças do Vórtice Elemental",
    ],
    decisions: [
      "Fechar o portão exige resfriar as runas ou sacrificar a estrutura da mina.",
      "Salvar mineiros presos dá tempo para mais salamandras atravessarem.",
      "Usar magia de fogo fortalece o inimigo, mas pode controlar o campo.",
    ],
    scenes: [
      {
        title: "A descida quente",
        text:
          "O túnel pinga ferro. Ferramentas estão moles como cera. A primeira escolha é avançar rápido ou preparar proteção.",
        danger:
          "Para 7 players, divida a cena entre resgate e contenção do fogo.",
      },
      {
        title: "Galeria dos capacetes vazios",
        text:
          "Capacetes de mineiros estão alinhados no chão. Dentro de cada um, cinzas sem corpo. Edras reconhece nomes.",
        danger:
          "Cena de comoção. Não force combate aqui; deixe o silêncio pesar.",
      },
      {
        title: "O portão aberto",
        text:
          "As salamandras não rugem; elas coordenam. Uma delas aponta para Nima como se já soubesse seu nome.",
        danger:
          "Combate intenso. Para 7 players, use várias salamandras menores e uma líder. Para menos de 4, use apenas uma líder ferida.",
      },
    ],
    map: [
      { symbol: "D", label: "Descida da mina", tone: "calor e pressão" },
      { symbol: "C", label: "Capacetes vazios", tone: "tragédia" },
      { symbol: "M", label: "Máquina de contenção", tone: "objetivo tático" },
      { symbol: "S", label: "Salamandras", tone: "combate intenso" },
      { symbol: "P", label: "Portão Basal", tone: "ameaça planar" },
      { symbol: "?", label: "Túnel instável", tone: "espaço em branco" },
    ],
    ending:
      "A vitória não é só derrotar salamandras. É decidir quem assume a culpa pela escavação e o que será feito com o conhecimento do portão.",
  },
];

function getDangerNote(index: number) {
  const notes = [
    "Perigo baixo: investigação, tensão e consequência social.",
    "Perigo moderado: risco real, uma ameaça ativa por cena.",
    "Perigo alto: múltiplas pressões, combate e escolha difícil.",
    "Perigo extremo: duas frentes avançam ao mesmo tempo.",
  ];

  return notes[index] ?? notes[0];
}

function AdventureMap({ points }: { points: AdventureMapPoint[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
      }}
    >
      {points.map((point) => (
        <Paper
          key={`${point.symbol}-${point.label}`}
          sx={{
            minHeight: 92,
            p: 1,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            bgcolor:
              point.symbol === "?"
                ? "rgba(255,255,255,.035)"
                : "rgba(197,155,75,.08)",
            border: "1px solid rgba(217,200,159,.16)",
          }}
        >
          <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#c59b4b" }}>
            {point.symbol}
          </Typography>
          <Typography sx={{ fontSize: ".78rem", fontWeight: 900 }}>
            {point.label}
          </Typography>
          <Typography sx={{ color: "#b9a98b", fontSize: ".72rem" }}>
            {point.tone}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default function Aventuras({ onNavigate }: { onNavigate: (view: PublicView) => void }) {
  return (
    <PublicPageShell active="aventuras" onNavigate={onNavigate}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            Aventuras prontas para mesa
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
            Frentes, mapas e encontros para 7 jogadores
          </Typography>

          <Typography sx={{ color: "#d7c59d", mt: 1, maxWidth: 900 }}>
            Estrutura pensada para Dungeon World: mapas sugestivos, espaços em branco,
            NPCs com função dramática, monstros dos capítulos oficiais e decisões abertas
            guiadas pelo mestre.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
              Escala de perigo da mesa
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {[7, 6, 5, 4, 3, 2, 1].map((players) => (
                <Chip
                  key={players}
                  label={`${players} player${players > 1 ? "s" : ""}`}
                  sx={{
                    bgcolor:
                      players >= 6
                        ? "rgba(170,38,61,.24)"
                        : players >= 4
                          ? "rgba(197,155,75,.18)"
                          : "rgba(95,182,196,.16)",
                    color: "#f7edd9",
                  }}
                />
              ))}
            </Stack>

            <Typography sx={{ color: "#b9a98b", mt: 1.5 }}>
              Todas as aventuras abaixo foram escritas para 7 jogadores. As ressalvas
              indicam como reduzir pressão, quantidade de inimigos e simultaneidade de
              perigos para mesas menores.
            </Typography>
          </CardContent>
        </Card>

        {adventures.map((adventure, index) => (
          <Accordion
            key={adventure.id}
            defaultExpanded={index === 0}
            sx={{
              bgcolor: "rgba(17,17,15,.92)",
              color: "#f7edd9",
              border: "1px solid rgba(217,200,159,.16)",
              borderRadius: "18px !important",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#f7edd9" }} />}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 900, color: "#c59b4b" }}>
                  {adventure.title}
                </Typography>
                <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                  {adventure.tone} • {getDangerNote(index)}
                </Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2.5}>
                <Typography sx={{ color: "#d7c59d", lineHeight: 1.7 }}>
                  {adventure.premise}
                </Typography>

                <Paper sx={{ p: 2 }}>
                  <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                    Gancho inicial
                  </Typography>
                  <Typography sx={{ color: "#d7c59d", mt: 1 }}>
                    {adventure.hook}
                  </Typography>
                </Paper>

                <AdventureMap points={adventure.map} />

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 900 }}>Escala por quantidade de jogadores</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {adventure.playerScale.map((note) => (
                        <Chip
                          key={note}
                          label={note}
                          sx={{
                            justifyContent: "flex-start",
                            height: "auto",
                            py: 0.8,
                            color: "#f7edd9",
                            bgcolor: "rgba(255,255,255,.05)",
                          }}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 900 }}>Frentes e presságios</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {adventure.fronts.map((front) => (
                        <Typography key={front} sx={{ color: "#d7c59d" }}>
                          • {front}
                        </Typography>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 900 }}>NPCs e monstros oficiais usados</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                          NPCs
                        </Typography>
                        {adventure.npcs.map((npc) => (
                          <Typography key={npc} sx={{ color: "#d7c59d" }}>
                            • {npc}
                          </Typography>
                        ))}
                      </Box>

                      <Divider />

                      <Box>
                        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                          Monstros / ameaças
                        </Typography>
                        {adventure.monsters.map((monster) => (
                          <Typography key={monster} sx={{ color: "#d7c59d" }}>
                            • {monster}
                          </Typography>
                        ))}
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 900 }}>Cenas jogáveis</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {adventure.scenes.map((scene) => (
                        <Paper key={scene.title} sx={{ p: 2 }}>
                          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                            {scene.title}
                          </Typography>
                          <Typography sx={{ color: "#d7c59d", mt: 1 }}>
                            {scene.text}
                          </Typography>
                          <Typography sx={{ color: "#b9a98b", mt: 1 }}>
                            Mestre: {scene.danger}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 900 }}>Decisões abertas</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {adventure.decisions.map((decision) => (
                        <Typography key={decision} sx={{ color: "#d7c59d" }}>
                          • {decision}
                        </Typography>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Paper sx={{ p: 2, bgcolor: "rgba(197,155,75,.08)" }}>
                  <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                    Final possível
                  </Typography>
                  <Typography sx={{ color: "#f7edd9", mt: 1 }}>
                    {adventure.ending}
                  </Typography>
                </Paper>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </PublicPageShell>
  );
}