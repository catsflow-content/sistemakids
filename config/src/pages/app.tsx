import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Helmet } from 'react-helmet';

import { Dash } from "./dash";
import { Home } from "./home";
import { Login } from "./login";

import { NotFoundPage } from "./err/404";
import { RestrictPage } from "./err/403";
import { Novidades } from "./novidades";
import GUS from "./gerenciar/usuarios";
import { Profile } from "./view/conta";
import { OffServer } from "./err/off";

import AuthenticationGuard from "../contents/auth/guardian";
import AdminGuard from "../contents/auth/adminguard";
import { ACP } from "./gerenciar/config";
import { GCJ } from "./gerenciar/gcj";
import { GCM } from "./gerenciar/gcm";
import { GTJ } from "./gerenciar/gtj";
import { GTM } from "./gerenciar/gtm";
import { RNA } from "./registrar/alunos";
import { Juniores } from "./registrar/crj";
import { Maternal } from "./registrar/crm";
import { RNU } from "./registrar/usuario";
import { Statistics } from "./statistics";
import { AVD } from "./view/aluno";
import { UVD } from "./view/usuarios";
import { VCJ } from "./view/vcj";
import { VCM } from "./view/vcm";

export function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Sistema Kids | Ministério Kids" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/novidades" element={<Novidades />} />
        <Route path="/dash" element={<AuthenticationGuard component={Dash} />} />
        <Route path="/conta" element={<AuthenticationGuard component={Profile} />} />

        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/err/403" element={<RestrictPage />} />
        <Route path="/err/off" element={<OffServer />} />

        <Route path="/admin/config" element={<AdminGuard component={ACP} />} />

        <Route path="/gerenciar/usuario" element={<AdminGuard component={GUS} />} />

        <Route path="/estatisticas" element={<AuthenticationGuard component={Statistics} />} />

        <Route path="/registrar/aluno" element={<AdminGuard component={RNA} />} />
        <Route path="/registrar/usuario" element={<AdminGuard component={RNU} />} />

        <Route path="/view/aluno" element={<AuthenticationGuard component={AVD} />} />
        <Route path="/view/usuario" element={<AdminGuard component={UVD} />} />

        <Route path="/turma/juniores/" element={<AuthenticationGuard component={GTJ} />} />
        <Route path="/turma/juniores/chamada/" element={<AuthenticationGuard component={Juniores} />} />
        <Route path="/turma/juniores/chamada/gerenciar" element={<AuthenticationGuard component={GCJ} />} />
        <Route path="/turma/juniores/chamada/view" element={<AuthenticationGuard component={VCJ} />} />

        <Route path="/turma/maternal/" element={<AuthenticationGuard component={GTM} />} />
        <Route path="/turma/maternal/chamada/" element={<AuthenticationGuard component={Maternal} />} />
        <Route path="/turma/maternal/chamada/gerenciar" element={<AuthenticationGuard component={GCM} />} />
        <Route path="/turma/maternal/chamada/view" element={<AuthenticationGuard component={VCM} />} />
      </Routes>
    </BrowserRouter>
  )
}