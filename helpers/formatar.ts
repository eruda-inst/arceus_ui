function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const formatarDataHora = (data: string) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function formatarPorcentagem(valor: number | string): string {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;
  const arredondado = Math.round(numero * 100) / 100;
  return arredondado.toFixed(2).replace(".", ",") + "%";
}

function formatarTempo(milissegundos: number): string {
  if (milissegundos < 1000) {
    return `${milissegundos} ms`;
  } else {
    // Converte para segundos
    const segundos = (milissegundos / 1000).toFixed(3);
    return `${segundos} s`.replace(".", ",");
  }
}

export { formatarData, formatarDataHora, formatarPorcentagem, formatarTempo };
