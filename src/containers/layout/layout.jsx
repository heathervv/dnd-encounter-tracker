import { Link, Outlet } from "react-router-dom"

const Layout = () => (
  <main className="bg-base-200 h-screen overflow-scroll">
    <nav className="flex justify-end px-4 py-2 border-b border-base-content/10">
      <ul className="flex self-end gap-3">
        <li className="text-sm link">
          <Link to="/">Encounters</Link>
        </li>
        <li className="text-sm link">
          <Link to="/monsters">Homebrew Monsters</Link>
        </li>
        <li className="text-sm link">
          <Link to="/players">Player characters</Link>
        </li>
        <li className="text-sm link">
          <Link to="/manage-data">Manage data</Link>
        </li>
      </ul>
    </nav>
    <div className="p-4">
      <Outlet />
    </div>
  </main>
)

export default Layout
