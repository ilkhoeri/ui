"use client";
import React from "react";
import Svg from "@/ui/svg";
import { cvx } from "xuxi";
import { cn } from "@/utils/cn";
import { Tabs } from "@/ui/tabs";
import { Times } from "@/ui/times";
import { Avatar } from "@/ui/avatar";
import { Sheets } from "@/ui/sheets";
import { Tooltip } from "@/ui/tooltip";
import { Indicator } from "@/ui/indicator";
import { ScrollArea } from "@/ui/scroll-area";
import { Button, buttonVariants } from "@/ui/button";
import { UserErrorIcon, UserInfoIcon, UserSuccessIcon, UserSupportIcon, UserWarningIcon } from "@/icons/*";
import { Table, dataRenderer, type DataTableProps } from "@/ui/table";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Stack } from "@/ui/stack";

type NotificationStatus = "unread" | "read";
type NotificationPriority = "low" | "medium" | "high";
type NotificationType = "info" | "warning" | "error" | "success" | "message";

interface User {
  id: string;
  name: string;
  image?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  receivedAt: string | Date;
  readAt?: string | Date;
  source?: string;
  linkUrl?: string;
  priority?: NotificationPriority;
  sender?: User;
}

type NotificationsTab = {
  key: "all" | "unread" | "read";
  notification: Notification[];
};

const dummyNotifications: Notification[] = [
  {
    id: "n1",
    title: "System Info",
    message: "System is running smoothly.",
    type: "info",
    status: "unread",
    receivedAt: "2025-04-29T09:00:00Z",
    priority: "low",
    source: "system"
  },
  {
    id: "n2",
    title: "Update Complete",
    message: "The update was installed successfully.",
    type: "success",
    status: "unread",
    receivedAt: "2025-04-29T10:00:00Z",
    priority: "medium",
    source: "updater"
  },
  {
    id: "n3",
    title: "Low Disk Space",
    message: "Only 2GB left on drive C:.",
    type: "warning",
    status: "read",
    receivedAt: "2025-04-28T14:00:00Z",
    readAt: "2025-04-28T14:30:00Z",
    priority: "high",
    source: "system"
  },
  {
    id: "n4",
    title: "500 Internal Server Error",
    message: "Something went wrong.",
    type: "error",
    status: "unread",
    receivedAt: "2025-04-28T08:00:00Z",
    priority: "high",
    source: "api"
  },
  {
    id: "n5",
    title: "New Message from Alice",
    message: "Hey, are you available for a quick call?",
    type: "message",
    status: "unread",
    receivedAt: "2025-04-29T11:15:00Z",
    sender: {
      id: "u1",
      name: "Alice Johnson",
      image: "https://api.dicebear.com/9.x/lorelei/svg?seed=1.jpg"
    },
    linkUrl: "/messages/u1",
    priority: "medium"
  },
  {
    id: "n6",
    title: "New Message from Bob",
    message: "Sure, I’ll send the report shortly.",
    type: "message",
    status: "read",
    receivedAt: "2025-04-29T08:15:00Z",
    readAt: "2025-04-29T08:30:00Z",
    sender: {
      id: "u2",
      name: "Bob Smith",
      image: "https://api.dicebear.com/9.x/lorelei/svg?seed=2.jpg"
    },
    linkUrl: "/messages/u2",
    priority: "low"
  },
  {
    id: "n7",
    title: "User Login Detected",
    message: "Login from Chrome on Windows.",
    type: "info",
    status: "read",
    receivedAt: "2025-04-27T21:00:00Z",
    readAt: "2025-04-27T21:05:00Z",
    source: "security"
  },
  {
    id: "n8",
    title: "High CPU Usage",
    message: "Server CPU usage is over 90%.",
    type: "warning",
    status: "unread",
    receivedAt: "2025-04-30T06:30:00Z",
    priority: "high",
    source: "monitoring"
  },
  {
    id: "n9",
    title: "Backup Complete",
    message: "The daily backup was completed.",
    type: "success",
    status: "read",
    receivedAt: "2025-04-29T02:00:00Z",
    readAt: "2025-04-29T02:10:00Z",
    priority: "medium"
  },
  {
    id: "n10",
    title: "App Crash Detected",
    message: "Crash reported on Android 13.",
    type: "error",
    status: "read",
    receivedAt: "2025-04-28T12:45:00Z",
    readAt: "2025-04-28T13:00:00Z",
    priority: "high",
    source: "crashlytics"
  },
  {
    id: "n11",
    title: "Message from Charlie",
    message: "Project meeting moved to 3 PM.",
    type: "message",
    status: "unread",
    receivedAt: "2025-04-30T08:30:00Z",
    sender: {
      id: "u3",
      name: "Charlie Green",
      image: "https://api.dicebear.com/9.x/lorelei/svg?seed=3.jpg"
    },
    linkUrl: "/messages/u3"
  },
  {
    id: "n12",
    title: "New Feature Released",
    message: "Dark mode is now available.",
    type: "info",
    status: "unread",
    receivedAt: "2025-04-28T07:00:00Z",
    source: "releases",
    priority: "low"
  },
  {
    id: "n13",
    title: "Quota Warning",
    message: "You’ve used 95% of your API quota.",
    type: "warning",
    status: "read",
    receivedAt: "2025-04-29T05:00:00Z",
    readAt: "2025-04-29T05:20:00Z",
    priority: "medium"
  },
  {
    id: "n14",
    title: "Deployment Failed",
    message: "Production build failed during CI.",
    type: "error",
    status: "unread",
    receivedAt: "2025-04-30T03:15:00Z",
    source: "ci/cd",
    priority: "high"
  },
  {
    id: "n15",
    title: "Monthly Report Ready",
    message: "Click to download your report.",
    type: "success",
    status: "unread",
    receivedAt: "2025-04-28T09:45:00Z",
    linkUrl: "/reports/march",
    priority: "medium"
  },
  {
    id: "n16",
    title: "System Notification",
    message: "Your profile has been updated.",
    type: "info",
    status: "read",
    receivedAt: "2025-04-27T17:30:00Z",
    readAt: "2025-04-27T18:00:00Z",
    source: "profile"
  },
  {
    id: "n17",
    title: "Message from Dana",
    message: "Check the latest draft when you can.",
    type: "message",
    status: "read",
    receivedAt: "2025-04-27T19:00:00Z",
    readAt: "2025-04-27T19:15:00Z",
    sender: {
      id: "u4",
      name: "Dana Lee",
      image: "https://api.dicebear.com/9.x/lorelei/svg?seed=4.jpg"
    },
    linkUrl: "/messages/u4"
  },
  {
    id: "n18",
    title: "Security Warning",
    message: "Multiple failed login attempts.",
    type: "warning",
    status: "unread",
    receivedAt: "2025-04-29T22:00:00Z",
    source: "security",
    priority: "high"
  },
  {
    id: "n19",
    title: "License Expiring Soon",
    message: "Your license will expire in 3 days.",
    type: "warning",
    status: "unread",
    receivedAt: "2025-04-28T15:00:00Z",
    source: "billing",
    priority: "medium"
  },
  {
    id: "n20",
    title: "Update Error",
    message: "Failed to install update v2.1.4.",
    type: "error",
    status: "read",
    receivedAt: "2025-04-27T16:00:00Z",
    readAt: "2025-04-27T16:20:00Z",
    source: "updater"
  },
  {
    id: "n21",
    title: "Success Sync",
    message: "Data sync completed.",
    type: "success",
    status: "read",
    receivedAt: "2025-04-26T09:00:00Z",
    readAt: "2025-04-26T09:10:00Z"
  },
  {
    id: "n22",
    title: "Admin Message",
    message: "Welcome to the new dashboard.",
    type: "message",
    status: "unread",
    receivedAt: "2025-04-26T10:00:00Z",
    sender: {
      id: "u5",
      name: "Admin"
    }
  },
  {
    id: "n23",
    title: "System Reboot",
    message: "Server restarted at 3:00 AM.",
    type: "info",
    status: "read",
    receivedAt: "2025-04-25T03:00:00Z",
    readAt: "2025-04-25T03:30:00Z",
    priority: "medium"
  },
  {
    id: "n24",
    title: "Warning: High Memory",
    message: "Memory usage exceeds 85%.",
    type: "warning",
    status: "read",
    receivedAt: "2025-04-24T22:00:00Z",
    readAt: "2025-04-24T22:30:00Z"
  },
  {
    id: "n25",
    title: "Service Restored",
    message: "Email delivery has resumed.",
    type: "success",
    status: "unread",
    receivedAt: "2025-04-25T12:00:00Z",
    priority: "low"
  },
  {
    id: "n26",
    title: "Critical Error Logged",
    message: "Unhandled exception in /api/users.",
    type: "error",
    status: "unread",
    receivedAt: "2025-04-30T09:30:00Z",
    priority: "high"
  }
];

const priorityVariants = cvx({
  assign: "rounded-full size-2",
  variants: {
    priority: {
      low: "bg-[#16C47F]",
      medium: "bg-[#FFD63A]",
      high: "bg-[#F14A00]",
      unknown: "bg-color"
    }
  }
});

export function getNotificationTabs(notifications: Notification[]) {
  const all = notifications;
  const unread = notifications.filter(n => n.status === "unread");
  const read = notifications.filter(n => n.status === "read");

  return [
    { key: "all", notification: all },
    { key: "unread", notification: unread },
    { key: "read", notification: read }
  ] as NotificationsTab[];
}
function getNotifIcon(notification: Notification) {
  if (notification.type === "message" && notification.sender?.image) {
    return <Avatar color="white" src={notification.sender.image} fallback={notification.sender.name} />;
  }

  function wrap(content: React.ReactNode, opt: { color?: string } = {}) {
    return (
      <div className="relative flex size-[--size] max-h-[--size] min-h-[--size] min-w-[--size] max-w-[--size] select-none items-center justify-center overflow-hidden rounded-full p-0 [--size:38px] [&>svg]:text-[--icon-color]" {...{ style: { "--icon-color": opt?.color } as React.CSSProperties }}>
        {content}
      </div>
    );
  }

  switch (notification.type) {
    case "info":
      return wrap(<UserInfoIcon size={32} />, { color: "#00879E" });
    case "warning":
      return wrap(<UserWarningIcon size={32} />, { color: "#FFD63A" });
    case "error":
      return wrap(<UserErrorIcon size={32} />, { color: "#F14A00" });
    case "success":
      return wrap(<UserSuccessIcon size={32} />, { color: "#16C47F" });
    default:
      return wrap(<UserSupportIcon size={32} />);
  }
}
function markAllAsRead(notifications: Notification[]): Notification[] {
  return notifications.map(n => (n.status === "unread" ? { ...n, status: "read", readAt: new Date().toISOString() } : n));
}

export function DropdownNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>(dummyNotifications);
  const [activeTab, setActiveTab] = React.useState<"all" | "read" | "unread">("all");

  const totalNewNotifications = notifications.filter(n => n.status === "unread").length;

  function handleMarkAllAsRead() {
    const updated = markAllAsRead(notifications);
    setNotifications(updated);
  }

  const data: NotificationsTab[] = getNotificationTabs(notifications);

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "read") return notifications.filter(n => n.status === "read");
    if (activeTab === "unread") return notifications.filter(n => n.status === "unread");
    return notifications;
  }, [notifications, activeTab]);

  const priorityCountMap = React.useMemo(() => {
    const map: Record<NotificationPriority, number> = {
      low: 0,
      medium: 0,
      high: 0
    };

    filteredNotifications.forEach(n => {
      if (n.priority) {
        map[n.priority] += 1;
      }
    });

    return map;
  }, [filteredNotifications]);

  const uniquePriorities = (Object.entries(priorityCountMap) as [NotificationPriority, number][]).filter(([, count]) => count > 0);

  return (
    <Sheets align="end" clickOutsideToClose modal sideOffset={4} variant="dropdown">
      <Indicator withBorder size={18} offset={2} disabled={!totalNewNotifications} label={totalNewNotifications} color="#FF5630" classNames={{ indicator: "text-white" }}>
        <Sheets.Trigger className={cn(buttonVariants({ size: "icon", variant: "unset" }), "[--sz:38px] data-[state=open]/st:bg-color data-[state=open]/st:text-background hover:data-[state=open]/st:bg-color hover:data-[state=open]/st:text-background")}>
          <Svg size={24} currentFill="fill" className="transition-colors">
            <path d="M8.352 20.242A4.63 4.63 0 0 0 12 22a4.63 4.63 0 0 0 3.648-1.758a27.2 27.2 0 0 1-7.296 0" />
            <path
              fillRule="evenodd"
              d="M18.75 9.704V9c0-3.866-3.023-7-6.75-7S5.25 5.134 5.25 9v.704c0 .845-.24 1.671-.692 2.374L3.45 13.801c-1.011 1.574-.239 3.713 1.52 4.21a25.8 25.8 0 0 0 14.06 0c1.759-.497 2.531-2.636 1.52-4.21l-1.108-1.723a4.4 4.4 0 0 1-.693-2.374M12 5.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75"
              clipRule="evenodd"
            />
          </Svg>
        </Sheets.Trigger>
      </Indicator>
      <Sheets.Content className="h-full max-h-[436px] w-[358px] bg-[#f4f6ff] p-4 shadow-lg dark:bg-[#151619]">
        <div className="mb-2">
          <h3 className="block text-xs font-medium text-muted-foreground">Notifications</h3>
          <div className="flex items-center justify-between gap-6">
            <p className="my-0 whitespace-nowrap text-sm font-normal text-color">
              {totalNewNotifications > 0 ? `You have ${totalNewNotifications}` : "Not have"} new notification{totalNewNotifications !== 1 ? "s" : ""}
            </p>
            <Button variant="outline" color="blue" size="sm" onClick={handleMarkAllAsRead}>
              <span className="whitespace-nowrap text-sm">Read all</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue={data?.[0]?.key} value={activeTab} onValueChange={value => setActiveTab(value as "all" | "read" | "unread")} variant="pills" round={999} color={{ bg: "hsl(var(--muted))", text: "hsl(var(--color))" }}>
          <Tabs.List gap={0}>
            {data.map(item => (
              <Tabs.Tab key={item.key} value={item.key} onClick={() => setActiveTab(item.key)} className="text-[13px] font-medium capitalize text-muted-foreground aria-selected:text-color">
                {item.key}
                {item.notification.length > 0 && <span className="absolute -right-2 -top-2 z-[200] rounded-full bg-red-500 p-1 text-[10px] font-medium leading-none text-white">{item.notification.length}</span>}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <ScrollArea color={{ thumb: "hsl(var(--muted-foreground))" }} classNames={{ root: "py-0.5", viewport: "max-h-[18.25rem] rounded-xl pb-px" }}>
            {data.map(item => {
              return (
                <Tabs.Panel key={item.key} value={item.key} className="space-y-[3px]">
                  {item.notification.map(notif => {
                    const icon = getNotifIcon(notif);
                    return (
                      <div key={notif.id} className="group/item relative flex cursor-pointer flex-row items-center justify-start gap-2 rounded-xl border px-2 py-2.5 transition-colors hover:bg-muted-foreground/20">
                        {icon}
                        <div className="grid grid-flow-row">
                          <p className="text-sm font-medium text-color">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                        </div>
                        <div className="absolute right-1 top-1 grid w-fit grid-flow-col items-center gap-1.5">
                          <Tooltip asChild side="left" content={`${notif.priority} Priority`} classNames={{ content: "capitalize px-2 py-1 text-xs font-medium" }}>
                            <span role="button" tabIndex={-1} aria-label={notif.source} className={priorityVariants({ ...notif })} />
                          </Tooltip>
                          <ClientOnly>
                            <Times format="default" time={notif.receivedAt} className="text-xs font-medium text-muted-foreground" />
                          </ClientOnly>
                        </div>
                      </div>
                    );
                  })}
                </Tabs.Panel>
              );
            })}
          </ScrollArea>
        </Tabs>
        <div className="ml-auto mt-1 grid w-max grid-flow-col items-center space-x-2 rounded-xl border px-2 py-1 empty:sr-only empty:hidden">
          {uniquePriorities.map(([priority, count]) => (
            <p key={priority} className="inline-flex items-center gap-1 whitespace-nowrap text-xs capitalize text-muted-foreground">
              <span className={priorityVariants({ priority })} /> {priority} ({count})
            </p>
          ))}
        </div>
      </Sheets.Content>
    </Sheets>
  );
}

function name(value: string | number) {
  return String(value).toLowerCase().replace(/\s/g, "-");
}
export function TableDemo() {
  const [data, setData] = React.useState(somePeriodic);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const allRowPositions = React.useMemo(() => data.map(item => item.name), [data]);
  const isAllSelected = selectedRows.length === allRowPositions.length;
  const isSomeSelected = selectedRows.length > 0 && !isAllSelected;
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setSelectedRows(allRowPositions);
    } else {
      setSelectedRows([]);
    }
  };
  const handleDelete = () => {
    const newData = data.filter(item => !selectedRows.includes(item.name));
    setData(newData);
    setSelectedRows([]);
  };
  const tableData: DataTableProps = {
    caption: (
      <div className="grid grid-flow-row items-center justify-center">
        <span>{data.length ? "Some elements from periodic table" : "Empty"}</span>
      </div>
    ),
    head: [
      <Label key={"select-all"} htmlFor="select-all" aria-label="select-all" className="mt-1.5 h-[17px] cursor-pointer">
        <Input type="checkbox" id="select-all" name="select-all" className="bg-color [--checked-color:hsl(var(--color))] checked:bg-background data-[state=indeterminate]:bg-background" aria-label="Select All" checked={data.length > 0 && isAllSelected} indeterminate={isSomeSelected} onChange={handleSelectAll} />
        &nbsp;&nbsp;All
      </Label>,
      "Element name",
      "Symbol",
      "Position",
      "Atomic mass"
    ],
    body: dataRenderer(data, [
      (item, index) => (
        <div className="flex flex-row items-center justify-start gap-1">
          <Input type="checkbox" id={name(item.name)} name={name(item.name)} aria-label="Select row" checked={selectedRows.includes(item.name)} onChange={event => setSelectedRows(event.currentTarget.checked ? [...selectedRows, item.name] : selectedRows.filter(name => name !== item.name))} />
          &nbsp;&nbsp;{index + 1}
        </div>
      ),
      item => (
        <Label htmlFor={name(item.name)} className="inline-flex cursor-pointer items-center gap-1">
          {item.name}
          <Tooltip touch side="top" content={item.description} classNames={{ trigger: "bg-muted rounded-lg p-0.5", content: "px-2 py-1 text-xs font-medium" }}>
            <Svg>
              <path d="M12 9h.01M11 12h1v4h1" />
              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9" />
            </Svg>
          </Tooltip>
        </Label>
      ),
      "symbol",
      "position",
      "mass"
    ])
  };
  return (
    <Stack className="w-full">
      <Table
        variant="tile"
        data={tableData}
        classNames={{ root: "[--selected-bg:#f4f6ff] dark:[--selected-bg:#151619]", thead: "bg-color", "tbody.tr": "shadow-md bg-background" }}
        styles={{
          root: {
            height: "29rem",
            "--height-cell": "auto"
          },
          "thead.tr.th": { "--color-cell": "hsl(var(--background))" },
          "tbody.tr": index =>
            selectedRows.includes(data[index].name) && {
              backgroundColor: "var(--selected-bg)",
              "--table-border-color": "hsl(var(--background))"
            }
        }}
      />
      <Button variant="destructive" size="default" className="w-max" disabled={selectedRows.length === 0} onClick={handleDelete}>
        Delete
      </Button>
    </Stack>
  );
}
const somePeriodic = [
  { name: "Sodium", symbol: "Na", position: 11, mass: 22.99, description: "A soft metal that reacts vigorously with water." },
  { name: "Magnesium", symbol: "Mg", position: 12, mass: 24.305, description: "A metal used in lightweight alloys." },
  { name: "Aluminum", symbol: "Al", position: 13, mass: 26.982, description: "A lightweight, corrosion-resistant metal." },
  { name: "Silicon", symbol: "Si", position: 14, mass: 28.085, description: "A key component in semiconductors." },
  { name: "Phosphorus", symbol: "P", position: 15, mass: 30.974, description: "Essential for DNA and energy transfer in cells." },
  { name: "Sulfur", symbol: "S", position: 16, mass: 32.06, description: "A yellow, nonmetallic element used in fertilizers." },
  { name: "Chlorine", symbol: "Cl", position: 17, mass: 35.45, description: "A reactive halogen used for water purification." },
  { name: "Argon", symbol: "Ar", position: 18, mass: 39.948, description: "A noble gas used in light bulbs and welding." },
  { name: "Potassium", symbol: "K", position: 19, mass: 39.098, description: "An essential element for human health." },
  { name: "Calcium", symbol: "Ca", position: 20, mass: 40.078, description: "A metal crucial for bones and teeth." },
  { name: "Iron", symbol: "Fe", position: 26, mass: 55.845, description: "A key element in hemoglobin, the oxygen-carrying molecule in blood." },
  { name: "Copper", symbol: "Cu", position: 29, mass: 63.546, description: "A conductor of electricity used in wiring." }
];

import { Command, type CommandActionGroupData } from "@/ui/command";
import { ClientOnly } from "@/source/assets/client-only";
// import { Svg } from "@/ui/svg";

const ICONSIZE = 24;

const dataGroup: CommandActionGroupData[] = [
  {
    group: "Frontend Frameworks",
    actions: [
      {
        id: "1-1",
        href: "#",
        label: "React",
        description: "A JavaScript library for building user interfaces.",
        leftSection: (
          <Svg size={ICONSIZE} viewBox="-10.5 -9.45 21 18.9" currentFill="none">
            <circle cx="0" cy="0" r="2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="10" ry="4.5" />
              <ellipse rx="10" ry="4.5" transform="rotate(60)" />
              <ellipse rx="10" ry="4.5" transform="rotate(120)" />
            </g>
          </Svg>
        )
      },
      {
        id: "1-2",
        href: "#",
        label: "Vue.js",
        description: "A progressive framework for building user interfaces.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M2 3h3.5L12 15l6.5-12H22L12 21zm4.5 0h3L12 7.58L14.5 3h3L12 13.08z" />
          </Svg>
        )
      }
    ]
  },
  {
    group: "Backend Frameworks",
    actions: [
      {
        id: "2-1",
        href: "#",
        label: "Express",
        description: "Fast, unopinionated, minimalist web framework for Node.js.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M24 18.588a1.53 1.53 0 0 1-1.895-.72l-3.45-4.771l-.5-.667l-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92l-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83l3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27c1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.08 4.08 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.42 5.42 0 0 1-2.589 3.957a6.27 6.27 0 0 1-7.306-.933a6.58 6.58 0 0 1-1.64-3.858c0-.235-.08-.455-.134-.666A88 88 0 0 1 0 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278c-2.882-.04-4.944 2.094-5.071 5.264z" />
          </Svg>
        )
      },
      {
        id: "2-2",
        href: "#",
        label: "NestJS",
        description: "A progressive Node.js framework for building efficient and scalable server-side applications.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M14.131.047c-.173 0-.334.037-.483.087c.316.21.49.49.576.806c.007.043.019.074.025.117a1 1 0 0 1 .013.112c.024.545-.143.614-.26.936c-.18.415-.13.861.086 1.22a.7.7 0 0 0 .074.137c-.235-1.568 1.073-1.803 1.314-2.293c.019-.428-.334-.713-.613-.911a1.37 1.37 0 0 0-.732-.21zM16.102.4c-.024.143-.006.106-.012.18c-.006.05-.006.112-.012.161c-.013.05-.025.1-.044.149q-.019.075-.05.149l-.067.142c-.02.025-.031.05-.05.075l-.037.055a2 2 0 0 1-.093.124c-.037.038-.068.081-.112.112v.006c-.037.031-.074.068-.118.1c-.13.099-.278.173-.415.266c-.043.03-.087.056-.124.093a1 1 0 0 0-.118.099c-.043.037-.074.074-.111.118c-.031.037-.068.08-.093.124a2 2 0 0 0-.087.13c-.025.05-.043.093-.068.142c-.019.05-.037.093-.05.143a2 2 0 0 0-.043.155c-.006.025-.006.056-.012.08c-.007.025-.007.05-.013.075c0 .05-.006.105-.006.155q-.002.055.006.111q0 .074.019.155q.01.075.03.15c.02.049.032.098.05.148c.013.03.031.062.044.087l-1.426-.552c-.241-.068-.477-.13-.719-.186l-.39-.093q-.56-.111-1.128-.167c-.013 0-.019-.006-.031-.006A11 11 0 0 0 8.9 2.855c-.378.025-.756.074-1.134.136a13 13 0 0 0-.837.174l-.279.074c-.092.037-.18.08-.266.118l-.205.093c-.012.006-.024.006-.03.012c-.063.031-.118.056-.174.087a3 3 0 0 0-.236.118c-.043.018-.086.043-.124.062l-.055.03q-.085.048-.162.094a2 2 0 0 0-.148.093c-.044.03-.087.055-.124.086c-.006.007-.013.007-.019.013c-.037.025-.08.056-.118.087l-.012.012l-.093.074c-.012.007-.025.019-.037.025c-.031.025-.062.056-.093.08c-.006.013-.019.02-.025.025c-.037.038-.074.069-.111.106c-.007 0-.007.006-.013.012a2 2 0 0 0-.111.106c-.007.006-.007.012-.013.012a2 2 0 0 0-.093.1c-.012.012-.03.024-.043.036a1 1 0 0 1-.106.112c-.006.012-.018.019-.024.03c-.05.05-.093.1-.143.15l-.018.018c-.1.106-.205.211-.317.304q-.168.15-.347.273a3.8 3.8 0 0 1-.762.421c-.13.056-.267.106-.403.149c-.26.056-.527.161-.756.18c-.05 0-.105.012-.155.018l-.155.037l-.149.056q-.075.03-.148.068c-.044.031-.093.056-.137.087a1 1 0 0 0-.124.106c-.043.03-.087.074-.124.111c-.037.043-.074.08-.105.124c-.031.05-.068.093-.093.143a1 1 0 0 0-.087.142c-.025.056-.05.106-.068.161q-.028.077-.056.161c-.012.05-.025.1-.03.15c0 .005-.007.012-.007.018c-.012.056-.012.13-.019.167C.006 7.95 0 7.986 0 8.03a.66.66 0 0 0 .074.31v.006q.03.056.069.112q.035.056.08.111c.031.031.068.069.106.1a1 1 0 0 0 .117.099c.149.13.186.173.378.272c.031.019.062.031.1.05c.006 0 .012.006.018.006c0 .013 0 .019.006.031a1.3 1.3 0 0 0 .08.298c.02.037.032.074.05.111q.01.02.02.031c.024.05.049.093.073.137l.093.13c.031.037.069.08.106.118s.074.068.118.105c0 0 .006.006.012.006q.055.048.112.087a1 1 0 0 0 .136.08c.043.025.093.05.142.069a1 1 0 0 0 .124.043c.007.006.013.006.025.012c.025.007.056.013.08.019c-.018.335-.024.65.026.762c.055.124.328-.254.6-.688c-.036.428-.061.93 0 1.079c.069.155.44-.329.763-.862c4.395-1.016 8.405 2.02 8.826 6.31c-.08-.67-.905-1.041-1.283-.948c-.186.458-.502 1.047-1.01 1.413c.043-.41.025-.83-.062-1.24a4 4 0 0 1-.769 1.562c-.588.043-1.177-.242-1.487-.67c-.025-.018-.031-.055-.05-.08q-.029-.065-.05-.13a.5.5 0 0 1-.037-.13q-.008-.064-.006-.137v-.093a1 1 0 0 1 .031-.13q.017-.064.044-.13c.024-.043.043-.087.074-.13c.105-.298.105-.54-.087-.682a1 1 0 0 0-.118-.062c-.024-.006-.055-.018-.08-.025l-.05-.018a1 1 0 0 0-.13-.031a.5.5 0 0 0-.13-.019a1 1 0 0 0-.136-.012c-.031 0-.062.006-.093.006a.5.5 0 0 0-.137.019q-.064.008-.13.024a1 1 0 0 0-.13.044c-.043.018-.08.037-.124.056c-.037.018-.074.043-.118.062c-1.444.942-.582 3.148.403 3.787c-.372.068-.75.148-.855.229l-.013.012q.4.24.837.416c.397.13.818.247 1.004.297v.006a6 6 0 0 0 1.562.112c2.746-.192 4.996-2.281 5.405-5.033l.037.161c.019.112.043.23.056.347v.006q.016.085.025.162v.024q.01.085.012.162q.01.102.012.204v.1c0 .03.007.067.007.098c0 .038-.007.075-.007.112v.087c0 .043-.006.08-.006.124q.002.036-.006.08c0 .044-.006.087-.006.137q-.007.027-.006.055l-.02.143q.001.028-.005.056c-.007.062-.019.118-.025.18v.012l-.037.174v.018l-.037.167c0 .007-.007.02-.007.025a2 2 0 0 1-.043.168v.018q-.03.091-.05.174q-.008.01-.006.012l-.056.186c-.024.062-.043.118-.068.18s-.043.124-.068.18c-.025.062-.05.117-.074.18h-.007c-.024.055-.05.117-.08.173l-.019.043c-.006.006-.006.013-.012.019a5.9 5.9 0 0 1-1.742 2.082c-.05.031-.099.069-.149.106c-.012.012-.03.018-.043.03a3 3 0 0 1-.136.094l.018.037h.007l.26-.037h.006q.241-.039.483-.087c.044-.006.093-.019.137-.031l.087-.019c.043-.006.086-.018.13-.024c.037-.013.074-.02.111-.031c.62-.15 1.221-.354 1.798-.595a9.9 9.9 0 0 1-3.85 3.142c.714-.05 1.426-.167 2.114-.366a9.9 9.9 0 0 0 5.857-4.68a9.9 9.9 0 0 1-1.667 3.986a9.8 9.8 0 0 0 1.655-1.376a9.8 9.8 0 0 0 2.61-5.268c.21.98.272 1.99.18 2.987c4.474-6.241.371-12.712-1.346-14.416c-.006-.013-.012-.019-.012-.031c-.006.006-.006.006-.006.012c0-.006 0-.006-.007-.012q-.002.11-.012.223a8 8 0 0 1-.062.415c-.03.136-.068.273-.105.41c-.044.13-.093.266-.15.396a5 5 0 0 1-.185.378a5 5 0 0 1-.477.688c-.093.111-.192.21-.292.31a4 4 0 0 1-.18.155l-.142.124a4 4 0 0 1-.347.241a4 4 0 0 1-.366.211q-.195.091-.39.174a4.4 4.4 0 0 1-.818.223c-.143.025-.285.037-.422.05a5 5 0 0 1-.297.012a5 5 0 0 1-.422-.025a3 3 0 0 1-.421-.062a3 3 0 0 1-.415-.105h-.007c.137-.013.273-.025.41-.05a4.5 4.5 0 0 0 .818-.223c.136-.05.266-.112.39-.174c.13-.062.248-.13.372-.204q.178-.119.347-.248q.168-.13.316-.279c.105-.093.198-.198.291-.304q.14-.167.26-.334c.013-.019.026-.044.038-.062q.095-.15.18-.298a4.3 4.3 0 0 0 .334-.775c.044-.13.075-.266.106-.403c.025-.142.05-.278.062-.415c.012-.142.025-.285.025-.421c0-.1-.007-.199-.013-.298a7 7 0 0 0-.05-.415a5 5 0 0 0-.092-.415c-.044-.13-.087-.267-.137-.397s-.111-.26-.173-.384q-.102-.187-.211-.366a7 7 0 0 0-.248-.34q-.138-.16-.285-.317a4 4 0 0 0-.161-.155q-.422-.327-.862-.607a1 1 0 0 0-.124-.062a2.4 2.4 0 0 0-.589-.26Z" />
          </Svg>
        )
      }
    ]
  },
  {
    group: "Databases",
    actions: [
      {
        id: "3-1",
        href: "#",
        label: "MongoDB",
        description: "A document database with the scalability and flexibility that you want with the querying and indexing that you need.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill" fillRule="evenodd" clipRule="evenodd">
            <path d="M7.294 11.804c0-3.966 2.14-6.417 3.533-8.014C11.501 3.02 12 2.447 12 2c0 .447.5 1.019 1.172 1.79c1.394 1.597 3.534 4.048 3.534 8.014c0 4.326-2.75 6.95-4.077 7.765L12.37 22h-.707l-.29-2.43c-1.326-.813-4.079-3.437-4.079-7.766m4.064 6.7L12 9.06l.649 9.446l-.65.75z" />
          </Svg>
        )
      },
      {
        id: "3-2",
        href: "#",
        label: "PostgreSQL",
        description: "A powerful, open-source object-relational database system.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M16.805 1a10 10 0 0 0-2.603.37l-.06.018a10.6 10.6 0 0 0-1.615-.151c-1.113-.019-2.07.243-2.84.68c-.76-.256-2.336-.697-3.997-.609c-1.157.061-2.419.402-3.354 1.36c-.933.958-1.426 2.44-1.322 4.457c.028.557.191 1.464.463 2.64c.27 1.175.652 2.55 1.127 3.805s.996 2.384 1.81 3.15c.406.384.965.707 1.624.68c.463-.018.882-.215 1.243-.506c.176.225.364.323.535.414c.215.114.425.192.642.244a4.6 4.6 0 0 0 1.84.091c.267-.043.548-.127.828-.247c.01.302.022.598.035.898c.038.95.063 1.827.357 2.596c.047.126.176.773.687 1.344c.51.572 1.51.928 2.648.692c.803-.167 1.825-.468 2.503-1.404c.67-.926.973-2.254 1.033-4.409c.015-.116.033-.215.052-.308l.16.014h.018c.857.038 1.787-.08 2.564-.43c.688-.31 1.208-.622 1.587-1.177c.095-.137.199-.303.227-.59c.028-.285-.14-.733-.421-.939c-.563-.414-.916-.257-1.295-.18q-.56.12-1.136.133c1.093-1.784 1.876-3.68 2.323-5.358c.264-.99.413-1.903.425-2.701s-.055-1.505-.548-2.117c-1.541-1.91-3.708-2.438-5.384-2.456q-.078-.002-.156-.001zm-.044.587c1.585-.015 3.611.417 5.065 2.22c.327.405.424.997.413 1.727c-.012.729-.151 1.601-.405 2.557c-.493 1.852-1.425 4.01-2.738 5.948a.7.7 0 0 0 .15.079c.274.11.898.204 2.145-.044c.313-.065.543-.108.781.068a.48.48 0 0 1 .173.39a.64.64 0 0 1-.123.308c-.24.351-.716.684-1.326.958c-.539.244-1.313.371-1.999.379c-.344.003-.661-.023-.93-.104l-.018-.006c-.104.971-.343 2.89-.498 3.765c-.125.706-.343 1.267-.76 1.687c-.416.42-1.004.673-1.796.838c-.981.204-1.696-.016-2.157-.393c-.46-.375-.671-.874-.798-1.18c-.087-.21-.132-.483-.176-.848a18 18 0 0 1-.097-1.315a46 46 0 0 1-.028-2.312c-.41.363-.92.605-1.467.696c-.65.107-1.232.002-1.579-.082a2.2 2.2 0 0 1-.49-.185c-.162-.083-.315-.177-.417-.363a.5.5 0 0 1-.054-.35a.56.56 0 0 1 .206-.303c.188-.148.435-.23.808-.306c.68-.135.917-.228 1.061-.339c.123-.095.262-.287.508-.57l-.003-.037a2.9 2.9 0 0 1-1.257-.328c-.141.144-.865.887-1.748 1.917c-.371.431-.781.678-1.214.696s-.824-.194-1.156-.506c-.665-.626-1.195-1.703-1.657-2.92c-.46-1.218-.836-2.574-1.102-3.729c-.268-1.155-.426-2.086-.448-2.535c-.1-1.909.36-3.195 1.15-4.006S4.652 1.94 5.708 1.882c1.894-.106 3.693.535 4.057.673c.701-.462 1.604-.75 2.733-.732a7.2 7.2 0 0 1 1.588.2l.019-.008q.344-.117.698-.196a9.4 9.4 0 0 1 1.957-.23zm.143.614h-.137a8.5 8.5 0 0 0-1.61.176a7.05 7.05 0 0 1 2.692 2.062a7.7 7.7 0 0 1 1.07 1.76c.104.242.174.447.213.605c.02.08.034.147.038.217a.4.4 0 0 1-.011.132l-.006.012c.029.803-.176 1.347-.201 2.113c-.019.556.127 1.209.163 1.92c.034.67-.049 1.405-.497 2.127q.056.066.108.132c1.185-1.81 2.04-3.814 2.495-5.521c.243-.92.373-1.753.384-2.413c.01-.66-.117-1.139-.279-1.338c-1.268-1.573-2.983-1.974-4.422-1.985m-4.525.235c-1.117.002-1.919.33-2.526.82c-.627.507-1.047 1.2-1.323 1.911a7.9 7.9 0 0 0-.485 2.213l.013-.007c.337-.184.78-.367 1.254-.473c.475-.106.986-.139 1.449.035s.846.584.985 1.206c.665 2.986-.207 4.096-.529 4.933a9 9 0 0 0-.312.929q.06-.017.121-.024a1.06 1.06 0 0 1 .51.1c.324.13.546.402.666.714q.047.124.067.26q.02.057.019.117a49 49 0 0 0 .012 3.426c.022.494.054.928.095 1.271c.04.342.098.602.135.69c.12.294.297.678.617.939s.777.434 1.614.26c.726-.151 1.174-.36 1.474-.663c.298-.301.477-.72.591-1.363c.171-.963.515-3.754.556-4.28c-.018-.395.042-.7.172-.932c.135-.238.343-.384.522-.463c.09-.04.174-.066.243-.085a6 6 0 0 0-.23-.298a4 4 0 0 1-.629-1.007a8 8 0 0 0-.243-.443c-.125-.22-.284-.495-.45-.804c-.333-.619-.695-1.369-.883-2.1c-.187-.729-.215-1.484.265-2.017c.426-.473 1.172-.669 2.293-.559c-.033-.096-.053-.176-.109-.304a7 7 0 0 0-.983-1.617c-.95-1.178-2.487-2.346-4.863-2.384h-.108zm-6.276.047q-.18 0-.36.01c-.954.053-1.856.322-2.501.986c-.647.663-1.072 1.751-.98 3.553c.019.34.172 1.296.434 2.43c.262 1.136.634 2.471 1.08 3.65c.446 1.18.988 2.207 1.502 2.693c.259.243.484.341.688.333c.205-.01.451-.124.753-.475a40 40 0 0 1 1.71-1.877a3.2 3.2 0 0 1-.932-1.307a3.1 3.1 0 0 1-.17-1.58c.097-.678.11-1.312.099-1.812c-.012-.488-.048-.812-.048-1.015v-.028a8.8 8.8 0 0 1 .559-3.095c.264-.682.658-1.375 1.249-1.936c-.58-.185-1.61-.467-2.725-.52a7 7 0 0 0-.36-.01zm11.714 4.842c-.641.008-1.001.169-1.19.379c-.268.298-.293.82-.127 1.464s.507 1.365.829 1.963c.16.3.316.57.442.788c.127.22.22.376.276.51q.08.181.168.331c.248-.509.293-1.008.267-1.529c-.033-.644-.187-1.303-.164-1.97c.025-.78.184-1.289.198-1.892a6 6 0 0 0-.699-.044m-7.78.105a2.7 2.7 0 0 0-.582.068a4.5 4.5 0 0 0-1.09.412q-.173.09-.33.209l-.02.018c.006.134.033.459.045.936c.01.523-.002 1.19-.106 1.91c-.226 1.568.946 2.866 2.324 2.868c.08-.322.213-.648.345-.992c.384-1.003 1.139-1.734.503-4.589c-.104-.467-.31-.656-.594-.763a1.4 1.4 0 0 0-.495-.077m7.48.187h.048q.094.003.17.02a.4.4 0 0 1 .13.051a.15.15 0 0 1 .071.1v.008a.2.2 0 0 1-.034.124a.6.6 0 0 1-.104.137a.65.65 0 0 1-.364.195a.57.57 0 0 1-.388-.095a.6.6 0 0 1-.123-.108a.24.24 0 0 1-.06-.116a.15.15 0 0 1 .04-.118a.4.4 0 0 1 .111-.082a1.3 1.3 0 0 1 .504-.118zm-7.388.154q.075 0 .157.012c.144.02.273.057.371.112q.072.037.126.097q.028.033.042.073t.009.083a.27.27 0 0 1-.071.141a.6.6 0 0 1-.135.12a.62.62 0 0 1-.424.103a.7.7 0 0 1-.396-.209a.7.7 0 0 1-.112-.15a.25.25 0 0 1-.039-.162c.014-.1.099-.15.18-.18a.8.8 0 0 1 .29-.036zm8.56 6.732h-.003c-.139.05-.253.07-.35.11a.42.42 0 0 0-.225.197c-.06.105-.11.292-.095.61a.5.5 0 0 0 .14.064c.161.048.432.08.735.075c.602-.007 1.344-.143 1.738-.321c.323-.146.623-.336.891-.564c-1.317.264-2.06.194-2.517.011a1.3 1.3 0 0 1-.314-.183m-7.588.086h-.02c-.05.004-.123.02-.263.172c-.33.358-.444.582-.716.792c-.27.21-.623.321-1.327.461c-.223.044-.35.093-.436.132c.028.022.025.028.066.049c.103.055.236.103.342.13c.303.073.8.159 1.319.073s1.058-.327 1.518-.953c.08-.108.088-.268.023-.44c-.067-.17-.211-.318-.313-.36a.6.6 0 0 0-.193-.054z" />
          </Svg>
        )
      }
    ]
  },
  {
    group: "CSS Frameworks",
    actions: [
      {
        id: "4-1",
        href: "#",
        label: "Tailwind CSS",
        description: "A utility-first CSS framework for rapidly building custom user interfaces.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M12.001 4.8q-4.8 0-6 4.8q1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12q4.8 0 6-4.8q-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8m-6 7.2q-4.8 0-6 4.8q1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624c1.177 1.194 2.538 2.576 5.512 2.576q4.8 0 6-4.8q-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12" />
          </Svg>
        )
      },
      {
        id: "4-2",
        href: "#",
        label: "Bootstrap",
        description: "The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first projects on the web.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill">
            <path d="M5.423 3.038c-1.284 0-2.233 1.124-2.19 2.342c.04 1.171-.013 2.688-.395 3.924c-.383 1.24-1.03 2.026-2.088 2.127v1.138c1.058.101 1.705.887 2.088 2.127c.382 1.237.435 2.753.394 3.924c-.042 1.218.907 2.342 2.192 2.342h13.154c1.284 0 2.234-1.124 2.192-2.342c-.041-1.171.012-2.687.393-3.924c.384-1.24 1.03-2.026 2.087-2.127v-1.138c-1.058-.101-1.703-.887-2.087-2.127c-.381-1.236-.434-2.753-.393-3.924c.042-1.218-.908-2.342-2.192-2.342zm10.581 11.033c0 1.678-1.251 2.696-3.328 2.696H9.14a.38.38 0 0 1-.382-.381V7.614a.38.38 0 0 1 .382-.38h3.515c1.732 0 2.869.937 2.869 2.378c0 1.01-.765 1.916-1.739 2.074v.053c1.326.145 2.22 1.064 2.22 2.332M12.29 8.442h-2.016v2.848h1.698c1.313 0 2.036-.529 2.036-1.474c0-.885-.622-1.374-1.718-1.374m-2.016 3.977v3.139h2.09c1.367 0 2.09-.549 2.09-1.58c0-1.03-.743-1.559-2.178-1.559z" />
          </Svg>
        )
      }
    ]
  },
  {
    group: "Development Tools",
    actions: [
      {
        id: "5-1",
        href: "#",
        label: "VS Code",
        description: "A source-code editor developed by Microsoft for Windows, Linux, and macOS.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill" viewBox="0 0 16 16">
            <path d="m9.785 1.38l-4.22 3.87l2.123 1.621L10 5.107V2c0-.234-.08-.45-.215-.62M10 9.893L2.584 4.234a.54.54 0 0 0-.691.031l-.716.655a.545.545 0 0 0 0 .805l8.608 7.894A1 1 0 0 0 10 13zm.753-8.856c.158.286.247.614.247.963v11c0 .35-.09.678-.247.963a1 1 0 0 0 .11-.043l2.677-1.295a.82.82 0 0 0 .46-.736V3.11c0-.314-.179-.6-.46-.736L10.863 1.08a1 1 0 0 0-.11-.043M1.177 9.275l1.195-1.097l1.637 1.5l-1.425 1.088a.54.54 0 0 1-.691-.031l-.716-.655a.547.547 0 0 1 0-.805" />
          </Svg>
        )
      },
      {
        id: "5-2",
        href: "#",
        label: "Git",
        description: "A free and open-source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.",
        leftSection: (
          <Svg size={ICONSIZE} currentFill="fill" fillRule="evenodd">
            <path d="M21.623 11.11L12.89 2.376a1.29 1.29 0 0 0-1.821 0L9.256 4.191l2.3 2.3a1.53 1.53 0 0 1 1.937 1.95l2.217 2.217a1.532 1.532 0 1 1-.918.864l-2.068-2.068v5.441a1.533 1.533 0 1 1-1.26-.045V9.36a1.53 1.53 0 0 1-.832-2.01L8.365 5.081l-5.988 5.987a1.29 1.29 0 0 0 0 1.822l8.733 8.732a1.29 1.29 0 0 0 1.821 0l8.692-8.692a1.29 1.29 0 0 0 0-1.822" />
          </Svg>
        )
      }
    ]
  }
];

export function CommandDemo() {
  return (
    <Command
      highlightQuery
      container={null}
      forceMount
      actions={dataGroup}
      classNames={{ content: "[--command-hover-bg:#f4f6ff] dark:[--command-hover-bg:#151619]" }}
      searchProps={{
        autoFocus: false,
        leftSection: (
          <Svg>
            <path d="M11 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v4" />
            <circle cx="17" cy="17" r="3" />
            <path d="m21 21-1.5-1.5" />
          </Svg>
        )
      }}
    />
  );
}
