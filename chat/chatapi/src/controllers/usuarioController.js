const token = require("../../util/token");
const usuarioModel = require("../models/usuarioModel");

exports.entrar = async (nick) => {
    let resp = await usuarioModel.registrarUsuario(nick);

    if (resp.insertedId) {
        return {
            "idUser": resp.insertedId,
            "token": await token.setToken(resp.insertedId.toString(), nick),
            "nick": nick
        }
    }
}

exports.sairChat = async (iduser) => {
    await usuarioModel.removerUsuario(iduser);
    return { msg: "Saiu do chat" };
}
