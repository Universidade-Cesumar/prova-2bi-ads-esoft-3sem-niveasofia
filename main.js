'use strict';

const API_MATERIAIS = 'https://6a29f55af59cb8f65f1de03d.mockapi.io/api/almoxarifado/materiais';

const listaMateriais = document.getElementById('lista-materiais');
const btnClose = document.getElementById('btnClose');


if (listaMateriais)
{
    carregarTabelaMateriais();

    btnClose.addEventListener("click", function ()
    {
        dialog.close();
        document.getElementById('character').value = '';
    });
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
    tr.dataset.id = p.id;
    tr.innerHTML = `
        <td>${p.nome}</td>
        <td>${p.quant}</td>
        <td>
            <button class="btn-retirada" onclick="retirada(this)">Retirada</button>
            <button class="btn-excluir" onclick="excluirProduto(${p.id}, this)">Excluir</button>
        </td>
    `;

    return tr;
}

let linhaSelecionada = null;
let idSelecionado = null;

function retirada(botao)
{
    const tr = botao.closest('tr');

    linhaSelecionada = tr;
    idSelecionado = tr.dataset.id;

    document.getElementById('input-retirada').value = '';
    document.getElementById('dialog').showModal();
}

document.querySelector('.btn-baixar').addEventListener('click', async function ()
{
    const valorRetirada = Number(document.getElementById('input-retirada').value);
    const quantAtual = Number(linhaSelecionada.cells[1].textContent);

    if (!validarRetirada(quantAtual, valorRetirada)) return;

    const novaQuant = quantAtual - valorRetirada;

    try
    {
        const resposta = await fetch(`${API_MATERIAIS}/${idSelecionado}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quant: novaQuant })
        });

        if (!resposta.ok) throw new Error('Erro ao atualizar estoque.');

        linhaSelecionada.cells[1].textContent = novaQuant;
        dialog.close();
    }
    catch (erro)
    {
        console.error(erro);
        alert('Erro ao registrar retirada.');
        dialog.close();
    }
});

function validarRetirada(estoqueAtual, quantidadeRetirada) 
{
    if (!quantidadeRetirada || quantidadeRetirada <= 0)
    {
        alert('Informe um valor de retirada válido.');
        return false;
    }

    if (quantidadeRetirada > estoqueAtual)
    {
        alert(`Quantidade insuficiente. Estoque atual: ${estoqueAtual}`);
        return false;
    }

    return true;
}

async function excluirProduto(id, botao) 
{
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