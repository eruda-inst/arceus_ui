import { FaUser } from "react-icons/fa6";
import { Button, Modal, ModalProps, AlertDialog, toast } from "@heroui/react";
import InfoItem from "@/components/InfoItem";
import { UserOutType } from "@/types/user.type";
import Formatter from "@/helpers/Formatter.helper";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import UserService from "@/services/User.service";
import { clsx } from "clsx";

export interface DetailsProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
  user: UserOutType;
}

export default function Details({ onClose, user, ...props }: DetailsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);
  const [localUser, setLocalUser] = useState<UserOutType | null>(user);

  const handleDelete = async () => {
    try {
      await UserService.delete(user?.id || 0);
      setIsDeleteOpen(false);
      onClose();
      toast.success("Usuário removido com sucesso!");
    } catch (error: unknown) {
      toast.danger("Não foi possível remover o usuário");
      throw error;
    }
  };

  const handleToggle = async () => {
    try {
      const updatedUser = await UserService.toggleStatus(user.id);
      setIsToggleOpen(false);
      setLocalUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
      toast.success("Status alterado com sucesso!");
    } catch (error: unknown) {
      toast.danger("Erro ao mudar status do usuário");
      throw error;
    }
  };

  const currentUser = useAuthStore((state) => state.currentUser);
  const hasPerm = useAuthStore((state) => state.hasPerm);

  return (
    <Modal {...props}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={onClose} />
            <Modal.Header>
              <div className="text-xl font-bold flex items-center gap-2">
                <Modal.Icon>
                  <FaUser className="text-blue-600" />
                </Modal.Icon>
                <Modal.Heading>{localUser?.nome}</Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Usuário
                  </h3>
                  <p className="text-sm text-muted">
                    Seção destinada a exibição, inativação, reativação e
                    exclusão do usuário selecionado
                  </p>
                </div>

                <div className="flex items-center gap-x-2">
                  <Button
                    isDisabled={
                      !hasPerm("alterar:usuarios") ||
                      currentUser?.id === user.id
                    }
                    onPress={() => setIsToggleOpen(true)}
                    className={
                      localUser?.ativo
                        ? "bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover"
                        : "bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
                    }
                  >
                    {localUser?.ativo ? "Inativar" : "Reativar"}
                  </Button>

                  <Button
                    isDisabled={
                      !hasPerm("remover:usuarios") ||
                      currentUser?.id === user.id
                    }
                    variant="danger-soft"
                    onPress={() => setIsDeleteOpen(true)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="E-mail" value={localUser?.email} />
                <InfoItem
                  label="Ativo"
                  value={localUser?.ativo ? "Sim" : "Não"}
                />
                <InfoItem
                  label="Criado em"
                  value={
                    localUser?.criado_em
                      ? Formatter.isoDatetimeToDate(localUser?.criado_em)
                      : "---"
                  }
                />
                <InfoItem
                  label="Atualizado em"
                  value={
                    localUser?.atualizado_em
                      ? Formatter.isoDatetimeToDate(localUser?.atualizado_em)
                      : "---"
                  }
                />
                <InfoItem label="Grupo" value={user.nome_grupo || ""} />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <AlertDialog isOpen={isDeleteOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.CloseTrigger
                onPress={() => setIsDeleteOpen(false)}
              />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Excluir usuário</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Tem certeza que deseja remover esse usuário?,{" "}
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

      <AlertDialog isOpen={isToggleOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.CloseTrigger
                onPress={() => setIsToggleOpen(false)}
              />
              <AlertDialog.Header>
                <AlertDialog.Icon status={user.ativo ? "warning" : "success"} />
                <AlertDialog.Heading>
                  {user.ativo ? "Inativar" : "Reativar"} usuário
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Tem certeza que deseja {user.ativo ? "inativar" : "reativar"}{" "}
                esse usuário?
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  className={clsx(
                    user.ativo
                      ? "bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover"
                      : "bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover",
                  )}
                  onPress={handleToggle}
                >
                  {user.ativo ? "Inativar" : "Reativar"}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </Modal>
  );
}
