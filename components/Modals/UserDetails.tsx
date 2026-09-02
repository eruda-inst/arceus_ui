import { FaUser } from "react-icons/fa6";
import {
  Button,
  Modal,
  ModalProps,
  AlertDialog,
  AlertDialogProps,
  toast,
} from "@heroui/react";
import InfoItem from "@/components/InfoItem";
import { UserOut } from "@/types/user.type";
import Formatter from "@/helpers/Formatter.helper";
import { useAuthStore } from "@/stores/authentication.store";
import { useEffect, useState } from "react";
import { usePermStore } from "@/stores/perm.store";
import GroupService from "@/services/Group.service";
import { GroupOut } from "@/types/group.type";
import { useUserStore } from "@/stores/user.store";
import UserService from "@/services/User.service";

export interface CustomAlertDialogProps extends Omit<
  AlertDialogProps,
  "children"
> {
  onClose: () => void;
}

export function DeleteUser({ onClose, ...props }: CustomAlertDialogProps) {
  const deleteById = UserService.delete;

  const selectedUser = useUserStore((state) => state.selectedUser);
  const deleteSelectedUser = useUserStore((state) => state.deleteSelectedUser);

  const handleDelete = async () => {
    try {
      await deleteById(selectedUser?.id || 0);
      deleteSelectedUser();
      onClose();
      toast.success("Usuário removido com sucesso!");
    } catch (error: unknown) {
      toast.danger("Não foi possível remover o usuário");
      throw error;
    }
  };

  return (
    <AlertDialog {...props}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger onPress={onClose} />
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
  );
}

export function ToggleUserStatus({
  onClose,
  ...props
}: CustomAlertDialogProps) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const toggleSelectedUserStatus = useUserStore(
    (state) => state.toggleSelectedUserStatus,
  );

  const isActive = selectedUser?.ativo ?? false;
  const action = isActive ? "inativar" : "reativar";
  const statusColor = isActive ? "warning" : "success";
  const buttonClass = isActive
    ? "bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover"
    : "bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover";

  const handleToggle = async () => {
    try {
      await UserService.toggleStatus(selectedUser?.id || 0);
      toggleSelectedUserStatus();
      onClose();
      toast.success(`Usuário ${action}do com sucesso!`);
    } catch (error: unknown) {
      toast.danger(`Não foi possível ${action} o usuário`);
      throw error;
    }
  };

  return (
    <AlertDialog {...props}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger onPress={onClose} />
            <AlertDialog.Header>
              <AlertDialog.Icon status={statusColor} />
              <AlertDialog.Heading>
                {isActive ? "Inativar" : "Reativar"} usuário
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              Tem certeza que deseja {action} esse usuário?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button className={buttonClass} onPress={handleToggle}>
                {isActive ? "Inativar" : "Reativar"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export interface DetailsProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  user: UserOut;
}

export default function Details({ handleClose, user, ...props }: DetailsProps) {
  const { hasAllPerms } = usePermStore();
  const { currentUser } = useAuthStore();

  const [group, setGroup] = useState<GroupOut | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const fetchGroup = async () => {
    const group = await GroupService.getById(user.id_grupo);
    setGroup(group);
  };

  useEffect(() => {
    fetchGroup();
  }, [user]);

  return (
    <Modal {...props}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={handleClose} />
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
                <InfoItem label="Grupo" value={group?.nome || ""} />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <DeleteUser
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
      <ToggleUserStatus
        isOpen={isToggleOpen}
        onOpenChange={setIsToggleOpen}
        onClose={() => setIsToggleOpen(false)}
      />
    </Modal>
  );
}
