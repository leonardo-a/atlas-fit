import { UserCircle } from 'lucide-react'
import { Link } from 'react-router'

import Logo from '/logo.svg'

export function Header() {
  return (
    <div className="flex items-center justify-between w-full h-16 bg-slate-100 fixed px-4">
      <Link to="/">
        <div className="flex items-center gap-2 text-lime-500">
          <img src={Logo} width={32} height={32} />
        </div>
      </Link>
      <Link to="/perfil">
        <UserCircle size={28} className="text-slate-600" />
      </Link>
    </div>
  )
}
