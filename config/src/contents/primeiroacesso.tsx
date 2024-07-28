import { IdentificationBadge, IdentificationCard } from "@phosphor-icons/react";

export function PrimeiroAcesso() {
  return (
    <section className="_card">
      <div className="_fav">
        <IdentificationCard className="ico" />
      </div>
      <h2>Primeiro acesso?</h2>
      <p>Parabéns! Agora que você acessou o sistema Kids, recomendamos que altere sua senha padrão para garantir que sua conta não fique vulnerável no futuro.</p>
      <a className="_btn" title="Gerenciar sua conta" href="/conta">
        <IdentificationBadge className="ico" />
        Sua conta
      </a>
    </section>
  )
}