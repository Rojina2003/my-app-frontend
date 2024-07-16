import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import style from "../css/navbar.module.css";

const Navbar = () => {
  const { logout, auth } = useContext(AuthContext);

  const isAuthenticated = auth && auth.token;

  // const auth = (false)

  return (
    <nav className={style.navbar}>
      {isAuthenticated ? (
        <>
          <Link to="/" className={style.navbarbrand}>
            My App
          </Link>
          <div className={style.navbarCollapse}>
            <ul className={style.navbarAuto}>
              <li className={style.navbarItem}>
                <Link to="/" className={style.navlink}>
                  Posts
                </Link>
              </li>
              <li className={style.navbarItem}>
                <Link to="/add" className={style.navlink}>
                  Create
                </Link>
              </li>
              <li className={style.navbarItem}>
                <Link to={`/edit/${auth.userId}`} className={style.navlink}>
                  Profile
                </Link>
              </li>
              <li className={style.navbarItem}>
                <button className={style.navlink} onClick={logout}>
                  LogOut
                </button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Navbar;
