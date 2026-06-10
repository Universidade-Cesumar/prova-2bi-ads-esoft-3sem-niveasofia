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
    `;

    return tr;
}