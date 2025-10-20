function converterTempo(milissegundos: number): string {
  if (milissegundos < 1000) {
    return `${milissegundos} ms`;
  } else {
    // Converte para segundos
    const segundos = milissegundos / 1000;
    return `${segundos} s`;
  }
}

export { converterTempo };
