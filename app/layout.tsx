import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "Eko Med Treyd",
  description:
    "Eko Med Treyd tomonidan tashkil etiladigan o‘quv kurslari dorixona xodimlarining kasbiy malakasini oshirishga qaratilgan.",
  keywords: [
    "eko med",
    "med treyd",
    "eko med treyd",
    "tibbiy uskunalar",
    "med texnika",
    "medical equipment",
  ],
  authors: [{ name: "Eko Med Treyd" }],

  icons: {
    icon: "/logo.png", // 🔥 FAVICON SHU YERDA
  },

  openGraph: {
    title: "Eko Med Treyd",
    description: "Tibbiy uskunalar va med texnika bo‘yicha ishonchli hamkor.",
    type: "website",
    images: ["/logo.png"], // (ixtiyoriy, lekin yaxshi)
  },

  verification: {
    google: "XX47B1i_phjPjrXVTC2tt_9Vq-9v0RBj5u4yxvHhjy0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>
        <div className="pageWrapper">
          <Header />
          <main className="content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
