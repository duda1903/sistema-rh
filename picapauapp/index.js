



const express = require('express');
const cors = require('cors'); 
const app = express();
const pool = require('./db'); 

app.use(cors());
app.use(express.json());

app.get('/api/candidatos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM candidato');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar candidatos:', error);
        res.status(500).send('Erro ao buscar candidatos');
    }
});

app.post('/api/candidatos', async (req, res) => {
    try {
        const { nome, cargo, data_nascimento, observacao, experiencias, escolaridade, cpf, email } = req.body;

        // Validação básica para os campos obrigatórios
        if (!nome || !cargo) {
            return res.status(400).send('Os campos "nome" e "cargo" são obrigatórios.');
        }

        // Inserção dos dados na tabela 'candidato'
        const [result] = await pool.query(
            `INSERT INTO candidato (nome, cargo, data_nascimento, observacao, experiencias, escolaridade, cpf, email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, cargo, data_nascimento, observacao, experiencias, escolaridade, cpf, email]
        );

        // Retorna o candidato cadastrado com o ID gerado
        res.status(201).json({ 
            id: result.insertId, 
            nome, 
            cargo, 
            data_nascimento, 
            observacao, 
            experiencias, 
            escolaridade, 
            cpf, 
            email 
        });
    } catch (error) {
        console.error('Erro ao cadastrar candidato:', error);
        res.status(500).send('Erro ao cadastrar candidato');
    }
});

app.get('/api/empregados', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empregados');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar empregados:', error);
        res.status(500).send('Erro ao buscar empregados');
    }
});


app.post('/api/empregados', async (req, res) => {
    const { nome, cargo, data_admissao } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO empregados (nome, cargo, data_admissao) VALUES (?, ?, ?)',
            [nome, cargo, data_admissao]
        );
        const novoEmpregado = { id: result.insertId, nome, cargo, data_admissao };
        res.status(201).send(novoEmpregado);
    } catch (error) {
        console.error('Erro ao inserir empregado:', error);
        res.status(500).send('Erro ao inserir empregado');
    }
});

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});