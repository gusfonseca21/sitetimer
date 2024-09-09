import { DomainDataValue, StorageData } from '../types';

export async function getStoredData() {
  try {
    return (await chrome.storage.local.get()) as StorageData;
  } catch (error) {
    // console.error("Houve um erro ao tentar retornar os dados salvos: ", error);
    throw error;
  }
}

export async function getDomainData(domain: string): Promise<DomainDataValue> {
  try {
    const data = await chrome.storage.local.get(domain);
    if (Object.keys(data).length) {
      return data[domain];
    }
    throw new Error(`Não foram encontrados registros do domínio ${domain}`);
  } catch (error) {
    throw error;
  }
}

export async function storeNewDomain(domain: string) {
  try {
    const domainData: StorageData = { [domain]: { seconds: 0, favicon: '' } };
    await chrome.storage.local.set(domainData); // Novo domínio inicia com tempo gasto de 0 segundos;
    console.info(`O domínio ${domain} foi registrado com sucesso`);
  } catch (error) {
    // console.error("Houve um erro ao tentar armazenar o novo domínio registrado: ", error);
    throw error;
  }
}

export async function updateDomainData(
  domain: string,
  updatedSeconds: number | null,
  updatedFavIcon?: string
) {
  try {
    const domainData = await getDomainData(domain);
    if (updatedSeconds) {
      domainData.seconds = updatedSeconds;
    }
    if (updatedFavIcon) {
      domainData.favicon = updatedFavIcon;
    }
    await chrome.storage.local.set({ [domain]: domainData });
    console.info(
      `Os dados do domínio ${domain} foram atualizados: ${JSON.stringify({
        favIcon: domainData.favicon.substring(0, 5) + '...',
        seconds: domainData.seconds,
      })}`
    );
  } catch (error) {
    // console.error(`Houve um erro ao tentar atualizar o favicon do domínio ${domain}: ${error}`);
    throw error;
  }
}

export async function checkDomainStored(
  incomingDomain: string
): Promise<boolean> {
  try {
    let exists = false;
    const data = await getStoredData();
    Object.keys(data).forEach((storedDomain) => {
      if (incomingDomain === storedDomain) {
        exists = true;
      }
    });
    return exists;
  } catch (error) {
    // console.error('Erro ao tentar verificar se o domínio já está registrado: ', error);
    throw error;
  }
}

export async function checkHasFavIcon(domain: string): Promise<boolean> {
  try {
    const data = await getDomainData(domain);
    return !!data.favicon;
  } catch (error) {
    throw error;
  }
}

export async function clearAllData() {
  try {
    await chrome.storage.local.clear();
    console.info('Todos os dados foram limpos');
  } catch (error) {
    // console.error("Erro ao limpar todos os dados: ", error);
    throw error;
  }
}

