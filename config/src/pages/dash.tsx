import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios, { AxiosResponse } from "axios";

import { PrimeiroAcesso } from "../contents/primeiroacesso";

import { Baby, Student, BookBookmark, ClipboardText, Backpack, Toolbox, ChartPieSlice, Notebook, Notepad, IdentificationBadge, User, AddressBook, GearFine, FolderOpen, ArticleNyTimes } from "@phosphor-icons/react";
import { Footer, Header } from "../contents/layout";
import { verifyPermission } from "../utils/verify";

interface ProfileData {
  password: string;
}

interface Link {
  title: string;
  href: string;
  icon: JSX.Element;
}

const CardSection = ({ title, requiredPermissions, userPermissions, icon, links }: { title: string; requiredPermissions: string[]; userPermissions: string[]; icon: JSX.Element; links: Link[] }) => {
  const hasPermission = requiredPermissions.some((perm: string) => userPermissions.includes(perm));

  return (
    hasPermission && (
      <section className="_card">
        <div className="_fav">
          {icon}
        </div>
        <h2>{title}</h2>
        <div className="_div">
          {links.map((link: Link, index: number) => (
            <a key={index} title={link.title} className="_btn" href={link.href}>
              {link.icon}
              {link.title}
            </a>
          ))}
        </div>
      </section>
    )
  );
};

export function Dash() {
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem("token");

      try {
        const permission = await verifyPermission();
        setPermissions([permission]);

        const profileResponse: AxiosResponse<ProfileData> = await axios.post(`${import.meta.env.VITE_SERVIDOR_URL}/auth/verify/profile`, { token });

        if (!profileResponse.data) {
          throw new Error("Erro ao obter informações do usuário");
        }

        const profileData: ProfileData = profileResponse.data;
        setIsDefaultPassword(profileData.password === "@MinisterioKids721");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erro desconhecido");
        }
      }
    };

    fetchPermissions();
  }, []);

  return (
    <section className="_body _dash">
      <Helmet>
        <title>Painel Inicial • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Painel Inicial • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {isDefaultPassword && <PrimeiroAcesso />}
        <CardSection title="Turma do Maternal" requiredPermissions={['administrador', 'lider', 'maternal']} userPermissions={permissions} icon={<Baby className="ico" />} links={[
          { title: "Alunos do maternal", href: "/turma/maternal/", icon: <Student className="ico" /> },
          { title: "Chamada do maternal", href: "/turma/maternal/chamada/", icon: <BookBookmark className="ico" /> },
          { title: "Gerenciar chamadas", href: "/turma/maternal/chamada/gerenciar", icon: <ClipboardText className="ico" /> }
        ]}
        />
        <CardSection title="Turma do Juniores" requiredPermissions={['administrador', 'lider', 'juniores']} userPermissions={permissions} icon={<Backpack className="ico" />} links={[
          { title: "Alunos do juniores", href: "/turma/juniores/", icon: <Student className="ico" /> },
          { title: "Chamada do juniores", href: "/turma/juniores/chamada/", icon: <BookBookmark className="ico" /> },
          { title: "Gerenciar chamadas", href: "/turma/juniores/chamada/gerenciar", icon: <ClipboardText className="ico" /> }
        ]}
        />
        <CardSection title="Utilitários" requiredPermissions={['administrador', 'lider', 'maternal', 'juniores']} userPermissions={permissions} icon={<Toolbox className="ico" />} links={[
          { title: "Estatísticas", href: "/estatisticas", icon: <ChartPieSlice className="ico" /> },
          { title: "Material de estudo", href: "https://drive.google.com/drive/folders/11YmX-xli_EF8_DZ8pm9LPTDzCMquOfe-?usp=drive_link", icon: <Notebook className="ico" /> },
          { title: "Cadastro infantil", href: "https://drive.google.com/drive/folders/1vzMSk5CtaKO_o64BbAeenDm3d9qhRr8K?usp=drive_link", icon: <Notepad className="ico" /> }
        ]}
        />
        {/* <CardSection title="Matérias" requiredPermissions={['administrador', 'lider']} userPermissions={permissions} icon={<FolderOpen className="ico" />} links={[
          { title: "Gerenciar grupos", href: "/gerenciar/grupos", icon: <FolderOpen className="ico" /> },
          { title: "Gerenciar matérias", href: "/gerenciar/materias", icon: <ArticleNyTimes className="ico" /> }
        ]}
        /> */}
        <CardSection title="Painel de controle" requiredPermissions={['administrador']} userPermissions={permissions} icon={<IdentificationBadge className="ico" />} links={[
          { title: "Registrar aluno", href: "/registrar/aluno", icon: <Student className="ico" /> },
          { title: "Registrar usuário", href: "/registrar/usuario", icon: <User className="ico" /> },
          { title: "Gerenciar usuário", href: "/gerenciar/usuario", icon: <AddressBook className="ico" /> },
          { title: "Configurações", href: "/admin/config", icon: <GearFine className="ico" /> }
        ]}
        />
      </main>
      <Footer />
    </section>
  );
}
