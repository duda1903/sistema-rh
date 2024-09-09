const db = require("./db");

async function registrarUsuario(nick) {
    return await db.insertOne("usuarios", { "nick": nick });
}

let buscarUsuario = async (iduser) => {
    return await db.findOne("usuarios", iduser);
}

let alterarUsuario = async (user) => {
    return await db.updateOne("usuarios", user, { _id: user._id });
}

let removerUsuario = async (iduser) => {
    return await db.deleteOne("usuarios", iduser);
};

module.exports = { registrarUsuario, buscarUsuario, alterarUsuario, removerUsuario };
