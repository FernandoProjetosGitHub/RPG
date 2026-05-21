import { useState } from "react";
import Aventuras from "./pages/adventures/AventurasPage";
import AppsAccessPage from "./pages/appsAccess/AppsAccessPage";
import CharacterAppPage from "./pages/character/CharacterAppPage";
import ClassCatalogPage from "./pages/classCatalog/ClassCatalogPage";
import LandingPage from "./pages/landingPage/LandingPage";
import MapsPage from "./pages/maps/MapsPage";
import MasterAppPage from "./pages/master/MasterAppPage";
import { useSupabaseTableSync } from "./hooks/useSupabaseTableSync";
import { useRpgTable } from "./hooks/useRpgTable";
import type { PublicView } from "./components/public/PublicPageShell";

type CurrentView =
  | PublicView
  | "playerCharacter"
  | "masterPanel"
  | "masterCharacter";

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>("landing");
  const {
    character,
    setCharacter,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    playerProfiles,
    characters,
    replaceTableState,
    applyConsumableToPlayer,
  } = useRpgTable();
  const tableSync = useSupabaseTableSync({
    characters,
    selectedPlayerIndex,
    replaceTableState,
  });

  // As telas de ficha ocupam a tela inteira e mantem rolagem/menu proprios.
  // Por isso elas saem da moldura publica e recebem somente os dados da mesa.
  if (currentView === "playerCharacter") {
    return (
      <CharacterAppPage
        mode="player"
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onApplyConsumableToPlayer={applyConsumableToPlayer}
        onBackToCodex={() => setCurrentView("apps")}
      />
    );
  }

  // O painel do mestre tambem e uma experiencia fechada: ele controla jogador
  // ativo, regras secretas, monstros, mapas de mestre e restauracao de recursos.
  if (currentView === "masterPanel") {
    return (
      <MasterAppPage
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onBackToCodex={() => setCurrentView("apps")}
        onOpenCharacter={() => setCurrentView("masterCharacter")}
      />
    );
  }

  // O mestre pode abrir a ficha completa do jogador selecionado sem perder o
  // contexto do painel. O botao Voltar retorna ao painel, nao a landing.
  if (currentView === "masterCharacter") {
    return (
      <CharacterAppPage
        mode="master"
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onApplyConsumableToPlayer={applyConsumableToPlayer}
        onBackToMaster={() => setCurrentView("masterPanel")}
      />
    );
  }

  // As paginas abaixo sao publicas e compoem a estrutura do GitHub Pages.
  // Elas explicam o projeto antes de levar para os apps operacionais.
  if (currentView === "classes") {
    return <ClassCatalogPage onNavigate={setCurrentView} />;
  }

  if (currentView === "maps") {
    return <MapsPage onNavigate={setCurrentView} />;
  }

  if (currentView === "aventuras") {
    return <Aventuras onNavigate={setCurrentView} tableSync={tableSync} />;
  }

  if (currentView === "apps") {
    return (
      <AppsAccessPage
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onNavigate={setCurrentView}
        onOpenMaster={() => setCurrentView("masterPanel")}
        onOpenPlayer={(index) => {
          setSelectedPlayerIndex(index);
          setCurrentView("playerCharacter");
        }}
      />
    );
  }

  return <LandingPage onNavigate={setCurrentView} />;
}
