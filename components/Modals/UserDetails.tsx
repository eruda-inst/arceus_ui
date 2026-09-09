import { useState } from "react";
import { clsx } from "clsx";
import { FaUser } from "react-icons/fa6";
import { AlertDialog, Button, Modal, ModalProps, toast } from "@heroui/react";
import InfoItem from "@/components/InfoItem";
import { UserOutType } from "@/types/user.type";
import Formatter from "@/helpers/Formatter.helper";
import { useAuthStore } from "@/stores/auth.store";
import UserService from "@/services/User.service";

/**
 * Props for the Details component.
 * Extends ModalProps (from HeroUI) but omits 'children' because we define our own content.
 * @property onClose - Callback to close the modal.
 * @property user - The user data to display and manage.
 */
export interface DetailsProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
  user: UserOutType;
}

/**
 * Details component - displays user information and provides actions to toggle status or delete.
 * It shows a modal with user details, and two confirmation dialogs for status toggle and deletion.
 * The actions are permission-aware and disable if the current user is the same as the viewed user.
 */
export default function Details({ onClose, user, ...props }: DetailsProps) {
  // State for controlling the delete confirmation dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  // State for controlling the toggle status confirmation dialog
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);
  // Local copy of the user to reflect updates after toggling status without refetching
  const [localUser, setLocalUser] = useState<UserOutType | null>(user);

  // Get the currently authenticated user from the auth store
  const currentUser = useAuthStore((state) => state.currentUser);
  // Permission checker function
  const hasPerm = useAuthStore((state) => state.hasPerm);

  /**
   * Handles the deletion of the user.
   * Calls the service, shows a success toast, closes the modal, and hides the dialog.
   * On error, shows a danger toast.
   */
  const handleDelete = async () => {
    try {
      await UserService.delete(user?.id || 0);
      setIsDeleteOpen(false);
      onClose();
      toast.success("Usuário removido com sucesso!");
    } catch {
      toast.danger("Não foi possível remover o usuário");
    }
  };

  /**
   * Handles toggling the user's active status (activate/deactivate).
   * Calls the service, updates the local user state with the response,
   * closes the confirmation dialog, and shows a success toast.
   * On error, shows a danger toast.
   */
  const handleToggle = async () => {
    try {
      const updatedUser = await UserService.toggleStatus(user.id);
      setIsToggleOpen(false);
      setLocalUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
      toast.success("Status alterado com sucesso!");
    } catch {
      toast.danger("Erro ao mudar status do usuário");
    }
  };

  return (
    <Modal {...props}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            {/* Close trigger calls onClose to dismiss the modal */}
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
              {/* Header section with title, description, and action buttons */}
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

                {/* Action buttons: Toggle status and Delete */}
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

              {/* User information grid */}
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
                      : null
                  }
                />
                <InfoItem
                  label="Atualizado em"
                  value={
                    localUser?.atualizado_em
                      ? Formatter.isoDatetimeToDate(localUser?.atualizado_em)
                      : null
                  }
                />
                <InfoItem label="Grupo" value={localUser?.nome_grupo} />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      {/* Confirmation dialog for delete action */}
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

      {/* Confirmation dialog for status toggle (inactivate/reactivate) */}
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
