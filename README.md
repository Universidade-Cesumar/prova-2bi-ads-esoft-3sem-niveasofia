[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# Projeto Almoxarifado

<p align="center">
    <img src="https://img.shields.io/badge/ALMOXARIFADO-%23386641?style=for-the-badge&label=SISTEMA%20DE&labelColor=%23f2e8cf" />
</p>

## 📋 Descrição 

&emsp;&emsp; A proposta de desenvolvimento de Sistema para Almoxarifado, surge da necessidade de um controle mais prático para entrada e saída dos materiais no almoxarifado do Senac de Londrina. Utilizado como prova prática na matéria de Programação Front-End, ministrada pelo professor [Leonardo Rocha](https://github.com/leonardossrocha). <br>
&emsp;&emsp; Os objetivos principais do sistema além do controle mais prático referente as movimentações de entrada e saída, é a necessidade de indicadores de validade próxima, indicadores de itens zerados, geração de relatórios das movimentações. <br> 
&emsp;&emsp; O sistema vai consumir uma API, feita com o MockAPI. Ele funciona semelhante a um banco de dados, mas com limitações e sem segurança alguma. 

## MockAPI

É uma ferramenta simples que permite criar protótipos de APIs, para teste e aprendizado.

## Como fazer uso 

Crie uma conta no mockapi.io. <br>
Crie um novo projeto. Informe `name` e `API Prefix` (*opcional).

> ⚠️ No plano gratuito, é permitido criar apenas um projeto.

Crie os recursos, que irão funcionar como endpoints da API e defina a resposta que ele deve retornar.

> ⚠️ No plano gratuito, é permitido criar apenas dois recursos.

É possível definir o Schema, que serão os campos retornados na resposta, podendo ser dos tipos string, número, booleano, array ou até datas. Há definições ainda mais específicas, conforme necessidade de quem está refinando a API, um exemplo são os endereços com detalhamento completo, com número do prédio, condado, coordenadas de GPS, etc.

Considere o cenário: `New Project → teste` e `New Resource → users`.<br>
O MockAPI vai disponibilizar uma URL, que através dos metódos HTTP, temos as seguintes possibilidades:

| Método | Descrição |
|---|---|
| **GET /users** | Lista todos os usuários |
| **GET /users/1** | Busca um usuário específico |
| **POST /users** | Cria um novo usuário |
| **PUT /users/1** | Atualiza um usuário |
| **DELETE /users/1** | Deleta um usuário |

- O método GET não é obrigatório especificar ao fazer uso, diferentemente dos outros métodos que precisam ser 'chamados'. Confira o exemplo do método `POST` abaixo. 

Para consumir a API utilizando o JavaScritp, optou-se pelo uso de async, await, e fetch.

- `async` → declara uma função assíncrona, permitindo a execução de outras tarefas enquanto aguarda operações demoradas, como requisições a uma API.
- `await` → pausa a execução até que a resposta chegue. Só funciona dentro de funções async.
- `fetch` → realiza a requisição HTTP, e retorna uma Promise (promessa de que os dados vão chegar).


## Exemplo: Executando o método POST

É feita uma requisição para o MockAPI, informando que novos dados serão inseridos, utilizando `method: 'POST'`. Essas informações devem ser convertidas para JSON, antes de serem enviadas utilizando `JSON.stringify()`.

> ⚠️ Os dados informados precisam estar em conformidade com o Schema definido no MockAPI, para serem salvos corretamente. 

```
const API_URL = 'https://654321fedcba.mockapi.io/api/v1/users';

const criarUsuario = async (dadosUsuario) =>
{
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const dadosSalvos = await response.json();
        console.log('Usuário criado com sucesso:', dadosSalvos);
        return dadosSalvos;

    } catch (error) {
        console.error('Erro ao executar o POST:', error);
    }
}

criarUsuario({ nome: "Carlos Souza", email: "carlos@email.com" });
```

## 🔗 Endpoint da API

O sistema utiliza um recurso no MockAPI:

| Recurso | Descrição |
|---|---|
| `/materiais` | Cadastro e controle do estoque de produtos |

## ⚙️ Funcionalidades Implementadas

- **Cadastro de produtos** 
- **Registro de Baixa de itens** com atualização automática do estoque via `PUT`
- **Tabela de estoque** com edição inline e exclusão de produtos
- **Tratamento de erros** → Não permite dar baixa em valor maior do que, o valor que contém no estoque. Aceita apenas valores. 

