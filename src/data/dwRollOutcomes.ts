import type { AttributeKey } from "../types/character";
import { attributeLabels } from "../types/character";

export type DwRollOutcomeKey = "success" | "partial" | "miss";

export type DwRollOutcome = {
  key: DwRollOutcomeKey;
  band: string;
  title: string;
  playerText: string;
  gmText: string;
  color: string;
};

export const dwRollOutcomes: Record<DwRollOutcomeKey, DwRollOutcome> = {
  success: {
    key: "success",
    band: "10+",
    title: "Acerto",
    playerText:
      "Voce consegue o que queria de forma limpa. A ficcao avanca a seu favor e o efeito descrito pelo movimento acontece.",
    gmText:
      "Mostre o resultado da acao, mantenha a cena andando e ofereca a proxima escolha interessante.",
    color: "#5fb6c4",
  },
  partial: {
    key: "partial",
    band: "7-9",
    title: "Acerto parcial",
    playerText:
      "Voce consegue, mas paga um custo, aceita uma escolha dificil, sofre uma complicacao ou fica exposto.",
    gmText:
      "Ofereca resultado pior, barganha dificil, custo imediato ou uma consequencia que siga a ficcao.",
    color: "#f2c76c",
  },
  miss: {
    key: "miss",
    band: "6-",
    title: "Falha narrativa",
    playerText:
      "Marque XP. A acao da errado, sai torta ou funciona com uma consequencia forte definida pelo MJ.",
    gmText:
      "Faca um movimento de mestre: revele perigo, separe alguem, gaste recursos, cause dano ou mostre uma verdade desagradavel.",
    color: "#ff8f9d",
  },
};

export function getDwRollOutcome(total: number): DwRollOutcomeKey {
  if (total >= 10) return "success";
  if (total >= 7) return "partial";
  return "miss";
}

export function getDwMoveRollIntro(
  moveName: string,
  attribute?: AttributeKey,
) {
  if (!attribute) {
    return `${moveName} nao pede rolagem propria: aplique o texto quando a ficcao disparar o movimento.`;
  }

  return `${moveName} pede 2d6 + modificador de ${attributeLabels[attribute]}. Use o resultado para definir acerto, custo ou falha narrativa.`;
}

export function getDwMoveOutcomeSummary(
  moveName: string,
  attribute?: AttributeKey,
) {
  return [
    getDwMoveRollIntro(moveName, attribute),
    "10+ acerto limpo.",
    "7-9 acerto parcial com custo.",
    "6- marque XP e o MJ faz um movimento.",
  ].join(" ");
}
