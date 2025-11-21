"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { AdicionarUsuarioForm } from "@/ui/AdicionarUsuarioForm/AdicionarUsuarioForm";
import { ListagemUsuariosIXC } from "@/ui/ListagemUsuariosIXC/ListagemUsuariosIXC";

enum Funcao {
  ADMINISTRADOR = "administrador",
  USUARIO = "usuario",
}

interface Usuario {
  id: number;
  email: string;
  nome: string;
  funcao?: Funcao;
}

interface Usuarios {
  usuarios: Usuario[];
}

export default function Usuarios() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedIXCUser, setSelectedIXCUser] = useState<{
    id: number;
    email: string;
    nome: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery<Usuarios>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const token = obterTokenAutenticacao();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}?itens_por_pagina=100`,
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
    <div
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px)",
      }}
      className="relative"
    >
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Mensagem className="text-destructive">Erro: {error?.message}</Mensagem>
      ) : data?.usuarios && data?.usuarios.length > 0 ? (
        <Grid className="grid-cols-4">
          {data?.usuarios &&
            data?.usuarios.map((usuario: Usuario) => (
              <motion.li
                key={usuario.id}
                whileHover={{ y: "-5%" }}
                transition={{ type: "spring", bounce: 0 }}
              >
                <Card className="hover:cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <CardTitle>{usuario.nome}</CardTitle>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <Badge variant="secondary">
                        {usuario?.funcao === "administrador"
                          ? "Administrador"
                          : "Usuário"}
                      </Badge>
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum usuário encontrado.
        </Mensagem>
      )}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="fixed bottom-5 right-5">
            Novo usuário
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleção de Usuário do IXC</DialogTitle>
            <DialogDescription>
              Selecione o usuário do IXC que deseja adicionar ao sistema.
            </DialogDescription>
          </DialogHeader>
          <ListagemUsuariosIXC
            selectedId={selectedIXCUser?.id ?? null}
            onSelect={(u) => setSelectedIXCUser(u)}
            existingEmails={data?.usuarios?.map((u) => u.email) ?? []}
          />
          <Button
            disabled={!selectedIXCUser}
            onClick={() => {
              setIsProfileDialogOpen(false);
              setIsAddDialogOpen(true);
            }}
            className="w-fit ml-auto hover:cursor-pointer hover:disabled:cursor-not-allowed"
          >
            Selecionar Usuário
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>Preencha grupo e senha.</DialogDescription>
          </DialogHeader>
          <AdicionarUsuarioForm
            initialValues={
              selectedIXCUser
                ? {
                    id: selectedIXCUser.id,
                    email: selectedIXCUser.email,
                    nome: selectedIXCUser.nome,
                  }
                : undefined
            }
            onCreated={() => {
              setIsAddDialogOpen(false);
              setSelectedIXCUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

Usuarios.displayName = "Usuarios";
