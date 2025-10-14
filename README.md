# Larissa Dashboard Frontend

O Larissa Dashboard é uma ferramenta de monitoramento de métricas de requisições HTTP. Este repositório contém o código-fonte do frontend da aplicação, desenvolvido com Next.js e TypeScript.

## Features

- **Visualização de Métricas:** Acompanhe em tempo real as principais métricas da sua aplicação, como número de requisições, tempo médio de resposta e taxa de erros.
- **Gráficos Intuitivos:** Gráficos que facilitam a compreensão do comportamento da sua aplicação ao longo do tempo.
- **Logs de Requisições:** Visualize os logs das requisições mais recentes, incluindo informações detalhadas sobre cada uma.
- **Endpoints Mais Acessados:** Identifique rapidamente quais são os endpoints mais utilizados da sua aplicação.
- **Erros Recentes:** Monitore os últimos erros que ocorreram, facilitando a identificação e resolução de problemas.

## Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Query](https://tanstack.com/query/latest)

## Rodando o Projeto

### Com Docker (Recomendado)

Para rodar a aplicação com Docker, certifique-se de que você tenha o [Docker](https://www.docker.com/get-started/) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados. Em seguida, execute o comando abaixo:

```bash
docker-compose up -d
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Localmente

Para rodar a aplicação localmente, você precisa ter o [Node.js](https://nodejs.org/en/) e o [Yarn](https://yarnpkg.com/) instalados. Siga os passos abaixo:

1. **Instale as dependências:**

```bash
yarn install
```

2. **Rode o servidor de desenvolvimento:**

```bash
yarn dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).
