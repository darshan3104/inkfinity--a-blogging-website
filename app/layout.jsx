import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inkfinity – The Modern Blogging Platform",
  description:
    "Write, share, and discover stories that matter. Join Inkfinity – a beautiful, modern blogging platform for creators.",
  keywords: "blog, writing, stories, articles, content creation",
  openGraph: {
    title: "Inkfinity – The Modern Blogging Platform",
    description: "Write, share, and discover stories that matter.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
