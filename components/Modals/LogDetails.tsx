import { FaServer } from "react-icons/fa6";
import { Modal, ModalProps } from "@heroui/react";
import {
  a11yDark,
  coldarkDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import InfoItem from "@/components/InfoItem";
import { LogOutType } from "@/types/log.type";

/**
 * Props for the LogDetails component.
 * Extends all ModalProps from HeroUI except 'children' (which we don't use directly).
 */
export interface DetailsProps extends Omit<ModalProps, "children"> {
  /** Callback function to close the modal. */
  onClose: () => void;
  /** The log entry to display in detail. */
  log: LogOutType;
}

/**
 * LogDetails – a modal that displays detailed information about a selected log entry.
 * Uses HeroUI's Modal components and renders multiple InfoItem fields.
 */
export default function LogDetails({ onClose, log, ...props }: DetailsProps) {
  return (
    <Modal {...props}>
      {/* Backdrop with blur effect */}
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            {/* Close button that triggers the onClose callback */}
            <Modal.CloseTrigger onPress={onClose} />
            <Modal.Header>
              <div className="text-xl font-bold flex items-center gap-2">
                <Modal.Icon>
                  <FaServer className="text-blue-600" />
                </Modal.Icon>
                <Modal.Heading>{log.endpoint}</Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Registro
                  </h3>
                  <p className="text-sm text-muted">
                    Seção destinada a exibição de dados do registro selecionado
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Format duration with 3 decimal places using Intl.NumberFormat */}
                <InfoItem
                  label="Duração"
                  value={Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  }).format(log.duracao)}
                />
                <InfoItem label="Protocolo" value={log.protocolo} />
                <InfoItem label="URL" value={log.url} />
                <InfoItem label="Setor" value={log.setor} />
                <InfoItem label="Nome do cliente" value={log.nome_cliente} />
                {/* Payload is shown as code (JSON) if present, using a11yDark style */}
                <InfoItem
                  label="Payload"
                  value={log.payload}
                  isCode={!!log.payload}
                  codeStyle={a11yDark}
                />
                {/* Response is shown as code (JSON) if present, using coldarkDark style */}
                <InfoItem
                  label="Resposta"
                  value={log.resposta}
                  isCode={!!log.resposta}
                  codeStyle={coldarkDark}
                />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
