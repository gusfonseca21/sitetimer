import getDomain from './helper/getDomain';
import {
  checkDomainStored,
  checkHasFavIcon,
  getDomainData,
  getStoredData,
  storeNewDomain,
  updateDomainData,
} from './persistency/storage';
import { StorageData } from './types';

// VARIÁVEIS GLOBAIS
let data: StorageData = {};
let domainStartTime = 0; // Timestamp
let domainFavIcon = '';

// FUNÇÕES DE INICIALIZAÇÃO
(async () => {
  try {
    const storedData = await getStoredData();
    if (storedData) data = storedData;
    console.log('Dados persistidos: ', data);
  } catch (error) {
    console.error('Erro nas funções de inicialização da extensão: ', error);
  }
})();

// LISTENERS
// QUANDO UMA TAB É ATUALIZADA
chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  try {
    if (tab?.favIconUrl) domainFavIcon = tab.favIconUrl;
    const domain = getDomain(tab?.url);
    /*
    Loading é o primeiro evento do ciclo de vida de atualização da aba
    Garante que a função executará apenas uma vez quando o listener for disparado
    */
    if (changeInfo.status === 'loading') {
      if (domain) {
        if (!(await checkDomainStored(domain))) {
          await storeNewDomain(domain);
        }
        domainStartTime = Date.now(); // Inicia contagem

        /*
        O favicon da página não retorna durante o status loading,
        mas retorna durante outros eventos do ciclo de vida da página
        por isso é preciso atualizá-lo no armazenamento de dados
        */
        if (!(await checkHasFavIcon(domain)) && domainFavIcon) {
          updateDomainData(domain, null, domainFavIcon);
        }
      }
    }
  } catch (error) {
    console.error('Erro no listener onUpdate: ', error);
  }
});

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   console.log("Tab ativada: ", activeInfo);

//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab.url) {
//       const url = new URL(tab.url);
//       const domain = url.hostname;
//       console.log("Domínio capturado: ", domain);
//     }
//   });
// });

