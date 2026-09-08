import { useMemo, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  FieldError,
  Form,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
  toast,
} from "@heroui/react";
import { FaEnvelope, FaFilter, FaUser, FaUsers } from "react-icons/fa6";
import { UserFilterInType } from "@/types/user.type";

export interface UserFiltersProps {
  /** Current filter values from parent */
  filters: UserFilterInType;
  /** Callback to apply filters (send to parent) */
  onSetFilters: (filters: UserFilterInType) => void;
  /** Callback to reset all filters to empty */
  onResetFilters: () => void;
}

export default function UserFilters({
  filters,
  onSetFilters,
  onResetFilters,
}: UserFiltersProps) {
  // Local state for filter values before applying
  const [localFilters, setLocalFilters] = useState<UserFilterInType>(filters);

  // Determine if any filter is set (to enable/disable action buttons)
  const isFiltersEmpty = useMemo(() => {
    return !Object.keys(localFilters).length;
  }, [localFilters]);

  // Reset filters locally and notify parent
  const handleReset = () => {
    onResetFilters();
    setLocalFilters({});
    toast.success("Filtros limpos com sucesso");
  };

  // Apply current local filters to parent
  const handleApply = () => {
    onSetFilters(localFilters);
    toast.success("Filtros aplicados com sucesso");
  };

  return (
    <Card className="mb-6 border">
      <Card.Header className="flex justify-between flex-row items-center">
        <div className="space-y-2">
          <Card.Title className="flex items-center gap-x-2">
            <div className="p-2 bg-indigo-500 rounded-lg w-fit">
              <FaFilter className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold">Filtros</div>
          </Card.Title>
          <Card.Description>
            Filtre os usuários conforme necessário
          </Card.Description>
        </div>

        <div className="flex gap-3">
          <Button
            onPress={handleReset}
            isDisabled={isFiltersEmpty}
            className="bg-linear-to-r from-gray-700 to-gray-800 text-gray-200 hover:shadow-md transition-shadow"
          >
            Limpar
          </Button>
          <Button
            onPress={handleApply}
            isDisabled={isFiltersEmpty}
            className="bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Aplicar Filtros
          </Button>
        </div>
      </Card.Header>

      <Card.Content>
        {/* Accordion groups filter sections; only one section for user filters */}
        <Accordion>
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <div className="flex items-center gap-x-2">
                  <FaUser className="size-5" />
                  <span>Usuário</span>
                </div>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Form className="grid grid-cols-2 gap-4">
                  <TextField
                    variant="secondary"
                    value={localFilters.nome ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, nome: v }))
                    }
                  >
                    <Label>Nome</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUser className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Nome do usuário" />
                    </InputGroup>
                    <FieldError />
                  </TextField>

                  <TextField
                    variant="secondary"
                    value={localFilters.email ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, email: v }))
                    }
                  >
                    <Label>Email</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaEnvelope className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="email@exemplo.com" />
                    </InputGroup>
                    <FieldError />
                  </TextField>

                  <Select
                    variant="secondary"
                    placeholder="Ativo"
                    value={
                      localFilters.ativo === undefined
                        ? ""
                        : localFilters.ativo
                          ? "true"
                          : "false"
                    }
                    onChange={(v) => {
                      setLocalFilters((prev) => ({
                        ...prev,
                        ativo:
                          v === "true"
                            ? true
                            : v === "false"
                              ? false
                              : undefined,
                      }));
                    }}
                  >
                    <Label>Ativo</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item key="true" id="true" textValue="Sim">
                          Sim
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item key="false" id="false" textValue="Não">
                          Não
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField
                    variant="secondary"
                    value={localFilters.nome_grupo ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, nome_grupo: v }))
                    }
                  >
                    <Label>Grupo</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUsers className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Nome do grupo" />
                    </InputGroup>
                    <FieldError />
                  </TextField>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card.Content>
    </Card>
  );
}
