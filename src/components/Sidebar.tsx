import { NavLink, useNavigate } from 'react-router-dom'

const MENU = [
  { to: '/dashboard', label: '전체 문서' },
  { to: '/my-works', label: '내 작업' },
  { to: '/repositories', label: '저장소' },
  { to: '/settings', label: '설정' },
]

function Sidebar() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') ?? '사용자'

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <style>{styles}</style>
      <div className="sidebar__logo">NolGa</div>

      <nav className="sidebar__nav" aria-label="메인 메뉴">
        {MENU.map((m) => (
          <NavLink key={m.to} to={m.to} className="sidebar__link">
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__profile">
        <span className="avatar">{username.slice(0, 2).toUpperCase()}</span>
        <span className="sidebar__name">{username}</span>
        <button type="button" className="sidebar__logout" onClick={logout}>
          로그아웃
        </button>
      </div>
    </aside>
  )
}

const styles = `
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100vh;
  flex-shrink: 0;
  padding: 24px 16px;
  background: var(--surface);
  border-right: 1px solid var(--border);
}
.sidebar__logo {
  padding: 0 12px;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.sidebar__nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sidebar__link {
  padding: 12px;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.sidebar__link:hover { color: var(--text); }
.sidebar__link.active { background: var(--surface-2); color: var(--text); }
.sidebar__link:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.sidebar__profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 12px 0;
  border-top: 1px solid var(--border);
}
.sidebar__name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 500; }
.sidebar__logout {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
}
.sidebar__logout:hover { color: var(--text); background: var(--surface-2); }

@media (max-width: 860px) {
  .sidebar { display: none; }
}
`

export default Sidebar
