"use client";
import * as Icons from "@/icons/*";
import { useState } from "react";
import { useIsomorphicEffect } from "./use-isomorphic-effect";
import { SvgProps } from "@/ui/svg";

interface OSInfo {
  name: string;
  icon(props: SvgProps): React.JSX.Element;
}

const detectorsBrowser = [
  { regex: /msie|trident/i, name: "Internet Explorer", icon: Icons.WorldIcon },
  { regex: /edg/i, name: "Edge", icon: Icons.BrandEdgeIcon },
  { regex: /opr\/|opera/i, name: "Opera", icon: Icons.BrandOperaIcon },
  { regex: /chrome|chromium|crios/i, name: "Chrome", icon: Icons.BrandChromeIcon },
  { regex: /firefox|fxios/i, name: "Firefox", icon: Icons.BrandFirefoxIcon }
];
const detectorsOS = [
  { regex: /iPad/i, name: "iPad", icon: Icons.DeviceTabletIcon },
  { regex: /(Macintosh|Mac OS|MacIntel|MacPPC|Mac68K)/i, name: "Mac OS", icon: Icons.BrandMacOsIcon },
  { regex: /(iOS|iPhone|iPod)/i, name: "iOS", icon: Icons.BrandAppleIcon },
  { regex: /Android/i, name: "Android", icon: Icons.BrandAndroidIcon },
  { regex: /Linux/i, name: "Linux", icon: Icons.BrandLinuxIcon }
];
const detectorsWindows = [
  { regex: /Windows NT 10.0/i, name: "Windows 10", icon: Icons.BrandWindows810Icon },
  { regex: /Windows NT 6.2/i, name: "Windows 8", icon: Icons.BrandWindows810Icon },
  { regex: /Windows NT 6.1/i, name: "Windows 7", icon: Icons.BrandWindowsLegacyIcon },
  { regex: /Windows NT 6.0/i, name: "Windows Vista", icon: Icons.BrandWindowsLegacyIcon },
  { regex: /Windows NT 5.1/i, name: "Windows XP", icon: Icons.BrandWindowsLegacyIcon },
  { regex: /Windows NT 5.0/i, name: "Windows 2000", icon: Icons.BrandWindowsClassicIcon },
  { regex: /(Win32|Win64|Windows|WinCE)/i, name: "Windows", icon: Icons.BrandWindowsClassicIcon }
];
const detectorsPhone = [
  { regex: /HUAWEI/i, match: /HUAWEI[^;]*/i, name: "Huawei", icon: Icons.BrandHuaweiIcon },
  { regex: /Xiaomi|Redmi/i, match: /(Xiaomi|Redmi)[^;]*/i, name: "Xiaomi", icon: Icons.BrandXiaomiIcon },
  { regex: /OnePlus/i, match: /OnePlus[^;]*/i, name: "OnePlus", icon: Icons.BrandAndroidIcon },
  { regex: /OPPO/i, match: /OPPO[^;]*/i, name: "OPPO", icon: Icons.BrandAndroidIcon },
  { regex: /Vivo/i, match: /Vivo[^;]*/i, name: "Vivo", icon: Icons.BrandAndroidIcon }
];

export function getBrowser(userAgent: string): OSInfo | undefined {
  // Browsers
  for (const detector of detectorsBrowser) {
    if (detector.regex.test(userAgent)) return { name: detector.name, icon: detector.icon };
  }
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return { name: "Safari", icon: Icons.BrandSafariIcon };
}

export function getDevice(userAgent: string): OSInfo {
  if (/SM-|Samsung/i.test(userAgent)) {
    const model = userAgent.match(/SM-[A-Z0-9]+/)?.[0];
    return { name: model ? `Samsung ${model}` : "Samsung Device", icon: Icons.BrandSamsungIcon };
  }
  for (const detector of detectorsPhone) {
    if (detector.regex.test(userAgent)) {
      return { name: userAgent.match(detector.match)?.[0] || detector.name, icon: detector.icon };
    }
  }
  if (/iPhone/i.test(userAgent)) {
    const model = userAgent.match(/iPhone\s([\d,]+)/)?.[1]?.replace(",", ".");
    return { name: model ? `iPhone ${model}` : "iPhone", icon: Icons.BrandAppleIcon };
  }
  for (const detector of detectorsOS) {
    if (detector.regex.test(userAgent)) return { name: detector.name, icon: detector.icon };
  }
  if (/X11/.test(userAgent) && !/Win/.test(userAgent) && !/Mac/.test(userAgent)) return { name: "UNIX", icon: Icons.WorldIcon };
  // Windows Versions
  for (const detector of detectorsWindows) {
    if (detector.regex.test(userAgent)) return { name: detector.name, icon: detector.icon };
  }

  return { name: "undetermined", icon: Icons.WorldIcon };
}

interface OS {
  device: OSInfo;
  browser: OSInfo | undefined;
}
export async function getOSAuto(userAgent: string): Promise<OS> {
  const browser = getBrowser(userAgent);
  try {
    if ((navigator as any)?.userAgentData) {
      const uaData = await (navigator as any).userAgentData.getHighEntropyValues(["platform", "platformVersion", "model"]);
      const device = getDevice(uaData.model || uaData.platform);

      if (uaData.platform === "Windows") {
        const majorVersion = parseInt(uaData.platformVersion.split(".")[0]);
        if (majorVersion >= 13) {
          return { device: { name: "Windows 11", icon: Icons.BrandWindows11Icon }, browser };
        }
        return { device: { name: "Windows 10", icon: Icons.BrandWindows810Icon }, browser };
      }

      return { device, browser };
    }
  } catch (error) {
    console.error("Failed to detect high entropy userAgentData", error);
  }
  const device = getDevice(userAgent);
  return { device, browser };
}

interface UseOsOptions {
  getValueInEffect?: boolean | string;
}

export function useOS(opts: UseOsOptions = {}): OS {
  const { getValueInEffect = false } = opts;
  const nameInEffect = typeof getValueInEffect === "string" ? getValueInEffect : "undetermined";
  const defaultState = getValueInEffect ? { name: nameInEffect, icon: Icons.WorldIcon } : { name: "", icon: Icons.AISearchIcon };
  const [os, setOS] = useState<OS>({ device: defaultState, browser: defaultState });

  useIsomorphicEffect(() => {
    const userAgent = window.navigator.userAgent;
    async function updateOS() {
      try {
        setOS(await getOSAuto(userAgent));
      } catch {
        setOS(os => os);
      }
    }
    updateOS();
  }, []);

  return os;
}
