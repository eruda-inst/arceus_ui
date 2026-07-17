import { FaServer } from "react-icons/fa6";
import { Modal, ModalProps } from "@heroui/react";
import { LogOut } from "@/types/log.type";
import InfoItem from "@/components/InfoItem/InfoItem";
import {
  a11yDark,
  coldarkDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface DetailsProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  log: LogOut;
}

function Details({ handleClose, log, ...props }: DetailsProps) {
  return (
    <Modal {...props}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={handleClose} />
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
                  <h3 className="text-lg font-semibold text-gray-200">
                    Registro
                  </h3>
                  <p className="text-sm text-gray-400">
                    Seção destinada a exibição de dados do registro selecionado
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Duração"
                  value={log.duracao.toFixed(3).toString().replace(".", ",")}
                />
                <InfoItem
                  label="Protocolo"
                  value={log.protocolo ? log.protocolo : "---"}
                />
                <InfoItem label="URL" value={log.url} />
                <InfoItem label="Domínio" value={log.dominio} />
                <InfoItem label="Setor" value={log.setor} />
                <InfoItem
                  label="Payload"
                  value={
                    log.payload
                      ? (() => {
                          try {
                            const obj =
                              typeof log.payload === "string"
                                ? JSON.parse(log.payload)
                                : log.payload;
                            return JSON.stringify(obj, null, 2);
                          } catch {
                            return String(log.payload);
                          }
                        })()
                      : "---"
                  }
                  isCode={log.payload !== null}
                  codeStyle={a11yDark}
                />
                <InfoItem
                  label="Resposta"
                  value={(() => {
                    try {
                      const obj =
                        typeof log.resposta === "string"
                          ? JSON.parse(log.resposta)
                          : log.resposta;
                      return JSON.stringify(obj, null, 2);
                    } catch {
                      return String(log.resposta);
                    }
                  })()}
                  isCode={log.resposta !== null}
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

export default Details;
