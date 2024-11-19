const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carregar variáveis de ambiente do .env

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://survey.alchemer.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, x-vercel-protection-bypass");
  next();
});

// Middleware para permitir o acesso a arquivos JSON
app.use(express.json());

// Rota para obter frases do banco de dados (JSON)
app.get('/frases', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'frases.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de frases.');
    }
    res.json(JSON.parse(data));
  });
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Função para analisar a frase usando o modelo Gemini
async function analisarFrase(inputFrase, contextoFrases) {
  const prompt = `
    Baseado nas seguintes frases:
    ${contextoFrases.map((frase, i) => `Exemplo ${i + 1}: "${frase.frase}" - Palavras_chave: ${frase.palavras_chave}, Emoção: ${frase.emoção}, Categoria: ${frase.categoria}, Polaridade: ${frase.polaridade}`).join('\n')}
    
    Agora analise a seguinte frase: "${inputFrase}".
    Retorne os valores: Frase, Palavras-chave, Emoção, Categoria e Polaridade e evite dualidades como "tristeza e alegria" em polaridade e emoção
    
    FORMATE EM JSON .
  `;

  try {
    const result = await model.generateContent(prompt);

    // Obter a resposta crua
    const respostaTexto = result.response.text(); 
    console.log('Resposta crua do modelo:', respostaTexto); // Log da resposta crua

    // Usar regex para capturar o JSON válido
    const match = respostaTexto.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
    if (!match) {
      throw new Error("A resposta não contém um JSON válido.");
    }

    // Converter o JSON encontrado
    const dadosRetornados = JSON.parse(match[0]);

    return {
      frase: dadosRetornados.Frase,
      palavras_chave: dadosRetornados.Palavras_chave,
      emocao: dadosRetornados.Emoção,
      categoria: dadosRetornados.Categoria,
      polaridade: dadosRetornados.Polaridade,
    };

  } catch (error) {
    throw new Error('Erro ao enviar solicitação ao modelo: ' + error.message);
  }
}

// Rota para analisar uma frase
app.post('/analisar', async (req, res) => {
  const { inputFrase } = req.body;

  // Ler o contexto das frases do arquivo JSON
  const contextoFrases = await new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data', 'frases.json'), 'utf8', (err, data) => {
      if (err) {
        reject('Erro ao ler o arquivo de frases.');
      }
      resolve(JSON.parse(data));
    });
  });

  // Analisar a frase com o Google Gemini
  try {
    const resultado = await analisarFrase(inputFrase, contextoFrases);
    res.json(resultado);
  } catch (error) {
    res.status(500).send('Erro ao analisar a frase: ' + error.message);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY}`); // Exibir a chave da API
});
