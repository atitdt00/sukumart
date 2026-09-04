"use client";

import { toast } from "react-toastify";
import { logoutUser } from "../../Services/Auth_Service";
import { useRouter } from "next/navigation";

export default function Header() {
  const router= useRouter()

  const handleLogout=async()=>{
    try{
      const response=await logoutUser();
      if(response.success){
        toast.success(response.message|| "Logout successfully")
        //redirect to login page
        router.push("/login")

        //refresh server client state;
        router.refresh();
      }

    }catch(error){
      console.error("Logout Error",error)
      toast.error(
        error.response?.data?.message || "Logout Failed"
      )
    }
  }
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Admin</span>

        <div className="w-9 h-9 rounded-full bg-[#0055B3] text-white flex items-center justify-center">
          A
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          {" "}
          <i className="fa-solid fa-right-from-bracket"></i>{" "}
          <span className="text-sm font-medium"> Logout </span>{" "}
        </button>
      </div>
    </header>
  );
}
