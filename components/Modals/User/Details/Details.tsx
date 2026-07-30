import { FaUser } from "react-icons/fa6";
import { Button, Modal, ModalProps } from "@heroui/react";
import InfoItem from "@/components/InfoItem/InfoItem";
import { UserOut } from "@/types/user.type";
import Formatter from "@/helpers/Formatter";
import { useAuthStore } from "@/stores/authentication.store";
import DeleteUser from "@/components/AlertDialog/User/Delete/DeleteUser";
import { useEffect, useState } from "react";
import { usePermStore } from "@/stores/perm.store";
import { GroupService } from "@/services/Group";
import { GroupOut } from "@/types/group.type";
import ToggleUserStatus from "@/components/AlertDialog/User/ToggleStatus/ToggleStatus";

interface DetailsProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  user: UserOut;
}

function Details({ handleClose, user, ...props }: DetailsProps) {
  const { hasAllPerms } = usePermStore();
  const { currentUser } = useAuthStore();

  const [group, setGroup]=useState<GroupOut|undefined>(undefined)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const fetchGroup = async () => {
    const group =await GroupService.getById(user.id_grupo)
    setGroup(group)
  }

  useEffect(() => {
     fetchGroup()
  },[user])

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
                      !hasAllPerms(["alterar:usuarios"])
                    }
                    onPress={()=>setIsToggleOpen(true)}
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
                <InfoItem label="Grupo" value={group?.nome || ''} />
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

export default Details;
