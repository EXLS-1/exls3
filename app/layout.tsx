import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toast } from "@/component/ui/Toast";
import { AuthProvider } from "@/lib/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EXCELLENT SERVICE - ERP",
  description: "Gestion intelligente du personnel et des activités de gardiennage (EXLS)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>
        <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
          {children}
          <Toast />
        </body>
      </AuthProvider>
    </html>
  );
}
