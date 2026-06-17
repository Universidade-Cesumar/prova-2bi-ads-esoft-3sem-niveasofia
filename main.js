'use strict';

const API_MATERIAIS = 'https://6a29f55af59cb8f65f1de03d.mockapi.io/api/almoxarifado/materiais';

const listaMateriais = document.getElementById('lista-materiais')

if (listaMateriais)
{
    carregarTabelaMateriais();
}

async function carregarTabelaMateriais() 
{
    try
    {
        const resposta = await fetch (API_MATERIAIS);
        if (!resposta.ok)
        {
            throw new Error ('Erro ao buscar materiais.');
        }

        const materiais = await resposta.json();
        listaMateriais.innerHTML = '';

        materiais.forEach(p => listaMateriais.appendChild(criarLinha(p)));
    }
    catch (erro)
    {
        console.error(erro);
        listaMateriais.innerHTML = '<tr><td colspan="2">Erro ao carregar materiais.</td></tr>';
    }
}

function criarLinha (p)
{
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${p.nome}</td>
        <td>${p.quant}</td>
        <td>
            <button class="btn-baixar" onclick="">Baixar</button>
            <button class="btn-excluir" onclick="excluirProduto(${p.id}, this)">Excluir</button>
        </td>
    `;

    return tr;
}

async function excluirProduto(id, botao) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const resposta = await fetch(`${API_MATERIAIS}/${id}`, { method: 'DELETE' });

        if (!resposta.ok) throw new Error('Erro ao excluir produto.');

        botao.closest('tr').remove();
    } catch (erro) {
        console.error(erro);
        alert('Erro ao excluir produto.');
    }
}


// ==========================CADASTRAR================================\\
const btnCadastrar = document.getElementById('btn-cadastrar');
const formulario = document.getElementById('formCadastro');

if (btnCadastrar)
{
    btnCadastrar.addEventListener("click", async function (evento)
    {
        evento.preventDefault();

        const nomeInformado = document.getElementById('input-nome').value;
        const quantInformada = document.getElementById('input-quantidade').value;

        const novoMaterial =
        {
            nome: nomeInformado.trim().toLowerCase(),
            quant: Number(quantInformada)
        };

        await salvarMaterial(novoMaterial);
    });
}

async function salvarMaterial(material) 
{
    try
    {
        const resposta = await fetch (API_MATERIAIS,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(material)
        });

        if (!resposta.ok)
        {
            throw new Error ("Não foi possível salvar o material no servidor");
        }

        const dadosSalvos = await resposta.json();
        console.log ("Sucesso: ", dadosSalvos);

        alert ("Material cadastrado com sucesso");

        formulario.reset();
    }
    catch (erro)
    {
        console.error ('Erro na requisição: ', erro);
        alert ("Houve um erro ao tentar cadastrar o material");
    }
}