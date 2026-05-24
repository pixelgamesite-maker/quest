import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
