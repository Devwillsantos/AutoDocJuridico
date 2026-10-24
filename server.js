const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const textoExtraido = pdfData.text;

    if (!textoExtraido || textoExtraido.trim() === '') {
      return res
        .status(400)
        .json({ error: 'O PDF está vazio ou não contém texto legível.' });
    }

    const promptText = `Analise o seguinte contrato jurídico e extraia as informações principais estritamente em JSON puro com as chaves: "tipoContrato", "partesEnvolvidas" (array de strings), "valor", "resumoClausulas". Texto: ${textoExtraido.substring(0, 10000)}`;

    // Chamada limpa utilizando o modelo atual gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
    });

    const textoResposta = response.text || '';

    let jsonResultado;
    try {
      let limpo = textoResposta
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      jsonResultado = JSON.parse(limpo);
    } catch (e) {
      jsonResultado = { resumoClausulas: textoResposta };
    }

    return res.json({
      nomeArquivo: req.file.originalname,
      totalPaginas: pdfData.numpages,
      analiseJuridica: jsonResultado,
    });
  } catch (error) {
    console.error('ERRO COMPLETO:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Erro ao processar requisição.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
