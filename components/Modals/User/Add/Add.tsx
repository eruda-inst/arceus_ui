import {
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Modal,
  ModalProps,
  TextField,
  Label,
  Select,
  ListBox,
  InputGroup,
  toast,
} from "@heroui/react";
import { motion } from "motion/react";
import {
  FaCircleCheck,
  FaDisplay,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa6";
import { IXCUserOut } from "@/types/ixcUserType";
import { useCallback, useEffect, useState } from "react";
import { IxcUserService } from "@/services/IxcUser";
import { UserService } from "@/services/User";
import { useIxcUserStore } from "@/stores/ixcUserStore";
import { GroupService } from "@/services/Group";
import { GroupOut } from "@/types/groupType";
import z from "zod";
import { useUserStore } from "@/stores/userStore";

interface AddProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
}

const FormSchema = z.object({
  senha: z.string().min(8),
  id_grupo: z.number().positive(),
  email: z.email(),
  ativo: z.boolean(),
  nome: z.string(),
  confirmarSenha: z.string().min(8),
});

type formType = z.infer<typeof FormSchema>;

function Add({ handleClose, ...props }: AddProps) {
  const getAllUsers = UserService.getAll;
  const getAllIxcUsers = IxcUserService.getAll;
  const getAllGroups = GroupService.getAll;
  const createUser = UserService.create;

  const initialValues: formType = {
    senha: "",
    id_grupo: 0,
    email: "",
    ativo: true,
    nome: "",
    confirmarSenha: "",
  };
  const [form, setForm] = useState<formType>(initialValues);

  const ixcUsers = useIxcUserStore((state) => state.ixcUsers);
  const addUser = useUserStore((state) => state.addUser);
  const selectedIxcUser = useIxcUserStore((state) => state.selectedIxcUser);
  const setIxcUsers = useIxcUserStore((state) => state.setIxcUsers);
  const setSelectedIxcUser = useIxcUserStore(
    (state) => state.setSelectedIxcUser,
  );

  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [registeredEmails, setRegisteredEmails] = useState<Set<string>>(
    new Set(),
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [groups, setGroups] = useState<GroupOut[]>([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const handleChange = (
    key: keyof Pick<formType, "id_grupo" | "senha" | "confirmarSenha">,
    value: string | number,
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser(form);
      if (createdUser) {
        addUser(createdUser);
      }
      toast.success("Usuário adicionado com sucesso");
      await fetchAll();
      setSelectedIxcUser(null);
      handleClearForm();
    } catch (error) {
      console.log(error);
      toast.danger("Erro ao adicionar usuário");
    } finally {
      setIsAdding(false);
    }
  };

  const fetchAll = useCallback(async () => {
    try {
      const [ixcRes, userRes, groups] = await Promise.all([
        getAllIxcUsers({ itemsPerPage: 9999 }),
        getAllUsers({ itemsPerPage: 9999 }),
        getAllGroups(),
      ]);

      setIxcUsers(ixcRes?.dados || []);
      setGroups(groups || []);

      if (userRes?.dados) {
        setRegisteredEmails(new Set(userRes.dados.map((u) => u.email)));
      } else {
        setRegisteredEmails(new Set());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClearForm = () => {
    setForm(initialValues);
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (selectedIxcUser) {
      setForm((previous) => ({
        ...previous,
        nome: selectedIxcUser.nome || "",
        email: selectedIxcUser.email || "",
      }));
    }
  }, [selectedIxcUser]);

  useEffect(() => {
    setIsAdding(false);
    setSelectedIxcUser(null);
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
    handleClearForm();
  }, [props.isOpen]);

  useEffect(() => {
    const isValid =
      FormSchema.safeParse(form).success && form.confirmarSenha === form.senha;
    setIsValidForm(isValid);
  }, [form]);

  const handleSelectIxcUser = (user: IXCUserOut) => {
    setSelectedIxcUser(selectedIxcUser?.id === user.id ? null : user);
  };

  return (
    <Modal {...props}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={handleClose} />

            <Modal.Header className="flex flex-row items-center gap-x-2">
              <Modal.Icon>
                <FaUserPlus className="text-green-500 text-2xl" />
              </Modal.Icon>
              <Modal.Heading className="font-bold">
                Usuário do IXC a ser adicionado
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-6">
              {isAdding ? (
                <Form className="grid grid-cols-2 gap-2">
                  {/* Nome */}
                  <TextField
                    variant="secondary"
                    isReadOnly
                    isRequired
                    isDisabled
                  >
                    <Label>Nome</Label>
                    <Input
                      placeholder="Nome do usuário"
                      value={selectedIxcUser?.nome}
                    />
                    <Description>Nome do usuário</Description>
                    <FieldError />
                  </TextField>
                  {/* E-mail */}
                  <TextField
                    variant="secondary"
                    isReadOnly
                    type="email"
                    isRequired
                    isDisabled
                  >
                    <Label>E-mail</Label>
                    <Input
                      placeholder="E-mail do usuário"
                      value={selectedIxcUser?.email}
                    />
                    <Description>E-mail do usuário</Description>
                    <FieldError />
                  </TextField>
                  {/* Grupo de permissões */}
                  <Select
                    variant="secondary"
                    isRequired
                    placeholder="Selecione o grupo de permissões"
                    value={form.id_grupo || null}
                    onChange={(value) => handleChange("id_grupo", value || 0)}
                  >
                    <Label>Grupo de permissões</Label>

                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Description>Grupo de permissões do usuário</Description>

                    <Select.Popover>
                      <ListBox>
                        {groups.map((group) => (
                          <ListBox.Item
                            key={group.id}
                            id={group.id}
                            textValue={group.nome}
                          >
                            <Label>{group.nome}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  <TextField
                    variant="secondary"
                    isRequired
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    validate={(value) => {
                      if (!value.length) {
                        return "Campo obrigatório";
                      }
                      if (value.length < 8) {
                        return "Mínimo 8 caracteres";
                      }
                      return null;
                    }}
                    value={form.senha}
                    onChange={(value) => handleChange("senha", value)}
                  >
                    <Label>Senha</Label>
                    <InputGroup>
                      <InputGroup.Input placeholder="Digite a senha" />
                      <InputGroup.Suffix>
                        {isPasswordVisible ? (
                          <FaEyeSlash
                            className="text-lg hover:cursor-pointer"
                            onClick={() => setIsPasswordVisible(false)}
                          />
                        ) : (
                          <FaEye
                            className="text-lg hover:cursor-pointer"
                            onClick={() => setIsPasswordVisible(true)}
                          />
                        )}
                      </InputGroup.Suffix>
                    </InputGroup>
                    <Description>Senha utilizada para login</Description>
                    <FieldError />
                  </TextField>
                  <TextField
                    variant="secondary"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    isRequired
                    validate={(value) => {
                      if (!value.length) {
                        return "Campo obrigatório";
                      }
                      if (value.length < 8) {
                        return "Mínimo 8 caracteres";
                      }
                      if (value !== form.senha) {
                        return "As senhas não coincidem";
                      }
                      return null;
                    }}
                    value={form.confirmarSenha}
                    onChange={(value) => handleChange("confirmarSenha", value)}
                  >
                    <Label>Confirmar Senha</Label>
                    <InputGroup>
                      <InputGroup.Input placeholder="Digite a senha novamente" />
                      <InputGroup.Suffix>
                        {isConfirmPasswordVisible ? (
                          <FaEyeSlash
                            className="text-lg hover:cursor-pointer"
                            onClick={() => setIsConfirmPasswordVisible(false)}
                          />
                        ) : (
                          <FaEye
                            className="text-lg hover:cursor-pointer"
                            onClick={() => setIsConfirmPasswordVisible(true)}
                          />
                        )}
                      </InputGroup.Suffix>
                    </InputGroup>
                    <Description>Confirmação da senha</Description>
                    <FieldError />
                  </TextField>
                </Form>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {ixcUsers
                    .filter((u) => !registeredEmails.has(u.email))
                    .map((ixcUser) => {
                      const isSelected = selectedIxcUser?.id === ixcUser.id;
                      return (
                        <motion.div key={ixcUser.id} whileHover={{ y: -5 }}>
                          <Card
                            className={`bg-surface-secondary hover:cursor-pointer active:bg-surface-tertiary transition-all ${
                              isSelected
                                ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                                : ""
                            }`}
                            onClick={() => handleSelectIxcUser(ixcUser)}
                          >
                            <Card.Header>
                              <Card.Title className="flex flex-row items-center gap-x-2 w-full">
                                <FaUser className="text-blue-500 text-lg shrink-0" />
                                <p className="flex-1">{ixcUser.nome}</p>
                                {isSelected && (
                                  <FaCircleCheck className="text-green-500 text-lg shrink-0" />
                                )}
                              </Card.Title>
                            </Card.Header>

                            <Card.Content>
                              <div className="flex items-center gap-x-2">
                                <FaEnvelope className="text-amber-500 text-lg" />
                                <p>
                                  E-mail: <strong>{ixcUser.email}</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-x-2">
                                <FaCircleCheck className="text-emerald-500 text-lg" />
                                <p>
                                  Status:{" "}
                                  <strong>
                                    <Chip
                                      variant="soft"
                                      color={
                                        ixcUser.status === "Ativo"
                                          ? "success"
                                          : "warning"
                                      }
                                    >
                                      {ixcUser.status}
                                    </Chip>
                                  </strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-x-2">
                                <FaDisplay className="text-orange-500 text-lg" />
                                <p>
                                  Tipo de acesso:{" "}
                                  <strong>{ixcUser.tipo_acesso}</strong>
                                </p>
                              </div>
                            </Card.Content>
                            <Card.Footer />
                          </Card>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              {isAdding ? (
                <Button
                  className="bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
                  isDisabled={!isValidForm}
                  onPress={handleCreateUser}
                >
                  Adicionar
                </Button>
              ) : (
                <Button
                  isDisabled={!selectedIxcUser}
                  className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                  onPress={() => setIsAdding(true)}
                >
                  Confirmar
                </Button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default Add;
