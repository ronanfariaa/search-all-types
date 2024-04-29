const fs = require('fs');
const path = require('path');
const { findPDFs, createDirectoriesAndMovePDFs, generateXLSXReport } = require('./script');

describe('findPDFs', () => {
  it('deve encontrar arquivos PDF em um diretório e suas subpastas', () => {
    // Criar uma pasta fictícia para testes
    const testFolder = './testFolder';
    fs.mkdirSync(testFolder);
    fs.writeFileSync(path.join(testFolder, 'file1.pdf'), 'conteúdo do arquivo 1');
    fs.mkdirSync(path.join(testFolder, 'subfolder1'));
    fs.writeFileSync(path.join(testFolder, 'subfolder1', 'file2.pdf'), 'conteúdo do arquivo 2');
    fs.mkdirSync(path.join(testFolder, 'subfolder2'));
    fs.writeFileSync(path.join(testFolder, 'subfolder2', 'file3.pdf'), 'conteúdo do arquivo 3');

    // Chamada da função
    const result = [];
    const originalReaddirSync = fs.readdirSync;
    fs.readdirSync = jest.fn().mockImplementation((dir) => {
      if (dir === testFolder) {
        return ['file1.pdf', 'subfolder1', 'subfolder2'];
      } else if (dir === path.join(testFolder, 'subfolder1')) {
        return ['file2.pdf'];
      } else if (dir === path.join(testFolder, 'subfolder2')) {
        return ['file3.pdf'];
      }
    });

    const originalStatSync = fs.statSync;
    fs.statSync = jest.fn().mockImplementation((filePath) => {
      if (filePath.endsWith('.pdf')) {
        result.push(filePath);
        return { isDirectory: () => false };
      } else {
        return { isDirectory: () => true };
      }
    });

    findPDFs(testFolder);

    // Restaurar fs.readdirSync e fs.statSync
    fs.readdirSync = originalReaddirSync;
    fs.statSync = originalStatSync;

    // Teste de expectativa
    expect(result).toEqual([
      path.join(testFolder, 'file1.pdf'),
      path.join(testFolder, 'subfolder1', 'file2.pdf'),
      path.join(testFolder, 'subfolder2', 'file3.pdf')
    ]);

    // Remover a pasta fictícia após o teste
    fs.unlinkSync(path.join(testFolder, 'file1.pdf'));
    fs.unlinkSync(path.join(testFolder, 'subfolder1', 'file2.pdf'));
    fs.unlinkSync(path.join(testFolder, 'subfolder2', 'file3.pdf'));
    fs.rmdirSync(path.join(testFolder, 'subfolder1'));
    fs.rmdirSync(path.join(testFolder, 'subfolder2'));
    fs.rmdirSync(testFolder);
  });
});

describe('createDirectoriesAndMovePDFs', () => {
  it('deve criar diretórios e mover arquivos PDF', () => {
    const parentDirectory = './testFolder';
    const pdfFiles = [
      './testFolder/pdf1.pdf',
      './testFolder/subfolder1/pdf2.pdf',
      './testFolder/subfolder2/pdf3.pdf'
    ];

    // Criar pastas e arquivos PDF fictícios
    fs.mkdirSync('./testFolder');
    fs.mkdirSync('./testFolder/subfolder1');
    fs.mkdirSync('./testFolder/subfolder2');
    fs.writeFileSync('./testFolder/pdf1.pdf', 'conteúdo do arquivo 1');
    fs.writeFileSync('./testFolder/subfolder1/pdf2.pdf', 'conteúdo do arquivo 2');
    fs.writeFileSync('./testFolder/subfolder2/pdf3.pdf', 'conteúdo do arquivo 3');

    // Chamar a função
    createDirectoriesAndMovePDFs();

    // Verificar se os arquivos PDF foram movidos corretamente
    expect(fs.existsSync('./lololo/pdf1.pdf')).toBeTruthy();
    expect(fs.existsSync('./lololo/subfolder1/pdf2.pdf')).toBeTruthy();
    expect(fs.existsSync('./lololo/subfolder2/pdf3.pdf')).toBeTruthy();

    // Limpeza após os testes
    fs.unlinkSync('./lololo/pdf1.pdf');
    fs.unlinkSync('./lololo/subfolder1/pdf2.pdf');
    fs.unlinkSync('./lololo/subfolder2/pdf3.pdf');
    fs.rmdirSync('./testFolder/subfolder1');
    fs.rmdirSync('./testFolder/subfolder2');
    fs.rmdirSync('./testFolder');
  });
});


describe('generateXLSXReport', () => {
  it('deve gerar um relatório XLSX', () => {
    const pdfFiles = [
      './testFolder/pdf1.pdf',
      './testFolder/subfolder1/pdf2.pdf',
      './testFolder/subfolder2/pdf3.pdf'
    ];

    // Criar uma lista de arquivos PDF fictícios
    fs.writeFileSync('./testFolder/pdf1.pdf', 'conteúdo do arquivo 1');
    fs.writeFileSync('./testFolder/subfolder1/pdf2.pdf', 'conteúdo do arquivo 2');
    fs.writeFileSync('./testFolder/subfolder2/pdf3.pdf', 'conteúdo do arquivo 3');

    // Chamar a função
    generateXLSXReport();

    // Verificar se o relatório XLSX foi gerado corretamente
    const wb = XLSX.readFile('relatorio.xlsx');
    const ws = wb.Sheets['Relatório'];
    const cell1 = ws['A1'];
    const cell2 = ws['B1'];
    const cell3 = ws['A2'];
    const cell4 = ws['B2'];
    const cell5 = ws['A3'];
    const cell6 = ws['B3'];

    expect(cell1.v).toEqual('Arquivo');
    expect(cell2.v).toEqual('Diretório');
    expect(cell3.v).toEqual('./lololo/pdf1.pdf');
    expect(cell4.v).toEqual('subfolder1');
    expect(cell5.v).toEqual('./lololo/subfolder1/pdf2.pdf');
    expect(cell6.v).toEqual('subfolder2');

    // Limpeza após os testes
    fs.unlinkSync('./lololo/pdf1.pdf');
    fs.unlinkSync('./lololo/subfolder1/pdf2.pdf');
    fs.unlinkSync('./lololo/subfolder2/pdf3.pdf');
    fs.unlinkSync('relatorio.xlsx');
  });
});

