<h1>ENIGMA.IO API</h1>

API usada por trás do aplicativo enigma.io, criada no EXPO (react native).

Arquivo .env necessário!

<code>
PORT=</br>
JWT=</br>
ROUNDS=</br>
DB_HOST=
</code>
</br>
PORT é a porta onde irá rodar a aplicação. (Verifique se a porta não está sendo usada por outra aplicação)</br>
JWT é a chave secreta do Json Web Token.</br>
ROUNDS Salt Rounds do bcrypt é o fator de custo, tempo necessário para calcular um único hash. Valor Padrão: 10.</br>
DB_HOST é a string de conexão do mongodb. Ex.: mongodb://localhost:27017/dbname.</br>

<h2>Instalação</h2>

Não se esqueça de rodar o comando <code>npm install</code> para que o node instale os módulos utilizados no backend.

<h2>Inicialização</h2>

<code>npm start start</code> é o mesmo que <code>node index.js</code>
<code>npm start startDev</code> é o mesmo que <code>nodemon index.js</code>

<h2>ENDPOINTS</h2>

<code>PUT /auth/</code>
<i>Entra o email e a senha do usuário e retorna uma string de token onde será usado para fazer certas requisições.</i>
</br>
</br>
<b>Exemplo</b>
</br>
URL: <code>http://localhost:3000/auth/</code></br>
Body: <code>{ "username": "Fulano", "email": "emaildofulano@email.com", "password": "senhafortíssima!123" }</code></br>
Resultado: <code>{ "success": true, "result": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MTE2ZjRkMGFlNmZkZjQ3ZjRiZGI0M2MiLCJpYXQiOjE2Mjk3NTg3ODl9.BCIZlr2ZnngZ0xgi6JcWpznekyXZR4sJ0NCJqXGmE2k" }</code></br>

<code>POST /auth/register/</code>
<i>Entra o username, email e senha e retorna o resultado do registro. Caso o registro tiver sucesso (ou seja, o username e email foram aceitos) retornará os dados do usuário com exceção da senha.</i>
</br>

<code>GET /auth/usable/email/:email</code>
<i>Entra o email e retorna se aquele email já existe no banco de dados. É utilizado no aplicativo, no momento do cadastro de um novo usuário.</i>
</br>

<code>GET /auth/usable/username/:username</code>
<i>Entra o username e retorna se aquele username já existe no banco de dados. É utilizado no aplicativo, no momento do cadastro de um novo usuário.</i>
</br>

Aqui foi usado JWT e Bcrypt para autenticação do usuário e em determinadas requisições.

Banco de dados: MongoDB.

Também é utilizado Socket.IO para algumas implementações em tempo-real, mas ainda está em desenvolvimento.