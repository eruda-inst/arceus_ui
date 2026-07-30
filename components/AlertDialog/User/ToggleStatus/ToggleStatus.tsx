import { AlertDialog, AlertDialogProps, Button, toast } from "@heroui/react";
import { useUserStore } from "@/stores/user.store";
import { UserService } from "@/services/User";

interface ToggleUserStatusProps extends Omit<AlertDialogProps, "children"> {
  onClose: () => void;
}

function ToggleUserStatus({ onClose, ...props }: ToggleUserStatusProps) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const toggleSelectedUserStatus = useUserStore(
    (state) => state.toggleSelectedUserStatus
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

export default ToggleUserStatus;
