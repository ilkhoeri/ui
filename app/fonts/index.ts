import localFont from "next/font/local";
import { Amiri, Anek_Telugu, Inter, Kanit, Koulen, Montserrat, Poppins, Roboto_Mono, Special_Elite, Quicksand, Dancing_Script, Caveat, Ubuntu, Barlow } from "next/font/google";

export const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--ff-geist-sans",
  weight: "100 900"
});
export const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--ff-geist-mono",
  weight: "100 900"
});
export const playwrite_ro = localFont({
  src: "./PlaywriteRO-VF.ttf",
  variable: "--ff-playwrite-romania",
  weight: "100 400"
});

export const amiri = Amiri({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-amiri",
  display: "swap"
});
export const anekTelugu = Anek_Telugu({
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-anek-telugu",
  display: "swap"
});
export const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-inter",
  display: "swap"
});
export const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-ubuntu",
  display: "swap"
});
export const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-caveat",
  display: "swap"
});
export const kanit = Kanit({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-kanit",
  display: "swap"
});
export const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-dancing-script",
  display: "swap"
});
export const koulen = Koulen({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-koulen",
  display: "swap"
});
export const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-montserrat",
  display: "swap"
});
export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-poppins",
  display: "swap"
});
export const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-roboto-mono",
  display: "swap"
});
export const specialElit = Special_Elite({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-special-elit",
  display: "swap"
});
export const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-quicksand",
  display: "swap"
});
export const barlow = Barlow({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--ff-barlow",
  display: "swap"
});

export const fontsVariable = [geistSans.variable, geistMono.variable, inter.variable, montserrat.variable, poppins.variable, robotoMono.variable, barlow.variable, montserrat.variable, kanit.variable, robotoMono.variable, playwrite_ro.variable, ubuntu.variable].join(" ");

type CSSProperties = React.CSSProperties & { [key: string]: any };
type stylesBodyType = { className: string; style?: CSSProperties };
/**
 * @usage
 *  // without className
 * ```js
 * <body {...stylesBody()}>
 * ```
 *  // with className & style
 * ```js
 * <body
 *   {...stylesBody(
 *     "bg-white font-bold", {color: "black"}
 *   )}
 * >
 * ```
 */
export function bodyConfig(className?: string | undefined, style?: CSSProperties): stylesBodyType {
  let additionalClass: stylesBodyType = {
    className: fontsVariable,
    style: { ...style }
  };

  if (className) {
    additionalClass = {
      className: [fontsVariable, className].join(" "),
      style: { ...style }
    };
  }

  return additionalClass;
}
