import { Link, Outlet } from 'react-router-dom'
import './layout.css'

const Layout = () => (
    <main>
        <nav>
            <ul>
                <li className="link">
                    <Link to="/">Encounters</Link>
                </li>
                <li className="link">
                    <Link to="/monsters">Homebrew Monsters</Link>
                </li>
                <li className="link">
                    <Link to="/players">Player characters</Link>
                </li>
                <li className="link">
                    <Link to="/manage-data">Manage data</Link>
                </li>
            </ul>
        </nav>
        <Outlet />
    </main>
)

export default Layout
