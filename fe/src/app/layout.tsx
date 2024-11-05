import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/common/sidebar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "./providers";

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
          <ReduxProvider>
            <div className="min-h-screen min-w-screen flex">
              <Sidebar />
              <main className="flex-1">
                <div className="ps-3 ">{children}</div>
              </main>
            </div>
          </ReduxProvider>
          <ToastContainer />
        </ThemeProvider>

        <div id="modal-root"></div>
      </body>
    </html>
  );
}
