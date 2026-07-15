"use client";
import { useCallback, useEffect, useState } from "react";
import { useWindowEvent } from "@/hooks/use-window-event";

interface NetworkStatus {
  downlink?: number;
  downlinkMax?: number;
  rtt?: number;
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | "5g";
  type?: "bluetooth" | "cellular" | "ethernet" | "wifi" | "wimax" | "none" | "other" | "unknown";
}

function getOnlineStatus() {
  return typeof navigator !== "undefined" ? navigator.onLine : false;
}

function getConnection(): NetworkStatus {
  if (typeof navigator === "undefined") return {};

  const n = navigator as any;
  const connection = n.connection || n.mozConnection || n.webkitConnection;

  if (!connection) return {};

  return {
    downlink: navigator.onLine ? connection.downlink : 0,
    downlinkMax: navigator.onLine ? connection.downlinkMax : 0,
    effectiveType: navigator.onLine ? connection.effectiveType : "none",
    rtt: navigator.onLine ? connection.rtt : 0,
    saveData: navigator.onLine ? connection.saveData : false,
    type: navigator.onLine ? (typeof connection.type === "undefined" ? "unknown" : connection.type) : "none"
  };
}

export function useNetwork() {
  const [status, setStatus] = useState<{ online: boolean } & NetworkStatus>({
    online: getOnlineStatus(),
    ...getConnection()
  });

  const updateConnectionStatus = useCallback(() => {
    setStatus({
      online: getOnlineStatus(),
      ...getConnection()
    });
  }, []);

  useEffect(() => {
    updateConnectionStatus();
  }, [updateConnectionStatus]);

  useWindowEvent("online", updateConnectionStatus);
  useWindowEvent("offline", updateConnectionStatus);

  useEffect(() => {
    const n = navigator as any;
    const connection = n.connection || n.mozConnection || n.webkitConnection;

    if (connection) {
      connection.addEventListener("change", updateConnectionStatus);
      return () => connection.removeEventListener("change", updateConnectionStatus);
    }
  }, [updateConnectionStatus]);

  return status;
}
