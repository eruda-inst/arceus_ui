import { AlertDialog, AlertDialogProps, Button, toast } from "@heroui/react";
import { useUserStore } from "@/stores/userStore";
import { UserService } from "@/services/User";

interface DeleteUserProps extends Omit<AlertDialogProps, "children"> {
  onClose: () => void;
}

function DeleteUser({ onClose, ...props }: DeleteUserProps) {
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

export default DeleteUser;
