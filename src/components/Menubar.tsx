import logo from "../assets/logo.svg";
import { ReactComponent as IconMoon } from "../assets/icon-moon.svg";
import { ReactComponent as IconSun } from "../assets/icon-sun.svg";
import avatar from "../assets/image-avatar.jpg";

import { Link } from "react-router-dom";

function Menubar(props: any) {
  function toggleTheme() {
    if (props.theme === "dark") {
      props.setTheme("light");
    } else {
      props.setTheme("dark");
    }
  }
  return (
    <div className="menubar-container">
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
          <button className="menu-button-nightmode" onClick={toggleTheme}>
            {props.theme === "dark" ? (
              <IconSun className="menu-theme-icon" />
            ) : (
              <IconMoon className="menu-theme-icon" />
            )}
          </button>
          <div className="menu-button-profile--container">
            <button className="menu-button-profile">
              <img src={avatar} alt=""></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menubar;
