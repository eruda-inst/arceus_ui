import Misc from "@/helpers/Misc.helper";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  Avatar,
  Button,
  Description,
  FieldError,
  Form,
  InputGroup,
  Label,
  Modal,
  ModalProps,
  Skeleton,
  TextField,
  TextFieldRootProps,
  toast,
} from "@heroui/react";
import { FormEvent, useMemo, useState } from "react";
import InfoItem from "../InfoItem";
import { FaEye, FaEyeSlash, FaPencil } from "react-icons/fa6";
import z from "zod";
import UserService from "@/services/User.service";

export const FormSchema = z
  .object({ senha: z.string().min(8), confirmarSenha: z.string().min(8) })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type FormType = z.infer<typeof FormSchema>;

export interface ProfileDetailsProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
}

export default function ProfileDetails({
  onClose,
  ...props
}: ProfileDetailsProps) {
  const { resolvedTheme } = useTheme();

  const [form, setForm] = useState<FormType>({ senha: "", confirmarSenha: "" });

  const currUser = useAuthStore((state) => state.currentUser);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const loadingUser = useAuthStore((state) => state.loadingUser);
  const logout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<{
    pass: boolean;
    confirm: boolean;
  }>({ pass: false, confirm: false });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDelOpen, setIsDelOpen] = useState<boolean>(false);

  const variant: TextFieldRootProps["variant"] = useMemo(() => {
    return resolvedTheme === "dark" ? "secondary" : "primary";
  }, [resolvedTheme]);

  const isDisabled = useMemo(() => {
    return !FormSchema.safeParse(form).success;
  }, [form]);

  const handleDelete = async () => {
    try {
      await UserService.delete(currUser?.id!);
      setIsDelOpen(false);
      logout();
    } catch {
      toast.danger("Erro", {
        description: "Não foi possível remover o usuário",
      });
    }
  };

  const handleReset = () => {
    setForm({ senha: "", confirmarSenha: "" });
    setIsVisible({ pass: false, confirm: false });
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currUser) return;

    setIsSaving(true);

    try {
      await UserService.updatePasswordById(currUser.id, form.senha);
      await fetchCurrentUser();

      toast.success("Sucesso", {
        description: "Perfil atualizado com sucesso!",
      });

      handleReset();
    } catch (error: unknown) {
      toast.danger("Erro", { description: "Erro ao atualizar perfil" });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      onOpenChange={(open) => {
        if (!open) handleReset();
      }}
      {...props}
    >
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={onClose} />

            <Modal.Header>
              <div className="flex items-center gap-3">
                {loadingUser ? (
                  <Skeleton className="w-10 h-10 rounded-full" />
                ) : (
                  <>
                    <Modal.Icon>
                      <Avatar size="lg">
                        <Avatar.Fallback className="bg-linear-to-r from-purple-500 to-indigo-500 text-white">
                          {Misc.getInitials(currUser?.nome)}
                        </Avatar.Fallback>
                      </Avatar>
                    </Modal.Icon>
                    <div>
                      <Modal.Heading className="text-lg font-semibold">
                        {currUser?.nome}
                      </Modal.Heading>
                      <p className="text-sm text-muted">
                        {currUser?.nome_grupo}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col py-6">
              {!isEditing ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Perfil e Conta</h3>

                    <div className="space-x-2">
                      <Button
                        onPress={() => setIsEditing(true)}
                        size="sm"
                        className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger-soft"
                        size="sm"
                        onPress={() => setIsDelOpen(true)}
                      >
                        Excluir conta
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Email" value={currUser?.email || "-"} />
                    <InfoItem
                      label="Usuário ativo"
                      value={currUser?.ativo ? "Sim" : "Não"}
                    />
                    <InfoItem
                      label="Grupo"
                      value={currUser?.nome_grupo || "-"}
                    />
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
                      Não é possível alterar nome, e-mail e grupo. Nome e e-mail
                      são somente leitura, pois condiz com o que está salvo no
                      IXC.
                    </p>
                  </div>
                  <Form
                    onSubmit={handleSave}
                    className="flex flex-col justify-between h-full"
                    autoComplete="off"
                  >
                    <div className="grid gap-4 grid-cols-2 w-full">
                      <TextField
                        variant={variant}
                        type={isVisible.pass ? "text" : "password"}
                        value={form.senha}
                        autoComplete="new-password"
                        onChange={(v) => setForm((p) => ({ ...p, senha: v }))}
                        isRequired
                        validate={(v) => {
                          if (v.length && v.length < 8) {
                            return "Digite 8 caracteres ou mais";
                          }
                          return null;
                        }}
                      >
                        <Label>Nova Senha</Label>
                        <InputGroup>
                          <InputGroup.Input placeholder="Digite sua nova senha" />
                          <InputGroup.Suffix>
                            {isVisible.pass ? (
                              <FaEyeSlash
                                className="hover:cursor-pointer text-xl"
                                onClick={() =>
                                  setIsVisible((prev) => ({
                                    ...prev,
                                    pass: !prev.pass,
                                  }))
                                }
                              />
                            ) : (
                              <FaEye
                                className="hover:cursor-pointer text-xl"
                                onClick={() =>
                                  setIsVisible((prev) => ({
                                    ...prev,
                                    pass: !prev.pass,
                                  }))
                                }
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
                        value={form.confirmarSenha}
                        onChange={(v) =>
                          setForm((p) => ({ ...p, confirmarSenha: v }))
                        }
                        type={isVisible.confirm ? "text" : "password"}
                        variant={variant}
                        isRequired
                        validate={(v) => {
                          if (v.length) {
                            if (v.length < 8) {
                              return "Digite 8 caracteres ou mais";
                            } else {
                              if (v !== form?.senha) {
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
                            {isVisible.confirm ? (
                              <FaEyeSlash
                                className="hover:cursor-pointer text-xl"
                                onClick={() =>
                                  setIsVisible((prev) => ({
                                    ...prev,
                                    confirm: !prev.confirm,
                                  }))
                                }
                              />
                            ) : (
                              <FaEye
                                className="hover:cursor-pointer text-xl"
                                onClick={() =>
                                  setIsVisible((prev) => ({
                                    ...prev,
                                    confirm: !prev.confirm,
                                  }))
                                }
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

      {/* Confirmation dialog for delete action */}
      <AlertDialog isOpen={isDelOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.CloseTrigger onPress={() => setIsDelOpen(false)} />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Excluir usuário</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Tem certeza que deseja remover seu usuário?,{" "}
                <strong>esta ação é irreversível</strong>.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="danger-soft" onPress={handleDelete}>
                  Remover
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </Modal>
  );
}
