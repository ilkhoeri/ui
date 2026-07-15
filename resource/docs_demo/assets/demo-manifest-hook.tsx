// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.

// script: bun run generated:generated-files-demos

import { DemoSlot } from "@/resource/docs_demo/assets/demo-slot";
import { UseClickOutsideDemos } from "@/resource/demos/web/hooks/use-click-outside";
import { UseClipboardDemos } from "@/resource/demos/web/hooks/use-clipboard";
import { UseDeviceInfoDemos } from "@/resource/demos/web/hooks/use-device-info";
import { UseDirectionDemos } from "@/resource/demos/web/hooks/use-direction";
import { UseDocumentTitleDemos } from "@/resource/demos/web/hooks/use-document-title";
import { UseElementInfoDemos } from "@/resource/demos/web/hooks/use-element-info";
import { UseEyeDropperDemos } from "@/resource/demos/web/hooks/use-eye-dropper";
import { UseFetchDemos } from "@/resource/demos/web/hooks/use-fetch";
import { UseFullscreenDemos } from "@/resource/demos/web/hooks/use-fullscreen";
import { UseGeoLocationDemos } from "@/resource/demos/web/hooks/use-geo-location";
import { UseHotkeysDemos } from "@/resource/demos/web/hooks/use-hotkeys";
import { UseHoverDemos } from "@/resource/demos/web/hooks/use-hover";
import { UseImagePopupDemos } from "@/resource/demos/web/hooks/use-image-popup";
import { UseMeasureScrollbarDemos } from "@/resource/demos/web/hooks/use-measure-scrollbar";
import { UseMoveDemos } from "@/resource/demos/web/hooks/use-move";
import { UseNetworkDemos } from "@/resource/demos/web/hooks/use-network";
import { UseOpenStateDemos } from "@/resource/demos/web/hooks/use-open-state";
import { UseOrientationDemos } from "@/resource/demos/web/hooks/use-orientation";
import { UseOsDemos } from "@/resource/demos/web/hooks/use-os";
import { UsePwaInstallerDemos } from "@/resource/demos/web/hooks/use-pwa-installer";
import { UseRandomColorsDemos } from "@/resource/demos/web/hooks/use-random-colors";
import { UseReloadDemos } from "@/resource/demos/web/hooks/use-reload";
import { UseTriggerDemos } from "@/resource/demos/web/hooks/use-trigger";
import { UseWindowScrollDemos } from "@/resource/demos/web/hooks/use-window-scroll";

export type ConstructorWebHooksDemos =
  | ["use-click-outside", typeof UseClickOutsideDemos]
  | ["use-clipboard", typeof UseClipboardDemos]
  | ["use-device-info", typeof UseDeviceInfoDemos]
  | ["use-direction", typeof UseDirectionDemos]
  | ["use-document-title", typeof UseDocumentTitleDemos]
  | ["use-element-info", typeof UseElementInfoDemos]
  | ["use-eye-dropper", typeof UseEyeDropperDemos]
  | ["use-fetch", typeof UseFetchDemos]
  | ["use-fullscreen", typeof UseFullscreenDemos]
  | ["use-geo-location", typeof UseGeoLocationDemos]
  | ["use-hotkeys", typeof UseHotkeysDemos]
  | ["use-hover", typeof UseHoverDemos]
  | ["use-image-popup", typeof UseImagePopupDemos]
  | ["use-measure-scrollbar", typeof UseMeasureScrollbarDemos]
  | ["use-move", typeof UseMoveDemos]
  | ["use-network", typeof UseNetworkDemos]
  | ["use-open-state", typeof UseOpenStateDemos]
  | ["use-orientation", typeof UseOrientationDemos]
  | ["use-os", typeof UseOsDemos]
  | ["use-pwa-installer", typeof UsePwaInstallerDemos]
  | ["use-random-colors", typeof UseRandomColorsDemos]
  | ["use-reload", typeof UseReloadDemos]
  | ["use-trigger", typeof UseTriggerDemos]
  | ["use-window-scroll", typeof UseWindowScrollDemos];

export type ConstructorKeys<U extends [string, unknown]> = {
  [K in U as K[0]]: `${K[0]}-${Extract<keyof K[1], string>}`;
}[U[0]];

export type DocsDemoEntries = ConstructorKeys<ConstructorWebHooksDemos>;

export const demosMap = {
  "use-click-outside": UseClickOutsideDemos,
  "use-clipboard": UseClipboardDemos,
  "use-device-info": UseDeviceInfoDemos,
  "use-direction": UseDirectionDemos,
  "use-document-title": UseDocumentTitleDemos,
  "use-element-info": UseElementInfoDemos,
  "use-eye-dropper": UseEyeDropperDemos,
  "use-fetch": UseFetchDemos,
  "use-fullscreen": UseFullscreenDemos,
  "use-geo-location": UseGeoLocationDemos,
  "use-hotkeys": UseHotkeysDemos,
  "use-hover": UseHoverDemos,
  "use-image-popup": UseImagePopupDemos,
  "use-measure-scrollbar": UseMeasureScrollbarDemos,
  "use-move": UseMoveDemos,
  "use-network": UseNetworkDemos,
  "use-open-state": UseOpenStateDemos,
  "use-orientation": UseOrientationDemos,
  "use-os": UseOsDemos,
  "use-pwa-installer": UsePwaInstallerDemos,
  "use-random-colors": UseRandomColorsDemos,
  "use-reload": UseReloadDemos,
  "use-trigger": UseTriggerDemos,
  "use-window-scroll": UseWindowScrollDemos
} as const;

export const demoHooksEntries = {
  UseClickOutsideDemosUsage: () => <DemoSlot data={UseClickOutsideDemos.usage} />,
  UseClipboardDemosUsage: () => <DemoSlot data={UseClipboardDemos.usage} />,
  UseDeviceInfoDemosUsage: () => <DemoSlot data={UseDeviceInfoDemos.usage} />,
  UseDirectionDemosUsage: () => <DemoSlot data={UseDirectionDemos.usage} />,
  UseDocumentTitleDemosUsage: () => <DemoSlot data={UseDocumentTitleDemos.usage} />,
  UseElementInfoDemosUsage: () => <DemoSlot data={UseElementInfoDemos.usage} />,
  UseEyeDropperDemosUsage: () => <DemoSlot data={UseEyeDropperDemos.usage} />,
  UseFetchDemosUsage: () => <DemoSlot data={UseFetchDemos.usage} />,
  UseFullscreenDemosUsage: () => <DemoSlot data={UseFullscreenDemos.usage} />,
  UseFullscreenDemosWithRefUsage: () => <DemoSlot data={UseFullscreenDemos.withRefUsage} />,
  UseGeoLocationDemosUsage: () => <DemoSlot data={UseGeoLocationDemos.usage} />,
  UseHotkeysDemosUsage: () => <DemoSlot data={UseHotkeysDemos.usage} />,
  UseHoverDemosUsage: () => <DemoSlot data={UseHoverDemos.usage} />,
  UseImagePopupDemosUsage: () => <DemoSlot data={UseImagePopupDemos.usage} />,
  UseMeasureScrollbarDemosUsage: () => <DemoSlot data={UseMeasureScrollbarDemos.usage} />,
  UseMoveDemosUsage: () => <DemoSlot data={UseMoveDemos.usage} />,
  UseNetworkDemosUsage: () => <DemoSlot data={UseNetworkDemos.usage} />,
  UseOpenStateDemosUsage: () => <DemoSlot data={UseOpenStateDemos.usage} />,
  UseOpenStateDemosUsageTooltip: () => <DemoSlot data={UseOpenStateDemos.usageTooltip} />,
  UseOrientationDemosUsage: () => <DemoSlot data={UseOrientationDemos.usage} />,
  UseOsDemosUsage: () => <DemoSlot data={UseOsDemos.usage} />,
  UsePwaInstallerDemosUsage: () => <DemoSlot data={UsePwaInstallerDemos.usage} />,
  UseRandomColorsDemosUsage: () => <DemoSlot data={UseRandomColorsDemos.usage} />,
  UseReloadDemosUsage: () => <DemoSlot data={UseReloadDemos.usage} />,
  UseReloadDemosReloadWindow: () => <DemoSlot data={UseReloadDemos.reloadWindow} />,
  UseTriggerDemosUsage: () => <DemoSlot data={UseTriggerDemos.usage} />,
  UseWindowScrollDemosUsage: () => <DemoSlot data={UseWindowScrollDemos.usage} />
} as const;