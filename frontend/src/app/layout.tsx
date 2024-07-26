import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from "./component/ReduxProvider";
import "./globals.css";
import ClientSideInitializer from "./component/ClientSideInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <title>Chat Me</title>
      <body className={inter.className}>
        <ToastContainer />
        <ReduxProvider>
          <>
            <ClientSideInitializer />
            {children}
          </>
        </ReduxProvider>

      </body>
    </html>
  );
}
