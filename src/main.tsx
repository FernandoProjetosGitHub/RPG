import React from 'react'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'


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
    fontFamily: `"Cinzel", serif`,
  },

components: {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 6,
        textTransform: "none",
        fontWeight: 700,
      },
      contained: {
        backgroundColor: "#c59b4b",
        color: "#1a1814",
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
        backgroundColor: "#12110f",
        border: "1px solid rgba(217,200,159,.15)",
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
}
});


createRoot(document.getElementById('root') as HTMLElement).render(
 <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
</React.StrictMode>
)
