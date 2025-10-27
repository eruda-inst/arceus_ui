function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarPorcentagem(valor: number | string): string {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;
  const arredondado = Math.round(numero * 100) / 100;
  return arredondado.toFixed(2).replace(".", ",") + "%";
}

export { formatarData, formatarPorcentagem };
