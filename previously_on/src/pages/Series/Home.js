import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../../context/Auth";
import Cookies from "universal-cookie";

import logout from "../../assets/logout.png"

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = new Cookies();
    const getCookie = cookie.get("betaseries");

    if (!getCookie) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log("abc");
  }

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <Link to="/">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <svg
              className="fill-current h-8 w-8 mr-2"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
            </svg>
            <span className="font-semibold text-xl tracking-tight">
              Tailwind CSS
            </span>
          </div>
        </Link>

        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link to="/">
              <p className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Home
              </p>
            </Link>

            <Link to="/membre">
              <p className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Membre
              </p>
            </Link>
          </div>
          <div>
            <img
              className="w-10 h-10 cursor-pointer"
              src={logout}
              onClick={handleLogout}
              alt="logout"
            />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
