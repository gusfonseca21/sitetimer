chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab ativada: ", activeInfo);

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      console.log("Domínio capturado: ", domain);
    }
  });
});
