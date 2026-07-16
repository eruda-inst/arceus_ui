import { useState, useEffect, useMemo } from "react";
import {
  Button,
  InputGroup,
  Label,
  TextField,
  FieldError,
  Accordion,
  Form,
  Card,
  toast,
} from "@heroui/react";
import { FaFilter, FaUser, FaEnvelope, FaUsers } from "react-icons/fa6";
import { useUserFilter } from "@/stores/userFilter.store";
import type { UserFilterIn } from "@/types/user.type";

function UserFilters() {
  const filters = useUserFilter((state) => state.filters);
  const setFilters = useUserFilter((state) => state.setFilters);
  const resetFilters = useUserFilter((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState<UserFilterIn>(filters);
  const [isFiltersEmpty, setIsFiltersEmpty] = useState(true);

  const handleChange = (key: keyof UserFilterIn, value?: string) => {
    const cleanValue = value?.trim() === "" ? undefined : value;
    setLocalFilters((prev) => ({ ...prev, [key]: cleanValue }));
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({});
    toast.success("Filtros limpos com sucesso");
  };

  const handleApply = () => {
    setFilters(localFilters);
    toast.success("Filtros aplicados com sucesso");
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    setIsFiltersEmpty(
      !localFilters.name && !localFilters.email && !localFilters.groupName,
    );
  }, [localFilters]);

  return (
    <Card className="mb-6 border">
      <Card.Header className="flex justify-between flex-row items-center">
        <div className="space-y-2">
          <Card.Title className="flex items-center gap-x-2">
            <div className="p-2 bg-linear-to-r from-purple-700 to-indigo-700 rounded-lg w-fit">
              <FaFilter className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-200">Filtros</div>
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
            className="bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md transition-shadow"
          >
            Aplicar Filtros
          </Button>
        </div>
      </Card.Header>

      <Card.Content>
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
                    value={localFilters.name ?? ""}
                    onChange={(value) => handleChange("name", value)}
                  >
                    <Label>Nome</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUser className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Nome do usuário..." />
                    </InputGroup>
                    <FieldError />
                  </TextField>

                  <TextField
                    variant="secondary"
                    value={localFilters.email ?? ""}
                    onChange={(value) => handleChange("email", value)}
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

                  <TextField
                    variant="secondary"
                    value={localFilters.groupName ?? ""}
                    onChange={(value) => handleChange("groupName", value)}
                  >
                    <Label>Grupo</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUsers className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Nome do grupo..." />
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

export default UserFilters;
