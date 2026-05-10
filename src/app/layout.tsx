import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DramaFlow Agent",
  description: "AI 短剧 Agent 工作台 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
