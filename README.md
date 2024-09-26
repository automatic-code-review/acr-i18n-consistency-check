## acr-i18n-consistency-check

### Introdução

Este arquivo README descreve a configuração JSON utilizada para verificar a consistência de chaves em arquivos de um projeto com estrutura i18n.

A configuração definem as mensagens a serem exibidas durante a análise e os conjuntos de arquivos a serem comparados.

### Configuração

A configuração é um objeto JSON com as seguintes propriedades:

* **title:** String
  * Mensagem principal exibida na análise, fornecendo um resumo dos resultados.
  * **Variáveis:**
    * `${CHAVESQTD}`: Quantidade total de chaves divergentes.
    * `${TYPE}`: Tipo do conjunto de arquivos (ex., "frontend", "backend").
* **message:** String
  * Mensagem detalhada para cada chave divergente, indicando onde ela está ausente.
  * **Variáveis:**
    * `${CHAVE}`: Nome da chave ausente.
    * `${ARQUIVO}`: Lista de arquivos onde a chave não foi encontrada.
* **comparison:** Array de objetos
  * Define os conjuntos de arquivos a serem comparados.
  * **Objeto:**
    * **type:** String
      * Identificador do conjunto de arquivos.
    * **files:** Array de strings
      * Lista de caminhos para os arquivos do conjunto.

### Exemplo `config.json`

```json
{
  "title": "Foram encontrados ${CHAVESQTD} chaves divergentes entre os arquivos do `${TYPE}`",
  "message": "A chave `${CHAVE}` não esta presente nos arquivos `${ARQUIVO}`",
  "comparison": [
    {
      "type": "frontend",
      "files": [
        "src/resources/frontend/pt-br.json",
        "src/resources/frontend/es-cl.json"
      ]
    },
    {
      "type": "backend",
      "files": [
        "src/resources/backend/pt-br.json",
        "src/resources/backend/es-cl.json"
      ]
    }
  ]
}