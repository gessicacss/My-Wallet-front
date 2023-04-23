import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignUp(e) {
    setLoading(true);
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("As senhas precisam ser iguais!");
    }
    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/sign-up`, body)
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 409) {
          return alert("E-mail já cadastrado");
        }
        alert(err.response.data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <SingUpContainer>
      <form onSubmit={handleSignUp}>
        <MyWalletLogo />
        <input
          name="name"
          placeholder="Nome"
          type="text"
          required
          value={form.name}
          disabled={loading}
          onChange={handleForm}
        />
        <input
          name="email"
          placeholder="E-mail"
          type="email"
          required
          value={form.email}
          disabled={loading}
          onChange={handleForm}
        />
        <input
          name="password"
          placeholder="Senha"
          type="password"
          required
          value={form.password}
          disabled={loading}
          onChange={handleForm}
        />
        <input
          name="confirmPassword"
          placeholder="Confirme a senha"
          type="password"
          required
          value={form.confirmPassword}
          disabled={loading}
          onChange={handleForm}
        />
        <button disabled={loading}>
          {loading ? (
            <span>
              <ThreeDots height="25" width="70" color="#fff" />
            </span>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SingUpContainer>
  );
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
