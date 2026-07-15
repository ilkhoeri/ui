// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.

// script: bun run generated:generated-files-demos

import { DemoSlot } from "@/resource/docs_demo/assets/demo-slot";
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

export type ConstructorWebComponentsDemos =
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

export type DocsDemoEntries = ConstructorKeys<ConstructorWebComponentsDemos>;

export const demosMap = {
  "anchor": AnchorDemos,
  "avatar": AvatarDemos,
  "breadcrumb": BreadcrumbDemos,
  "burger": BurgerDemos,
  "button": ButtonDemos,
  "card": CardDemos,
  "carousel": CarouselDemos,
  "checker": CheckerDemos,
  "code": CodeDemos,
  "color-picker": ColorPickerDemos,
  "command": CommandDemos,
  "confetti": ConfettiDemos,
  "copy-button": CopyButtonDemos,
  "double-helix-words": DoubleHelixWordsDemos,
  "floating-indicator": FloatingIndicatorDemos,
  "group": GroupDemos,
  "highlight": HighlightDemos,
  "indicator": IndicatorDemos,
  "input": InputDemos,
  "kbd": KbdDemos,
  "label": LabelDemos,
  "loader": LoaderDemos,
  "pagination": PaginationDemos,
  "password-requirement": PasswordRequirementDemos,
  "polymorphic-slot": PolymorphicSlotDemos,
  "progress": ProgressDemos,
  "prose": ProseDemos,
  "rating": RatingDemos,
  "running-area": RunningAreaDemos,
  "scroll-area": ScrollAreaDemos,
  "sheets": SheetsDemos,
  "skeleton": SkeletonDemos,
  "slider": SliderDemos,
  "stack": StackDemos,
  "svg": SvgDemos,
  "table": TableDemos,
  "tabs": TabsDemos,
  "textarea": TextareaDemos,
  "timeline": TimelineDemos,
  "times": TimesDemos,
  "toaster": ToasterDemos,
  "tooltip": TooltipDemos,
  "typing-words": TypingWordsDemos,
  "typography": TypographyDemos
} as const;

export const demoComponentsEntries = {
  AnchorDemosUsage: () => <DemoSlot data={AnchorDemos.usage} />,
  AnchorDemosConfigurator: () => <DemoSlot data={AnchorDemos.configurator} />,
  AnchorDemosDecoration: () => <DemoSlot data={AnchorDemos.decoration} />,
  AnchorDemosButtonVariant: () => <DemoSlot data={AnchorDemos.buttonVariant} />,
  AvatarDemosUsage: () => <DemoSlot data={AvatarDemos.usage} />,
  AvatarDemosConfigurator: () => <DemoSlot data={AvatarDemos.configurator} />,
  AvatarDemosGroup: () => <DemoSlot data={AvatarDemos.group} />,
  BreadcrumbDemosUsage: () => <DemoSlot data={BreadcrumbDemos.usage} />,
  BreadcrumbDemosConfigurator: () => <DemoSlot data={BreadcrumbDemos.configurator} />,
  BreadcrumbDemosChangeSeparator: () => <DemoSlot data={BreadcrumbDemos.changeSeparator} />,
  BurgerDemosUsage: () => <DemoSlot data={BurgerDemos.usage} />,
  BurgerDemosConfigurator: () => <DemoSlot data={BurgerDemos.configurator} />,
  ButtonDemosUsage: () => <DemoSlot data={ButtonDemos.usage} />,
  ButtonDemosConfigurator: () => <DemoSlot data={ButtonDemos.configurator} />,
  ButtonDemosUnstyled: () => <DemoSlot data={ButtonDemos.unstyled} />,
  CardDemosUsage: () => <DemoSlot data={CardDemos.usage} />,
  CarouselDemosUsage: () => <DemoSlot data={CarouselDemos.usage} />,
  CarouselDemosConfigurator: () => <DemoSlot data={CarouselDemos.configurator} />,
  CarouselDemosConfiguratorHook: () => <DemoSlot data={CarouselDemos.configuratorHook} />,
  CarouselDemosAutoScrollPlugins: () => <DemoSlot data={CarouselDemos.autoScrollPlugins} />,
  CarouselDemosAutoplayPlugins: () => <DemoSlot data={CarouselDemos.autoplayPlugins} />,
  CheckerDemosUsage: () => <DemoSlot data={CheckerDemos.usage} />,
  CheckerDemosConfigurator: () => <DemoSlot data={CheckerDemos.configurator} />,
  CheckerDemosChangeIconLabels: () => <DemoSlot data={CheckerDemos.changeIconLabels} />,
  CheckerDemosChangeThumbIcon: () => <DemoSlot data={CheckerDemos.changeThumbIcon} />,
  CheckerDemosGroup: () => <DemoSlot data={CheckerDemos.group} />,
  CheckerDemosGroupCard: () => <DemoSlot data={CheckerDemos.groupCard} />,
  CheckerDemosCurrentSelected: () => <DemoSlot data={CheckerDemos.currentSelected} />,
  CheckerDemosMultipleSelected: () => <DemoSlot data={CheckerDemos.multipleSelected} />,
  CheckerDemosIndeterminate: () => <DemoSlot data={CheckerDemos.indeterminate} />,
  CodeDemosUsage: () => <DemoSlot data={CodeDemos.usage} />,
  CodeDemosConfigurator: () => <DemoSlot data={CodeDemos.configurator} />,
  ColorPickerDemosUsage: () => <DemoSlot data={ColorPickerDemos.usage} />,
  ColorPickerDemosConfigurator: () => <DemoSlot data={ColorPickerDemos.configurator} />,
  CommandDemosUsage: () => <DemoSlot data={CommandDemos.usage} />,
  CommandDemosConfigurator: () => <DemoSlot data={CommandDemos.configurator} />,
  CommandDemosDataTypesSingle: () => <DemoSlot data={CommandDemos.dataTypesSingle} />,
  CommandDemosDataTypesGroup: () => <DemoSlot data={CommandDemos.dataTypesGroup} />,
  CommandDemosMultipleCommand: () => <DemoSlot data={CommandDemos.multipleCommand} />,
  ConfettiDemosUsage: () => <DemoSlot data={ConfettiDemos.usage} />,
  ConfettiDemosConfigurator: () => <DemoSlot data={ConfettiDemos.configurator} />,
  CopyButtonDemosUsage: () => <DemoSlot data={CopyButtonDemos.usage} />,
  CopyButtonDemosConfigurator: () => <DemoSlot data={CopyButtonDemos.configurator} />,
  DoubleHelixWordsDemosUsage: () => <DemoSlot data={DoubleHelixWordsDemos.usage} />,
  DoubleHelixWordsDemosConfigurator: () => <DemoSlot data={DoubleHelixWordsDemos.configurator} />,
  FloatingIndicatorDemosUsage: () => <DemoSlot data={FloatingIndicatorDemos.usage} />,
  FloatingIndicatorDemosConfigurator: () => <DemoSlot data={FloatingIndicatorDemos.configurator} />,
  GroupDemosUsage: () => <DemoSlot data={GroupDemos.usage} />,
  GroupDemosConfigurator: () => <DemoSlot data={GroupDemos.configurator} />,
  HighlightDemosUsage: () => <DemoSlot data={HighlightDemos.usage} />,
  HighlightDemosConfigurator: () => <DemoSlot data={HighlightDemos.configurator} />,
  IndicatorDemosUsage: () => <DemoSlot data={IndicatorDemos.usage} />,
  IndicatorDemosConfigurator: () => <DemoSlot data={IndicatorDemos.configurator} />,
  InputDemosConfigurator: () => <DemoSlot data={InputDemos.configurator} />,
  InputDemosPassword: () => <DemoSlot data={InputDemos.password} />,
  InputDemosWrapperAndConfigurator: () => <DemoSlot data={InputDemos.wrapperAndConfigurator} />,
  InputDemosCheckboxUsage: () => <DemoSlot data={InputDemos.checkboxUsage} />,
  InputDemosCheckboxIndeterminate: () => <DemoSlot data={InputDemos.checkboxIndeterminate} />,
  KbdDemosUsage: () => <DemoSlot data={KbdDemos.usage} />,
  KbdDemosConfigurator: () => <DemoSlot data={KbdDemos.configurator} />,
  LabelDemosUsage: () => <DemoSlot data={LabelDemos.usage} />,
  LoaderDemosUsage: () => <DemoSlot data={LoaderDemos.usage} />,
  LoaderDemosConfigurator: () => <DemoSlot data={LoaderDemos.configurator} />,
  PaginationDemosUsage: () => <DemoSlot data={PaginationDemos.usage} />,
  PaginationDemosConfigurator: () => <DemoSlot data={PaginationDemos.configurator} />,
  PaginationDemosAsLink: () => <DemoSlot data={PaginationDemos.asLink} />,
  PaginationDemosChangeIcon: () => <DemoSlot data={PaginationDemos.changeIcon} />,
  PaginationDemosWithChunk: () => <DemoSlot data={PaginationDemos.withChunk} />,
  PasswordRequirementDemosUsage: () => <DemoSlot data={PasswordRequirementDemos.usage} />,
  PasswordRequirementDemosConfigurator: () => <DemoSlot data={PasswordRequirementDemos.configurator} />,
  PolymorphicSlotDemosUsage: () => <DemoSlot data={PolymorphicSlotDemos.usage} />,
  PolymorphicSlotDemosConfigurator: () => <DemoSlot data={PolymorphicSlotDemos.configurator} />,
  ProgressDemosUsage: () => <DemoSlot data={ProgressDemos.usage} />,
  ProgressDemosConfigurator: () => <DemoSlot data={ProgressDemos.configurator} />,
  ProseDemosUsage: () => <DemoSlot data={ProseDemos.usage} />,
  ProseDemosBlockquoteUsage: () => <DemoSlot data={ProseDemos.blockquoteUsage} />,
  ProseDemosListUsage: () => <DemoSlot data={ProseDemos.listUsage} />,
  ProseDemosListInsideUsage: () => <DemoSlot data={ProseDemos.listInsideUsage} />,
  ProseDemosTableUsage: () => <DemoSlot data={ProseDemos.tableUsage} />,
  ProseDemosConfigurator: () => <DemoSlot data={ProseDemos.configurator} />,
  RatingDemosUsage: () => <DemoSlot data={RatingDemos.usage} />,
  RatingDemosConfigurator: () => <DemoSlot data={RatingDemos.configurator} />,
  RatingDemosCustomSymbol: () => <DemoSlot data={RatingDemos.customSymbol} />,
  RatingDemosCustomFractions: () => <DemoSlot data={RatingDemos.customFractions} />,
  RunningAreaDemosUsage: () => <DemoSlot data={RunningAreaDemos.usage} />,
  RunningAreaDemosConfigurator: () => <DemoSlot data={RunningAreaDemos.configurator} />,
  ScrollAreaDemosUsage: () => <DemoSlot data={ScrollAreaDemos.usage} />,
  ScrollAreaDemosConfigurator: () => <DemoSlot data={ScrollAreaDemos.configurator} />,
  SheetsDemosAccordion: () => <DemoSlot data={SheetsDemos.accordion} />,
  SheetsDemosCollapsible: () => <DemoSlot data={SheetsDemos.collapsible} />,
  SheetsDemosCollapsible2: () => <DemoSlot data={SheetsDemos.collapsible2} />,
  SheetsDemosDialog: () => <DemoSlot data={SheetsDemos.dialog} />,
  SheetsDemosDialogNested: () => <DemoSlot data={SheetsDemos.dialogNested} />,
  SheetsDemosDrawer: () => <DemoSlot data={SheetsDemos.drawer} />,
  SheetsDemosDrawerNested: () => <DemoSlot data={SheetsDemos.drawerNested} />,
  SheetsDemosDropdown: () => <DemoSlot data={SheetsDemos.dropdown} />,
  SheetsDemosDropdownNested: () => <DemoSlot data={SheetsDemos.dropdownNested} />,
  SkeletonDemosUsage: () => <DemoSlot data={SkeletonDemos.usage} />,
  SkeletonDemosConfigurator: () => <DemoSlot data={SkeletonDemos.configurator} />,
  SliderDemosUsage: () => <DemoSlot data={SliderDemos.usage} />,
  SliderDemosConfigurator: () => <DemoSlot data={SliderDemos.configurator} />,
  SliderDemosInverted: () => <DemoSlot data={SliderDemos.inverted} />,
  SliderDemosLabel: () => <DemoSlot data={SliderDemos.label} />,
  SliderDemosMarks: () => <DemoSlot data={SliderDemos.marks} />,
  SliderDemosScale: () => <DemoSlot data={SliderDemos.scale} />,
  SliderDemosStep: () => <DemoSlot data={SliderDemos.step} />,
  SliderDemosThumb: () => <DemoSlot data={SliderDemos.thumb} />,
  StackDemosUsage: () => <DemoSlot data={StackDemos.usage} />,
  StackDemosConfigurator: () => <DemoSlot data={StackDemos.configurator} />,
  SvgDemosUsage: () => <DemoSlot data={SvgDemos.usage} />,
  SvgDemosConfigurator: () => <DemoSlot data={SvgDemos.configurator} />,
  TableDemosUsage: () => <DemoSlot data={TableDemos.usage} />,
  TableDemosConfigurator: () => <DemoSlot data={TableDemos.configurator} />,
  TabsDemosUsage: () => <DemoSlot data={TabsDemos.usage} />,
  TabsDemosConfigurator: () => <DemoSlot data={TabsDemos.configurator} />,
  TabsDemosPosition: () => <DemoSlot data={TabsDemos.position} />,
  TabsDemosCustom1: () => <DemoSlot data={TabsDemos.custom1} />,
  TextareaDemosUsage: () => <DemoSlot data={TextareaDemos.usage} />,
  TextareaDemosValidateJson: () => <DemoSlot data={TextareaDemos.validateJson} />,
  TimelineDemosUsage: () => <DemoSlot data={TimelineDemos.usage} />,
  TimelineDemosConfigurator: () => <DemoSlot data={TimelineDemos.configurator} />,
  TimesDemosUsage: () => <DemoSlot data={TimesDemos.usage} />,
  TimesDemosConfigurator: () => <DemoSlot data={TimesDemos.configurator} />,
  ToasterDemosUsage: () => <DemoSlot data={ToasterDemos.usage} />,
  ToasterDemosConfigurator: () => <DemoSlot data={ToasterDemos.configurator} />,
  ToasterDemosConfiguratorChain: () => <DemoSlot data={ToasterDemos.configuratorChain} />,
  TooltipDemosUsage: () => <DemoSlot data={TooltipDemos.usage} />,
  TooltipDemosConfigurator: () => <DemoSlot data={TooltipDemos.configurator} />,
  TooltipDemosInline: () => <DemoSlot data={TooltipDemos.inline} />,
  TypingWordsDemosUsage: () => <DemoSlot data={TypingWordsDemos.usage} />,
  TypingWordsDemosConfigurator: () => <DemoSlot data={TypingWordsDemos.configurator} />,
  TypographyDemosUsage: () => <DemoSlot data={TypographyDemos.usage} />,
  TypographyDemosConfigurator: () => <DemoSlot data={TypographyDemos.configurator} />
} as const;