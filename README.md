# Aplicativo de Quiz

Este é um aplicativo de quiz desenvolvido em Angular, que permite aos usuários responder perguntas em várias categorias e acompanhar seu progresso e estatísticas. O aplicativo inclui recursos como persistência de dados com Supabase, autenticação de usuários, e uma interface moderna e intuitiva.

## Tecnologias Utilizadas
- **Angular**: Framework principal para o desenvolvimento frontend.
- **Supabase**: Utilizado como backend para autenticação e gerenciamento de dados.
- **Mailgun**: Serviço utilizado para SMTP, necessário para versão gratuita do Supabase.
- **CSS**: Para estilização e design responsivo das telas.
- **Font Awesome**: Ícones utilizados na interface do usuário.

## Funcionalidades do Aplicativo
- **Quiz**: Permite que os usuários respondam perguntas em várias categorias.
- **Autenticação**: Os usuários podem se registrar e fazer login no aplicativo. (Emails cadastrados no mailgun).
- **Modo de Acessibilidade**: Opção para mudar o tema para melhorar a acessibilidade.
- **Estatísticas do Usuário**: Mostra as estatísticas de acertos e precisão em cada categoria.
- **Configurações**: Tela de configurações para personalizar a experiência do usuário.
- **Domínio de Categoria**: Exibe a categoria em que o usuário tem melhor desempenho.

## Como Desenvolver
O aplicativo foi desenvolvido usando Angular como framework principal e Supabase para a persistência de dados e autenticação. A lógica de negócios foi implementada em serviços Angular que interagem com o banco de dados do Supabase para obter dados de perguntas, respostas e estatísticas do usuário.

### Estrutura de Arquivos
- `src/app/core/`: Contém os serviços centrais como `supabase.service.ts` para comunicação com a API do Supabase.
- `src/app/features/`: Contém os componentes principais do aplicativo, como as telas de quiz, configuração, domínio e login.
- `src/assets/`: Contém arquivos de imagem, CSS personalizado e outros recursos estáticos.
- `styles.css`: Arquivo CSS que aplica as alterações para o tema de acessibilidade.

## Como Testar como Client
- **Acesse a URL**: essentialis.vercel.app/login
- **Faça login com**: fariasvitor270@gmail.com
- **Senha**: 123456

## Como Testar o Aplicativo

### Pré-requisitos
- **Node.js**: Certifique-se de ter o Node.js instalado (versão 12 ou superior).
- **Angular CLI**: Execute `npm install -g @angular/cli` para instalar a CLI do Angular.

### Passos para Testar
1. Clone este repositório:
   ```bash
   git clone https://github.com/guto-farias/EssentialisQuizPWA
   cd EssentialisQuizPWA
2. Instale as dependências do projeto:
   ```bash
   npm install
3. Inicie o servidor de desenvolvimento:
   ```bash
   ng serve
4. Acesse o aplicativo no navegador:
   http://localhost:4200
