import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import ToastProvider from "../Components/ToastProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata = {
  title: "Sukumart",
  description: "Sukumart Online Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body className={`bg-gray-50 text-gray-800 ${jakarta.variable} ${sora.variable}`}>
        {children}
      <ToastProvider/>
      </body>
    </html>
  );
}