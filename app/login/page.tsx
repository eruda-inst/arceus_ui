"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Form,
  InputGroup,
  Label,
  TextField,
  toast,
  Typography,
} from "@heroui/react";
import { motion } from "motion/react";
import {
  FaArrowRightToBracket,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa6";
import { CURRENT_VERSION } from "@/configs/misc.config";
import { LoginInType } from "@/types/auth.type";
import { LoginInSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";
import Validator from "@/helpers/Validator.helper";
import AuthService from "@/services/Auth.service";
import logo from "@/public/logo.svg";

/**
 * LoginPage component
 * Renders the login screen with email/password fields, form validation,
 * and handles the authentication flow. Uses Zustand store to persist tokens
 * and redirects to the home page upon success.
 */
export default function LoginPage() {
  const router = useRouter();

  // Zustand store action to save authentication tokens.
  const setTokens = useAuthStore((state) => state.setTokens);

  // Local state for login form data.
  const [login, setLogin] = useState<LoginInType>({ email: "", senha: "" });
  // Toggle password visibility.
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Loading state while authentication request is in progress.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Computes whether the submit button should be disabled.
   * Uses Zod schema to validate the current login data.
   * The button is disabled if validation fails.
   */
  const isBtnDisabled = useMemo(() => {
    const result = LoginInSchema.safeParse(login);
    const isDisabled = !result.success;
    return isDisabled;
  }, [login]);

  /**
   * Handles form submission:
   * - Prevents default browser behavior
   * - Sets loading state
   * - Calls the authentication service
   * - On success: stores tokens and redirects to home
   * - On error: shows a toast message
   * - Finally resets loading state
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await AuthService.login(login);
      setTokens(data.access_token, data.refresh_token);
      router.replace("/");
    } catch {
      toast.danger("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full">
      {/* Left column: login form with slide-in animation */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="flex w-1/2 flex-col justify-center items-center px-12 relative"
        initial={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header section */}
          <div>
            <Typography type="h1" className="text-3xl" weight="bold">
              Bem-vindo de volta
            </Typography>
            <p className="mt-2 text-muted">
              Por favor, insira suas credenciais para acessar o sistema.
            </p>
          </div>

          {/* Login form */}
          <Form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Email field with built-in validation */}
            <TextField
              autoComplete="email"
              value={login.email}
              onChange={(v) => setLogin((prev) => ({ ...prev, email: v }))}
              isRequired
              validate={(value) => {
                if (!value.length) {
                  return "Campo obrigatório";
                }
                if (value && !Validator.email(value)) {
                  return "E-mail inválido";
                }
                return null;
              }}
              variant="secondary"
            >
              <Label>E-mail</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FaUser className="text-xl" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Digite seu e-mail" />
              </InputGroup>
              <FieldError />
            </TextField>

            {/* Password field with visibility toggle and validation */}
            <TextField
              autoComplete="current-password"
              value={login.senha}
              onChange={(v) => setLogin((prev) => ({ ...prev, senha: v }))}
              type={isVisible ? "text" : "password"}
              variant="secondary"
              isRequired
              validate={(value) => {
                if (!value.length) {
                  return "Campo obrigatório";
                }
                if (value.length < 8) {
                  return "A senha deve conter 8 caracteres ou mais";
                }
                return null;
              }}
            >
              <Label>Senha</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FaLock className="text-xl" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Digite sua senha" />
                <InputGroup.Suffix>
                  {isVisible ? (
                    <FaEyeSlash
                      className="hover:cursor-pointer text-xl"
                      onClick={() => setIsVisible(false)}
                    />
                  ) : (
                    <FaEye
                      className="hover:cursor-pointer text-xl"
                      onClick={() => setIsVisible(true)}
                    />
                  )}
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError />
            </TextField>

            {/* Submit button with loading state and icon */}
            <Button
              type="submit"
              fullWidth
              isPending={isLoading}
              isDisabled={isBtnDisabled}
              className="bg-purple-500"
            >
              {({ isPending }) => (
                <>
                  <FaArrowRightToBracket />
                  {isPending ? "Entrando..." : "Entrar"}
                </>
              )}
            </Button>
          </Form>

          {/* Footer credits */}
          <div className="text-center text-sm text-muted mt-8">
            Desenvolvido pela Newnet.
          </div>
        </div>
      </motion.div>

      {/* Right column: branding and info with fade-in animation */}
      <motion.div
        animate={{ opacity: 1 }}
        className="flex w-1/2 relative bg-linear-to-br from-purple-500 to-indigo-500 items-center justify-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative blurred background circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        {/* Main content with staggered animation */}
        <div className="relative p-12 text-center max-w-lg">
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Logo */}
            <div className="size-20 mx-auto">
              <Image
                alt="Logo do sistema. Imagem do pokémon Arceus"
                src={logo}
              />
            </div>

            {/* Title and description */}
            <Typography
              type="h2"
              align="center"
              weight="bold"
              className="text-4xl mt-4 mb-6"
            >
              Arceus
            </Typography>
            <p className="text-lg leading-relaxed mb-8">
              Plataforma para monitoramento de requisições HTTP realizadas ao
              Arceus, com visualização de logs, métricas agregadas e dashboards
              analíticos.
            </p>
          </motion.div>

          {/* Feature cards with hover animation */}
          <div className="grid grid-cols-2 gap-4 mt-12 text-left">
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-bold text-xl">Logs</div>
              <div className="text-xs uppercase tracking-wider">Detalhados</div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-bold text-xl">Dashboards</div>
              <div className="text-xs uppercase tracking-wider">
                Interativos
              </div>
            </motion.div>
          </div>

          {/* Version info with delayed fade-in */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute bottom-5 left-0 right-0 text-center text-sm font-mono"
            initial={{ opacity: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Versão: {CURRENT_VERSION}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
