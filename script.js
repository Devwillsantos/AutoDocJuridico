document.addEventListener('DOMContentLoaded', () => {
  const btnAnalisar = document.getElementById('btnAnalisar');

  if (btnAnalisar) {
    btnAnalisar.addEventListener('click', enviarArquivo);
  }
});

async function enviarArquivo() {
  const inputfile = document.getElementById('arquivoPdf');
  const divResultado = document.getElementById('resultado');
  const cardResultado = document.getElementById('cardResultado');

  if (inputfile.files.length === 0) {
    alert('Por favor, selecione um arquivo PDF primeiro!');
    return;
  }

  const arquivo = inputfile.files[0];
  const formData = new FormData();
  formData.append('documento', arquivo);

  // Esconde os cartões anteriores e mostra o aviso de carregamento
  if (cardResultado) cardResultado.style.display = 'none';
  divResultado.style.display = 'block';
  divResultado.innerText = '🤖 A Inteligência Artificial está analisando o contrato, aguarde alguns segundos...';

  try {
    const resposta = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      // Esconde o texto de "aguarde"
      divResultado.style.display = 'none';
      
      // Exibe a grade de cartões estilizada
      if (cardResultado) {
        cardResultado.style.display = 'grid';
      }

      const analise = dados.analiseJuridica.analiseJuridica || dados.analiseJuridica;

      // Preenche os campos dos cartões
      document.getElementById('resNome').innerText = dados.nomeArquivo;
      document.getElementById('resPaginas').innerText = dados.totalPaginas;
      document.getElementById('resTipo').innerText = analise.tipoContrato || 'Não especificado';
      document.getElementById('resValor').innerText = analise.valor
        ? `R$ ${analise.valor}`
        : 'Não aplicável / Não informado';
      document.getElementById('resResumo').innerText =
        analise.resumoClausulas || analise.textoBruto || 'Sem resumo disponível.';

      // Preenche a lista de partes envolvidas
      const listaPartes = document.getElementById('resPartes');
      listaPartes.innerHTML = '';
      if (analise.partesEnvolvidas && Array.isArray(analise.partesEnvolvidas)) {
        analise.partesEnvolvidas.forEach(parte => {
          const li = document.createElement('li');
          li.innerText = parte;
          listaPartes.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.innerText = 'Não informado';
        listaPartes.appendChild(li);
      }
    } else {
      divResultado.style.display = 'block';
      divResultado.innerHTML = `<p style="color: red;">❌ Erro do servidor: ${dados.error || 'Desconhecido'}</p>`;
    }
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    divResultado.style.display = 'block';
    divResultado.innerText = '❌ Falha ao conectar com o servidor. O servidor Node.js está rodando?';
  }
}