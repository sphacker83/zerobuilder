import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroBuilder | 개발비 0원 파트너형 개발",
  description:
    "아이디어만 있으면 4~8주 내 MVP를 출시합니다. 초기 개발비 없이 AI + 시니어 팀이 함께 만드는 ZeroBuilder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
