import altaiBackground from "../../../assets/adventure-backgrounds/altai.svg";
import formigueiroBackground from "../../../assets/adventure-backgrounds/formigueiro.svg";
import nekestiBackground from "../../../assets/adventure-backgrounds/nekesti.svg";
import nemfallaBackground from "../../../assets/adventure-backgrounds/nemfalla.svg";

type AdventureVisual = {
  background: string;
  titleLines: string[];
  position: string;
};

const defaultVisual: AdventureVisual = {
  background: nekestiBackground,
  titleLines: ["Aventura", "Guiada"],
  position: "center",
};

const adventureVisuals: Record<string, AdventureVisual> = {
  nekesti: {
    background: nekestiBackground,
    titleLines: ["Confusões em", "Nekesti"],
    position: "center",
  },
  nemfalla: {
    background: nemfallaBackground,
    titleLines: ["Desfiladeiro de", "Nemfalla"],
    position: "center",
  },
  "forte-altai": {
    background: altaiBackground,
    titleLines: ["O Forte de", "Altai"],
    position: "center",
  },
  "formigueiro-infectado": {
    background: formigueiroBackground,
    titleLines: ["O Formigueiro", "Infectado"],
    position: "center",
  },
};

export function getAdventureVisual(adventureId: string) {
  return adventureVisuals[adventureId] ?? defaultVisual;
}
