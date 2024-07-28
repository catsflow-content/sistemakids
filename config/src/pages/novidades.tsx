import { GitCommit } from "@phosphor-icons/react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Footer, Header } from "../contents/layout";
import { sections } from "../utils/novidades";
import Pagination from "../contents/pagination";

export function Novidades() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSections = sections.slice(startIndex, endIndex);

  return (
    <section className="_body">
      <Helmet>
        <title>Novidades • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Novidades • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {currentSections.map((section, index) => (
          <section key={index} className="_card">
            <div className="_fav">
              <GitCommit className="ico" />
            </div>
            <h2>{section.title}</h2>
            <div className="_div">
              <ul className="_list">
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
        <Pagination totalItems={sections.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
      <Footer />
    </section>
  );
}
