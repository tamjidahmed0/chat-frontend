import { Inter } from "next/font/google";
import '@/app/globals.css'
import Sidebar from "./sidebar";

// import { AppProvider } from "@/context/context";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat | Settings",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
   
      <body className=" bg-[#1A3142] flex ">
      {/* <AppProvider> */}
       
        <Sidebar />
      {children}
        
 
        {/* </AppProvider> */}
      
        
        </body>
    </html>
  );
}
