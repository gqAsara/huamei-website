import {
  Fraunces,
  Lora,
  Inter,
  Noto_Serif_SC,
} from "next/font/google";

// Fraunces is a variable font: omit `weight` to load the full 100–900 range,
// and pull in the optical-size + SOFT + WONK axes. WONK (the "wonky" alternate
// letterforms) and optical sizing are what give headings the high-contrast,
// swashy display character. They're toggled on in globals.css via
// font-optical-sizing / font-variation-settings.
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  variable: "--font-display-family",
});

export const fontBody = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body-family",
});

export const fontLabel = Inter({
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
