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
                    <Link to="/monsters">Monsters</Link>
                </li>
            </ul>
        </nav>
        <div className="wrapper">
            <Outlet />
        </div>
    </main>
)

export default Layout
