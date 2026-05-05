import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { dwClasses } from '../data/dwClasses'

type AppTab = 'personagem' | 'descricao' | 'skills' | 'mestre'

type CharacterAppPageProps = {
  onBackToCodex?: () => void
}

const initialCharacter = {
  name: 'Alyn',
  classId: 'guerreiro',
  hp: {
    current: 24,
    max: 24,
  },
  mana: {
    current: 6,
    max: 6,
  },
  attributes: {
    forca: 16,
    destreza: 13,
    constituicao: 15,
    inteligencia: 10,
    sabedoria: 12,
    carisma: 9,
  },
  items: ['Espada longa', 'Armadura de couro', 'Rações de masmorra'],
  skillPoints: 2,
  selectedSkillIds: [] as string[],
  skillsLocked: false,
}

const tabLabels: Record<AppTab, string> = {
  personagem: 'Personagem',
  descricao: 'Descrição',
  skills: 'Skills',
  mestre: 'Mestre',
}

export default function CharacterAppPage({ onBackToCodex }: CharacterAppPageProps) {
  const [activeTab, setActiveTab] = useState<AppTab>('personagem')
  const [character, setCharacter] = useState(initialCharacter)

  const selectedClass = useMemo(() => {
    return dwClasses.find((dwClass) => dwClass.id === character.classId) ?? dwClasses[0]
  }, [character.classId])

  const hpPercent = Math.round((character.hp.current / character.hp.max) * 100)
  const manaPercent = Math.round((character.mana.current / character.mana.max) * 100)
  const isBloodied = hpPercent <= 35
  const isCritical = hpPercent <= 15

  function damageHp(amount: number) {
    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: Math.max(0, current.hp.current - amount),
      },
    }))
  }

  function spendMana(amount: number) {
    setCharacter((current) => ({
      ...current,
      mana: {
        ...current.mana,
        current: Math.max(0, current.mana.current - amount),
      },
    }))
  }

  function restoreResources() {
    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: current.hp.max,
      },
      mana: {
        ...current.mana,
        current: current.mana.max,
      },
    }))
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: '#070706',
        background:
          'radial-gradient(circle at 10% 0%, rgba(170,38,61,.26), transparent 22rem), radial-gradient(circle at 90% 12%, rgba(36,112,109,.22), transparent 20rem), linear-gradient(180deg, #12100d 0%, #070706 100%)',
        color: '#f7edd9',
        px: 1.5,
        py: 2,
        pb: 11,
      }}
    >
      <Stack spacing={1.5} sx={{ maxWidth: 520, mx: 'auto' }}>
        <Stack spacing={1} sx={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#c59b4b', fontWeight: 900, fontSize: '.78rem' }}>
            DW Character App
          </Typography>
          {onBackToCodex && (
            <Button
              size="small"
              variant="outlined"
              onClick={onBackToCodex}
              sx={{ borderColor: 'rgba(217,200,159,.28)', color: '#f7edd9' }}
            >
              Codex
            </Button>
          )}
        </Stack>

        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(217,200,159,.18)',
            borderRadius: 4,
            bgcolor: 'rgba(17,17,15,.92)',
            color: '#f7edd9',
            boxShadow: isCritical
              ? 'inset 14px 0 34px rgba(190,0,0,.7), inset -14px 0 34px rgba(190,0,0,.7), 0 22px 60px rgba(0,0,0,.62)'
              : isBloodied
                ? 'inset 10px 0 28px rgba(150,0,0,.52), inset -10px 0 28px rgba(150,0,0,.52), 0 18px 46px rgba(0,0,0,.56)'
                : '0 18px 46px rgba(0,0,0,.5)',
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Stack sx={{ alignItems: 'flex-start', flexDirection: 'row', gap: 2, justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#c59b4b', fontSize: '.75rem', fontWeight: 900 }}>
                    Ficha ativa
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 0.9 }}>
                    {character.name}
                  </Typography>
                  <Typography sx={{ color: '#d7c59d', mt: 0.5 }}>{selectedClass.name}</Typography>
                </Box>
                <Chip
                  label={`${character.hp.current}/${character.hp.max} HP`}
                  sx={{
                    bgcolor: isBloodied ? 'rgba(170,38,61,.26)' : 'rgba(197,155,75,.16)',
                    border: '1px solid rgba(217,200,159,.2)',
                    color: '#fff3dc',
                    fontWeight: 900,
                  }}
                />
              </Stack>

              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#b9a98b' }}>Classe</InputLabel>
                <Select
                  label="Classe"
                  value={character.classId}
                  onChange={(event) =>
                    setCharacter((current) => ({ ...current, classId: event.target.value }))
                  }
                  sx={{
                    color: '#f7edd9',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(217,200,159,.22)',
                    },
                    '.MuiSvgIcon-root': { color: '#f7edd9' },
                  }}
                >
                  {dwClasses.map((dwClass) => (
                    <MenuItem value={dwClass.id} key={dwClass.id}>
                      {dwClass.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {activeTab === 'personagem' && (
                <Stack spacing={2}>
                  <ResourceBar label="HP" value={hpPercent} color="#aa263d" />
                  <ResourceBar label="Mana" value={manaPercent} color="#24706d" />

                  <InfoPanel title="Atributos">
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                      {Object.entries(character.attributes).map(([key, value]) => (
                        <Paper
                          variant="outlined"
                          key={key}
                          sx={{
                            borderColor: 'rgba(217,200,159,.14)',
                            bgcolor: 'rgba(255,255,255,.04)',
                            color: '#f7edd9',
                            p: 1.2,
                          }}
                        >
                          <Typography sx={{ color: '#b9a98b', fontSize: '.72rem' }}>
                            {key}
                          </Typography>
                          <Typography sx={{ fontWeight: 900, fontSize: '1.35rem' }}>
                            {value}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </InfoPanel>

                  <InfoPanel title="Itens">
                    <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                      {character.items.map((item) => (
                        <Chip
                          label={item}
                          key={item}
                          sx={{ bgcolor: 'rgba(197,155,75,.14)', color: '#f7edd9' }}
                        />
                      ))}
                    </Stack>
                  </InfoPanel>
                </Stack>
              )}

              {activeTab === 'descricao' && (
                <InfoPanel title={selectedClass.name}>
                  <Typography sx={{ color: '#d7c59d', mb: 2 }}>{selectedClass.description}</Typography>
                  <Stack spacing={1}>
                    {selectedClass.characteristics.map((item) => (
                      <Chip
                        label={item}
                        key={item}
                        sx={{ justifyContent: 'flex-start', color: '#f7edd9', bgcolor: 'rgba(36,112,109,.18)' }}
                      />
                    ))}
                  </Stack>
                </InfoPanel>
              )}

              {activeTab === 'skills' && (
                <InfoPanel title="Skills">
                  <Typography sx={{ color: '#d7c59d', mb: 1.5 }}>
                    Pontos disponíveis: {character.skillPoints - character.selectedSkillIds.length}
                  </Typography>
                  <Stack spacing={1.2}>
                    {selectedClass.startingSkills.map((skill) => (
                      <Paper
                        variant="outlined"
                        key={skill.id}
                        sx={{
                          borderColor: 'rgba(217,200,159,.14)',
                          bgcolor: 'rgba(255,255,255,.04)',
                          color: '#f7edd9',
                          p: 1.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: 900 }}>{skill.name}</Typography>
                        <Typography sx={{ color: '#b9a98b', fontSize: '.9rem' }}>
                          {skill.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </InfoPanel>
              )}

              {activeTab === 'mestre' && (
                <InfoPanel title="Controles do Mestre">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                    <Button color="error" variant="contained" onClick={() => damageHp(1)}>
                      -1 HP
                    </Button>
                    <Button color="error" variant="contained" onClick={() => damageHp(5)}>
                      -5 HP
                    </Button>
                    <Button variant="contained" onClick={() => spendMana(1)}>
                      -1 Mana
                    </Button>
                    <Button variant="contained" onClick={() => spendMana(3)}>
                      -3 Mana
                    </Button>
                  </Box>
                  <Button fullWidth variant="outlined" onClick={restoreResources} sx={{ mt: 1.5, color: '#f7edd9' }}>
                    Restaurar recursos
                  </Button>
                </InfoPanel>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          left: 12,
          maxWidth: 520,
          mx: 'auto',
          overflow: 'hidden',
          border: '1px solid rgba(217,200,159,.18)',
          borderRadius: 4,
          bgcolor: 'rgba(8,8,7,.92)',
        }}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(_, value: AppTab) => setActiveTab(value)}
          sx={{
            bgcolor: 'transparent',
            '.MuiBottomNavigationAction-root': { color: '#b9a98b' },
            '.Mui-selected': { color: '#f2c76c' },
          }}
        >
          {(Object.keys(tabLabels) as AppTab[]).map((tab) => (
            <BottomNavigationAction label={tabLabels[tab]} value={tab} key={tab} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

function ResourceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', mb: 0.6 }}>
        <Typography sx={{ fontWeight: 900 }}>{label}</Typography>
        <Typography sx={{ color: '#b9a98b' }}>{value}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 12,
          borderRadius: 999,
          bgcolor: 'rgba(255,255,255,.08)',
          '.MuiLinearProgress-bar': { bgcolor: color },
        }}
      />
    </Box>
  )
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: 'rgba(217,200,159,.16)',
        borderRadius: 3,
        bgcolor: 'rgba(0,0,0,.2)',
        color: '#f7edd9',
        p: 1.6,
      }}
    >
      <Typography sx={{ color: '#c59b4b', fontWeight: 900, mb: 1 }}>{title}</Typography>
      {children}
    </Paper>
  )
}
