export type ClassTheme = {
  symbol: string;
  color: string;
  accent: string;
  role: string;
};

export const classThemes: Record<string, ClassTheme> = {
  barbaro: {
    symbol: "BRB",
    color: "#c44d3d",
    accent: "#ffd1a8",
    role: "Forca, apetite e impacto direto",
  },
  bardo: {
    symbol: "BRD",
    color: "#b56bd9",
    accent: "#f0d4ff",
    role: "Arte, influencia e conhecimento",
  },
  clerigo: {
    symbol: "CLR",
    color: "#d8c46a",
    accent: "#fff2b0",
    role: "Fe, cura e autoridade divina",
  },
  druida: {
    symbol: "DRD",
    color: "#5f9f67",
    accent: "#d8efbd",
    role: "Natureza, espiritos e metamorfose",
  },
  "engenheiro-arcano": {
    symbol: "ARC",
    color: "#5fb6c4",
    accent: "#dff7ff",
    role: "Codex, dispositivos e efeitos instaveis",
  },
  guerreiro: {
    symbol: "GRR",
    color: "#9c8d77",
    accent: "#f2e3c7",
    role: "Arma assinatura e linha de frente",
  },
  ladrao: {
    symbol: "LAD",
    color: "#7f6fd9",
    accent: "#d8d1ff",
    role: "Furtividade, venenos e oportunidades",
  },
  mago: {
    symbol: "MAG",
    color: "#4f77d9",
    accent: "#dce7ff",
    role: "Grimorio, preparo e ritual",
  },
  paladino: {
    symbol: "PAL",
    color: "#d9a84f",
    accent: "#ffe3a8",
    role: "Juramento, protecao e julgamento",
  },
  ranger: {
    symbol: "PTR",
    color: "#4f9f78",
    accent: "#c7f2d9",
    role: "Rastro, tiro e companheiro animal",
  },
};

export function getClassTheme(classId: string) {
  return (
    classThemes[classId] ?? {
      symbol: "DW",
      color: "#c59b4b",
      accent: "#f7edd9",
      role: "Aventureiro de Dungeon World",
    }
  );
}
