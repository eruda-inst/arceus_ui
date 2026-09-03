import { FaUser } from "react-icons/fa6";
import { Button, Modal, ModalProps, AlertDialog, toast } from "@heroui/react";
import InfoItem from "@/components/InfoItem";
import { UserOut } from "@/types/user.type";
import Formatter from "@/helpers/Formatter.helper";
import { useAuthStore } from "@/stores/authentication.store";
import { useState } from "react";
import { usePermStore } from "@/stores/perm.store";
import UserService from "@/services/User.service";
import { clsx } from "clsx";

export interface DetailsProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
  onRefreshUser: () => void;
  user: UserOut;
}

export default function Details({
  onClose,
  onRefreshUser,
  user,
  ...props
}: DetailsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

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
      await UserService.toggleStatus(user.id);
      setIsToggleOpen(false);
      onRefreshUser();
      toast.success("Status alterado com sucesso!");
    } catch (error: unknown) {
      toast.danger("Erro ao mudar status do usuário");
      throw error;
    }
  };

  const { hasAllPerms } = usePermStore();
  const { currentUser } = useAuthStore();

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
                <Modal.Heading>{user.nome}</Modal.Heading>
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
                    className={
                      user.ativo
                        ? "bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover"
                        : "bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
                    }
                    isDisabled={
                      user.id === currentUser?.id ||
                      !hasAllPerms(["alterar:usuarios"])
                    }
                    onPress={() => setIsToggleOpen(true)}
                  >
                    {user.ativo ? "Inativar" : "Reativar"}
                  </Button>

                  <Button
                    variant="danger-soft"
                    isDisabled={
                      user.id === currentUser?.id ||
                      !hasAllPerms(["remover:usuarios"])
                    }
                    onPress={() => setIsDeleteOpen(true)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="E-mail" value={user.email} />
                <InfoItem label="Ativo" value={user.ativo ? "Sim" : "Não"} />
                <InfoItem
                  label="Criado em"
                  value={Formatter.isoDate(user.criado_em.split("T")[0])}
                />
                <InfoItem
                  label="Atualizado em"
                  value={
                    user.atualizado_em
                      ? Formatter.isoDate(user.atualizado_em.split("T")[0])
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
