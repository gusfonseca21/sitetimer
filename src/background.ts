import getDomain from './helper/getDomain';
import { getTimeSpent } from './helper/getTimeSpent';
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
let activeDomain = '';
let domainStartTime = 0; // Timestamp
let domainFavIcon = '';
let prevActiveTabId: number | null = null;

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

// ABRINDO NOVA ABA E INSERINDO UM URL
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
        activeDomain = domain;
        if (!(await checkDomainStored(domain))) {
          await storeNewDomain(domain);
        }
        domainStartTime = Date.now(); // Inicia contagem

        /*
        O favicon da página não retorna durante o status loading,
        mas retorna durante outros eventos do ciclo de vida da página
        por isso é preciso atualizar os dados do banco de daos posteriormente
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

// ALTERANDO A ABA ATIVA
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('activeInfo', activeInfo);
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const domain = getDomain(tab.url);
    if (domain) {
      if (domain !== activeDomain) {
        // A aba foi alterada para uma página com um domínio diferente
        // É preciso contabilizar e salvar o tempo gasto
        activeDomain = domain;

        if (prevActiveTabId) {
          chrome.tabs.get(prevActiveTabId, async (tab) => {
            try {
              const prevDomain = getDomain(tab?.url);
              if (prevDomain) {
                let { seconds } = await getDomainData(prevDomain);
                seconds += getTimeSpent(domainStartTime); // Somando os segundos do banco de dados com os gastos agora
                await updateDomainData(domain, seconds);
              }
            } finally {
              // As funções para atualização do banco de dados são assíncronas. Assim, o timestamp do novo domínio
              // é atualizado e é esse valor atualizado que acaba sendo passado para a função que retorna o tempo gasto
              // em um domínio. Foi um erro ter usado async/await. .then().catch() teria sido melhor.
              domainStartTime = Date.now();
            }
          });
        }
      }
    }

    // Condição para quando uma aba nova é criada, quando ainda nõo há um domínio
    if (!domain) {
      activeDomain = '';
      if (prevActiveTabId) {
        chrome.tabs.get(prevActiveTabId, async (tab) => {
          const prevDomain = getDomain(tab?.url);
          if (prevDomain) {
            let { seconds } = await getDomainData(prevDomain);
            seconds += getTimeSpent(domainStartTime);
            await updateDomainData(prevDomain, seconds);
          }
        });
      }
    }

    // No final armazena dos dados da aba ativa para servir como
    // referência quando a aba for trocada
    prevActiveTabId = activeInfo.tabId;
  });
});

// QUANDO A ABA ATIVA FOR FECHADA
chrome.tabs.onRemoved.addListener((_tabId, removeInfo) => {
  // isWindowClosing é executado quando o browser é fechado
  // Aqui é importante que as funções sejam executadas com o método .then()
  // pois é o que garante que os dados sejam salvos antes do navegador ser fechado completamente
  if (removeInfo.isWindowClosing) {
    getDomainData(activeDomain).then(({ seconds }) => {
      return updateDomainData(
        activeDomain,
        (seconds += getTimeSpent(domainStartTime))
      );
    });
  }

  // Listener que podemos utilizar para retornar dados das abas recentemente fechadas
  // O resultado retornado é a última aba a ser fechada
  chrome.sessions.getRecentlyClosed({ maxResults: 1 }, async (session) => {
    const closedTab = session[0].tab;
    const domain = getDomain(closedTab?.url);

    if (domain === activeDomain) {
      let { seconds } = await getDomainData(domain);

      seconds += getTimeSpent(domainStartTime); // Somando os segundos do banco de dados com os gastos agora
      await updateDomainData(domain, seconds);
    }
  });
});

// chrome.windows.onFocusChanged.addListener(async (windowId) => {
//   // Se windowId for -1, significa que todas as janelas perderam o foco
//   // a contagem deve parar
//   if (windowId === -1) {
//     let { seconds } = await getDomainData(activeDomain);
//     seconds += getTimeSpent(domainStartTime);
//     await updateDomainData(activeDomain, seconds);
//   } else {
//     domainStartTime = Date.now();
//   }
// });

