import type { Metadata } from "next";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitcoin Mining Calculator",
  description: "Calculate Bitcoin mining profitability based on hash rate, power consumption, and electricity costs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let isDark = localStorage.getItem('darkMode') === 'true';
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
