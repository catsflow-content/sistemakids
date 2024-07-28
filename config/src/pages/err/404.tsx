import { Helmet } from "react-helmet";


import { ErrButton } from "../../components/buttons/err";
import { Footer, Header } from "../../contents/layout";

export function NotFoundPage() {
  return (
    <section className="_body _np _hw">
      <Helmet>
        <title>Página não encontrada • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Página não encontrada • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card _errpage">
          <div className="_div">
            <h1>404</h1>
            <p>Parece que a página não existe.</p>
          </div>
          <ErrButton />
        </section>
      </main>
      <Footer />
    </section>
  );
}
