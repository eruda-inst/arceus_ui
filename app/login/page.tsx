"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Label,
  TextField,
  Form,
  InputGroup,
  Button,
  FieldError,
  toast,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRightToBracket,
} from "react-icons/fa6";
import axios from "axios";
import { CURRENT_VERSION } from "@/configs/misc.config";
import { API_ROUTES } from "@/configs/api.config";
import { LoginIn } from "@/types/login.type";
import { LoginInSchema } from "@/schemas/login.schema";
import { useAuthStore } from "@/stores/authentication.store";
import Validator from "@/helpers/Validator.helper";
import logo from "@/public/logo.svg";

export default function Login() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const [login, setLogin] = useState<LoginIn>({ email: "", senha: "" });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);

  const handleChange = (key: keyof LoginIn, value: string) => {
    setLogin((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ROUTES.authentication.login(),
        login,
      );
      const data = response.data;

      const { access_token, refresh_token } = data;

      setTokens(access_token, refresh_token);
      router.replace("/");
    } catch {
      toast.danger("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsBtnDisabled = () => {
    const result = LoginInSchema.safeParse(login);
    const isDisabled = !result.success;
    setIsBtnDisabled(isDisabled);
  };

  useEffect(() => {
    checkIsBtnDisabled();
  }, [login]);

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Left Side */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="flex w-1/2 flex-col justify-center items-center px-12 relative"
        initial={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-muted">
              Por favor, insira suas credenciais para acessar o sistema.
            </p>
          </div>

          <Form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Usuário */}
            <TextField
              autoComplete="email"
              value={login.email}
              onChange={(value) => handleChange("email", value)}
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

            {/* Senha */}
            <TextField
              autoComplete="current-password"
              value={login.senha}
              onChange={(value) => handleChange("senha", value)}
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

          {/* Footer */}
          <div className="text-center text-sm text-muted mt-8">
            &copy; {new Date().getFullYear()} Arceus. Todos os direitos
            reservados.
          </div>
        </div>
      </motion.div>

      {/* Right Side */}
      <motion.div
        animate={{ opacity: 1 }}
        className="flex w-1/2 relative bg-linear-to-br from-purple-500 to-indigo-500 items-center justify-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 50, 0],
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 p-12 text-center max-w-lg">
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto">
              <Image
                alt="Logo do sistema. Imagem do pokémon Arceus"
                src={logo}
              />
            </div>
            <h2 className="text-4xl font-bold mb-6 tracking-tight mt-4">
              Arceus
            </h2>
            <p className="text-lg text-purple-100 leading-relaxed mb-8">
              Plataforma para monitoramento de requisições HTTP realizadas ao
              Arceus, com visualização de logs, métricas agregadas e dashboards
              analíticos.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 mt-12 text-left">
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-bold text-xl">Logs</div>
              <div className="text-xs text-muted uppercase tracking-wider">
                Detalhados
              </div>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-bold text-xl">Dashboards</div>
              <div className="text-xs text-muted uppercase tracking-wider">
                Interativos
              </div>
            </motion.div>
          </div>
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute bottom-5 left-0 right-0 text-center text-muted text-sm font-mono"
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
