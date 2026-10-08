import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    <div className="shell">
      <style>{`.shell{display:flex;min-height:100vh}.shell__main{flex:1;min-width:0}`}</style>
      <Sidebar />
      <div className="shell__main">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
