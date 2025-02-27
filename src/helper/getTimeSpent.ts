export default function getTimeSpent(startTime: number) {
  const finishTime = Date.now();
  // Para limitar o total de casas decimais da soma, usamos toFixed(), que transforma o número em uma string
  // por isso é importante utilizar parseFloat(), para transformar o float em tipo number de volta.
  return parseFloat(((finishTime - startTime) / 1000).toFixed(2)); // Segundos
}

