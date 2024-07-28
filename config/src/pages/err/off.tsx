import { Helmet } from "react-helmet";

import { Footer, Header } from "../../contents/layout";

export function OffServer() {
  return (
    <section className="_body _np _hw">
      <Helmet>
        <title>Servidor desligado • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Servidor desligado • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card _errpage">
          <div className="_div">
            <h1>Ops!</h1>
            <p>Parece que o servidor não está ligado.</p>
          </div>
          <a title="Página inicial" className="_btn" href="/">
            Tentar novamente
          </a>
        </section>
      </main>
      <Footer />
    </section>
  );
}
