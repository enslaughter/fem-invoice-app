import logo from "../assets/logo.svg";
import {ReactComponent as IconMoon} from "../assets/icon-moon.svg";
// import iconsun from "../assets/icon-sun.svg";
import avatar from "../assets/image-avatar.jpg";

import {Link} from "react-router-dom";

function Menubar(){
    return(
        <div className="menubar">
            <Link to="/">
                <div className="menu-logo">
                    <div className="menu-logo--styling"></div>
                    <div className="menu-logo--container">
                        <img src={logo} alt=""></img>
                    </div>
                </div>
            </Link>
            
            <div className="menu-right">
                <button className="menu-button-nightmode">
                    <IconMoon className="menu-theme-icon"/>
                </button>
                <div className="menu-button-profile--container">
                <button className="menu-button-profile">
                    <img src={avatar} alt=""></img>
                </button>
                </div>
                
            </div>
        </div>
    )
}

export default Menubar;