require("dotenv").config();
const app = require("../src/routers/api")

const port = process.env.API_PORT || 8000
app.listen(port)

let teste = "App executando na porta:" + port

console.log(teste)