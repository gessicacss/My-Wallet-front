import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components"
import { UserContext } from "../contexts/UserContext";

export default function TransactionsPage() {
  const {user} = useContext(UserContext);
  const {tipo} = useParams();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function sendTransaction(e) {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    if (isNaN(amount)) {
      setLoading(false);
      return alert("Valor inválido, por favor coloque apenas números");
    }
    const body = { description, amount: Number(amount) };
    axios
      .post(`${process.env.REACT_APP_API_URL}/transactions/${tipo}`, body, config)
      .then((res) => {
        console.log(res.data);
        navigate("/home");
      })
      .catch((err) => {
        if (err.response.status === 401) return alert('Faça login');
        alert(err.response.data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo === 'saida' ? "Saída" : "Entrada"}</h1>
      <form onSubmit={sendTransaction}>
        <input placeholder="Valor" type="text" required disabled={loading} value={amount} onChange={(e) => setAmount(e.target.value)}/>
        <input placeholder="Descrição" type="text" required disabled={loading} value={description} onChange={(e) => setDescription(e.target.value)}/>
        <button>Salvar {tipo === 'saida' ? "saída" : "entrada"}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
