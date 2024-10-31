// app/theme.ts
"use client";
import { createTheme } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";

const theme = createTheme({
  palette: {
    // This will be controlled by next-themes
    mode: "light",
  },
});

export default theme;
