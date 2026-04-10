import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "签到系统",
  description: "每日签到系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
