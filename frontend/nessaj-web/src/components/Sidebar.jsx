import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">NESSAJ</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/projetos" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          Projetos
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p style={{ margin: '0 0 0.6rem' }}>{user?.name} · {user?.role}</p>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  )
}
