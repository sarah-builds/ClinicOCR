import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClinicOCR - Medical Prescription Intelligence",
  description: "AI-powered document digitization platform converting handwritten doctor prescriptions into structured searchable records.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white`}>
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
