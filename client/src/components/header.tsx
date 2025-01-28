import { Omega, UserCircle } from "lucide-react"
import { Link } from "react-router"

import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-between w-full h-16 bg-slate-100 fixed px-4">
        <div className="flex items-center gap-2 text-lime-500">
          <Omega size={28}/>
          <p className="italic font-black text-lg">AtlasFit</p>
        </div>
        <Link to='perfil'>
          <UserCircle size={28} className="text-slate-600" />
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full h-16 grid place-items-center bg-slate-100 fixed">
      <div className="flex items-center gap-2 text-lime-500">
        <Omega size={28}/>
        <p className="italic font-black text-lg">AtlasFit</p>
      </div>
    </div>
  )
}