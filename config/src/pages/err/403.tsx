import { Helmet } from "react-helmet";

import { ErrButton } from "../../components/buttons/err";
import { Footer, Header } from "../../contents/layout";

export function RestrictPage() {
  return (
    <section className="_body _np _hw">
      <Helmet>
        <title>Acesso restrito • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Acesso restrito • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card _errpage">
          <div className="_div">
            <h1>403</h1>
            <p>Parece que a página é restrita.</p>
          </div>
          <ErrButton />
        </section>
      </main>
      <Footer />
    </section>
  );
}
