function obterCorMetodo(metodo: string | number): string {
  metodo = metodo.toString();
  switch (metodo) {
    case "GET":
      return "bg-blue-100 text-blue-800";
    case "POST":
      return "bg-green-100 text-green-800";
    case "PUT":
      return "bg-yellow-100 text-yellow-800";
    case "DELETE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function obterCorStatusCode(statusCode: number | string): string {
  statusCode = Number(statusCode);
  if (statusCode >= 200 && statusCode < 300) {
    return "bg-green-100 text-green-800";
  } else if (statusCode >= 400 && statusCode < 500) {
    return "bg-yellow-100 text-yellow-800";
  } else {
    return "bg-red-100 text-red-800";
  }
}

export { obterCorMetodo, obterCorStatusCode };
