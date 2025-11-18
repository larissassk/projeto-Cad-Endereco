'use strict'; 

// 1. Obter referências dos elementos DOM (Adicionado o 'cepInput' para escopo)
const cepInput = document.getElementById('cep'); 
const formulario = document.querySelector('form'); // Adicionado para impedir o refresh

//Limpar formulário
// 🟢 AJUSTE: Argumento 'endereco' removido da definição, pois não é usado na função.
const LimparFormulario = () => {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

//Verifica se CEP é válido
const eNumero = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length == 8 && eNumero(cep);

//preenche campos do formulario
const preencheFormulario = (endereco) => {
    document.getElementById('rua').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
}

/*função para consumo de API utilizando a função do tipo assimcrona*/
const pesquisarcep = async() => {
    LimparFormulario();
    
    // 🟢 CORREÇÃO DE ESCOPO: Pega o valor do input explicitamente.
    const cep = cepInput.value; 
    // 🟢 CORREÇÃO DE SEGURANÇA: Usando HTTPS na URL da API.
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    if (cepValido(cep)) {
        try {
            const dados = await fetch(url);
            // 🟢 CORREÇÃO: Variável 'addres' renomeada para 'address' (melhor legibilidade)
            const address = await dados.json(); 

            if (address.hasOwnProperty('erro')) {
                alert('CEP não encontrado');
            } else {
                preencheFormulario(address);
            }
        } catch (error) {
             alert('Ocorreu um erro de rede ou na requisição da API.');
             console.error(error);
        }
    } else {
        alert('cep incorreto');
    }
}

// Adiciona um evento DOM, no input CEP
document.getElementById('cep').addEventListener('focusout', pesquisarcep);

// 🟢 CORREÇÃO ESSENCIAL: Impede o recarregamento da página ao submeter o formulário
formulario.addEventListener('submit', (e) => {
    // Comando chave: Impede o comportamento padrão do botão submit
    e.preventDefault(); 
});