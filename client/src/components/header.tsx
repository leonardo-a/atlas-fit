import { UserCircle } from 'lucide-react'
import { Link } from 'react-router'

import Logo from '/logo.svg'

export function Header() {
  return (
    <div className="flex items-center justify-between w-full h-16 bg-slate-100 dark:bg-slate-900 fixed px-4 z-50">
      <Link to="/">
        <div className="flex items-center gap-2 text-lime-500">
          <img src={Logo} width={32} height={32} />
        </div>
      </Link>
      <Link to="/perfil">
        <UserCircle size={28} className="text-slate-600 dark:text-lime-500" />
      </Link>
    </div>
  )
}
