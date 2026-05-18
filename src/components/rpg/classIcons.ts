import type { IconType } from "react-icons";
import {
  GiBarbarian,
  GiBowArrow,
  GiCog,
  GiCrossedSwords,
  GiHolySymbol,
  GiLyre,
  GiMagicPalm,
  GiNinjaHeroicStance,
  GiOakLeaf,
  GiShield,
  GiTemplarShield,
} from "react-icons/gi";

const classIconMap: Record<string, IconType> = {
  barbaro: GiBarbarian,
  bardo: GiLyre,
  clerigo: GiHolySymbol,
  druida: GiOakLeaf,
  "engenheiro-arcano": GiCog,
  guerreiro: GiCrossedSwords,
  ladrao: GiNinjaHeroicStance,
  mago: GiMagicPalm,
  paladino: GiTemplarShield,
  ranger: GiBowArrow,
};

export function getClassIcon(classId: string) {
  return classIconMap[classId] ?? GiShield;
}
