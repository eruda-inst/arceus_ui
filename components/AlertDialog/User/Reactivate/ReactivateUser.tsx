import { AlertDialog, AlertDialogProps, Button, toast } from "@heroui/react";
import { useUserStore } from "@/stores/userStore";
import { UserService } from "@/services/User";

interface ReactivateUserProps extends Omit<AlertDialogProps, "children"> {
  onClose: () => void;
}

function ReactivateUser({ onClose, ...props }: ReactivateUserProps) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const reactivateSelectedUser = useUserStore(
    (state) => state.reactivateSelectedUser,
  );

  const handleReactivate = async () => {
    try {
      await UserService.reactivate(selectedUser?.id || 0);
      reactivateSelectedUser();
      onClose();
      toast.success("Usuário reativado com sucesso!");
    } catch (error: unknown) {
      toast.danger("Não foi possível reativar o usuário");
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
              <AlertDialog.Icon status="success" />
              <AlertDialog.Heading>Reativar usuário</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              Tem certeza que deseja reativar esse usuário?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                className="bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
                onPress={handleReactivate}
              >
                Reativar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default ReactivateUser;
