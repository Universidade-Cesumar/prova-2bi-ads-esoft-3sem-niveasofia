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
        listaMateriais.innerHTML = '<tr><td colspan="3">Erro ao carregar materiais.</td></tr>';
    }
}

function criarLinha (p)
{
    const tr = document.createElement('tr');
    tr.dataset.id = p.id;

    if (Number(p.quant) < 10) {
        tr.classList.add('estoque-critico');
    }
    
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

const btnBaixar = document.querySelector('.btn-baixar');

if (btnBaixar) 
{
    btnBaixar.addEventListener('click', async function () 
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

            if (novaQuant < 10) {
                linhaSelecionada.classList.add('estoque-critico');
            } else {
                linhaSelecionada.classList.remove('estoque-critico');
            }

            dialog.close();
        }
        catch (erro)
        {
            console.error(erro);
            alert('Erro ao registrar retirada.');
            dialog.close();
        }
    });
};

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

        const nomeInformado = document.getElementById('input-nome').value.trim().toLowerCase();
        const quantInformada = Number(document.getElementById('input-quantidade').value);

        if (!nomeInformado || quantInformada <= 0)
        {
            alert ("Por favor, insira um nome válido e uma quantidade maior que zero.");
            return;
        }

        try 
        {
            const respostaBusca = await fetch (API_MATERIAIS);
            if (!respostaBusca.ok) throw new Error ("Erro ao consultar materiais existentes.");

            const materiaisExistentes = await respostaBusca.json();

            const itemDuplicado = materiaisExistentes.find(item => item.nome.trim().toLowerCase() === nomeInformado);

            if (itemDuplicado)
            {
                const novaQuantidade = Number(itemDuplicado.quant) + quantInformada;

                const respostaPUT = await fetch (`${API_MATERIAIS}/${itemDuplicado.id}`, 
                {
                    method: 'PUT',
                    headers: { 'Content-Type' : 'application/json' },
                    body: JSON.stringify ({quant: novaQuantidade})
                });

                if (!respostaPUT.ok) throw new Error ("Erro ao somar quantidade ao item existente.");

                alert (`O item "${nomeInformado}" já existia. Quantidade adicionada ao estoque com sucesso!`);

                const linhaNaTabela = document.querySelector(`tr[data-id="${itemDuplicado.id}"]`);
                if (linhaNaTabela)
                {
                    linhaNaTabela.cells[1].textContent = novaQuantidade;

                    if (novaQuantidade < 10) {
                        linhaNaTabela.classList.add ('estoque-critico');
                    } else {
                        linhaNaTabela.classList.remove ('estoque-critico');
                    }
                } else {
                    carregarTabelaMateriais();
                }

                formulario.reset();
            }
            else
            {
                const novoMaterial = 
                {
                    nome: nomeInformado,
                    quant: quantInformada
                };
                await salvarMaterial (novoMaterial);
            }
        }
        catch (erro)
        {
            console.error('Erro no fluxo de cadastro:', erro);
            alert("Houve um erro ao processar o cadastro.");
        }
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

        listaMateriais.appendChild(criarLinha(dadosSalvos));

        formulario.reset();
    }
    catch (erro)
    {
        console.error ('Erro na requisição: ', erro);
        alert ("Houve um erro ao tentar cadastrar o material");
    }
}

// ========================== BUSCA ================================\\
const btnBuscar = document.getElementById('btnBuscar');
const inputBusca = document.getElementById('input-busca');
const totalItensSpan = document.getElementById('total-itens');

if (btnBuscar) {
    btnBuscar.addEventListener('click', function () {
        const termoBusca = inputBusca.value.toLowerCase().trim();
        const linhas = listaMateriais.getElementsByTagName('tr');
        
        let quantidadeEncontrada = 0;
        let itemEncontrado = false;

        if (linhas.length === 1 && linhas[0].textContent.includes('Carregando...')) return;

        for (let i = 0; i < linhas.length; i++) {
            const colunaNome = linhas[i].getElementsByTagName('td')[0];
            const colunaQuant = linhas[i].getElementsByTagName('td')[1];

            if (colunaNome && colunaQuant) {
                const nomeProduto = colunaNome.textContent.toLowerCase().trim();

                if (nomeProduto.includes(termoBusca) && termoBusca !== '') {
                    quantidadeEncontrada = Number(colunaQuant.textContent);
                    itemEncontrado = true;
                    break;
                }
            }
        }

        if (itemEncontrado) {
            totalItensSpan.textContent = quantidadeEncontrada;
        } else {
            alert ("Item não existe no cadastro");
        }
    });
}