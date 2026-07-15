"use client";

import React from "react";
import Link from "next/link";
import { cvx, rem } from "xuxi";
import { cn } from "@/utils/cn";
import { TypingWords } from "@/ui/typing-words";
import { Transform } from "@/source/ondevelopment";
import { useNextTheme } from "@/modules/web/configuration/themes";
import { Svg } from "@/ui/svg";
import { BookOpenIcon, BrandGithubFillIcon, ArrowsSquareIcon, SunIcon, MoonStarIcon, CheckIcon, XIcon, HasCopyIcon } from "@/icons/*";

import { ProgressDemo } from "@/resource/demos/web/components/progress";
import { buttonVariants } from "@/ui/button";
import { Checker } from "@/ui/checker";
import { Avatar } from "@/ui/avatar";
import { useImagePopup } from "@/hooks/use-image-popup";
import { Loader } from "@/ui/loader";
import { Indicator } from "@/ui/indicator";
import { Rating } from "@/ui/rating";
import { TimelineConfiguratorDemo } from "@/resource/demos/web/components/timeline";
import { SliderConfiguratorDemo } from "@/resource/demos/web/components/slider";
import { Textarea } from "@/ui/textarea";
import { Stack } from "@/ui/stack";
import { Typography } from "@/ui/typography";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Tabs } from "@/ui/tabs";
import { Input } from "@/ui/input";
import { CopyButton } from "@/ui/copy-button";
import { CommandDemo, DropdownNotifications, TableDemo } from "./showcase";
import { GitBranchIcon, GitCommitIcon, GitPullRequestIcon } from "@/icons/*";
import { codes } from "./code-to-copy";

import style from "@/source/styles/.module.css";

const TYPING_DEFAULT = ["customize", "every", "of Your UI", "components"];

const classes = cvx({
  variants: {
    selector: {
      header: "relative flex h-[calc(100dvh-var(--navbar))] w-full max-w-7xl flex-col items-center justify-avenly px-6 [--sz-circle:clamp(3rem,1rem+5dvw,4.5rem)] [--sz-rx:2.25rem] [--sz-ry:7.5rem] [transition:height_185ms_ease]",
      wrapTop: "relative z-9 mx-auto flex size-full animate-[fade-in_0.6s_ease-in_forwards] flex-col items-center justify-center gap-16 text-left",
      h1: "relative w-full max-w-[55rem] grid grid-flow-row whitespace-nowrap font-extrabold leading-[1.35] text-color [--bg:40%_40%/200%_no-repeat_text_linear-gradient(0deg,hsl(var(--color)),rgb(64_64_64))] [--sz:clamp(22px,22px+5vw,5rem)] [--t-sh:-2px_-1px_15px_rgb(255_30_86/1%),2px_1px_15px_rgb(0_150_255/1%)] [font-size:--sz]",
      lineTop: "max-lg:top-[65%] max-lg:right-[25%] max-lg:[rotate:90deg] max-lg:[scale:1_-1] top-[10%] right-[-3rem] absolute w-[435px] h-max",
      aura1: "absolute h-full w-full opacity-[0.65] before:left-[-2%] before:top-[-10%] after:bottom-[5%] after:right-[-5%] max-w-full",
      aura2: "absolute h-full w-full opacity-[0.65] before:bottom-[-10%] before:left-[-2%] after:right-[-5%] after:top-[5%]",
      featuresWrap: "relative mb-20 w-full min-w-full space-y-40",
      links:
        "relative flex h-[clamp(2.25rem,1.25rem+2dvw,2.75rem)] w-[clamp(10.375rem,1.25rem+2dvw,100%)] items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:ring-2 before:ring-offset-4 before:ring-offset-background before:transition before:duration-300 before:content-[''] hover:before:scale-105 active:duration-75 active:before:scale-95",
      typingWords: "z-9 mx-auto text-center h-[--sz] select-none bg-clip-text leading-none [--cursor-color:#6e5494] [--cursor-h:calc(var(--sz))] [background:--bg] [display:flex] [text-shadow:--t-sh]",
      svg: "z-9 size-full overflow-visible stroke-muted-foreground"
    }
  }
});

export function PageHome() {
  return (
    <>
      <section id="header-section" className={cn(classes({ selector: "header" }), style.header_home)}>
        <i aria-hidden="true" className={cn(classes({ selector: "aura1" }), style.aura)} />
        <article className={classes({ selector: "wrapTop" })}>
          <Transform el="h1" hold={0} className={classes({ selector: "h1" })}>
            <span className="z-9 select-none bg-clip-text text-left [background:--bg] [text-shadow:--t-sh]">Control</span>
            <TypingWords el="span" withCursor duration={{ break: 2500 }} placeholders={TYPING_DEFAULT} className={classes({ selector: "typingWords" })} />
            <span className="z-9 select-none bg-clip-text text-right [background:--bg] [text-shadow:--t-sh]">lock-in.</span>
          </Transform>

          <Transform el="p" hold={0} transition={{ delay: "300ms, 300ms" }} transform={{ before: "translateY(9rem)", after: "translateY(0)", origin: "bottom center" }} className="relative z-[+1] flex flex-col items-center justify-center text-center font-normal text-muted-foreground text-h6 max-lg:mt-20">
            <span>Construct and develop your applications using straightforward dependencies</span>
          </Transform>

          <Transform el="div" hold={0} className="relative mx-auto -mt-4 flex w-full flex-col items-center justify-center gap-8 sm:flex-row" transform={{ before: "translateY(9rem)", after: "translateY(0)", origin: "bottom center" }}>
            {links.map((i, index) => (
              <Link key={index} href={i.url} target={i.target} className={cn(classes({ selector: "links" }), [{ "[&_svg]:fill-current before:bg-[#6e5494] before:ring-[#6e5494]": i.title === "Repo" }, { "before:bg-color before:ring-color": i.title === "Started" }])}>
                <span className="relative z-[+1] flex-row gap-2 text-base font-semibold text-background centered">
                  <i.icon size={20} /> {i.title}
                </span>
              </Link>
            ))}
          </Transform>
        </article>

        <ThemesToggle />

        <s data-linetop="" className={classes({ selector: "lineTop" })}>
          <Svg viewBox="0 0 436 140" size="unset" className={classes({ selector: "svg" })}>
            <circle cx="426.76" cy="9.5" r="7.5" fill="hsl(var(--background))" />
            <circle cx="9.24" cy="130.5" r="7.5" fill="hsl(var(--background))" />
            <path data-line="" d="m19.66,130.5h92.57c33.14,0,64-26.86,64-60v-1c0-33.14,29.86-60,63-60h180.56" fill="none" strokeDasharray="0 0 5 5" />
          </Svg>
        </s>
      </section>

      <SectionCustomizable />

      <ShowCaseComponents />

      <section id="features" className={cn(classes({ selector: "featuresWrap" }))}>
        <i aria-hidden="true" className={cn(classes({ selector: "aura2" }), style.aura)} />
        <div className="relative z-9 mx-auto max-w-7xl px-6 md:px-12 xl:px-6">
          <div className="md:w-2/3 lg:w-1/2">
            <svg className="size-16 text-color" onContextMenu={e => e.preventDefault()}>
              <use href="/images/icons.svg#stars" />
            </svg>
            <h2 className="mb-2 mt-4 font-bold text-color text-h1 empty:hidden"></h2>
            <p className="text-xs text-muted-foreground md:text-sm 2xl:text-base">
              <b>Oeri UI</b> lets you own your components — not just use them.
            </p>
          </div>
          <FeaturesList features={features} />
        </div>
      </section>
    </>
  );
}

export function ThemesToggle({ size }: { size?: number | string }) {
  const { theme, memoizedTheme } = useNextTheme();
  const isDark = theme === "dark";
  return (
    <div className={`${style.switch_wrap} [--ring:white] dark:[--ring:linear-gradient(-45deg,#f8acff,#696eff)]`} {...{ style: { "--sz-circle": size ? rem(size) : undefined } as React.CSSProperties }}>
      <s className={style.line_circle}>
        <Svg viewBox="0 0 218 179" size="unset" stroke={3} className={classes({ selector: "svg" })}>
          <circle cx="9" cy="9.04" r="7.5" fill="hsl(var(--background))" />
          <path data-line="" d="m198.54,169.04H69c-33.14,0-60-26.86-60-60V16.02" fill="none" strokeDasharray="0 0 6.96 6.96" />
          <path d="m203,177.46c-.26,0-.52-.07-.75-.2-.46-.27-.75-.76-.75-1.3v-13.86c0-.54.29-1.03.75-1.3.23-.13.49-.2.75-.2s.52.07.75.2l12,6.93c.46.27.75.76.75,1.3s-.29,1.03-.75,1.3l-12,6.93c-.23.13-.49.2-.75.2Z" fill="hsl(var(--background))" />
        </Svg>
      </s>
      <input checked={isDark} onChange={() => memoizedTheme(isDark || theme === "system" ? "light" : "dark")} className={style.switch_input} id="themes-toggle" name="themes-toggle" aria-label="toggle" type="checkbox" hidden />
      <label className={`${style.switch_label} [--shadow:--switch-shadow-light] dark:[--shadow:--switch-shadow-dark] dark:[--switch-ml:--switch-ml-dark]`} htmlFor="themes-toggle" />
      <span className={style.switch_marbles} />
    </div>
  );
}

function SectionCustomizable() {
  return (
    <div className="relative m-auto !mb-20 size-fit">
      <div className="relative flex h-[120px] w-[280px] items-center">
        <svg className="absolute inset-0 size-full" fill="currentColor" viewBox="0 0 254 104" xmlns="http://www.w3.org/2000/svg">
          <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" />
        </svg>
        <span className="mx-auto -mb-2.5 block w-fit bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text font-playwrite-romania text-5xl font-bold leading-tight text-transparent dark:from-blue-400 dark:to-blue-700">100%&nbsp;</span>
      </div>
      <h2 className="mt-4 text-center font-semibold text-h3">Customizable</h2>
    </div>
  );
}

function TabsVerticalDemos() {
  return (
    <Tabs orientation="vertical" variant="outline" defaultValue="commit" classNames={{ root: "rounded", panel: "p-4 flex items-center justify-center text-start" }}>
      <Tabs.List>
        <Tabs.Tab value="branch" className="[&_svg]:aria-selected:text-blue-500" leftSection={<GitBranchIcon size={15} stroke={3} />} />
        <Tabs.Tab value="commit" className="[&_svg]:aria-selected:text-pink-500" leftSection={<GitCommitIcon size={15} stroke={3} />} />
        <Tabs.Tab value="pullrequest" className="[&_svg]:aria-selected:text-yellow-500" leftSection={<GitPullRequestIcon size={15} stroke={3} />} />
      </Tabs.List>

      <Tabs.Panel value="branch">
        <div className="rounded-2xl bg-blue-600 p-4">
          <GitBranchIcon size={32} stroke={3} color="white" />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="commit">
        <div className="rounded-2xl bg-pink-600 p-4">
          <GitCommitIcon size={32} stroke={3} color="white" />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="pullrequest">
        <div className="rounded-2xl bg-yellow-600 p-4">
          <GitPullRequestIcon size={32} stroke={3} color="white" />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

function CheckerSwitchDemos() {
  const { theme, memoizedTheme } = useNextTheme();
  const [mount, setMound] = React.useState(false);
  React.useEffect(() => setMound(true), []);

  const isDark = theme === "dark" && mount;

  return (
    <Checker
      type="switch"
      size={24}
      onLabel="Dark"
      offLabel="Light"
      color="hsl(var(--muted))"
      checked={isDark}
      onCheckedChange={() => memoizedTheme((isDark ?? theme === "system") ? "light" : "dark")}
      icon={checked => (checked ? <MoonStarIcon animation size={16} /> : <SunIcon animation size={18} />)}
      classNames={{ track: "[&_svg]:text-background", thumb: "[--switch-thumb-bd:transparent] data-[checked]:bg-background [&>svg]:data-[switch]:data-[checked]:text-color" }}
    />
  );
}
function CheckerCheckboxDemos() {
  return <Checker type="checkbox" defaultChecked size={22} icon={checked => (checked ? <CheckIcon animation stroke={3} color="white" /> : <XIcon animation stroke={3} color="#ef4444" />)} />;
}

function renamed(str: string) {
  const words = str.split("-");
  return words.map(word => word.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}
function BreadcrumbDemos() {
  const pathname = "docs/web/components/breadcrumb";
  const paths = pathname.split("/").filter(Boolean);
  const active = (index: number) => index === paths.length - 1 || undefined;
  const links = (index: number) => (active(index) ? `/${paths.slice(0, index + 1).join("/")}` : `/${paths.slice(0, index + 1).join("/")}`);
  const separator = (index: number) => (index % 2 === 0 ? "+" : "-");

  const items = paths.map((path, index) => (
    <Link key={path} href={links(index)} aria-disabled={active(index)} className={cn(active(index) && "text-color")}>
      {renamed(path)}
    </Link>
  ));

  return <Breadcrumb gap={16} items={items} overflowWrap separator={separator} />;
}

function AvatarGroupDemos() {
  useImagePopup("[data-has-popup]");
  return (
    <Avatar.Group gap={14} color="hsl(var(--color))" classNames={{ root: "cursor-zoom-in" }}>
      <Avatar data-has-popup fallback="Jack" src="https://api.dicebear.com/9.x/lorelei/svg?seed=Jack" />
      <Avatar data-has-popup fallback="Brian" src="https://api.dicebear.com/9.x/lorelei/svg?seed=Brian" />
      <Avatar data-has-popup fallback="Re" src="https://api.dicebear.com/9.x/lorelei/svg?seed=Re" />
      <Avatar data-has-popup fallback="Ve" src="https://api.dicebear.com/9.x/lorelei/svg?seed=ve" />
      <Avatar data-has-popup initialLimit="4" classNames={{ fallback: "invert" }}>
        +99
      </Avatar>
    </Avatar.Group>
  );
}

function TextareaValidateJsonDemo() {
  const [error, setError] = React.useState<Error | null>(null);
  const defaultValue = `[
  {
    "userId": 1,
    "id": 1,
    "title": "quidem molestiae enim"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "sunt qui excepturi placeat culpa"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "omnis laborum odio"
  },
  {
    "userId": 1,
    "id": 4,
    "title": "non esse culpa molestiae omnis sed optio"
  },
  {
    "userId": 1,
    "id": 5,
    "title": "eaque aut omnis a"
  }
]`;
  return (
    <Stack className="mx-auto w-full max-w-xl">
      <Textarea validateJson formatOnBlur defaultValue={defaultValue} validationError="Invalid JSON" onValidationError={error => setError(error)} className="h-[380px] max-h-[380px] min-h-[380px] max-w-xl" placeholder="Enter JSON here, e.g. [{}]" />
      <Typography el="label" htmlFor="textarea-validatejson-demo" hidden={!error} className="-my-2 text-sm text-destructive">
        {error?.message}
      </Typography>
      <Typography prose="muted">Enter inline text in JSON format and blur from Textarea component to format the text.</Typography>
    </Stack>
  );
}

const showcaseVariant = cvx({
  variants: {
    box: {
      outer: "group/outer relative grid grid-flow-col size-full min-h-max items-center rounded-2xl border border-muted-foreground border-dashed [--p:0.75rem]",
      inner: "group/inner relative flex size-full items-center justify-center rounded-none bg-background/20 p-[--p] first-of-type:rounded-l-2xl last-of-type:rounded-r-2xl",
      copy: "pointer-events-none absolute -right-1.5 -top-1.5 z-[4] cursor-pointer rounded-md border border-muted-foreground border-dashed bg-background p-0.5 opacity-0 transition-opacity duration-300 group-hover/inner:pointer-events-auto group-hover/inner:opacity-100",
      hr: "absolute right-[-0.7px] z-[2] h-[calc(100%-(var(--p)*1))] w-px border-l border-dashed border-muted-foreground"
    }
  }
});

function CopyCode({ code, className }: { code: string | null | undefined; className?: string }) {
  if (!code) return null;
  return (
    <CopyButton timeout={1750} value={code?.trimEnd()}>
      {({ copied, copy }) => (
        <div tabIndex={-1} onClick={copy} className={cn(showcaseVariant({ box: "copy" }), className)}>
          <HasCopyIcon has={copied} />
        </div>
      )}
    </CopyButton>
  );
}

interface TileInnerProps extends React.ComponentProps<"div"> {
  contents?: Array<{ code?: string | null; content?: React.ReactNode }>;
  classNames?: Partial<Record<"outer" | "inner" | "hr", string>>;
}
function TileInner(_props: TileInnerProps) {
  const { className, children, contents, classNames, ...props } = _props;
  return (
    <div className={cn(showcaseVariant({ box: "outer" }), classNames?.outer, className)} {...props}>
      {children ??
        contents?.map((content, index) => (
          <div key={index} className={cn(showcaseVariant({ box: "inner" }), classNames?.inner)}>
            {content.content}
            {content?.code && <CopyCode code={content?.code} />}
            {index < contents?.length - 1 && <hr className={cn(showcaseVariant({ box: "hr" }), classNames?.hr)} />}
          </div>
        ))}
    </div>
  );
}

export function ShowCaseComponents() {
  return (
    <div className="mx-auto w-full max-w-7xl px-0 md:px-6 2xl:px-4">
      <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        <div className="col-span-2 p-1 max-2xl:-order-1 md:col-span-2 max-2xl:md:row-span-2 lg:col-span-3 2xl:col-span-4 2xl:row-span-2">
          <div className="relative z-10 w-fit text-start max-xl:pb-6 lg:-top-16 lg:max-h-32">
            <span className="text-sm text-muted-foreground">
              <b>Blocks.</b>
            </span>
            <h2 className="mt-6 scroll-m-20 text-balance bg-gradient-to-b text-[clamp(2rem,1rem+4vw,2.75rem)] font-bold leading-none">
              Take Control of Your UI, <br />
              One Component at a Time
            </h2>
            <p className="mb-4 mt-2 text-muted-foreground max-md:text-sm md:max-w-lg md:text-base 2xl:mb-12 2xl:mt-6 2xl:max-w-xl 2xl:text-xl">Explore modular, customizable building blocks for fully controlled, scalable applications.</p>
            <Link href="/docs/web/components" className={cn(buttonVariants({ variant: "outline" }), "group w-fit gap-2.5 pr-2")}>
              More
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-1 md:col-start-2 lg:col-span-1 lg:col-start-2 lg:row-span-2 2xl:col-start-3 2xl:row-start-[0]">
          <TileInner contents={[{ code: codes.rating, content: <Rating size={28} color="#fab005" fractions={4} defaultValue={3.75} /> }]} classNames={{ inner: "p-0" }} />
        </div>

        <div className="p-1 lg:col-span-1 lg:col-start-3 lg:row-span-2 2xl:col-start-4 2xl:row-start-[0]">
          <TileInner contents={[{ code: codes.tabsVertical, content: <TabsVerticalDemos /> }]} classNames={{ inner: "p-0" }} />
        </div>

        <div className="col-span-2 p-1 max-2xl:-order-1 md:col-span-1 max-2xl:md:col-start-3 max-2xl:md:row-span-1 max-2xl:md:row-start-2 max-2xl:lg:col-start-4 2xl:col-span-2 2xl:col-start-5 2xl:row-span-1 2xl:row-start-2">
          <TileInner contents={[{ code: codes.password, content: <Input.Password /> }]} />
        </div>

        <div className="p-1 lg:col-start-4 2xl:col-span-1 2xl:col-start-5">
          <TileInner contents={[{ code: codes.avatarGroup, content: <AvatarGroupDemos /> }]} classNames={{ inner: "p-0 py-[--p]" }} />
        </div>

        <div className="p-1 max-2xl:lg:col-start-4">
          <TileInner
            contents={[
              {
                code: codes.avatarWithIndicator,
                content: (
                  <Indicator size={12} offset={4} color="#fab005" processing withBorder>
                    <Avatar fallback="Jack" color="hsl(var(--color))" classNames={{ root: "cursor-pointer", fallback: "[--avatar-text-color:hsl(var(--background))]" }} />
                  </Indicator>
                )
              },
              { code: codes.dropdownNotification, content: <DropdownNotifications /> }
            ]}
          />
        </div>

        <div className="p-1 2xl:col-span-1 2xl:col-start-5">
          <TileInner
            contents={[
              { code: codes.checkerSwitch, content: <CheckerSwitchDemos /> },
              { code: codes.checkerCheckbox, content: <CheckerCheckboxDemos /> }
            ]}
          />
        </div>

        <div className="p-1">
          <TileInner
            contents={[
              { code: codes.loaderBuffer, content: <Loader variant="buffer" color="hsl(var(--color))" size={32} /> },
              { code: codes.loaderDots, content: <Loader variant="dots" color="hsl(var(--color))" size={32} /> }
            ]}
          />
        </div>

        <div className="col-span-2 p-1 md:col-span-2 2xl:col-start-1 2xl:col-end-3">
          <TileInner contents={[{ code: codes.progress, content: <ProgressDemo animated /> }]} />
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-2 2xl:col-span-2">
          <TileInner contents={[{ code: codes.slider, content: <SliderConfiguratorDemo displayOnValueChange={false} labelAlwaysOn marks={[]} /> }]}></TileInner>
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-2 2xl:col-span-2 2xl:col-end-7">
          <TileInner>
            <div className={cn(showcaseVariant({ box: "inner" }), "overflow-x-auto")}>
              <BreadcrumbDemos />
            </div>
            <CopyCode code={codes.breadcrumb} className="group-hover/outer:pointer-events-auto group-hover/outer:opacity-100" />
          </TileInner>
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-2 2xl:col-span-3">
          <TileInner contents={[{ code: codes.textarea, content: <TextareaValidateJsonDemo /> }]} />
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-2 2xl:col-span-3">
          <TileInner contents={[{ code: codes.timeline, content: <TimelineConfiguratorDemo /> }]} classNames={{ inner: "pt-[18px]" }} />
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-3 2xl:col-span-4">
          <TileInner>
            <div className={cn(showcaseVariant({ box: "inner" }), "overflow-x-auto")}>
              <TableDemo />
            </div>
            <CopyCode code={codes.table} className="group-hover/outer:pointer-events-auto group-hover/outer:opacity-100" />
          </TileInner>
        </div>

        <div className="col-span-2 p-1 md:col-span-3 lg:col-span-1 2xl:col-span-2">
          <TileInner classNames={{ inner: "pt-[18px]" }}>
            <div className={cn(showcaseVariant({ box: "inner" }), "overflow-x-auto")}>
              <CommandDemo />
            </div>
            <CopyCode code={codes.command} className="group-hover/outer:pointer-events-auto group-hover/outer:opacity-100" />
          </TileInner>
        </div>
      </div>
    </div>
  );
}

function FeaturesList({ features }: { features: { title?: string; slug?: string; image?: string; notes?: string }[] | null }) {
  if (!features?.length) {
    return null;
  }
  return (
    <div className="relative mb-12 mt-16 grid overflow-hidden rounded-xl border bg-background text-muted-foreground opacity-80 [background-image:repeating-radial-gradient(circle_at_0_0,transparent_0,hsl(var(--background))_10px),repeating-linear-gradient(hsl(var(--color)/0.08),hsl(var(--muted)/0.75))] sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
      {features.map((i, index) => (
        <div key={index} className="group relative cursor-default transition">
          <div className="relative space-y-4 px-6 py-8">
            <svg width="64" height="64" className="size-10 text-color" onContextMenu={e => e.preventDefault()}>
              <use href={i.image} />
            </svg>

            <div className="space-y-1">
              {i?.title && <h5 className="font-semibold text-color transition text-h6">{i.title}</h5>}
              {i?.notes && <p className="text-xs text-muted-foreground md:text-sm 2xl:text-base">{i.notes}</p>}
            </div>
            {i?.slug && (
              <Link href={i.slug} className="!sr-only !hidden items-center justify-start gap-4 rounded-sm group-hover:text-color">
                <span className="text-sm">Read</span>
                <ArrowsSquareIcon square={false} arrow="right" className="size-6 -translate-x-4 flex-row-reverse text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const links = [
  {
    title: "Started",
    target: "_self",
    icon: BookOpenIcon,
    url: "/docs"
  },
  {
    title: "Repo",
    target: "_blank",
    icon: BrandGithubFillIcon,
    url: "https://github.com/ilkhoeri/ui/tree/master/resource/docs"
  }
];

const features = [
  {
    title: "Snappy",
    slug: "#",
    image: "/images/icons.svg#clock-alt-2",
    notes: "The effectiveness of time in building and adjusting the needs during development."
  },
  {
    title: "Scalable",
    slug: "#",
    image: "/images/icons.svg#draw-compass",
    notes: "Consider the effectiveness of code structure to maintainComponentflexibility."
  },
  {
    title: "Enchant",
    slug: "#",
    image: "/images/icons.svg#forest",
    notes: "The structure of rich components is modeled effectively for rapid comprehension."
  },
  {
    title: "Customizable",
    slug: "#",
    image: "/images/icons.svg#pantone-2",
    notes: "Editable content according to the requirements of the styleComponentstructure."
  }
];
