const express = require('express');
const app = express();
app.use(express.json());

let empregados = [];

app.post('/api/empregados', (req, res) => {
    const { nome, cargo, data_admissao } = req.body;
    const novoEmpregado = {
        id: empregados.length + 1,
        nome,
        cargo,
        data_admissao
    };
    empregados.push(novoEmpregado);
    res.status(201).send(novoEmpregado);
});

app.get('/api/empregados', (req, res) => {
    res.status(200).send(empregados);
});

app.get('/api/empregados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const empregado = empregados.find(e => e.id === id);
    if (!empregado) return res.status(404).send('Empregado não encontrado');
    res.status(200).send(empregado);
});

app.put('/api/empregados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, cargo, data_admissao } = req.body;
    let empregado = empregados.find(e => e.id === id);
    if (!empregado) return res.status(404).send('Empregado não encontrado');
    
    empregado.nome = nome;
    empregado.cargo = cargo;
    empregado.data_admissao = data_admissao;
    
    res.status(200).send(empregado);
});

app.delete('/api/empregados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    empregados = empregados.filter(e => e.id !== id);
    res.status(200).send({ message: 'Empregado removido com sucesso!' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

let candidaturas = [];

app.post('/api/candidaturas', (req, res) => {
    const { nome_candidato, email, cargo_pretendido, link_curriculo } = req.body;
    
    const novaCandidatura = {
        id: candidaturas.length + 1,
        nome_candidato,
        email,
        cargo_pretendido,
        link_curriculo
    };
    
    candidaturas.push(novaCandidatura);
    res.status(201).send(novaCandidatura);
});

app.get('/api/candidaturas', (req, res) => {
    res.status(200).send(candidaturas);
});

app.get('/api/candidaturas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const candidatura = candidaturas.find(c => c.id === id);
    
    if (!candidatura) return res.status(404).send('Currículo não encontrado');
    res.status(200).send(candidatura);
});

app.put('/api/candidaturas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome_candidato, email, cargo_pretendido, link_curriculo } = req.body;
    
    let candidatura = candidaturas.find(c => c.id === id);
    if (!candidatura) return res.status(404).send('Currículo não encontrado');
    
    candidatura.nome_candidato = nome_candidato;
    candidatura.email = email;
    candidatura.cargo_pretendido = cargo_pretendido;
    candidatura.link_curriculo = link_curriculo;
    
    res.status(200).send(candidatura);
});

app.delete('/api/candidaturas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    candidaturas = candidaturas.filter(c => c.id !== id);
    res.status(200).send({ message: 'Currículo deletado com sucesso!' });
});

let recompensas = [];

app.post('/api/recompensas', (req, res) => {
    const { empregadoId, tipo } = req.body;
    const empregado = empregados.find(e => e.id === empregadoId);
    if (!empregado) return res.status(404).send('Funcionário não encontrado');

    const novaRecompensa = {
        id: recompensas.length + 1,
        empregadoId,
        tipo,
        data: new Date()
    };
    recompensas.push(novaRecompensa);
    res.status(201).send(novaRecompensa);
});

app.get('/api/recompensas', (req, res) => {
    res.status(200).send(recompensas);
});

let avaliacao = [];

app.post('/api/avaliacao', (req, res) => {
    const { empregadoId, nota, comentario } = req.body;

    const empregado = empregados.find(e => e.id === empregadoId);
    if (!empregado) return res.status(404).send('Funcionário não encontrado');

    const novaAvaliacao = {
        id: avaliacao.length + 1,
        empregadoId,
        nota,
        comentario,
        data: new Date()
    };

    avaliacao.push(novaAvaliacao);
    res.status(201).send(novaAvaliacao);
});

app.get('/api/avaliacao', (req, res) => {
    res.status(200).send(avaliacao);
});

app.get('/api/avaliacao/empregado/:empregadoId', (req, res) => {
    const empregadoId = parseInt(req.params.empregadoId);
    const avaliacaoEmpregado = avaliacao.filter(r => r.empregadoId === empregadoId);
    
    if (avaliacaoEmpregado.length === 0) return res.status(404).send('Este funcionário não tem nenhuma avaliação registrada');
    res.status(200).send(avaliacaoEmpregado);
});

app.delete('/api/avaliacao/:id', (req, res) => {
    const id = parseInt(req.params.id);
    avaliacao = avaliacao.filter(r => r.id !== id);
    res.status(200).send({ message: 'Avaliação deletada com sucesso!' });
});