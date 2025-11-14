function capitalizarString(str: string): string {
  const primeiroCaractere = str.charAt(0);
  const outrosCaracteres = str.slice(1);
  const primeiroCaractereCapitalizado = primeiroCaractere.toUpperCase();
  const stringCapitalizada =
    primeiroCaractereCapitalizado.concat(outrosCaracteres);
  return stringCapitalizada;
}

function obterTokenAutenticacao(): string | undefined {
  if (typeof document === "undefined") return undefined;

  return document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("auth-token="))
    ?.split("=")[1];
}

export { capitalizarString, obterTokenAutenticacao };
