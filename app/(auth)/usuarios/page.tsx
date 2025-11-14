"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/config";
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
import { obterTokenAutenticacao } from "@/helpers/misc";

interface Usuario {
  id: number;
  email: string;
  nome: string;
  funcao: string;
}

interface Usuarios {
  usuarios: Usuario[];
}

export default function Usuarios() {
  const { data, isLoading, isError, error } = useQuery<Usuarios>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const token = obterTokenAutenticacao();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(API_CONFIG.HTTP.ROTAS.USUARIOS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    retry: false,
  });

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Mensagem className="text-destructive">Erro: {error?.message}</Mensagem>
      ) : data?.usuarios && data?.usuarios.length > 0 ? (
        <Grid className="grid-cols-4">
          {data?.usuarios &&
            data?.usuarios.map((usuario: Usuario) => (
              <Card key={usuario.id}>
                <CardHeader>
                  <CardTitle>
                    <CardTitle>{usuario.nome}</CardTitle>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <Badge variant="secondary">{usuario.funcao}</Badge>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum usuário encontrado.
        </Mensagem>
      )}
    </div>
  );
}

Usuarios.displayName = "Usuarios";
