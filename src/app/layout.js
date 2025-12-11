import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "BibleVerse Postcards",
  description: "Reflect on Bible verses and save them as postcards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
