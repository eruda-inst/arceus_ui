function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export { formatarData };
