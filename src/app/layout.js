import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata = {
  title: "Universal Wishlist | Premium Price Tracker",
  description: "Samla dina favoritprodukter från hela nätet på ett och samma ställe, och låt oss bevaka prisfallen åt dig.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={inter.variable}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
