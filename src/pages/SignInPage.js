import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useContext, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function signinUser(e) {
    e.preventDefault();
    setLoading(true);
    console.log(loading);
    const body = { email, password };
    axios
      .post(`${process.env.REACT_APP_API_URL}/sign-in`, body)
      .then((res) => {
        const { token, name} = res.data;
        localStorage.setItem("user", JSON.stringify({token, name}))
        setUser(res.data);
        navigate("/home");
      })
      .catch((err) => {
        if(err.response.status === 404){
          return alert("E-mail não cadastrado")
        } else if (err.response.status === 401){
          return alert("Senha ou e-mail incorreto")
        }
        alert(err.response.data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <SingInContainer>
      <form onSubmit={signinUser}>
        <MyWalletLogo />
        <input
          type="email"
          value={email}
          required
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        ></input>
        <input
          type="password"
          value={password}
          required
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="senha"
        ></input>
        <button disabled={loading}>
          {loading ? (
            <span>
              <ThreeDots
                height="25"
                width="70"
                color="#fff"
              />
            </span>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <Link to="/cadastro">Primeira vez? Cadastre-se!</Link>
    </SingInContainer>
  );
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
