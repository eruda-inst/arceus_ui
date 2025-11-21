import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface UsuarioIXC {
  id: number;
  email: string;
  nome: string;
}

interface UsuariosIXC {
  usuarios_ixc: UsuarioIXC[];
}

interface Props {
  selectedId?: number | null;
  onSelect?: (usuario: UsuarioIXC) => void;
  existingEmails?: string[];
}

export function ListagemUsuariosIXC({
  selectedId,
  onSelect,
  existingEmails,
}: Props) {
  const { data, error, isError, isLoading } = useQuery<UsuariosIXC>({
    queryKey: ["usuariosIXC"],
    queryFn: async () => {
      const token = obterTokenAutenticacao();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS_IXC)}?itens_por_pagina=100`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    retry: false,
  });

  return (
    <ScrollArea
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px - 80px)",
      }}
      className="rounded-md border p-4"
    >
      <ul className="flex flex-col gap-y-2">
        {data?.usuarios_ixc &&
          (() => {
            const existingSet = new Set((existingEmails ?? []).filter(Boolean));
            return data.usuarios_ixc
              .filter((u) => !existingSet.has(u.email))
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((usuarioIXC) => {
                const isSelected = selectedId === usuarioIXC.id;
                return (
                  <motion.li
                    key={usuarioIXC.id}
                    whileHover={{ x: "20px" }}
                    transition={{ type: "spring", bounce: 0 }}
                    className="hover:cursor-pointer"
                    onClick={() => onSelect && onSelect(usuarioIXC)}
                  >
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {usuarioIXC.nome}
                    </Badge>
                  </motion.li>
                );
              });
          })()}
      </ul>
    </ScrollArea>
  );
}

ListagemUsuariosIXC.displayName = "ListagemUsuariosIXC";
