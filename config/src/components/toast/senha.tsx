import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@chakra-ui/react";
import { Eye, EyeClosed, Password } from "@phosphor-icons/react";

interface ChangePasswordProps {
  setAlerta: React.Dispatch<React.SetStateAction<{ status: string, mensagem: string }>>;
  onClose: () => void;
}

export function ChangePassword({ setAlerta, onClose }: ChangePasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_SERVIDOR_URL}/auth/change/password/user`, {
        newPassword,
        token
      });
      console.log('Senha alterada com sucesso!');
      setNewPassword('');
      setAlerta({ status: 'success', mensagem: 'Senha alterada com sucesso' });
      onClose();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao alterar senha. Por favor, tente novamente.' });
    }
  };

  return (
    <section className="_toast">
      <section className="_card">
        <div className="_fav">
          <Password className="ico" />
        </div>
        <h2>Alterar senha</h2>
        <form onSubmit={handleSubmit} className="_cnt">
          <Input className="_input" name="Nova senha" placeholder="Nova senha" autoComplete="new-password" aria-label="Nova senha do usuário" maxLength={25} min={5} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={show ? 'text' : 'password'} required />
          <div className="_btn rd" title={show ? 'Ocultar senha' : 'Mostrar senha'} onClick={handleClick}>
            {show ? <EyeClosed /> : <Eye />}
          </div>
        </form>
        <nav className="_nav">
          <button type="button" className="_btn center" onClick={onClose} >
            Cancelar
          </button>
          <button type="submit" className="_btn active center" title="Alterar senha">
            Alterar
          </button>
        </nav>
      </section>
    </section>
  );
}