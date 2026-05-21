import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { dwClasses, unselectedClass } from "../data/dwClasses";
import { consumableItems, items } from "../data/items";
import {
  loadRpgTableSnapshot,
  saveRpgTableSnapshot,
} from "../services/rpgTableStorage";
import type { CloudTableState } from "../services/cloudTablePlan";
import {
  initialCharacter,
  type Character,
  type PlayerProfileSummary,
} from "../types/character";

const playerCount = 7;

function cloneInitialCharacter() {
  // A ficha inicial possui objetos aninhados; o clone evita que os 7 jogadores
  // compartilhem a mesma referencia de inventario, atributos ou equipamentos.
  return JSON.parse(JSON.stringify(initialCharacter)) as Character;
}

function createInitialTable() {
  // A mesa sempre nasce com 7 espacos, porque o mestre pode preparar fichas em
  // tempos diferentes e abrir cada perfil quando o jogador aparecer.
  return Array.from({ length: playerCount }, cloneInitialCharacter);
}

function normalizePlayerIndex(index?: number) {
  if (typeof index !== "number") return 0;
  return Math.max(0, Math.min(playerCount - 1, index));
}

function mergeStoredCharacter(fallback: Character, storedCharacter?: Character) {
  if (!storedCharacter) return fallback;

  return {
    ...fallback,
    ...storedCharacter,
    hp: {
      ...fallback.hp,
      ...storedCharacter.hp,
    },
    attributes: {
      ...fallback.attributes,
      ...storedCharacter.attributes,
    },
    modifiers: {
      ...fallback.modifiers,
      ...storedCharacter.modifiers,
      attributes: {
        ...fallback.modifiers.attributes,
        ...storedCharacter.modifiers?.attributes,
      },
    },
    creationChoices: {
      ...fallback.creationChoices,
      ...storedCharacter.creationChoices,
    },
    consumables: {
      ...fallback.consumables,
      ...storedCharacter.consumables,
    },
    equipment: {
      ...fallback.equipment,
      ...storedCharacter.equipment,
    },
    availableItems: Array.isArray(storedCharacter.availableItems)
      ? storedCharacter.availableItems
      : fallback.availableItems,
    selectedSkillIds: Array.isArray(storedCharacter.selectedSkillIds)
      ? storedCharacter.selectedSkillIds
      : fallback.selectedSkillIds,
    preparedSpellIds: Array.isArray(storedCharacter.preparedSpellIds)
      ? storedCharacter.preparedSpellIds
      : fallback.preparedSpellIds,
    exhaustedSpellIds: Array.isArray(storedCharacter.exhaustedSpellIds)
      ? storedCharacter.exhaustedSpellIds
      : fallback.exhaustedSpellIds,
  };
}

function normalizeStoredTable(storedCharacters?: Character[]) {
  const initialTable = createInitialTable();
  if (!Array.isArray(storedCharacters)) return initialTable;

  return initialTable.map((fallbackCharacter, index) =>
    mergeStoredCharacter(fallbackCharacter, storedCharacters[index]),
  );
}

function getMaxHpForCharacter(character: Character) {
  const selectedClass =
    dwClasses.find((dwClass) => dwClass.id === character.classId) ??
    unselectedClass;

  // Itens equipados podem alterar PV maximo. Somamos apenas itens existentes
  // para manter a ficha estavel mesmo se um item antigo sair da lista.
  const equippedBonusHp = Object.values(character.equipment)
    .filter((itemId): itemId is string => Boolean(itemId))
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item))
    .reduce((acc, item) => acc + (item.modifiers.hp ?? 0), 0);

  return selectedClass.baseHp + character.attributes.constituicao + equippedBonusHp;
}

function buildPlayerProfiles(characters: Character[]): PlayerProfileSummary[] {
  // Perfil e ficha sao dados diferentes: o perfil e um resumo barato para
  // selects/listas, enquanto a ficha completa fica preservada no array.
  return characters.map((currentCharacter, index) => {
    const currentClass =
      dwClasses.find((dwClass) => dwClass.id === currentCharacter.classId) ??
      unselectedClass;

    return {
      index,
      label: `Jogador ${index + 1}`,
      name: currentCharacter.name,
      classId: currentClass.id,
      className: currentClass.name,
    };
  });
}

export function useRpgTable() {
  const [initialSnapshot] = useState(() => loadRpgTableSnapshot());
  const [characters, setCharacters] = useState<Character[]>(() =>
    normalizeStoredTable(initialSnapshot?.characters),
  );
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(() =>
    normalizePlayerIndex(initialSnapshot?.selectedPlayerIndex),
  );

  const character = characters[selectedPlayerIndex] ?? characters[0];
  const playerProfiles = useMemo(
    () => buildPlayerProfiles(characters),
    [characters],
  );

  const setCharacter: Dispatch<SetStateAction<Character>> = useCallback((update) => {
    // Este setter replica o comportamento do setState do React, mas limitado
    // ao jogador ativo. Assim as telas de ficha nao precisam conhecer o array
    // inteiro da mesa. Se a atualizacao devolver a mesma ficha, mantemos o
    // mesmo array para evitar renders em loop nas paginas de jogador/mestre.
    setCharacters((currentCharacters) => {
      let changed = false;
      const nextCharacters = currentCharacters.map((currentCharacter, index) => {
        if (index !== selectedPlayerIndex) return currentCharacter;
        const nextCharacter =
          typeof update === "function" ? update(currentCharacter) : update;
        if (nextCharacter !== currentCharacter) changed = true;
        return nextCharacter;
      });

      return changed ? nextCharacters : currentCharacters;
    });
  }, [selectedPlayerIndex]);

  const applyConsumableToPlayer = useCallback((consumableId: string, targetIndex: number) => {
    const consumable = consumableItems.find((item) => item.id === consumableId);
    if (!consumable) return;

    setCharacters((currentCharacters) => {
      const source = currentCharacters[selectedPlayerIndex];

      // O recurso sempre sai de quem esta usando. Se ele nao possui usos,
      // abortamos sem alterar o alvo para impedir cura gratuita.
      if (!source || (source.consumables[consumableId] ?? 0) <= 0) {
        return currentCharacters;
      }

      return currentCharacters.map((currentCharacter, index) => {
        let nextCharacter = currentCharacter;

        if (index === selectedPlayerIndex) {
          nextCharacter = {
            ...nextCharacter,
            consumables: {
              ...nextCharacter.consumables,
              [consumableId]: Math.max(
                0,
                (nextCharacter.consumables[consumableId] ?? 0) - 1,
              ),
            },
          };
        }

        if (index !== targetIndex) return nextCharacter;

        // Efeitos ficcionais tambem consomem o item, mas nao mexem em PV. A
        // descricao do item orienta a conversa com o mestre nesses casos.
        const maxHp = getMaxHpForCharacter(nextCharacter);
        let nextHp = nextCharacter.hp.current;
        if (consumable.effect.type === "heal") {
          nextHp = Math.min(maxHp, nextHp + consumable.effect.amount);
        }
        if (consumable.effect.type === "healHalf") {
          nextHp = Math.min(maxHp, nextHp + Math.ceil(maxHp / 2));
        }

        return {
          ...nextCharacter,
          hp: {
            ...nextCharacter.hp,
            current: nextHp,
          },
        };
      });
    });
  }, [selectedPlayerIndex]);

  const replaceTableState = useCallback((state: CloudTableState) => {
    setCharacters(normalizeStoredTable(state.characters));
    setSelectedPlayerIndex(normalizePlayerIndex(state.selectedPlayerIndex));
  }, []);

  useEffect(() => {
    saveRpgTableSnapshot({
      characters,
      selectedPlayerIndex,
    });
  }, [characters, selectedPlayerIndex]);

  return {
    character,
    characters,
    setCharacter,
    replaceTableState,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    playerProfiles,
    applyConsumableToPlayer,
  };
}
