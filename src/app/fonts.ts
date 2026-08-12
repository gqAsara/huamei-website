import {
  Cormorant_Garamond,
  Montserrat,
  Noto_Serif_SC,
} from "next/font/google";

export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-family",
});

export const fontBody = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body-family",
});

export const fontLabel = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-label-family",
});

export const fontCN = Noto_Serif_SC({
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cn-family",
  preload: false,
});
