/*
-------------------
developed Ronan Faria
Copyright (c) 2024
--------------------
*/ 

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const cliProgress = require('cli-progress');

const directoryToSearch = './todospdfs'; 
const reportFileName = 'relatorio.xlsx';  
const jsonFileName = 'output.json';  
const parentDirectory = './lololo'; 
const pdfFiles = [];

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

function findPDFs(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      findPDFs(filePath);
    } else if (path.extname(filePath).toLowerCase() === '.pdf') {
      pdfFiles.push(filePath);
    }
  });
}

function createDirectoriesAndMovePDFs() {
  progressBar.start(pdfFiles.length, 0); 
  pdfFiles.forEach((pdfFile, index) => {
    const folderName = path.basename(path.dirname(pdfFile));
    const repositoryPath = path.join(parentDirectory, folderName);

    if (!fs.existsSync(repositoryPath)) {
      fs.mkdirSync(repositoryPath, { recursive: true });
    }

    const newFilePath = path.join(repositoryPath, path.basename(pdfFile));

    
    fs.renameSync(pdfFile, newFilePath);

    const fileName = path.basename(pdfFile);
    const Nome_Pdf = fileName.trim();
    const Nome_Diretorio = folderName;

    const regex = /([^-]+)-(.+)\.pdf/;
    const match = Nome_Pdf.match(regex);
    let Nome_Autor = '';
    let Nome_resumo = '';

    if (match && match.length === 3) {
      Nome_Autor = match[1].trim();
      Nome_resumo = match[2].trim();
    }

    const fileInfo = {
      Nome_Autor,
      Nome_Pdf,
      Nome_resumo,
      Nome_Diretorio
    };

    const jsonFilePath = path.join(parentDirectory, jsonFileName);
    let jsonContent = [];
    if (fs.existsSync(jsonFilePath)) {
      const existingContent = fs.readFileSync(jsonFilePath);
      jsonContent = JSON.parse(existingContent);
    }
    jsonContent.push(fileInfo);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2));

    progressBar.update(index + 1); 
  });

  progressBar.stop(); 
}

function generateXLSXReport() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([['Arquivo', 'Diretório']]);

  pdfFiles.forEach(pdfFile => {
    const folderName = path.basename(path.dirname(pdfFile));
    const row = [pdfFile, folderName];
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  XLSX.writeFile(wb, reportFileName);
  console.log(`Relatório gerado: ${reportFileName}`);
}

try {
  findPDFs(directoryToSearch);
  createDirectoriesAndMovePDFs();
  generateXLSXReport();
  console.log('Automação concluída.');
} catch (error) {
  console.error('Ocorreu um erro na automação:', error);
}
