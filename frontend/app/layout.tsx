import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResumeProvider } from "@/context/resume-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build professional resumes with ease",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Fix iOS auto-linking hydration mismatches */}
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={`${inter.className} bg-slate-950`} suppressHydrationWarning={true}>
        <ResumeProvider>{children}</ResumeProvider>
      </body>
    </html>
  );
}