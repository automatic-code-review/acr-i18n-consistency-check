const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

const review = function(config){
    const {title} = config;
    const comparison = getTypeModified(config);

    const comments = [];

    for (const key in comparison) {
        const {files, type} = comparison[key];
        const missingKeys = compareKeys(files, config);
        const messages = transformKeysInMessage(missingKeys, config);
        const commitTitle = title.replace('${TYPE}', type).replace('${CHAVESQTD}', messages.length);
        const comment = `<b>${commitTitle}</b><details>${messages.join('<br>')}</details>`;

        comments.push({
            id: generateMd5FromComment(comment),
            comment
        })
    }

    return comments;
};

const getTypeModified = function(config){
    const {comparison, merge} = config;
    const {changes} = merge;
    const changedFiles = changes.map(change => change.new_path);

    return comparison.filter(compareConfig => compareConfig.files.some(file => changedFiles.includes(file)));
}

const compareKeys = function(files, config) {
    const {path_source_v2} = config;

    // Captura todas chaves dos arquivos
    const filesData = files.map((file) => {
        const {path_source_v2} = config;
        const data = JSON.parse(fs.readFileSync(`${path_source_v2}/${file}`, 'utf8'));
    
        return Object.keys(data);
    });

    // Cria um Map para armazenar as chaves e seus respectivos arquivos num Set
    const keysMap = new Map(); 
    filesData.forEach((keys, index) => {
        keys.forEach(key => {
            if (!keysMap.has(key)) {
                keysMap.set(key, new Set([index]));
            } else {
                keysMap.get(key).add(index);
            }
        });
    });

    // Encontra as chaves que não estão presentes em todos os arquivos
    const missingKeys = [];
    keysMap.forEach((keyMap, key) => {
        if (keyMap.size !== files.length) {
            const missingFiles = files.filter((src, index) => !keyMap.has(index)).map(file => file.split('/').at(-1));

            missingKeys.push({
                key,
                missingFiles
            });
        }
    });

    return missingKeys;
}

const transformKeysInMessage = function(missingKeys, config){
    const {message} = config;
    const messages = [];

    missingKeys.forEach((missingKey) => {
        const {key, missingFiles} = missingKey;
        const files = new Intl.ListFormat('pt-br', { style: 'long', type: 'conjunction' }).format(missingFiles);

        messages.push(message.replace('${CHAVE}', key).replace('${ARQUIVO}', files));
    });

    return messages;
}

const generateMd5FromComment = function(comment){
    return crypto.createHash('md5').update(comment).digest("hex");
}

module.exports = review;
