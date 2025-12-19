import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { NomeGrupos } from "@/types/grupo";

export interface Grupo {
  id: number;
  nome: string;
  criado_em: string;
  atualizado_em: string;
}

export function useGruposDisponiveis(usuarioNomeGrupo: NomeGrupos | undefined) {
  const { data: todosGrupos, isLoading: isLoadingGrupos } = useQuery<Grupo[]>({
    queryKey: ["grupos"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS)}?itens_por_pagina=100`,
      );
      return response.data;
    },
    enabled: !!usuarioNomeGrupo,
    retry: false,
  });

  const getGruposDisponiveis = (
    nomeGrupo: NomeGrupos | undefined,
  ): string[] => {
    if (!nomeGrupo || !todosGrupos) {
      return [NomeGrupos.Usuario];
    }

    const nomesGrupos = todosGrupos.map((g) => g.nome);

    if (nomeGrupo === NomeGrupos.SuperAdministrador) {
      return nomesGrupos;
    }

    if (nomeGrupo === NomeGrupos.Administrador) {
      // Administradores podem atribuir qualquer grupo EXCETO Super Administrador e Administrador
      return nomesGrupos.filter(
        (g) =>
          g !== NomeGrupos.SuperAdministrador && g !== NomeGrupos.Administrador,
      );
    }

    return [NomeGrupos.Usuario];
  };

  return {
    gruposDisponiveis: getGruposDisponiveis(usuarioNomeGrupo),
    isLoading: isLoadingGrupos,
  };
}
