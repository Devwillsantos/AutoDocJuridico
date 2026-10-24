# 📄 AutoDocJuridico — Analisador de Documentos Jurídicos com IA

Aplicação web **Full Stack** desenvolvida para automatizar a leitura e extração de informações de contratos em PDF, utilizando Inteligência Artificial (Google Gemini) para gerar análises estruturadas em formato JSON.

---

## 🚀 Sobre o Projeto

Este projeto foi construído com o objetivo de otimizar a análise de documentos jurídicos extensos. O sistema extrai o texto bruto de arquivos PDF enviados pelo usuário, processa os dados no backend via Node.js e envia para a API do Gemini, retornando um painel interativo e organizado com o tipo de contrato, partes envolvidas, valores e resumo das cláusulas.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Layout em Grid Responsivo.
* **Backend:** Node.js, Express.js.
* **Manipulação de Arquivos & IA:** 
  * `multer` (gerenciamento de upload em memória)
  * `pdf-parse` (extração de texto de arquivos PDF)
  * `@google/genai` (SDK oficial da API do Google Gemini com o modelo `gemini-3.8-flash`)
* **Utilitários:** `cors`, `dotenv` (para segurança de variáveis de ambiente).

---

## ⚙️ Arquitetura e Funcionamento

1. **Interface do Usuário (Frontend):** O usuário faz o upload de um arquivo PDF através de uma interface limpa e moderna. O JavaScript captura o arquivo usando `FormData` e faz uma requisição assíncrona (`fetch`) para o servidor.
2. **Processamento no Servidor (Backend):** O Express recebe o arquivo, o `multer` o mantém temporariamente na memória, e a biblioteca `pdf-parse` converte o PDF em texto legível.
3. **Inteligência Artificial:** O texto extraído é enviado junto a um prompt estruturado para a API do Gemini, que devolve um objeto JSON limpo com os dados jurídicos essenciais.
4. **Renderização:** O frontend intercepta a resposta e preenche dinamicamente os cartões visuais para o usuário.

---

## 📦 Como Rodar o Projeto Localmente

Siga os passos abaixo para clonar e testar o projeto na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Devwillsantos/AutoDocJuridico.git](https://github.com/Devwillsantos/AutoDocJuridico.git)
