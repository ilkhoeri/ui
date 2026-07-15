import { PluginAPI, type Config } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";

export default {
  prefix: "",
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx,md,mdx}", "./source/**/*.{js,jsx,ts,tsx,md,mdx}", "./resource/**/*.{js,jsx,ts,tsx,md,mdx}", "./components/**/*.{js,jsx,ts,tsx,md,mdx}", "./pages/**/*.{js,jsx,ts,tsx,md,mdx}", "./src/**/*.{js,jsx,ts,tsx,md,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "460px",
        "2xl": "1400px",
        "3xl": "1600px"
      }
    },
    extend: {
      screens: {
        xs: "460px",
        "2xl": "1400px",
        "3xl": "1600px"
      },
      spacing: {
        26: "104px"
      },
      letterSpacing: {
        px: "-.0625rem",
        "0.5": "-.03125rem"
      },
      maxWidth: {
        var: "var(--max-w, var(--max-w1, var(--max-w2, var(--max-w3))))"
      },
      borderRadius: {
        "4xl": "2rem",
        "3xl": "calc(var(--radius) + .5rem)",
        "2xl": "calc(var(--radius) + .25rem)",
        xl: "calc(var(--radius) + .125rem)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - .125rem)",
        sm: "calc(var(--radius) - .25rem)"
      },
      colors: {
        code: "hsl(var(--code))",
        border: "hsl(var(--border))",
        color: {
          DEFAULT: "hsl(var(--color))",
          muted: "hsl(var(--color-muted))"
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          theme: "hsl(var(--background-theme))",
          box: "hsl(var(--background-box))",
          nav: "hsl(var(--background-nav))",
          muted: "hsl(var(--background-muted))",
          "code-header": "hsl(var(--background-code-header))",
          "code-body": "hsl(var(--background-code-body))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          emphasis: "hsl(var(--destructive-emphasis))"
        },
        constructive: {
          DEFAULT: "hsl(var(--constructive))",
          foreground: "hsl(var(--constructive-foreground))",
          emphasis: "hsl(var(--constructive-emphasis))"
        },
        conservative: {
          DEFAULT: "hsl(var(--conservative))",
          foreground: "hsl(var(--conservative-foreground))",
          emphasis: "hsl(var(--conservative-emphasis))"
        },
        primitive: {
          DEFAULT: "hsl(var(--primitive))",
          foreground: "hsl(var(--primitive-foreground))",
          emphasis: "hsl(var(--primitive-emphasis))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          emphasis: "hsl(var(--muted-emphasis))"
        },
        mention: {
          DEFAULT: "hsl(var(--mention))",
          foreground: "hsl(var(--mention-foreground))",
          emphasis: "hsl(var(--mention-emphasis))"
        }
      },
      backgroundImage: {
        "danger-area": "repeating-linear-gradient(var(--danger-bg-image))"
      },
      keyframes: {
        "cursor-bar": { "50%": { borderRightColor: "transparent" } },
        "cursor-blink": {
          "20%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0)" },
          "80%": { transform: "scaleY(1)" }
        },
        "fade-in": {
          from: {
            opacity: "var(--tw-enter-opacity, initial)",
            scale: "var(--tw-enter-scale, initial)"
          }
        },
        "fade-out": {
          to: {
            opacity: "var(--tw-exit-opacity, initial)",
            scale: "var(--tw-exit-scale, initial)"
          }
        },
        "collapse-open": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--measure-available-h)" }
        },
        "collapse-closed": {
          from: { height: "var(--measure-available-h)" },
          "85%": { opacity: "0" },
          to: { height: "0", visibility: "hidden" }
        },
        "bounce-in": {
          "0%": { opacity: "0", scale: "1.3" },
          "50%": { opacity: "0.8", scale: "0.7" },
          "80%": { opacity: "9", scale: "0.8" },
          "100%": { opacity: "1", scale: "1" }
        },
        "bounce-out": {
          "0%": { opacity: "0", scale: "0.3" },
          "50%": { opacity: "0.8", scale: "1.2" },
          "80%": { opacity: "9", scale: "0.8" },
          "100%": { opacity: "1", scale: "1" }
        },
        "wave-in": { "50%": { transform: "scale(0.85)" } },
        "wave-out": { "50%": { transform: "scale(1.2)" } },
        "opacity-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "opacity-out": {
          from: { opacity: "1" },
          to: { opacity: "0" }
        },
        "pulse-1": {
          "0%,16.667%,to": { opacity: "1" },
          "33.333%,83.333%": { opacity: "0" }
        },
        "pulse-2": {
          "0%,to": { opacity: "0" },
          "33.333%,50%": { opacity: "1" },
          "16.667%,66.667%": { opacity: "0" }
        },
        "pulse-3": {
          "0%,50%,to": { opacity: "0" },
          "66.667%,83.333%": { opacity: "1" }
        },
        "pulse-4": {
          "0%, 16.667%, 100%": { opacity: "1" },
          "33%, 83.333%": { opacity: "0" }
        },
        "pulse-5": {
          "0%, 16.667%, 66.667%, 100%": { opacity: "0" },
          "33.333%, 50%": { opacity: "1" }
        },
        "pulse-6": {
          "0%, 50%, 100%": { opacity: "0" },
          "66.667%, 83.333%": { opacity: "1" }
        }
      },
      animation: {
        "cursor-bar": "cursor-bar 0.5s step-end infinite alternate, cursor-blink 0.5s infinite",
        "collapse-open": "collapse-open 0.2s linear forwards",
        "collapse-closed": "collapse-closed 0.2s linear forwards",
        "fade-in": "fade-in ease-in forwards",
        "fade-out": "fade-out ease-out forwards",
        "bounce-in": "bounce-in 0.5s linear forwards 0.3s",
        "bounce-out": "bounce-out 0.5s linear forwards 0.3s",
        "wave-in": "wave-in 0.4s ease forwards",
        "wave-out": "wave-out 0.4s ease forwards",
        enter: "enter ease forwards",
        exit: "exit ease forwards",
        "pulse-1": "pulse-1 8s infinite",
        "pulse-2": "pulse-2 8s infinite",
        "pulse-3": "pulse-3 8s infinite",
        "pulse-4": "pulse-4 8s infinite",
        "pulse-5": "pulse-5 8s infinite",
        "pulse-6": "pulse-6 8s infinite"
      },
      transitionProperty: {
        spacing: "margin, padding"
      },
      transitionDuration: {
        "500": "500ms",
        "1000": "1000ms"
      },
      transitionTimingFunction: {
        ease: "ease",
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)"
      },
      fontFamily: {
        "anek-telugu": ["var(--ff-anek-telugu)"],
        amiri: ["var(--ff-amiri)"],
        ubuntu: ["var(--ff-ubuntu)"],
        inter: ["var(--ff-inter)"],
        kanit: ["var(--ff-kanit)"],
        barlow: ["var(--ff-barlow)"],
        koulen: ["var(--ff-koulen)"],
        montserrat: ["var(--ff-montserrat)"],
        poppins: ["var(--ff-poppins)"],
        "roboto-mono": ["var(--ff-roboto-mono)"],
        "special-elit": ["var(--ff-special-elit)"],
        "geist-sans": ["var(--ff-geist-sans)"],
        "geist-mono": ["var(--ff-geist-mono)"],
        "playwrite-romania": ["var(--ff-playwrite-romania)"]
      },
      zIndex: {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "11",
        "19": "19",
        "20": "20",
        "21": "21",
        "29": "29",
        "30": "30",
        "99": "99",
        "999": "999",
        "9999": "9999",
        "99999": "99999"
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addBase, addUtilities }: PluginAPI) => {
      addBase({});
      addUtilities({
        ".scrollbar": {
          scrollbarColor: "var(--scroll-color, #adb3bd) var(--scroll-bg, #0000)",
          scrollbarWidth: "var(--scroll-w, thin)",
          scrollbarGutter: "auto"
        },
        ".webkit-scrollbar": {
          "@supports (scrollbar-color: auto)": {
            "&::-webkit-scrollbar": {
              display: "none",
              width: "var(--scroll-sz, 0px)",
              height: "var(--scroll-sz, 0px)",
              borderRadius: "var(--scroll-rounded, 9999px)"
            },
            "&::-webkit-scrollbar-track": {
              background: "var(--scroll-bg, #0000)"
            },
            "&::-webkit-scrollbar-thumb": {
              background: "var(--scroll-color, #0000)",
              borderRadius: "var(--scroll-rounded, 9999px)"
            },
            "&:hover": {
              "&::-webkit-scrollbar-thumb": {
                background: "var(--scroll-color-hover, var(--scroll-color, #0000))"
              }
            }
          }
        },
        ".underline-hover": {
          position: "relative",
          touchAction: "manipulation",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "var(--underline-offset, 2px)",
            backgroundColor: "currentColor",
            height: "1px"
          },
          "@media (hover: hover)": {
            "&::after": {
              left: "0",
              width: "100%",
              transform: "scaleX(0)",
              transformOrigin: "right center",
              transition: "transform .45s cubic-bezier(0.86, 0, 0.07, 1)"
            },
            "&:hover": {
              "&::after": {
                transform: "scaleX(1)",
                transformOrigin: "left center",
                animation: "none"
              }
            }
          },
          "@media not all and (hover: hover)": {
            "&::after": {
              width: "0"
            },
            "&:hover": {
              "&::after": {
                animation: "underlinehover 0.75s cubic-bezier(0.86, 0, 0.07, 1)"
              }
            }
          }
        },
        ".timeline": {
          "--offset": "calc(var(--tl-bullet-size) / 2 + var(--tl-line-width) / 2)",
          "&:where([data-align=left])": {
            // paddingInlineStart: "var(--pl ,var(--offset))",
            "& [data-tl=bullet]": {
              right: "auto",
              left: "calc((var(--tl-bullet-size) / 2 + var(--tl-line-width) / 2) * -1)"
            },
            "& [data-tl=body]": {
              paddingLeft: "var(--offset)"
            },
            "& [data-tl=item]": {
              textAlign: "var(--tli-text-align, left)",
              paddingLeft: "var(--offset)",
              "&::before": {
                "--tli-line-right": "auto",
                "--tli-line-left": "calc(var(--tl-line-width) * -1)"
              }
            }
          },
          "&:where([data-align=right])": {
            // paddingInlineEnd: "var(--pr ,var(--offset))",
            "& [data-tl=bullet]": {
              left: "auto",
              right: "calc((var(--tl-bullet-size) / 2 + var(--tl-line-width) / 2) * -1)"
            },
            "& [data-tl=body]": {
              paddingRight: "var(--offset)"
            },
            "& [data-tl=item]": {
              textAlign: "var(--tli-text-align, right)",
              paddingRight: "var(--offset)",
              "&::before": {
                "--tli-line-left": "auto",
                "--tli-line-right": "calc(var(--tl-line-width) * -1)"
              }
            }
          }
        },
        ".timeline-item": {
          "--tli-line": "var(--tli-line-width, var(--tl-line-width)) var(--tli-has-line-active-style, var(--tl-line-style)) var(--tli-line-clr, var(--tl-line-clr))",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "var(--tli-line-top, 0)",
            left: "var(--tli-line-left, 0)",
            right: "var(--tli-line-right, 0)",
            bottom: "var(--tli-line-bottom, -2rem)",
            display: "var(--tli-line-display, none)",
            borderInlineStart: "var(--tli-line)",
            pointerEvents: "none"
          },
          "&:where(:not(:first-of-type))": {
            marginTop: "2rem"
          },
          "&:where(:not(:last-of-type))": {
            "--tli-line-display": "block"
          },
          "&:where([data-active]:has(+ [data-active]))": {
            "--tli-has-line-active-style": "var(--tli-line-style)",
            "--tli-has-bullet-active-style": "solid",
            "&::before": {
              borderColor: "var(--active-line, var(--tli-active-line, var(--tl-line-clr)))"
            }
          }
        },
        ".timeline-item-bullet": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "var(--tl-bullet-top, calc(var(--tl-bullet-size) * (-16.667 / 100)))",
          width: "var(--tl-bullet-size)",
          height: "var(--tl-bullet-size)",
          borderRadius: "var(--tl-bullet-round)",
          outline: "var(--tli-line-width, var(--tl-line-width)) var(--tli-has-bullet-active-style, var(--tl-bullet-style)) var(--tli-line-clr, var(--tl-bullet-ring, var(--tl-line-clr)))",
          "&[data-active]": {
            outlineColor: "var(--active-ring, var(--bullet-active-ring, var(--tl-line-clr)))"
          },
          "&[data-bullet]": {
            "&[data-active]": {
              backgroundColor: "var(--active-bg, var(--tli-active-bg, var(--tl-line-clr)))",
              "& *": {
                color: "var(--active-clr, var(--tli-active-clr))"
              }
            },
            "& svg": {
              flexShrink: "0",
              pointerEvents: "none"
            }
          },
          "&[data-notif]": {
            "--inset-tr": "calc(var(--tli-line-width, var(--tl-line-width)) * -0.75)",
            "&::after": {
              content: '""',
              zIndex: "0",
              position: "absolute",
              width: "33.333333%",
              height: "33.333333%",
              top: "var(--inset-tr)",
              right: "var(--inset-tr)",
              borderRadius: "inherit",
              backgroundColor: "var(--notif-clr, var(--tli-notif-clr))",
              boxShadow: "0 0 0 calc(var(--tli-line-width, var(--tl-line-width)) / 2) var(--notif-clr, var(--tli-notif-clr)), 0 0 0 calc(var(--tli-line-width, var(--tl-line-width)) / 2 + 2px) var(--notif-ring, var(--tli-notif-ring))"
            }
          }
        },
        ".sizer": {
          width: "var(--sz--w, var(--sz-w, var(--sz)))",
          minWidth: "var(--sz-miw, var(--sz-min, var(--sz-w, var(--sz))))",
          maxWidth: "var(--sz-maw, var(--sz-max, var(--sz-w, var(--sz))))",
          height: "var(--sz--h, var(--sz-h, var(--sz)))",
          minHeight: "var(--sz-mih, var(--sz-min, var(--sz-h, var(--sz))))",
          maxHeight: "var(--sz-mah, var(--sz-max, var(--sz-h, var(--sz))))"
        },
        ".unmounted": {
          height: "0px",
          width: "0px",
          overflow: "hidden",
          opacity: "0",
          scale: "0",
          display: "none"
        },
        ".bg-clip-text": {
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        },
        ".centered, .center-left, .center-right": {
          display: "flex",
          alignItems: "center"
        },
        ".centered": {
          justifyContent: "center"
        },
        ".center-left": {
          justifyContent: "flex-start"
        },
        ".center-right": {
          justifyContent: "flex-end"
        },
        ".center-top": {
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center"
        },
        ".center-bottom": {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center"
        },
        ".text-h1": {
          fontSize: "clamp(20px, 0.75rem + 4vw, 2.25rem)",
          lineHeight: "2.5rem"
        },
        ".text-h2": {
          fontSize: "clamp(18px, 11px + 3.5vw, 1.875rem)",
          lineHeight: "2.25rem"
        },
        ".text-h3": {
          fontSize: "clamp(17px, 14px + 3vw, 1.5rem)",
          lineHeight: "2rem"
        },
        ".text-h4": {
          fontSize: "clamp(1rem, 0.75rem + 2vw, 1.35rem)",
          lineHeight: "1.75rem"
        },
        ".text-h5": {
          fontSize: "clamp(1rem, 0.85rem + 2vw, 1.3rem)",
          lineHeight: "1.5"
        },
        ".text-h6": {
          fontSize: "clamp(1rem, 0.75rem + 1vw, 1.25rem)",
          lineHeight: "1.5"
        },
        ".font-heading": {
          fontSize: "clamp(2rem, 1rem + 3vw, 3.5rem)",
          letterSpacing: "-.01em",
          fontWeight: "800"
        },
        ".text-paragraph": {
          fontSize: "clamp(0.925rem, 0.925rem + 1vw, 1rem)",
          lineHeight: "1.75rem"
        },
        ".text-span": {
          fontSize: "clamp(0.75rem, 0.65rem + 0.65vw, 0.9rem)",
          lineHeight: "1.35"
        },
        ".h-inherit": {
          height: "inherit"
        },
        ".w-inherit": {
          width: "inherit"
        },
        ".size-inherit": { height: "inherit", width: "inherit" },
        ".inherit": {
          display: "inherit"
        },
        ".position-inherit": {
          position: "inherit"
        },
        ".grid-area-1": {
          gridArea: "1/1"
        },
        ".visibility-hidden": {
          visibility: "hidden"
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden"
        },
        ".backface-visible": {
          backfaceVisibility: "visible"
        },
        ".decoration-none": {
          textDecoration: "none"
        },
        ".whitespace-pre-line": {
          whiteSpace: "pre-line"
        },
        ".whitespace-pre-wrap": {
          whiteSpace: "pre-wrap"
        },
        ".whitespace-break-spaces": {
          whiteSpace: "break-spaces"
        },
        ".filter-icon": {
          filter: "var(--filter-icon)"
        },
        ".filter-icon-foreground": {
          filter: "var(--filter-icon-foreground)"
        },
        ".occure_load": {
          transformOrigin: "center",
          animation: "hop-arround 2s infinite"
        }
      });
    })
  ]
} satisfies Config;
