import { Helmet } from 'react-helmet';

export function Loader() {
  return (
    <main className="load">
      <Helmet>
        <title>Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Sistema Kids | Ministério Kids" />
      </Helmet>
      <div className="_load loader" id="loader"></div>
    </main>
  )
}