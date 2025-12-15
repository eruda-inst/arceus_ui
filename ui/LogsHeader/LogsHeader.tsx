import DescricaoPagina from "../DescricaoPagina/DescricaoPagina";
import HeaderPagina from "../HeaderPagina/HeaderPagina";
import TituloPagina from "../TituloPagina/TituloPagina";

interface LogsHeaderProps {
  totalLogs: number;
  isConnected: boolean;
}

export function LogsHeader({ totalLogs, isConnected }: LogsHeaderProps) {
  return (
    <HeaderPagina>
      <div>
        <TituloPagina>Registros</TituloPagina>
        <DescricaoPagina>
          Total de <span className="font-medium">{totalLogs}</span> requisições
          registradas
        </DescricaoPagina>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">
          {isConnected ? "Conectado" : "Desconectado"}
        </span>
      </div>
    </HeaderPagina>
  );
}

LogsHeader.displayName = "LogsHeader";
