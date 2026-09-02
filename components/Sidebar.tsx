"use client";

import Image from "next/image";
import {
  FaArrowRight,
  FaClipboardList,
  FaEye,
  FaEyeSlash,
  FaHouseChimney,
  FaPaintbrush,
  FaPencil,
  FaRightFromBracket,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/public/logo.svg";
import {
  Avatar,
  Button,
  Description,
  Dropdown,
  FieldError,
  Form,
  InputGroup,
  Label,
  Modal,
  Skeleton,
  TextField,
  toast,
} from "@heroui/react";
import { useAuthStore } from "@/stores/authentication.store";
import Misc from "@/helpers/Misc.helper";
import z from "zod";
import { useEffect, useState } from "react";
import { UserOut } from "@/types/user.type";
import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import InfoItem from "@/components/InfoItem";
import { usePermStore } from "@/stores/perm.store";
import { useTheme } from "next-themes";
import { Key } from "react-aria";
import clsx from "clsx";

const FormSchema = z.object({
  senha: z.string().min(8).nullable(),
  confirmarSenha: z.string().min(8).nullable(),
});

const EmptyForm = z.object({
  senha: z.literal(""),
  confirmarSenha: z.literal(""),
});

type FormType = z.infer<typeof FormSchema>;

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasAllPerms } = usePermStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<Key>>(new Set(["system"]));
  const { setTheme } = useTheme();

  const {
    currentUser,
    loadingUser,
    logout,
    fetchCurrentUser,
    isAuthenticated,
    groupName,
  } = useAuthStore();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [form, setForm] = useState<FormType>({
    senha: "",
    confirmarSenha: "",
  });

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setForm({ senha: "", confirmarSenha: "" });
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
    setIsEditingUser(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (key: keyof FormType, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      return;
    }

    setIsSaving(true);

    try {
      await axiosClient.patch<UserOut>(
        API_ROUTES.user.updatePasswordById(currentUser.id),
        { nova_senha: form.senha },
      );

      await fetchCurrentUser();

      toast.success("Sucesso", {
        description: "Perfil atualizado com sucesso!",
      });

      setIsEditingUser(false);
    } catch (error: unknown) {
      toast.danger("Erro ao atualizar perfil.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const checkIsDisabled = () => {
    const isFormEmpty = EmptyForm.safeParse(form).success;
    const isFormValid = FormSchema.safeParse(form).success;
    const passwordMismatch = form.senha !== form.confirmarSenha;
    setIsDisabled(isFormEmpty || !isFormValid || passwordMismatch);
  };

  useEffect(() => {
    checkIsDisabled();
  }, [form]);

  return (
    <>
      <div className="flex w-64 flex-col fixed inset-y-0 bg-surface border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <div className="flex items-center gap-3">
            <Image alt="Arceus" className="size-8" src={logo} />
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Arceus
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {currentUser ? (
            <Button
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/" ? "bg-indigo-500 text-white" : "bg-inherit",
              )}
              onPress={() => router.push("/")}
              isDisabled={!hasAllPerms(["ver:metricas"])}
            >
              <FaHouseChimney className="size-5" /> Métricas
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}

          {currentUser ? (
            <Button
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/registros"
                  ? "bg-indigo-500 text-white"
                  : "bg-inherit",
              )}
              onPress={() => router.push("/registros")}
              isDisabled={!hasAllPerms(["ver:logs"])}
            >
              <FaClipboardList className="size-5" /> Registros
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}

          {currentUser ? (
            <Button
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/usuarios"
                  ? "bg-indigo-500 text-white"
                  : "bg-inherit",
              )}
              onPress={() => router.push("/usuarios")}
              isDisabled={!hasAllPerms(["ver:usuarios"])}
            >
              <FaUsers className="size-5" /> Usuários
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}
        </nav>

        <div className="p-4 border-t space-y-4">
          <Dropdown>
            <Dropdown.Trigger className="justify-start gap-x-3 p-3 h-14 w-full flex">
              {!isAuthenticated ? (
                <Skeleton className="w-full h-10 rounded-full" />
              ) : (
                <>
                  <Avatar size="sm">
                    <Avatar.Fallback className="bg-linear-to-r from-purple-500 to-indigo-500 text-white">
                      {Misc.getInitials(currentUser?.nome)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p
                      className="text-sm font-medium w-36 truncate"
                      title={currentUser?.nome}
                    >
                      {currentUser?.nome}
                    </p>
                    <p className="text-xs text-muted">{groupName}</p>
                  </div>
                </>
              )}
            </Dropdown.Trigger>

            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item
                  textValue="Perfil e Conta"
                  onPress={handleProfileClick}
                >
                  <FaUser className="size-4" />
                  <Label>Perfil e Conta</Label>
                </Dropdown.Item>

                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item>
                    <FaPaintbrush className="size-4" />
                    <Label>Tema</Label>
                    <Dropdown.SubmenuIndicator>
                      <FaArrowRight className="size-4 text-muted" />
                    </Dropdown.SubmenuIndicator>
                  </Dropdown.Item>
                  <Dropdown.Popover>
                    <Dropdown.Menu
                      selectedKeys={selected}
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        if (keys !== "all") {
                          setSelected(new Set(keys));
                        }
                      }}
                    >
                      <Dropdown.Item
                        id="light"
                        textValue="Claro"
                        onPress={() => setTheme("light")}
                      >
                        <Dropdown.ItemIndicator />
                        <Label>Claro</Label>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="dark"
                        textValue="Escuro"
                        onPress={() => setTheme("dark")}
                      >
                        <Dropdown.ItemIndicator />
                        <Label>Escuro</Label>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="system"
                        textValue="Sistema"
                        onPress={() => setTheme("system")}
                      >
                        <Dropdown.ItemIndicator />
                        <Label>Sistema</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>

                <Dropdown.Item
                  variant="danger"
                  textValue="Sair"
                  onPress={async () => await logout()}
                >
                  <FaRightFromBracket className="size-4 text-danger" />
                  <Label>Sair</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      <Modal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="cover">
            <Modal.Dialog>
              <Modal.CloseTrigger onPress={() => handleModalClose()} />

              <Modal.Header>
                <div className="flex items-center gap-3">
                  {loadingUser ? (
                    <Skeleton className="w-10 h-10 rounded-full" />
                  ) : (
                    <>
                      <Modal.Icon>
                        <Avatar size="lg">
                          <Avatar.Fallback className="bg-linear-to-r from-purple-500 to-indigo-500 text-white">
                            {Misc.getInitials(currentUser?.nome)}
                          </Avatar.Fallback>
                        </Avatar>
                      </Modal.Icon>
                      <div>
                        <Modal.Heading className="text-lg font-semibold">
                          {currentUser?.nome}
                        </Modal.Heading>
                        <p className="text-sm text-muted">{groupName}</p>
                      </div>
                    </>
                  )}
                </div>
              </Modal.Header>

              <Modal.Body className="flex flex-col py-6">
                {!isEditingUser ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Perfil e Conta</h3>
                      <Button
                        onPress={() => setIsEditingUser(true)}
                        size="sm"
                        className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoItem
                        label="Email"
                        value={currentUser?.email || "-"}
                      />
                      <InfoItem
                        label="Usuário ativo"
                        value={currentUser?.ativo ? "Sim" : "Não"}
                      />
                      <InfoItem label="Grupo" value={groupName || "-"} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 mt-2">
                        <div className="p-2 bg-accent-soft rounded-lg">
                          <FaPencil className="w-5 h-5 text-accent-soft-foreground" />
                        </div>
                        <h4 className="font-semibold">Alterar senha</h4>
                      </div>
                      <p className="text-warning">
                        Não é possível alterar nome, e-mail e grupo. Nome e
                        e-mail são somente leitura, pois condiz com o que está
                        salvo no IXC.
                      </p>
                    </div>
                    <Form
                      action={handleSave}
                      className="flex flex-col justify-between h-full"
                      autoComplete="off"
                    >
                      <div className="space-y-4 grid gap-x-4 grid-cols-2 w-full">
                        <TextField
                          variant="secondary"
                          type={showNewPassword ? "text" : "password"}
                          value={form.senha || ""}
                          autoComplete="new-password"
                          onChange={(value) => handleChange("senha", value)}
                          isRequired
                          validate={(value) => {
                            if (value.length && value.length < 8) {
                              return "Digite 8 caracteres ou mais";
                            }
                            return null;
                          }}
                        >
                          <Label>Nova Senha</Label>
                          <InputGroup>
                            <InputGroup.Input placeholder="Digite sua nova senha" />
                            <InputGroup.Suffix>
                              {showNewPassword ? (
                                <FaEyeSlash
                                  className="hover:cursor-pointer text-xl"
                                  onClick={() => setShowNewPassword(false)}
                                />
                              ) : (
                                <FaEye
                                  className="hover:cursor-pointer text-xl"
                                  onClick={() => setShowNewPassword(true)}
                                />
                              )}
                            </InputGroup.Suffix>
                          </InputGroup>
                          <Description>
                            Senha utilizada para acessar o sistema
                          </Description>
                          <FieldError />
                        </TextField>

                        <TextField
                          value={form.confirmarSenha || ""}
                          onChange={(value) =>
                            handleChange("confirmarSenha", value)
                          }
                          type={showConfirmPassword ? "text" : "password"}
                          variant="secondary"
                          isRequired
                          validate={(value) => {
                            if (value.length) {
                              if (value.length < 8) {
                                return "Digite 8 caracteres ou mais";
                              } else {
                                if (value !== form.senha) {
                                  return "As senhas não coincidem";
                                }
                              }
                            }
                            return null;
                          }}
                        >
                          <Label>Confirmar nova senha</Label>
                          <InputGroup>
                            <InputGroup.Input placeholder="Confirme sua nova senha" />
                            <InputGroup.Suffix>
                              {showConfirmPassword ? (
                                <FaEyeSlash
                                  className="hover:cursor-pointer text-xl"
                                  onClick={() => setShowConfirmPassword(false)}
                                />
                              ) : (
                                <FaEye
                                  className="hover:cursor-pointer text-xl"
                                  onClick={() => setShowConfirmPassword(true)}
                                />
                              )}
                            </InputGroup.Suffix>
                          </InputGroup>
                          <FieldError />
                          <Description>Confirmar a nova senha</Description>
                        </TextField>
                      </div>

                      <div className="space-x-2 ml-auto">
                        <Button
                          type="submit"
                          isPending={isSaving}
                          isDisabled={isDisabled}
                          className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                        >
                          Salvar
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default Sidebar;
