"use client";

import { Loader } from "@/ui/loader";

export default function Loading() {
  return (
    <main className="relative flex h-screen min-h-screen w-full items-center justify-center bg-background">
      <Loader size={24} />
    </main>
  );
}
