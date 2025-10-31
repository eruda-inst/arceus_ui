"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  FaLock,
  FaUser,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

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
    onError: (error: any) => {
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

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Acesse sua conta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "E-mail inválido",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-border-light dark:border-border-dark rounded-lg bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                  disabled={mutation.isPending}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-border-light dark:border-border-dark rounded-lg bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Sua senha"
                  disabled={mutation.isPending}
                />
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>

            {/* Root Error Display */}
            {errors.root && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                  <FaExclamationTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {errors.root.message}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ao continuar, você concorda com nossos{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
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
              <FaChartLine className="text-white text-3xl" />
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
                <FaShieldAlt className="text-white text-sm" />
              </div>
              <span className="text-white/90">Monitoramento em tempo real</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaRocket className="text-white text-sm" />
              </div>
              <span className="text-white/90">
                Análises detalhadas e insights
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaLock className="text-white text-sm" />
              </div>
              <span className="text-white/90">Segurança e confiabilidade</span>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/70 text-sm mb-2">Versão: 0.69.9</p>
            <p className="text-white/50 text-xs">
              Sistema de monitoramento e análise em tempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginContent.displayName = "LoginContent";

export default function Login() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
