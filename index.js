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

app.post('/api/avaliacoes', async (req, res) => { /*TESTADA FUNCIONANDO NO POSTMAN*/
    const { membro_id, assiduidade, comprometimento, cuidado, colaboracao } = req.body;

    const criterios = [assiduidade, comprometimento, cuidado, colaboracao];
    if (criterios.some(nota => nota < 0 || nota > 5)) {
        return res.status(400).send("Todas as notas devem estar entre 0 e 5.");
    }

    try {
        const mediaNota = (assiduidade + comprometimento + cuidado + colaboracao) / 4;

        const [result] = await pool.execute(
            'INSERT INTO avaliacoes (membro_id, nota, comentario, data_avaliacao) VALUES (?, ?, ?, CURDATE())',
            [membro_id, mediaNota, 'Avaliação realizada com base nos critérios de assiduidade, comprometimento, cuidado e colaboração']
        );

        const novaAvaliacao = { 
            id: result.insertId, 
            membro_id, 
            nota: mediaNota, 
            comentario: 'Avaliação realizada com base nos critérios de assiduidade, comprometimento, cuidado e colaboração', 
            data_avaliacao: new Date() 
        };

        res.status(201).send(novaAvaliacao);
    } catch (error) {
        console.error('Erro ao avaliar membro:', error);
        res.status(500).send('Erro ao avaliar membro');
    }
});


app.post('/api/equipes', async (req, res) => { /*OK TESTADA NO POSTMAN */
    const { nomeEquipe, lider_id, nomeLider } = req.body;

    try {
        const [lider] = await pool.execute(
            'SELECT nome FROM empregados WHERE id = ?',
            [lider_id]
        );

        if (lider.length === 0) {
            return res.status(404).send('Líder não encontrado');
        } else if (lider[0].nome !== nomeLider) {
            return res.status(400).send('Nome do líder incorreto');
        }

        const [result] = await pool.execute(
            'INSERT INTO equipes (nomeEquipe, lider_id, nomeLider) VALUES (?, ?, ?)',
            [nomeEquipe, lider_id, nomeLider]
        );
        

        const novaEquipe = {
            id: result.insertId,
            nomeEquipe,
            lider_id,
            nomeLider
        };

        res.status(201).json(novaEquipe);
    } catch (error) {
        console.error('Erro ao criar equipe:', error);
        res.status(500).send('Erro ao criar equipe');
    }
});


app.post('/api/equipes/:equipeId/membros', async (req, res) => { /*OK TESTADA NO POSTMAN */
    const { equipeId } = req.params;
    const { membroId } = req.body;

    try {
        const [empregado] = await pool.execute(
            'SELECT nome, cargo FROM empregados WHERE id = ?',
            [membroId]
        );

        if (empregado.length === 0) {
            return res.status(404).send('Funcionário não encontrado');
        }

        await pool.execute(
            'INSERT INTO equipe_membros (equipe_id, empregado_id) VALUES (?, ?)',
            [equipeId, membroId]
        );

        const membroAdicionado = {
            equipe_id: equipeId,
            empregado_id: membroId,
            nome: empregado[0].nome,
            areaAtuacao: empregado[0].cargo
        };

        res.status(201).json({
            mensagem: 'Membro adicionado à equipe com sucesso',
            membro: membroAdicionado
        });
    } catch (error) {
        console.error('Erro ao adicionar membro à equipe:', error);
        res.status(500).send('Erro ao adicionar membro à equipe');
    }
});


app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
