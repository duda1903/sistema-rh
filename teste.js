const readline = require('readline');
const mysql = require('mysql2');

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'picapau'
});

// Interface para capturar entradas no console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("____BEM-VINDO AO SISTEMA DE CANDIDATOS PICAPAU_____");

// Perguntas em sequência para coletar os dados do candidato
rl.question("Digite seu nome: ", function(nome) {
    rl.question("Digite seu CPF: ", function(cpf) {
        rl.question("Digite sua data de nascimento (DD/MM/AAAA): ", function(dataNascimento) {
            rl.question("Digite seu telefone: ", function(telefone) {
                rl.question("Digite seu email: ", function(email) {
                    rl.question("Digite seu endereço: ", function(endereco) {
                        rl.question("Digite sua cidade: ", function(cidade) {
                            rl.question("Digite seu CEP: ", function(cep) {
                                rl.question("Digite o cargo pretendido: ", function(cargoPretendido) {
                                    rl.question("Descreva sua experiência profissional: ", function(experienciaProfissional) {
                                        console.log("\nCadastro completo:");
                                        console.log(`Nome: ${nome}`);
                                        console.log(`CPF: ${cpf}`);
                                        console.log(`Data de Nascimento: ${dataNascimento}`);
                                        console.log(`Telefone: ${telefone}`);
                                        console.log(`Email: ${email}`);
                                        console.log(`Endereço: ${endereco}`);
                                        console.log(`Cidade: ${cidade}`);
                                        console.log(`CEP: ${cep}`);
                                        console.log(`Cargo Pretendido: ${cargoPretendido}`);
                                        console.log(`Experiência Profissional: ${experienciaProfissional}`);

                                        // Inserir os dados no banco de dados MySQL
                                        const query = `INSERT INTO candidatos 
                                        (nome, cpf, data_nascimento, telefone, email, endereco, cidade, cep, cargo_pretendido, experiencia_profissional)
                                        VALUES (?, ?, STR_TO_DATE(?, '%d/%m/%Y'), ?, ?, ?, ?, ?, ?, ?)`;

                                        connection.query(query, 
                                        [nome, cpf, dataNascimento, telefone, email, endereco, cidade, cep, cargoPretendido, experienciaProfissional], 
                                        (error, results) => {
                                            if (error) {
                                                console.error("Erro ao inserir no banco de dados: ", error);
                                            } else {
                                                console.log("Candidato inserido com sucesso!");
                                            }

                                            // Fechar a interface de readline e a conexão com o banco
                                            rl.close();
                                            connection.end();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});