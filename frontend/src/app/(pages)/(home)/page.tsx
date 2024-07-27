import { PrivateRoute } from "@/app/component/auth/Auth"
import Chat from "@/app/component/Chat/Chat";
import Header from "@/app/component/header/Header";
import Sidebar from "@/app/component/Sidebar/Sidebar";
import { useEffect, useState } from "react";
interface ChatPageProps {
  searchParams: { chatId?: string };
}

export default function Home({ searchParams }: ChatPageProps) {

  const chatId = searchParams?.chatId || ""; // Extract chatId from searchParams



  return (
    <PrivateRoute>
      <Header />

      <div className="md:flex flex flex-nowrap">
        
        <Sidebar />
        <Chat />
      </div>
    </PrivateRoute>
  );
}


