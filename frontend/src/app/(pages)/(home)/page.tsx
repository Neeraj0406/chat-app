import { PrivateRoute } from "@/app/component/auth/Auth"
import Chat from "@/app/component/Chat/Chat";
import Header from "@/app/component/header/Header";
import Sidebar from "@/app/component/Sidebar/Sidebar";

export default function Home() {

  return (
    <PrivateRoute>
      <Header />

      <div className="flex">
        <Sidebar />
        <Chat />
      </div>
    </PrivateRoute>
  );
}


