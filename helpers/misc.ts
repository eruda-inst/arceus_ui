function capitalizarString(str: string): string {
  const primeiroCaractere = str.charAt(0);
  const outrosCaracteres = str.slice(1);
  const primeiroCaractereCapitalizado = primeiroCaractere.toUpperCase();
  const stringCapitalizada =
    primeiroCaractereCapitalizado.concat(outrosCaracteres);
  return stringCapitalizada;
}

export { capitalizarString };
