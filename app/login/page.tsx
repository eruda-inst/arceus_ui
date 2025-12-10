"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Versao } from "@/ui/Versao/Versao";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Eye,
  EyeOff,
  Rocket,
  TriangleAlert,
  Lock,
  ChartBar,
  ShieldCheck,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { setCookie } from "cookies-next";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";

interface LoginForm {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
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

  // Verifica se já está autenticado e redireciona
  useEffect(() => {
    const token = document.cookie.includes("auth-token=");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const mutation = useMutation({
    mutationFn: async (credentials: LoginForm) => {
      const response = await api.post<LoginResponse>(
        getHttpUrl(HTTP_ENDPOINTS_NAME.LOGIN),
        credentials,
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Set the auth token cookie
      setCookie("auth-token", data.token, {
        path: "/",
        maxAge: 60 * 30, // 30 minutes (matches TOKEN_EXPIRE_MINUTES in backend)
        sameSite: "strict",
      });

      // Store refresh token securely
      localStorage.setItem("refreshToken", data.refresh_token);

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
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email", {
                        required: "E-mail é obrigatório.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "E-mail inválido.",
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
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...register("senha", {
                        required: "Senha é obrigatório.",
                        minLength: {
                          value: 6,
                          message: "Senha deve ter pelo menos 6 caracteres. ",
                        },
                      })}
                      className="pl-10 pr-12"
                      placeholder="12ABab@"
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                  <p className="text-destructive text-sm mt-1">
                    {errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full hover:cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? <Spinner /> : "Entrar"}
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
              <ChartBar className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Arceus</h2>
            <div className="w-16 h-1 bg-white/50 rounded-full mx-auto"></div>
          </div>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Monitoramento em tempo real para uma operação mais inteligente e
            eficiente.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-white text-sm" />
              </div>
              <span className="text-white/90">Monitoramento em tempo real</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Rocket className="text-white text-sm" />
              </div>
              <span className="text-white/90">
                Análises detalhadas e insights
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="text-white text-sm" />
              </div>
              <span className="text-white/90">Segurança e confiabilidade</span>
            </div>
          </div>
          <Separator className="border-white/20" />
          <div className="pt-6">
            <Versao />
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
