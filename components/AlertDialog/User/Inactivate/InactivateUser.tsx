import { AlertDialog, AlertDialogProps, Button, toast } from "@heroui/react";
import { useUserStore } from "@/stores/user.store";
import { UserService } from "@/services/User";

interface InactivateUserProps extends Omit<AlertDialogProps, "children"> {
  onClose: () => void;
}

function InactivateUser({ onClose, ...props }: InactivateUserProps) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const inactivateSelectedUser = useUserStore(
    (state) => state.inactivateSelectedUser,
  );

  const handleInactivate = async () => {
    try {
      await UserService.inactivate(selectedUser?.id || 0);
      inactivateSelectedUser();
      onClose();
      toast.success("Usuário inativado com sucesso!");
    } catch (error: unknown) {
      toast.danger("Não foi possível inativar o usuário");
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
              <AlertDialog.Icon status="warning" />
              <AlertDialog.Heading>Inativar usuário</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              Tem certeza que deseja inativar esse usuário?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                className="bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover"
                onPress={handleInactivate}
              >
                Inativar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default InactivateUser;
