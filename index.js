const express = require('express');
const cors = require('cors'); 
const app = express();
const pool = require('./db'); 

app.use(cors());
app.use(express.json());


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
