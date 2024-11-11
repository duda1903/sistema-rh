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

app.get('/api/empregados', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empregados');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar empregados:', error);
        res.status(500).send('Erro ao buscar empregados');
    }
});

app.post('/api/candidatos/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [candidato] = await pool.query('SELECT * FROM candidato WHERE id = ?', [id]);
        if (candidato.length === 0) {
            return res.status(404).send('Candidato não encontrado');
        }

        const {
            nome, cargo, data_nascimento, observacao,
            experiencias, escolaridade, cpf, email
        } = candidato[0];

        if (status === 'contratado') {
            await pool.execute(
                `INSERT INTO empregados (
                    nome, cargo, data_nascimento, observacao, experiencias,
                    escolaridade, cpf, email, data_admissao
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome, cargo, data_nascimento, observacao, experiencias,
                    escolaridade, cpf, email, new Date()
                ]
            );

            await pool.query('DELETE FROM candidato WHERE id = ?', [id]);
            res.status(200).send('Candidato contratado e movido para empregados');
        } else if (status === 'descartado') {
            await pool.query('DELETE FROM candidato WHERE id = ?', [id]);
            res.status(200).send('Candidato descartado e removido');
        } else {
            res.status(400).send('Status inválido');
        }
    } catch (error) {
        console.error('Erro ao atualizar status do candidato:', error);
        res.status(500).send('Erro ao atualizar status do candidato');
    }
});

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
