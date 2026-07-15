// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.

import { AnchorDemos } from "@/resource/demos/web/components/anchor";
import { AvatarDemos } from "@/resource/demos/web/components/avatar";
import { BreadcrumbDemos } from "@/resource/demos/web/components/breadcrumb";
import { BurgerDemos } from "@/resource/demos/web/components/burger";
import { ButtonDemos } from "@/resource/demos/web/components/button";
import { CardDemos } from "@/resource/demos/web/components/card";
import { CarouselDemos } from "@/resource/demos/web/components/carousel";
import { CheckerDemos } from "@/resource/demos/web/components/checker";
import { CodeDemos } from "@/resource/demos/web/components/code";
import { ColorPickerDemos } from "@/resource/demos/web/components/color-picker";
import { CommandDemos } from "@/resource/demos/web/components/command";
import { ConfettiDemos } from "@/resource/demos/web/components/confetti";
import { CopyButtonDemos } from "@/resource/demos/web/components/copy-button";
import { DoubleHelixWordsDemos } from "@/resource/demos/web/components/double-helix-words";
import { FloatingIndicatorDemos } from "@/resource/demos/web/components/floating-indicator";
import { GroupDemos } from "@/resource/demos/web/components/group";
import { HighlightDemos } from "@/resource/demos/web/components/highlight";
import { IndicatorDemos } from "@/resource/demos/web/components/indicator";
import { InputDemos } from "@/resource/demos/web/components/input";
import { KbdDemos } from "@/resource/demos/web/components/kbd";
import { LabelDemos } from "@/resource/demos/web/components/label";
import { LoaderDemos } from "@/resource/demos/web/components/loader";
import { PaginationDemos } from "@/resource/demos/web/components/pagination";
import { PasswordRequirementDemos } from "@/resource/demos/web/components/password-requirement";
import { PolymorphicSlotDemos } from "@/resource/demos/web/components/polymorphic-slot";
import { ProgressDemos } from "@/resource/demos/web/components/progress";
import { ProseDemos } from "@/resource/demos/web/components/prose";
import { RatingDemos } from "@/resource/demos/web/components/rating";
import { RunningAreaDemos } from "@/resource/demos/web/components/running-area";
import { ScrollAreaDemos } from "@/resource/demos/web/components/scroll-area";
import { SheetsDemos } from "@/resource/demos/web/components/sheets";
import { SkeletonDemos } from "@/resource/demos/web/components/skeleton";
import { SliderDemos } from "@/resource/demos/web/components/slider";
import { StackDemos } from "@/resource/demos/web/components/stack";
import { SvgDemos } from "@/resource/demos/web/components/svg";
import { TableDemos } from "@/resource/demos/web/components/table";
import { TabsDemos } from "@/resource/demos/web/components/tabs";
import { TextareaDemos } from "@/resource/demos/web/components/textarea";
import { TimelineDemos } from "@/resource/demos/web/components/timeline";
import { TimesDemos } from "@/resource/demos/web/components/times";
import { ToasterDemos } from "@/resource/demos/web/components/toaster";
import { TooltipDemos } from "@/resource/demos/web/components/tooltip";
import { TypingWordsDemos } from "@/resource/demos/web/components/typing-words";
import { TypographyDemos } from "@/resource/demos/web/components/typography";

export type ConstructorWebComponentDemos =
  | ["anchor", typeof AnchorDemos]
  | ["avatar", typeof AvatarDemos]
  | ["breadcrumb", typeof BreadcrumbDemos]
  | ["burger", typeof BurgerDemos]
  | ["button", typeof ButtonDemos]
  | ["card", typeof CardDemos]
  | ["carousel", typeof CarouselDemos]
  | ["checker", typeof CheckerDemos]
  | ["code", typeof CodeDemos]
  | ["color-picker", typeof ColorPickerDemos]
  | ["command", typeof CommandDemos]
  | ["confetti", typeof ConfettiDemos]
  | ["copy-button", typeof CopyButtonDemos]
  | ["double-helix-words", typeof DoubleHelixWordsDemos]
  | ["floating-indicator", typeof FloatingIndicatorDemos]
  | ["group", typeof GroupDemos]
  | ["highlight", typeof HighlightDemos]
  | ["indicator", typeof IndicatorDemos]
  | ["input", typeof InputDemos]
  | ["kbd", typeof KbdDemos]
  | ["label", typeof LabelDemos]
  | ["loader", typeof LoaderDemos]
  | ["pagination", typeof PaginationDemos]
  | ["password-requirement", typeof PasswordRequirementDemos]
  | ["polymorphic-slot", typeof PolymorphicSlotDemos]
  | ["progress", typeof ProgressDemos]
  | ["prose", typeof ProseDemos]
  | ["rating", typeof RatingDemos]
  | ["running-area", typeof RunningAreaDemos]
  | ["scroll-area", typeof ScrollAreaDemos]
  | ["sheets", typeof SheetsDemos]
  | ["skeleton", typeof SkeletonDemos]
  | ["slider", typeof SliderDemos]
  | ["stack", typeof StackDemos]
  | ["svg", typeof SvgDemos]
  | ["table", typeof TableDemos]
  | ["tabs", typeof TabsDemos]
  | ["textarea", typeof TextareaDemos]
  | ["timeline", typeof TimelineDemos]
  | ["times", typeof TimesDemos]
  | ["toaster", typeof ToasterDemos]
  | ["tooltip", typeof TooltipDemos]
  | ["typing-words", typeof TypingWordsDemos]
  | ["typography", typeof TypographyDemos];

export type ConstructorKeys<U extends [string, unknown]> = {
  [K in U as K[0]]: `${K[0]}-${Extract<keyof K[1], string>}`;
}[U[0]];

export type DocsDemoEntries = ConstructorKeys<ConstructorWebComponentDemos>;

export const demosMap = {
  anchor: AnchorDemos,
  avatar: AvatarDemos,
  breadcrumb: BreadcrumbDemos,
  burger: BurgerDemos,
  button: ButtonDemos,
  card: CardDemos,
  carousel: CarouselDemos,
  checker: CheckerDemos,
  code: CodeDemos,
  "color-picker": ColorPickerDemos,
  command: CommandDemos,
  confetti: ConfettiDemos,
  "copy-button": CopyButtonDemos,
  "double-helix-words": DoubleHelixWordsDemos,
  "floating-indicator": FloatingIndicatorDemos,
  group: GroupDemos,
  highlight: HighlightDemos,
  indicator: IndicatorDemos,
  input: InputDemos,
  kbd: KbdDemos,
  label: LabelDemos,
  loader: LoaderDemos,
  pagination: PaginationDemos,
  "password-requirement": PasswordRequirementDemos,
  "polymorphic-slot": PolymorphicSlotDemos,
  progress: ProgressDemos,
  prose: ProseDemos,
  rating: RatingDemos,
  "running-area": RunningAreaDemos,
  "scroll-area": ScrollAreaDemos,
  sheets: SheetsDemos,
  skeleton: SkeletonDemos,
  slider: SliderDemos,
  stack: StackDemos,
  svg: SvgDemos,
  table: TableDemos,
  tabs: TabsDemos,
  textarea: TextareaDemos,
  timeline: TimelineDemos,
  times: TimesDemos,
  toaster: ToasterDemos,
  tooltip: TooltipDemos,
  "typing-words": TypingWordsDemos,
  typography: TypographyDemos
} as const;
