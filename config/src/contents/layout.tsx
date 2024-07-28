import React, { useEffect, useState } from "react";
import { ArrowUUpLeft, Equals, GitBranch, IdentificationBadge, Info, NewspaperClipping, SealWarning, SignOut, TerminalWindow, X } from "@phosphor-icons/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { handleLogout } from "../utils/auth";
import { verifyToken } from "../utils/verify";

interface AlertCardProps {
  status: string; 
  mensagem: string;
  onClose: () => void;
}

export function Header() {
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
    <header className={`_header${isAuthenticated ? '' : ' _jcenter'}`}>
      <img src="/config/assets/logotipo.svg" alt="Logotipo do Ministério Kids" width="112px" height="78.84px" />
      {isAuthenticated && (
        <nav>
          <button type="submit" title="Retornar para página anterior" className="_btn return" onClick={ReturnPage}>
            <ArrowUUpLeft />
          </button>
          <Menu>
            <MenuButton as="button" className="_btn menu" title="Menu lateral">
              <Equals />
            </MenuButton>
            <MenuList className="_menu">
              <MenuItem className="_opt p1" as="a" href="/dash" title="Acessar o painel inicial">
                <TerminalWindow />
                Painel
              </MenuItem>
              <MenuItem className="_opt" as="a" href="/conta" title="Acessar informações da conta">
                <IdentificationBadge />
                Conta
              </MenuItem>
              <MenuItem className="_opt" as="a" href="/novidades" title="Novidades da versão">
                <NewspaperClipping />
                Novidades
              </MenuItem>
              <MenuItem className="_opt" as="button" title="Sair da conta" onClick={handleLogout}>
                <SignOut />
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="_footer">
      <p>© 2024 Cat`s Flow</p>
      <span>
        <span>
          <GitBranch />
          B1.3.1
        </span>
      </span>
    </footer>
  );
}

export function AlertCard({ status, mensagem, onClose }: AlertCardProps) {
  return (
    <section className="_toast">
      <section data-status={status} className="_card alert">
        <button title="Fechar o cartão de alerta" className="_btn _fav rd" onClick={onClose}>
          <X weight="bold" />
        </button>
        <SealWarning weight="bold" className="ico" />
        <p>{mensagem}</p>
      </section>
    </section>
  );
}
