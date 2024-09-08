import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearAllData, getStoredData } from "./persistency/storage";

const Popup = () => {
  return (
    <>
      <button onClick={async () => console.log(await getStoredData())}>Retornar Dados</button>
      <button onClick={clearAllData}>Limpar Dados</button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
