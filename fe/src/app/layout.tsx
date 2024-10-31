import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/common/sidebar";

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
      <body id="root" className="min-w-[1024px]">
        <ThemeProvider attribute="class">
          <div className="min-h-screen min-w-screen flex">
            <Sidebar />
            <main className="flex-1">
              <div className="px-5 ">{children}</div>
            </main>
          </div>
        </ThemeProvider>

        <div id="modal-root"></div>
      </body>
    </html>
  );
}
