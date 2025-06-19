import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/custom.css";
import { Toaster } from 'react-hot-toast'
import { SignalRProvider } from '@/providers/SignalRProvider'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareNest - Nền tảng chăm sóc sức khỏe gia đình",
  description: "CareNest giúp các thành viên gia đình nhắc nhở, theo dõi và hỗ trợ lẫn nhau trong các hoạt động sức khỏe hàng ngày",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <SignalRProvider>
            {children}
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2935ab',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -2px rgba(41, 53, 171, 0.15)',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          </SignalRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
