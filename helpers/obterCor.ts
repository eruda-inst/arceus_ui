interface Cor {
  bg: string;
  fg: string;
}

function obterCorMetodo(metodo: string): Cor {
  let bg = "bg-gray-100";
  let fg = "text-gray-800";
  switch (metodo) {
    case "GET":
      bg = "bg-blue-100";
      fg = "text-blue-800";
      break;
    case "POST":
      bg = "bg-green-100";
      fg = "text-green-800";
      break;
    case "PUT":
      bg = "bg-yellow-100";
      fg = "text-yellow-800";
      break;
    case "DELETE":
      bg = "bg-red-100";
      fg = "text-red-800";
  }
  return { bg: bg, fg: fg };
}

function obterCorStatusCode(statusCode: number | string): Cor {
  statusCode = Number(statusCode);
  let bg = "";
  let fg = "";
  if (statusCode >= 200 && statusCode < 300) {
    bg = "bg-green-100";
    fg = "text-green-800";
  } else if (statusCode >= 400 && statusCode < 500) {
    bg = "bg-yellow-100";
    fg = "text-yellow-800";
  } else {
    bg = "bg-red-100";
    fg = "text-red-800";
  }
  return { bg: bg, fg: fg };
}

export { obterCorMetodo, obterCorStatusCode };
