import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { clearAllData, getStoredData } from './persistency/storage';
import { StorageData } from './types';

const Popup = () => {
  const [data, setData] = useState<StorageData>({});
  useEffect(() => {
    fetchStoredData();
  }, []);

  async function fetchStoredData() {
    const storedData = await getStoredData();
    setData(storedData);
  }

  return (
    <div style={{ width: 300 }}>
      <div style={{ marginBottom: 10 }}>
        {Object.keys(data).length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.values(data).map((domain, valIndex) => {
              return (
                <div
                  key={domain.favicon}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <img src={domain.favicon} style={{ width: 24, height: 24 }} />
                  <span>
                    {`${
                      Object.keys(data).filter(
                        (_key, keyIndex) => keyIndex === valIndex
                      )[0]
                    } - ${domain.seconds} segundos`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <button onClick={clearAllData}>Limpar Dados</button>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

