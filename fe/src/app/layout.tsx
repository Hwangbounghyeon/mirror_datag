import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const BMJUA = localFont({
  src: "./fonts/BMJUA.woff",
  display: "swap",
  weight: "400",
  variable: "--font-bmjua",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={` ${pretendard.variable} ${BMJUA.variable}`}
    >
      <body id="root">
        <ThemeProvider attribute="class">
          <div>{children}</div>
          <div id="modal-root"></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
