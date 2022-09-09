import { useState, useEffect, createContext, useContext } from "react";
import Cookies from "universal-cookie";

const BaliseAuth = createContext();

export const AuthContext = () => useContext(BaliseAuth);

export default function FunctionAuthContext(props) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const cookie = new Cookies();
    const getCookie = cookie.get("betaseries");
    if (getCookie) {
      setToken(getCookie);
    }
  }, []);

  useEffect(() => {
    const cookie = new Cookies();
    if (token) {
      cookie.set("betaseries", token, { path: "/" });
    }
  }, [token]);


  const value = {
    token,
    setToken,
  };

  return (
    <BaliseAuth.Provider value={value}>{props.children}</BaliseAuth.Provider>
  );
}
