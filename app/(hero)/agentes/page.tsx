"use client";

import { useQuery } from "@tanstack/react-query";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Calendar, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface Agente {
  id: number;
  nome: string;
  setor: string;
  descricao: string;
  criado_em: string;
  atualizado_em: string;
  configuracao: string;
}

export default function Agentes() {
  const { hasPermission, redirectIfNoPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("agentes:ver");
    }
  }, [loading, redirectIfNoPermission]);

  const { data, isLoading, isError } = useQuery<Agente[]>({
    queryKey: ["agentes"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.AGENTES)}?itens_por_pagina=100`,
      );
      return response.data;
    },
    retry: false,
  });

  const handleDownloadConfig = (agente: Agente) => {
    const blob = new Blob([agente.configuracao], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `config-agente-${agente.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!hasPermission("agentes:ver")) {
    return null;
  }

  return (
    <div
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px)",
      }}
      className="relative"
    >
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Mensagem className="text-destructive">
          Erro ao carregar agentes
        </Mensagem>
      ) : data && data.length > 0 ? (
        <Grid className="grid-cols-4 gap-6">
          {data.map((agente: Agente) => (
            <motion.div
              key={agente.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", bounce: 0 }}
            >
              <Card className="h-80 flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 shrink-0">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-6">
                      {agente.nome}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {agente.setor}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0">
                  <div className="mb-4 shrink-0">
                    <CardDescription className="text-sm line-clamp-3">
                      {agente.descricao}
                    </CardDescription>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Criado: {formatarData(agente.criado_em)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3" />
                      <span>
                        Atualizado: {formatarData(agente.atualizado_em)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto shrink-0">
                    <Button
                      onClick={() => handleDownloadConfig(agente)}
                      className="w-full hover:cursor-pointer"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar configuração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum agente encontrado.
        </Mensagem>
      )}
    </div>
  );
}

Agentes.displayName = "Agentes";
