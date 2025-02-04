import React, { ReactNode } from "react";
import StreamVideoProvider from "@/components/providers/StreamClientProvider";

export default function layout({ children }: { children: ReactNode }) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
