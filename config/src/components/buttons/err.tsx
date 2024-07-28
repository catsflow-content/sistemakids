import { House, ArrowUUpLeft, Browsers } from "@phosphor-icons/react";
import { verifyToken } from "../../utils/verify";
import { useState, useEffect } from "react";

export function ErrButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const isAuth = await verifyToken();
      setIsAuthenticated(isAuth);
    };

    checkToken();
  }, []);

  const ReturnPage = () => {
    window.history.back();
  };

  return (
    <div className="_div">
      <nav className="_nav">
        <a title="Página inicial" className="_btn" href="/">
          <House />
          Home
        </a>
        <button type="submit" title="Retornar para página anterior" className="_btn return" onClick={ReturnPage}>
          <ArrowUUpLeft />
          Voltar
        </button>
      </nav>
      {isAuthenticated && (
        <a title="Painel inicial" className="_btn" href="/dash">
          <Browsers />
          Painel inicial
        </a>
      )}
    </div>
  )
}