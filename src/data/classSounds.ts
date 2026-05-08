type ClassSound = {
  src: string;
  gain: number;
};

export const classSelectSounds: Record<string, ClassSound> = {
  barbaro: {
    src: new URL("../assets/sounds/Barbaro.wav", import.meta.url).href,
    gain: 0.2,
  },
  bardo: {
    src: new URL("../assets/sounds/Bardo.wav", import.meta.url).href,
    gain: 0.2,
  },
  clerigo: {
    src: new URL("../assets/sounds/Clerigo.wav", import.meta.url).href,
    gain: 0.19,
  },
  druida: {
    src: new URL("../assets/sounds/Druida.wav", import.meta.url).href,
    gain: 0.18,
  },
  "engenheiro-arcano": {
    src: new URL("../assets/sounds/EngenheiroArcano.wav", import.meta.url).href,
    gain: 0.16,
  },
  guerreiro: {
    src: new URL("../assets/sounds/Guerreiro.wav", import.meta.url).href,
    gain: 0.18,
  },
  ladrao: {
    src: new URL("../assets/sounds/Ladino.wav", import.meta.url).href,
    gain: 0.2,
  },
  mago: {
    src: new URL("../assets/sounds/Mago.wav", import.meta.url).href,
    gain: 0.17,
  },
  paladino: {
    src: new URL("../assets/sounds/Paladino.wav", import.meta.url).href,
    gain: 0.2,
  },
  ranger: {
    src: new URL("../assets/sounds/Patrulheiro.wav", import.meta.url).href,
    gain: 0.18,
  },
};
