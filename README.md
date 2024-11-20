# Frase Analyzer

## Descrição do Projeto
O **Frase Analyzer** é um backend desenvolvido para análise de frases utilizando o modelo de linguagem **Google Gemini**. Este projeto oferece uma API para analisar frases com base em um contexto previamente definido, retornando informações como palavras-chave, emoções, categorias e polaridade.

## Funcionalidades
- **Análise semântica de frases** usando IA generativa.
- Processamento de frases baseadas em exemplos armazenados em um banco de dados local (JSON).
- Retorno estruturado em formato JSON, com informações detalhadas sobre a análise:
  - **Palavras-chave**.
  - **Emoção predominante**.
  - **Categoria associada**.
  - **Polaridade emocional**.
- Suporte a **CORS**, permitindo integração segura com aplicações externas.

## Tecnologias Utilizadas
- **Node.js** e **Express**: Para a criação do servidor backend.
- **Google Generative AI (Gemini)**: Para análise e processamento de linguagem natural.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **cors**: Controle de acesso entre domínios.
- **fs** e **path**: Manipulação de arquivos e diretórios.

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** (16 ou superior) e **npm** instalados no sistema.
- Uma chave de API válida para o **Google Gemini**, definida na variável de ambiente `GEMINI_API_KEY`.
- Arquivo `frases.json` com exemplos de contexto na pasta `data`.

### Instalação e Configuração

**1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/frase-analyzer.git
   cd frase-analyzer
```

**2. Acesse o diretório do projeto:**  
Entre na pasta clonada com o comando:  
`cd seu-repositorio`  

**3. Instale as dependências:**  
Execute o seguinte comando no terminal:  
`npm install`  

**4. Configuração:**  
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:  
GEMINI_API_KEY=sua_chave_de_api_aqui
PORT=3000

**5. Execução:**  
Inicie o servidor com o comando:  
`npm start`  

O servidor será iniciado na porta configurada no arquivo `.env` ou, caso não especificada, na porta padrão `3000`. Acesse o servidor no endereço:  
`http://localhost:3000`

## Rotas Disponíveis

**GET /frases**  
Retorna todas as frases do arquivo `frases.json`.  

**POST /analisar**  
Analisa uma frase enviada no corpo da requisição.  

**Exemplo de corpo da requisição:**  
```json
{
  "inputFrase": "A frase a ser analisada."
}
```

**Exemplo de retorno**]
```
{
  "frase": "A frase analisada.",
  "palavras_chave": ["chave1", "chave2"],
  "emocao": "alegria",
  "categoria": "categoria associada",
  "polaridade": "positiva"
}
```

