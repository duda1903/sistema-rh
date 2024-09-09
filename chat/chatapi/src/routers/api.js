var express = require("express");
const token = require("../../util/token");
const usuarioController = require("../controllers/usuarioController");
const salaController = require("../controllers/salaController");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req, res) => {
    res.status(200).send("<h2>CHATAPI</h2>");
}));

app.use('/', router.get('/sobre', (req, res) => {
    res.status(200).send({
        "nome": "apichat",
        "autor": "angelica",
    });
}));

app.use('/', router.get('/salas', async (req, res) => {
    if (await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        let resp = await salaController.get();
        res.status(200).send(resp);
    } else {
        res.status(400).send({ msg: "Usuário não autorizado" });
    }
}));

app.use('/', router.post('/entrar', async (req, res) => {
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

app.use("/", router.post("/sala/criar", async (req, res) => {
    const { nome, tipo, senha } = req.body;

    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }

    let resp = await salaController.criarSala(nome, tipo, senha);
    res.status(200).send(resp);
}));

app.use("/", router.put("/sala/entrar", async (req, res) => {
    const { idsala, senha } = req.query;

    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }

    let resp = await salaController.entrar(req.headers.iduser, idsala, senha);
    res.status(200).send(resp);
}));

app.use('/', router.post('/sala/mensagem', async (req, res) => {
    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }
    let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idsala);
    res.status(200).send(resp);
}));

app.use('/', router.get('/sala/mensagens', async (req, res) => {
    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }
    let resp = await salaController.buscarMensagens(req.query.idsala, req.query.timestamp);
    res.status(200).send(resp);
}));

app.use("/", router.delete("/sala/sair", async (req, res) => {
    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }
    const resp = await salaController.sair(req.headers.iduser, req.query.idsala);
    res.status(200).send(resp);
}));

app.use("/", router.delete("/sair", async (req, res) => {
    if (!await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(400).send({ msg: "Usuário não autorizado" });
    }
    const resp = await usuarioController.sairChat(req.headers.iduser);
    res.status(200).send(resp);
}));

module.exports = app;
