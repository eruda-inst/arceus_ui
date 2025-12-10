import axios from "axios";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface Formulario {
  id: number;
  email: string;
  senha: string;
  confirmarSenha: string;
  nome: string;
  id_grupo: number;
}

interface InitialValues {
  id?: number;
  email?: string;
  nome?: string;
  senha?: string;
  confirmarSenha?: string;
  id_grupo?: number;
}

interface Props {
  initialValues?: InitialValues;
  onCreated?: () => void;
}

export function AdicionarUsuarioForm({ initialValues, onCreated }: Props) {
  const queryClient = useQueryClient();
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
    control,
  } = useForm<Formulario>({
    defaultValues: {
      id_grupo: 2, // Valor padrão definido aqui
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        id: initialValues.id,
        email: initialValues.email ?? "",
        nome: initialValues.nome ?? "",
        senha: "",
        confirmarSenha: "",
        id_grupo: initialValues.id_grupo ?? 2, // Mantém o valor do initialValues ou usa 2 como padrão
      });
    }
  }, [initialValues, reset]);

  const onSubmit: SubmitHandler<Formulario> = async (data) => {
    try {
      const token = obterTokenAutenticacao();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Garante que id_grupo será 2 se não for informado
      const formData = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        id_grupo: data.id_grupo || 2,
      };

      await axios.post(getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS), formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Sucesso!", {
        position: "top-center",
        description: "Usuário criado com sucesso!",
      });
      reset();
      if (onCreated) onCreated();
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <Field>
        <FieldLabel htmlFor="nome">Nome</FieldLabel>
        <Input
          id="nome"
          type="text"
          autoComplete="name"
          readOnly={Boolean(initialValues?.nome)}
          className="bg-muted text-muted-foreground"
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
          autoComplete="email"
          readOnly={Boolean(initialValues?.email)}
          className="bg-muted text-muted-foreground"
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
          autoComplete="current-password"
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
          autoComplete="current-password"
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
        <Controller
          name="id_grupo"
          control={control}
          defaultValue={2} // Garante o valor padrão
          render={({ field }) => (
            <Select
              onValueChange={(val: string) => field.onChange(Number(val))}
              value={String(field.value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="2">Usuário</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <Button type="submit" className="w-fit ml-auto">
        Criar usuário
      </Button>
    </form>
  );
}

export default AdicionarUsuarioForm;
