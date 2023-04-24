import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const { user, setUser } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_URL}/transactions/`, config)
      .then((res) => {
        const trans = res.data.reverse();
        setTransactions(trans);
        const totalAmount = trans.reduce((value, t) => {
          return t.type === "entrada" ? value + t.amount : value - t.amount;
        }, 0);
        setTotal(totalAmount);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  }, []);

  console.log(total);

  function handleLogOut() {
    localStorage.removeItem("user");
    setUser({});
    navigate("/");
  }

  console.log(transactions);

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {user.name}</h1>
        <BiExit style={{ cursor: "pointer" }} onClick={handleLogOut} />
      </Header>

      <TransactionsContainer>
        {transactions.length === 0 ? (
          <h3>Não há registros de entrada ou saída</h3>
        ) : (
          <>
            <ul>
              {transactions.map((t, id) => (
                <ListItemContainer key={id}>
                  <div>
                    <span>{t.date}</span>
                    <strong>{t.description}</strong>
                  </div>
                  <Value color={t.type === "saida" ? "negativo" : "positivo"}>
                    {t.amount.toFixed(2)}
                  </Value>
                </ListItemContainer>
              ))}
            </ul>
            <article>
              <strong>Saldo</strong>
              <Value color={total > 0 ? "positivo" : "negativo"}>{total.toFixed(2)}</Value>
            </article>
          </>
        )}
      </TransactionsContainer>

      <ButtonsContainer>
        <button onClick={() => navigate("/nova-transacao/entrada")}>
          <AiOutlinePlusCircle />
          <p>
            Nova <br /> entrada
          </p>
        </button>
        <button onClick={() => navigate("/nova-transacao/saida")}>
          <AiOutlineMinusCircle />
          <p>
            Nova <br />
            saída
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h3 {
    display:flex;
    justify-content: center;
    margin-top:20%;
    color:#868686;
    font-size:20px;
  }
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;

const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
