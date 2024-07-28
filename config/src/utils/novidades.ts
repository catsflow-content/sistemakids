export const sections = [
  {
    title: "<!-- B1.3.1 -->",
    items: [
      "Melhroia: Páginas de gerenciar alunos e chamadas das turmas reformuladas para usar nova lógica de verificação de permissão. (SK-137)",
      "Melhroia: Páginas de gerenciar alunos e chamadas das turmas reformuladas para usarem componente de botão de páginação. (SK-139)",
      "Melhroia: Estrotura de pastas do src reorganizado. (SK-132)",
      "Melhroia: Toast criado para substituir página de alteração de senha do usuário, tanto para a página de conta e gerenciar usuários. (SK-136 & SK-135)",
      "Melhroia: Lógica de páginação universal criada. (SK-134)",
      "Correção: Erro nas estilização da foto de perfil corrigidos. (SK-123)",
      "Correção: Erro nos espaçamentos e larguras dos menus corrigidos. (SK-122)",
      "Melhoria: Lógica de paginação adicionado nas páginas de gerenciar usuários, chamadas e alunos. (SK-120)",
      "Correção: Erro nas aspas da importação do servidor no gráfico da presença da turma do maternal corrigido. (SK-125)",
      "Correção: Mensagem de sem chamadas aparece novamente. (SK-121)",
      "Melhoria: Mensagens de sem alunos, chamadas e usuários reunidas no arquivo events.tsx. (SK-127)",
    ]
  },
  {
    title: "<!-- B1.3.0 -->",
    items: [
      "Melhoria: Url do servidor adicionado no arquivo .env para melhor alteração caso necessário. (SK-114)",
      "Novidade: Lógica para redirecionar usuários para página de servidor desligado quando o servidor não estiver operando. (SK-113)",
      "Melhoria: Lógica dos Tokens melhorada para serem salvos localmente. (SK-97)",
      "Correção: Erros de compatibilidade do TypeScript solucionados. (SK-115)",
      "Melhoria: Botão para selecionar professor no registro da chamada das turmas. (SK-107)",
      "Melhoria: Tabela dos alunos no banco de dados melhorada para conter url de foto de perfil. (SK-96)",
      "Correção: Campos de marcar não aparecem ativos caso aluno esteja presente. (SK-103)",
      "Correção: Dados dos usuários não aparecem na página de visualizar dados dos usuários. (SK-118)",
      "Correção: Nomes dos usuários não aparecem em campos de seleção. (SK-110)",
      "Melhoria: Página da conta do usuário melhorada para conter foto do usuário e permissão. (SK-95)",
      "Melhoria: Opções do menu agora contem icones. (SK-109)",
      "Melhoria: Alinhamento dos textos dos card's alterada para melhor visibilidade durante leituras. (SK-106)",
      "Correção: Opção de filtrar por permissão de 'pastor' adicionada no campo de seleção na página de gerenciar usuários. (SK-105)",
      "Melhoria: Compos de senha e usuários contem autocomplete e arial-label para melhoria de acessibilidades. (SK-90)",
      "Correção: Campo do nome do professor na página de visualizar dados da chamada não está desabilitado. (SK-104)",
    ]
  },
  {
    title: "<!-- B1.2.4 -->",
    items: [
      "Melhoria: Estilização dos botões melhorada para ter largura e altura mímina exigida. (SK-93)",
      "Melhoria: Estilização dos checkbox melhorada para ter largura mímina exigida e cor de fundo diferente quando ativo. (SK-92)",
      "Correção: Página de gerenciar juniores não mostrava mensagem de sucesso quando chamada era excluida. (SK-86)",
      "Novidade: Campos de seleção para selecionar professores usaram lógica para retornar usuários salvos no banco de dados. (SK-66)",
      "Melhorias nos selects, agora são separados por gurpos, como turma, permissão e etc.",
      "Correção no alerta ao excluir chamada do maternal e juniores.",
      "Melhoria na estilização do botão editar e cancelar do página de visualizar dados dos alunos.",
      "Lógica no registro de alunos e visualização dos dados dos alunos para turmas serem selecionadas de forma automatica pela idade.",
      "Melhoria nos cards de alerta para aprecerem fixados no fim da tela.",
      "Card de confirmação de exclusão de alunos, usuários e chamadas adicionado.",
      "Correção em bug das permissões dos cards do Painel Inicial.",
      "Correção nos Select da página de registro de usuários.",
      "Títulos dos botões adicionado, para melhorias de acessibilidades.",
      "Problema ao atualizar chamada do juniores foi corrigido.",
      "Problema no grafíco de estatísticas de presença na chamada do maternal na página de estastísticas corrigida.",
      "Correção no modal dos grafícos de visualizar alunos presentes na chamada das turmas corrigido.",
      "Problemas no grafíco de visualizar alunos presentes na chamada do maternal corrigido.",
    ]
  },
  {
    title: "<!-- B1.2.3 -->",
    items: [
      "Correção de erros nos gráficos dos alunos.",
      "Correção no erro ao salvar chamadas."
    ]
  },
  {
    title: "<!-- B1.2.2 -->",
    items: [
      "Card de estatísticas de aulas dadas pelo professor na página user.",
      "Página de estatísticas criada.",
      "Melhorias e limpezas nos códigos e estrotura de pastas.",
      "Correções de erros e bugs nos códigos das páginas.",
      "Lógica para alterar dados das chamada criado.",
      "Grafícos para presença de turma e divisão de alunos por turma e idade."
    ]
  },
  {
    title: "<!-- B1.2.1 -->",
    items: [
      "Arquivo de visualizar dados dos alunos melhorado para utilizar nova lógica de verificação das permissões",
      "Arquivo de registrar chamadas e visualizar dados dos alunos foram simplificado e melhorados.",
      "Páginas que tratam sobre chamadas e alunos foram atualizadas para usar novas regras de data do Prisma.",
      "Lógica para edição de dados de usuário e alunos criada.",
      "Lógica para proteção de páginas de administradores criada.",
      "Componente guardian criado para páginas de acesso de administradores.",
      "Melhoria no formulário das chamadas onde reseta ao ser cadastrado com sucesso.",
      "Limpeza e melhoria nos códigos do servidor express.",
      "Página para administrador alterar senha dos usuários criada.",
      "Pasta de componentes e pages.",
      "Melhoria no componente Alert.",
      "Erro ao tentar viualizar chamadado feita corrigido."
    ]
  },
  {
    title: "<!-- B1.2.0 -->",
    items: [
      "Lógica de limitar chamadas por dia se configuração estiver ativa criada.",
      "Lógica de paginação dos ChangeLogs do arquivo novidade.",
      "Página para visualizar dados dos professores criada.",
      "Página de configuração do sistema criada (admin)."
    ]
  },
  {
    title: "<!-- B1.1.10 -->",
    items: [
      "Página e lógica para visualizar alunos presentes nas chamdas criada.",
      "Página e lógica para visualizar dados dos alunos criada.",
      "Nova lógica dos tokens sendo usada nos componentes do Header e Footer. Além das páginas de Home, Login e Dash.",
      "Página com informações do sistema criada.",
      "Correção do erro na hora de salvar informação do usuário no armazenamento da sessão.",
      "Formlário de cadastro de usuários atualizado para utilizar lógica das fotos de perfil."
    ]
  },
  {
    title: "<!-- B1.1.9 -->",
    items: [
      "Inclusão de campo de foto na tabela de usuários, porém lógica não criada.",
      "Filtros na página de gerenciar usuários adicionado.",
      "Erro de datas aparecerem um dia antes na página de gerenciar chamadas sulocionado.",
      "Lógica dos Tokens melhorada para conter o usuário, ID do usuário, permissão e token.",
      "Registro de atividades dos usuários criado, no momento somente login e logout são registrados.",
      "Melhoria no formulário de registro de usuários para resetar formulário quando o usuário é salvo com sucesso."
    ]
  },
  {
    title: "<!-- B1.1.8 -->",
    items: [
      "Criada a página de alteração de senha.",
      "Criação do componente para primeiro acesso.",
      "Criação da página para visualização das chamadas registradas.",
      "Melhoria nos cards do painel inicial (dash) para melhor organização das turmas.",
      "Melhoria e correções nos estilos do cards, botões e contaners.",
      "Correção de erros no estilo do rodapé na versão de celulares.",
      "Páginas de registro de melhorias e novidades criada."
    ]
  },
  {
    title: "<!-- B1.1.7 -->",
    items: [
      "Botão de retornar ao topo adicionado ao rodapé.",
      "Função para os usuários poderem alterar suas senhas adicionado.",
      "Erro de alerta de confirmação de usuário cadastrado não aparecer foi corrigido.",
      "Alerta de exclusão de usuários e alunos adicionado."
    ]
  },
  {
    title: "<!-- B1.1.6 -->",
    items: [
      "Função para administradores alterarem senha dos usuários.",
      "Melhoria no layout dos modais.",
      "Botão para visualização da senha adcionado.",
      "Página de visualização dos usuários cadastrados."
    ]
  },
  {
    title: "<!-- B1.1.5 -->",
    items: [
      "Botão de fechar adicionado aos alert."
    ]
  }
];
