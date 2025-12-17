import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
import CampoSenha from "@/ui/CampoSenha/CampoSenha";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { NomeGrupos } from "@/types/grupo";
import { useAuth } from "@/hooks/useAuth";

interface Formulario {
  id: number;
  email: string;
  senha: string;
  confirmarSenha: string;
  nome: string;
  nome_grupo: NomeGrupos;
}

interface InitialValues {
  id?: number;
  email?: string;
  nome?: string;
  senha?: string;
  confirmarSenha?: string;
  nome_grupo?: NomeGrupos;
}

interface Props {
  initialValues?: InitialValues;
  onCreated?: () => void;
}

export function AdicionarUsuarioForm({ initialValues, onCreated }: Props) {
  const { user: usuarioLogado } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      nome_grupo: NomeGrupos.Usuario,
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
        nome_grupo: initialValues?.nome_grupo ?? NomeGrupos.Usuario,
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

      const formData = {
        nome: data?.nome,
        email: data?.email,
        senha: data?.senha,
        nome_grupo: data?.nome_grupo,
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
      console.error("Error creating user:", error);
      toast.error("Erro!", {
        position: "top-center",
        description: "Ocorreu um erro ao criar o usuário.",
      });
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
      <CampoSenha
        id="senha"
        label="Senha"
        placeholder="Digite sua senha"
        validation={{
          required: "A senha é obrigatória.",
          minLength: {
            value: 6,
            message: "A senha deve ter no mínimo 6 caracteres.",
          },
          maxLength: {
            value: 50,
            message: "A senha deve ter no máximo 50 caracteres.",
          },
        }}
        register={register}
        errors={errors}
        showPassword={showPassword}
        onToggleVisibility={() => setShowPassword(!showPassword)}
      />
      <CampoSenha
        id="confirmarSenha"
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        validation={{
          required: "A confirmação de senha é obrigatória.",
          validate: (value: string) =>
            value === watch("senha") || "As senhas não coincidem.",
        }}
        register={register}
        errors={errors}
        showPassword={showConfirmPassword}
        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <Field>
        <FieldLabel>Grupo</FieldLabel>
        <Controller
          name="nome_grupo"
          control={control}
          defaultValue={NomeGrupos.Usuario}
          render={({ field }) => (
            <Select
              onValueChange={(val: string) => field.onChange(val)}
              value={field.value}
              disabled={!usuarioLogado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {usuarioLogado?.nome_grupo ===
                    NomeGrupos.SuperAdministrador && (
                    <>
                      <SelectItem value={NomeGrupos.SuperAdministrador}>
                        {NomeGrupos.SuperAdministrador}
                      </SelectItem>
                      <SelectSeparator />
                      <SelectItem value={NomeGrupos.Administrador}>
                        {NomeGrupos.Administrador}
                      </SelectItem>
                      <SelectSeparator />
                      <SelectItem value={NomeGrupos.Usuario}>
                        {NomeGrupos.Usuario}
                      </SelectItem>
                    </>
                  )}
                  {usuarioLogado?.nome_grupo === NomeGrupos.Administrador && (
                    <SelectItem value={NomeGrupos.Usuario}>
                      {NomeGrupos.Usuario}
                    </SelectItem>
                  )}
                  {usuarioLogado?.nome_grupo === NomeGrupos.Usuario && (
                    <SelectItem value={NomeGrupos.Usuario}>
                      {NomeGrupos.Usuario}
                    </SelectItem>
                  )}
                  {!usuarioLogado && (
                    <SelectItem value={NomeGrupos.Usuario}>
                      {NomeGrupos.Usuario}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.nome_grupo && (
          <span className="text-destructive text-sm">
            {errors.nome_grupo.message}
          </span>
        )}
      </Field>
      <Button type="submit" className="w-fit ml-auto">
        Criar usuário
      </Button>
    </form>
  );
}

export default AdicionarUsuarioForm;
