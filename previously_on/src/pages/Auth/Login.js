import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import OAuth2Login from "react-simple-oauth2-login";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

export default function Login() {
  const { setToken } = AuthContext();
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const cookie = new Cookies();
    const getCookie = cookie.get("betaseries");
  // if(code){
    if (getCookie) {
      navigate("/");
    // }
  }
  }, [navigate]);

  const onSuccess = (response) => setCode(response);
  const onFailure = (response) => console.error(response);

  useEffect(() => {
    if (code) {
      axios
        .post("https://api.betaseries.com/oauth/access_token", null, {
          params: {
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000/",
            code: code.code,
          },
        })
        .then((response) => {
          setToken(response.data.access_token);
          navigate("/");
        })
        .catch((err) => console.warn(err));
    }
  }, [code, navigate, setToken]);


  return (
    <div>
      <OAuth2Login
        authorizationUrl="https://www.betaseries.com/authorize"
        responseType="code"
        clientId={process.env.REACT_APP_CLIENT_ID}
        redirectUri="http://localhost:3000/"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />

    </div>
  );
}
