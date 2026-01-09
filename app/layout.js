// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Ghumante Yuwa Map",
  description: "Next.js + Map Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
