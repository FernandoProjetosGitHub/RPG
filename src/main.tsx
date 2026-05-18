import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c59b4b", // dourado
    },
    secondary: {
      main: "#aa263d", // vermelho sangue
    },
    background: {
      default: "#070706",
      paper: "#12110f",
    },
    text: {
      primary: "#f7edd9",
      secondary: "#b9a98b",
    },
  },

  typography: {
    fontFamily: `"Inter", ui-sans-serif, system-ui, sans-serif`,
    h1: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    h2: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    h3: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    h4: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    h5: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    h6: { fontFamily: `"Cinzel", Georgia, serif`, fontWeight: 900 },
    button: { fontWeight: 900 },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: "#6f5a36 #0b0a08",
      },
      "::selection": {
        backgroundColor: "rgba(197,155,75,.38)",
        color: "#fff8e9",
      },
      "*": {
        scrollbarWidth: "thin",
      },
      "*::-webkit-scrollbar": {
        width: 10,
        height: 10,
      },
      "*::-webkit-scrollbar-track": {
        background: "#0b0a08",
      },
      "*::-webkit-scrollbar-thumb": {
        background:
          "linear-gradient(180deg, rgba(197,155,75,.72), rgba(95,182,196,.42))",
        border: "2px solid #0b0a08",
        borderRadius: 999,
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 6,
        textTransform: "none",
        fontWeight: 900,
        minHeight: 38,
        transition:
          "transform .16s ease, border-color .16s ease, background-color .16s ease, box-shadow .16s ease",
        "&:hover": {
          transform: "translateY(-1px)",
        },
        "&.Mui-focusVisible": {
          outline: "2px solid rgba(255,243,220,.72)",
          outlineOffset: 2,
        },
      },
      contained: {
        backgroundColor: "#c59b4b",
        color: "#1a1814",
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,.28)",
        "&:hover": {
          backgroundColor: "#e0c26d",
        },
      },
      outlined: {
        borderColor: "rgba(217,200,159,.3)",
        color: "#f7edd9",
        "&:hover": {
          borderColor: "#c59b4b",
          backgroundColor: "rgba(197,155,75,.12)",
        },
      },
    },
  },

  MuiSelect: {
    styleOverrides: {
      root: {
        backgroundColor: "rgba(255,255,255,.05)",
        borderRadius: 6,
      },
      icon: {
        color: "#f7edd9",
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        backgroundColor: "rgba(255,255,255,.05)",
        borderRadius: 6,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(217,200,159,.2)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#c59b4b",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#c59b4b",
        },
      },
      input: {
        color: "#f7edd9",
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        background:
          "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018)), #11110f",
        border: "1px solid rgba(217,200,159,.15)",
        boxShadow: "0 18px 46px rgba(0,0,0,.36)",
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: "#b9a98b",
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "rgba(197,155,75,.15)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(197,155,75,.25)",
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        background:
          "linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.018)), #12110f",
        border: "1px solid rgba(217,200,159,.15)",
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        background:
          "linear-gradient(145deg, rgba(197,155,75,.08), rgba(95,182,196,.045)), #11110f",
        boxShadow: "0 30px 90px rgba(0,0,0,.78)",
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        maxWidth: "100%",
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,.08)",
        color: "#f7edd9",
        "@media (max-width:620px)": {
          width: "100%",
          height: "auto",
          minHeight: 30,
          justifyContent: "flex-start",
        },
      },
      label: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        "@media (max-width:620px)": {
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          textAlign: "left",
          lineHeight: 1.25,
          paddingTop: 5,
          paddingBottom: 5,
        },
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 50,
      },
      indicator: {
        height: 3,
        borderRadius: 999,
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        color: "#b9a98b",
        fontWeight: 900,
        minHeight: 50,
        textTransform: "none",
        "&.Mui-selected": {
          color: "#f2c76c",
        },
      },
    },
  },

  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        background:
          "linear-gradient(180deg, rgba(20,17,13,.92), rgba(7,7,6,.96))",
      },
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        color: "#b9a98b",
        minWidth: 0,
        "&.Mui-selected": {
          color: "#f2c76c",
        },
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,.08)",
      },
      bar: {
        borderRadius: 999,
      },
    },
  },
}
});


createRoot(document.getElementById("root") as HTMLElement).render(
 <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
</React.StrictMode>
);
