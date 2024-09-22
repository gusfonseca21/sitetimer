# Sitetimer


Extensão Chrome, TypeScript e Visual Studio Code

## Pré-requisitos

* [node + npm](https://nodejs.org/) (Versão Atual)

## Plugin Opcional para VSCode

* [Visual Studio Code](https://code.visualstudio.com/)

## Instalação
- Instale todas as dependências do projeto digitando o seguinte comando no terminal:
  ```npm i```
- Faça a build do projeto com o seguinte comando: ```npm run build```
- Após o build a pasta dist será criada na raiz do projeto. Substitua todo o conteúdo do arquivo manifest.json pelo seguinte código em JSON:
```{
  "manifest_version": 3,

  "name": "SiteTimer",
  "description": "",
  "version": "1.0",

  "options_ui": {
    "page": "options.html"
  },

  "action": {
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["js/vendor.js", "js/content_script.js"]
    }
  ],

  "background": {
    "service_worker": "js/background.js"
  },

  "permissions": ["storage", "tabs", "sessions", "activeTab"],

  "host_permissions": ["<all_urls>"]
}

```

-  No seu navegador, vá para a página de gerenciamento de extensões e faça a importação dos arquivos na pasta dist e ative a extensão.
-  Navegue por diferentes sites e então verifique o tempo gasto nos domínios clicando no ícone da extensão que fica ao lado do input de endereço do navegador.
