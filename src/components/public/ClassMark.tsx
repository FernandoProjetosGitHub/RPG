import { Box } from "@mui/material";
import { getClassTheme } from "../../data/classThemes";

type ClassMarkProps = {
  classId: string;
  size?: number;
};

export default function ClassMark({ classId, size = 46 }: ClassMarkProps) {
  const theme = getClassTheme(classId);
  const mark = classMarks[classId] ?? classMarks.default;

  // O brasao e SVG local para manter a landing e o catalogo padronizados sem
  // depender de pacote externo ou imagem pesada.
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: "8px",
        display: "block",
        flex: "0 0 auto",
        filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))",
      }}
    >
      <svg
        viewBox="0 0 64 64"
        role="img"
        focusable="false"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id={`class-mark-glow-${classId}`} cx="50%" cy="18%" r="78%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.46" />
            <stop offset="58%" stopColor={theme.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor="#050504" stopOpacity="0.96" />
          </radialGradient>
          <linearGradient id={`class-mark-metal-${classId}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.78" />
            <stop offset="45%" stopColor={theme.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#241812" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M32 3 55 12v17c0 14.8-8.7 25.6-23 32C17.7 54.6 9 43.8 9 29V12L32 3Z"
          fill={`url(#class-mark-glow-${classId})`}
          stroke={theme.accent}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 8.2 50 15.2v13.6c0 11.5-6.4 20.2-18 25.8C20.4 49 14 40.3 14 28.8V15.2l18-7Z"
          fill="#070706"
          fillOpacity="0.62"
          stroke={theme.color}
          strokeOpacity="0.72"
          strokeWidth="1.1"
        />
        <path
          d="M19 19.5h26M18 43.5h28"
          fill="none"
          stroke={theme.accent}
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {mark.paths.map((path, index) => (
          <path
            key={`${classId}-${index}`}
            d={path}
            fill={index === 0 ? `url(#class-mark-metal-${classId})` : "#070706"}
            stroke={index === 0 ? "#fff4d0" : theme.accent}
            strokeWidth={index === 0 ? 1.7 : 1.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={index === 0 ? 1 : 0.9}
          />
        ))}
      </svg>
    </Box>
  );
}

const classMarks: Record<string, { paths: string[] }> = {
  barbaro: {
    paths: [
      "M18 43 30 17l4 12 9-5-5 13 9 6-12 2-3 9-5-9-9-2Z",
      "M27 39 35 21",
    ],
  },
  bardo: {
    paths: [
      "M22 43c4-2 6-6 5-12l-2-12 16-4 2 19c1 6-3 10-8 10-4 0-6-3-4-6 2-3 7-3 9 0l-1-14-10 3 1 13c1 6-3 10-8 10-4 0-6-3-4-6 1-2 3-3 4-3Z",
      "M29 27 40 24",
    ],
  },
  clerigo: {
    paths: [
      "M29 14h6v13h12v6H35v17h-6V33H17v-6h12Z",
      "M22 45c5 3 15 3 20 0",
    ],
  },
  druida: {
    paths: [
      "M32 13c10 6 15 14 14 23-1 9-8 15-14 15s-13-6-14-15c-1-9 4-17 14-23Z",
      "M32 18c-1 13 2 21-9 29M33 29c5-1 8-4 10-9M31 37c-5 0-9-2-12-6",
    ],
  },
  "engenheiro-arcano": {
    paths: [
      "M21 23h22v18H21Zm5-8h12v8H26Zm0 26h12v8H26Z",
      "M25 30h14M25 35h14M32 17v30",
    ],
  },
  guerreiro: {
    paths: [
      "M21 16 48 43l-5 5-27-27Zm22 0 5 5-27 27-5-5Z",
      "M25 20 20 25M39 20l5 5",
    ],
  },
  ladrao: {
    paths: [
      "M24 17h17l-5 12 7 6-9 3-2 11-7-9-9-1 7-8Z",
      "M25 18c4 6 9 10 17 16M25 40l15-18",
    ],
  },
  mago: {
    paths: [
      "M32 11 37 25l15 1-12 9 4 15-12-8-12 8 4-15-12-9 15-1Z",
      "M32 20v17M24 32h16",
    ],
  },
  paladino: {
    paths: [
      "M32 11 44 20v14c0 8-4 13-12 18-8-5-12-10-12-18V20Z",
      "M32 17v28M24 29h16",
    ],
  },
  ranger: {
    paths: [
      "M17 44c10-20 20-27 32-29-2 12-9 23-29 32Z",
      "M21 43 43 21M28 32l-3-8M34 27l6 4",
    ],
  },
  default: {
    paths: [
      "M32 13 45 23v18L32 51 19 41V23Z",
      "M25 28h14v12H25Z",
    ],
  },
};
