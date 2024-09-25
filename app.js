const fs = require('fs');

const review = require('./src/review');
const config = require('./config.json');
const comments = review(config);

// Grava o resultado em um arquivo JSON
fs.writeFile(config.path_output, JSON.stringify(comments, null, 2), (err) => {
    if (err) {
        console.error('Erro ao gravar o arquivo:', err);
    } else {
        console.log('Resultado gravado em output.json');
    }
});
