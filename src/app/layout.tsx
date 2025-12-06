import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Among Us - Real Life",
  description: "Among Us hra pro reálný svět",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
