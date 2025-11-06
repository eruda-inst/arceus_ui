"use client";

import axios from "axios";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { VersionInfo } from "@/ui/VersionInfo/VersionInfo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  LuUser,
  LuEye,
  LuEyeOff,
  LuRocket,
  LuTriangleAlert,
  LuLoader,
  LuLock,
  LuChartBar,
  LuShieldCheck,
} from "react-icons/lu";

interface LoginForm {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>();

  const mutation = useMutation({
    mutationFn: async (credentials: LoginForm) => {
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login` ||
          "http://localhost:8000/api/v1/auth/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Set the auth token cookie that middleware expects
      document.cookie = `auth-token=${data.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Strict`;

      // Redirect to intended page or default
      router.push(redirect);
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);

      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          errorMessage;

        // Set field-specific errors if available
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          if (errors.email) {
            setError("email", { message: errors.email });
          }
          if (errors.senha) {
            setError("senha", { message: errors.senha });
          }
        }
      }

      // Set general form error
      setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-left mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Acesse sua conta
            </h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Field>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuUser className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email", {
                        required: "E-mail é obrigatório",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "E-mail inválido",
                        },
                      })}
                      className="pl-10"
                      placeholder="seu@email.com"
                      disabled={mutation.isPending}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuLock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("senha", {
                        required: "Senha é obrigatória",
                        minLength: {
                          value: 6,
                          message: "Senha deve ter pelo menos 6 caracteres",
                        },
                      })}
                      className="pl-10 pr-12"
                      placeholder="Sua senha"
                      disabled={mutation.isPending}
                    />
                    <Button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="bg-inherit absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors hover:bg-inherit hover:cursor-pointer"
                      disabled={mutation.isPending}
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <LuEyeOff className="h-4 w-4" />
                      ) : (
                        <LuEye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.senha && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.senha.message}
                    </p>
                  )}
                </Field>

                {/* Root Error Display */}
                {errors.root && (
                  <Alert>
                    <div className="flex items-start gap-3">
                      <LuTriangleAlert className="h-4 w-4" />
                      <div className="text-sm">
                        <div className="font-medium">{errors.root.message}</div>
                      </div>
                    </div>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <LuLoader className="h-4 w-4 animate-spin mr-2" />{" "}
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Ao continuar, você concorda com nossos{" "}
                  <a className="text-primary underline">Termos de Serviço</a> e{" "}
                  <a className="text-primary underline">
                    Política de Privacidade
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-center">
                <small className="text-xs text-muted-foreground">
                  Precisa de ajuda? Contate o suporte.
                </small>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 flex items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-white text-center max-w-lg">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <LuChartBar className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Aggregator • Monitor</h2>
            <div className="w-16 h-1 bg-white/50 rounded-full mx-auto"></div>
          </div>

          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Monitoramento em tempo real para uma operação mais inteligente e
            eficiente.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <LuShieldCheck className="text-white text-sm" />
              </div>
              <span className="text-white/90">Monitoramento em tempo real</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <LuRocket className="text-white text-sm" />
              </div>
              <span className="text-white/90">
                Análises detalhadas e insights
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <LuLock className="text-white text-sm" />
              </div>
              <span className="text-white/90">Segurança e confiabilidade</span>
            </div>
          </div>

          <Separator className="border-white/20" />

          <div className="pt-6">
            <VersionInfo />
            <p className="text-white/50 text-xs mt-2">
              Sistema de monitoramento e análise em tempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

Login.displayName = "Login";
