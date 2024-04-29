# Automação de Organização de Arquivos PDF

Este projeto é uma automação desenvolvida em Node.js para organizar arquivos PDF em pastas e gerar um relatório em formato XLSX com informações sobre esses arquivos.

## Funcionalidades

- **Encontrar Arquivos PDF**: A função `findPDFs` é responsável por percorrer um diretório e suas subpastas em busca de arquivos PDF.
  
- **Criar Diretórios e Mover Arquivos**: A função `createDirectoriesAndMovePDFs` cria diretórios com base nos nomes dos arquivos PDF e move os arquivos correspondentes para esses diretórios.
  
- **Gerar Relatório XLSX**: A função `generateXLSXReport` gera um relatório em formato XLSX contendo informações sobre os arquivos PDF organizados.

## Pré-requisitos

- Node.js instalado na máquina
- Pacotes npm necessários: `cli-progress`, `xlsx`

## Instalação

1. Clone este repositório:
git clone https://github.com/seu-usuario/automacao-organizacao-pdf.git

2. Instale as dependências:


## Uso

1. Coloque os arquivos PDF que deseja organizar na pasta `todospdfs`.
2. Execute o script:

3. O script irá organizar os arquivos PDF e gerar o relatório `relatorio.xlsx` na raiz do projeto.

## Testes

Os testes unitários para as funções do script estão localizados no arquivo `script.test.js`. Eles podem ser executados utilizando o Jest:


## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar o projeto.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).



