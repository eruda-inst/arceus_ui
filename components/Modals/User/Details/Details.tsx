import { FaUser } from "react-icons/fa6";
import { Button, Modal, ModalProps } from "@heroui/react";
import InfoItem from "@/components/InfoItem/InfoItem";
import { UserOut } from "@/types/userType";
import Formatter from "@/helpers/Formatter";
import { useAuthContext } from "@/contexts/authenticationContext";
import DeleteUser from "@/components/AlertDialog/User/Delete/DeleteUser";
import InactivateUser from "@/components/AlertDialog/User/Inactivate/InactivateUser";
import ReactivateUser from "@/components/AlertDialog/User/Reactivate/ReactivateUser";
import { useState } from "react";
import { usePermissions } from "@/contexts/permissionContext";

interface DetailsProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  user: UserOut;
}

function Details({ handleClose, user, ...props }: DetailsProps) {
  const { hasAllPermissions } = usePermissions();

  const { currentUser } = useAuthContext();

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isInactivateOpen, setIsInactivateOpen] = useState<boolean>(false);
  const [isReactivateOpen, setIsReactivateOpen] = useState<boolean>(false);

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
                  <h3 className="text-lg font-semibold text-gray-200">
                    Usuário
                  </h3>
                  <p className="text-sm text-gray-400">
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
                      !hasAllPermissions(["alterar:usuarios"])
                    }
                    onPress={() => {
                      if (user.ativo) {
                        setIsInactivateOpen(true);
                      } else {
                        setIsReactivateOpen(true);
                      }
                    }}
                  >
                    {user.ativo ? "Inativar" : "Reativar"}
                  </Button>

                  <Button
                    variant="danger-soft"
                    isDisabled={
                      user.id === currentUser?.id ||
                      !hasAllPermissions(["remover:usuarios"])
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
                  value={Formatter.isoDate(user.atualizado_em.split("T")[0])}
                />
                <InfoItem label="Grupo" value={user.nome_grupo} />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <DeleteUser
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
      <InactivateUser
        isOpen={isInactivateOpen}
        onClose={() => setIsInactivateOpen(false)}
      />
      <ReactivateUser
        isOpen={isReactivateOpen}
        onClose={() => setIsReactivateOpen(false)}
      />
    </Modal>
  );
}

export default Details;
