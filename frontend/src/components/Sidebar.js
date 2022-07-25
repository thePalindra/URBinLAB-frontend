import * as React from 'react'
import * as AiIcons from "react-icons/ai"
import * as FaIcons from "react-icons/fa"
import { Link } from 'react-router-dom'
import {SidebarData} from "./SidebarData"
import "./Sidebar.css"

function Sidebar() {
    const [sidebar, setSidebar] = React.useState(false)

    const showSideBar = () => setSidebar (!sidebar)
    return (
        <>
            <div className="sidebar">
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showSideBar}/>
                </Link>
            </div>
            <nav className={sidebar ? "side-menu active" : "side-menu"}>
                <ul className="side-menu-items">
                    <li className="side-toggle">
                        <Link to="#" className="menubars">
                            <AiIcons.AiOutlineClose/>
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                </Link>
                            </li> 
                        )
                    })}
                </ul>
            </nav>
        </>
    );
}
    


export default Sidebar