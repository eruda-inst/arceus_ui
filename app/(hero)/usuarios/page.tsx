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
  DialogClose,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

interface Formulario {
  id: number;
  email: string;
  senha: string;
  confirmarSenha: string;
  nome: string;
  funcao?: Funcao;
}

interface Usuarios {
  usuarios: Usuario[];
}

export default function Usuarios() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery<Usuarios>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const token = obterTokenAutenticacao();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS),
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
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm<Formulario>();

  const onSubmit: SubmitHandler<Formulario> = async (data) => {
    try {
      const token = obterTokenAutenticacao();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await axios.post(
        getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS),
        {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          funcao: data.funcao,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Sucesso!", {
        position: "top-center",
        description: "Usuário criado com sucesso!",
      });

      // Reset form and close dialog on success
      reset();
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

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
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="absolute bottom-0 right-0">
            Novo usuário
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <Field>
              <FieldLabel htmlFor="nome">Nome</FieldLabel>
              <Input
                id="nome"
                type="text"
                placeholder="John Doe"
                {...register("nome", {
                  required: "O nome é obrigatório.",
                  minLength: {
                    value: 3,
                    message: "O nome deve ter no mínimo 3 caracteres.",
                  },
                  maxLength: {
                    value: 50,
                    message: "O nome deve ter no máximo 50 caracteres.",
                  },
                })}
              />
              {errors.nome && (
                <span className="text-destructive text-sm">
                  {errors.nome.message}
                </span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@exemplo.com"
                {...register("email", {
                  required: "O e-mail é obrigatório.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Por favor, insira um e-mail válido.",
                  },
                })}
              />
              {errors.email && (
                <span className="text-destructive text-sm">
                  {errors.email.message}
                </span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="senha">Senha</FieldLabel>
              <Input
                id="senha"
                type="password"
                placeholder="abCD12@"
                {...register("senha", {
                  required: "A senha é obrigatória.",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter no mínimo 6 caracteres.",
                  },
                  maxLength: {
                    value: 50,
                    message: "A senha deve ter no máximo 50 caracteres.",
                  },
                })}
              />
              {errors.senha && (
                <span className="text-destructive text-sm">
                  {errors.senha.message}
                </span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmarSenha">Confirmar Senha</FieldLabel>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="abCD12@"
                {...register("confirmarSenha", {
                  required: "A senha é obrigatória.",
                  validate: (value) =>
                    value === watch("senha") || "As senhas não coincidem.",
                })}
              />
              {errors.confirmarSenha && (
                <span className="text-destructive text-sm">
                  {errors.confirmarSenha.message}
                </span>
              )}
            </Field>
            <Field>
              <FieldLabel>Grupo</FieldLabel>
              <Select {...register("funcao")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grupos</SelectLabel>
                    <SelectItem value="administrador">Admin</SelectItem>
                    <SelectItem value="usuario">Usuário</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button type="submit" className="w-fit ml-auto">
              Criar usuário
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Usuarios.displayName = "Usuarios";
