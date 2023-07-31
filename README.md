# Driven-BoardCamp-API 🎲
Projeto _back-end_ para construção de uma aplicação para locadora de jogos de tabuleiro.<br>
Repositório _back-end_ para desenvolvimento da API.
## Requisitos Obrigatórios ⚠️

### Geral:
- **Deploy do projeto back-end e do banco de dados na nuvem**.
- Utilização do banco de dados PostgreSQL.
- Arquiteturar o projeto em _controllers_, _routers_, _middlewares_ e _schemas_.
- Validação de dados utilizando a dependência _joi_.

### Armazenamento dos Dados:

- Formato geral dos dados:

``` jsx
games = {
  id: 'ID do jogo',
  name: 'nome do jogo',
  image: 'URL da imagem',
  stockTotal: 'quantidade total de jogos no estoque',
  pricePerDay: 'preço por dia do jogo',
}

customers = {
  id: 'ID do cliente',
  name: 'nome do cliente',
  phone: 'número do celular/telefone do cliente',
  cpf: 'CPF do cliente',
  birthday: 'data de aniversário do cliente (formato: YYYY-MM-DD => 1992-10-25)'
}

rentals = {
  id: 'ID do alugel',
  customerId: 'ID do cliente',
  gameId: 'ID do jogo',
  rentDate: 'data em que o aluguel foi feito',
  daysRented: 'quantidade de dias que o cliente agendou o aluguel',
  returnDate: 'data que o cliente devolveu o jogo (default: null)',
  originalPrice: 'preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)',
  delayFee: 'multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)'  
}
```

- _payload_ da requisição:

``` jsx

games = {
  name: 'Banco Imobiliário',
  image: 'http://www.imagem.com.br/banco_imobiliario.jpg',
  stockTotal: 3,
  pricePerDay: 1500
}

customers = {
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-25'
}

rentals = {
  customerId: 1,
  gameId: 1,
  daysRented: 3
}

```

## Entrypoints ⚙️
### 🚩 GamesRoute 🚩
### /games
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna lista dos jogos encontrados.<br>
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **name, image, stockTotal** e **pricePerDay** pelo _body_ e insere jogo no banco de dados.
<br>
### 🚩 CustomersRoute 🚩
### /customers
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna lista dos clientes encontrados.<br>
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **name, phone, cpf** e **birthday** pelo _body_ e insere cliente no banco de dados.
### /customers/:id
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna um cliente por ID.<br>
![](https://place-hold.it/80x20/ec7926/ffffff?text=PUT&fontsize=16) Recebe **name, phone, cpf** e **birthday** pelo _body_ e atualiza um cliente por ID.
<br>
### 🚩 RentalsRoute 🚩
### /rentals
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna lista com todos os aluguéis, contendo o customer e o game do aluguel para cada aluguel.<br>
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **customerId, gamesId** e **daysRented** pelo _body_ e insere aluguel no banco de dados.
### /rentals/:id
![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) Deleta um aluguel por ID, apenas para alugueis finalizados.
### /rentals/:id/return
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Finaliza um aluguel e atualiza os campos **returnDate** e **delayFee** no banco de dados (data atual e valor da multa por atraso, respectivamente).
<br>
## Middlewares 🔛

### schemaValidation & dataSanitization:
- Recebe um _Schema_ por parámetro de função e realiza as verificações dos dados recebidos pelo _body_ e _params_.
- Realiza a sanitização dos dados.
- Rotas que utilizam esses _middlewares_:
  - **GamesRoute**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/games**
  - **CustomersRoute**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/customers**
  - **RentalsRoute**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/rentals** 

### rentalValidation:
- Recebe um ID por _params_ e verifica se o ID do aluguel é válido.
- Rotas que utilizam esse _middleware_:
  - **RentalsRoute**:
    - ![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) **/rentals/:id**
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/rentals/:id/return**

## Deploy Front-End do Projeto 💻

| Plataforma | Deploy |
| --- | --- |
| <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a> | https://boardcamp-one.vercel.app
