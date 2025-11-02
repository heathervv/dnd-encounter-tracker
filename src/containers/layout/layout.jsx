import { Link, Outlet } from "react-router-dom"
import { THEMES, useThemeContext } from "../../context/theme/theme-context"
import Toggle from "../../components/Toggle"
import Sun from "../../assets/sun"
import Moon from "../../assets/moon"

const Layout = () => {
  const { activeTheme, saveActiveTheme } = useThemeContext()

  const isDarkMode = activeTheme === THEMES.DARK

  const handleToggle = () => {
    saveActiveTheme?.(isDarkMode ? THEMES.LIGHT : THEMES.DARK)
  }
  return (
    <main className="bg-base-200 h-screen overflow-scroll">
      <nav className="flex justify-end px-4 py-2 border-b border-base-content/10 gap-4">
        <Toggle
          LeftOption={Sun}
          RightOption={Moon}
          value="dark"
          checked={activeTheme === THEMES.DARK}
          onToggle={handleToggle}
        />
        <ul className="flex self-end gap-2">
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
}

export default Layout
