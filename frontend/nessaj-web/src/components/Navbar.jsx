import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', hint: 'Visão geral' },
  { to: '/projetos', label: 'Projetos', hint: 'Gerenciamento' }
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header
      className={`navbar${open ? ' open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className="navbar-bar"
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      >
        <div className="navbar-left">
          <span className="navbar-logo">NESSAJ</span>
          <span className="navbar-trigger">
            Navegar <span className={`navbar-caret${open ? ' up' : ''}`}>▾</span>
          </span>
        </div>
        <div className="navbar-right">
          <span>{user?.name}</span>
          <span className="navbar-divider">|</span>
          <button className="navbar-logout" onClick={(e) => { e.stopPropagation(); handleLogout() }}>
            Sair
          </button>
        </div>
      </div>

      <div className="navbar-dropdown">
        <div className="navbar-dropdown-inner">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `navbar-dropdown-link${isActive ? ' active' : ''}`}
            >
              <span className="navbar-dropdown-link-title">{link.label}</span>
              <span className="navbar-dropdown-link-hint">{link.hint}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}
