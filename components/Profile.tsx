"use client";

import Misc from "@/helpers/Misc.helper";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, Dropdown, Label, Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Key } from "react-aria";
import {
  FaArrowRight,
  FaPaintbrush,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";

interface ProfilePros {
  onCloseDetails: () => void;
}

export default function Profile({ onCloseDetails }: ProfilePros) {
  const { setTheme, theme } = useTheme();
  const [selected, setSelected] = useState<Set<Key>>(
    new Set([theme || "system"]),
  );
  const currUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Dropdown>
      <Dropdown.Trigger className="justify-start gap-x-3 p-3 h-14 w-full flex">
        {!isAuthenticated ? (
          <Skeleton className="w-full h-10 rounded-full" />
        ) : (
          <>
            <Avatar size="sm">
              <Avatar.Fallback className="bg-linear-to-r from-purple-500 to-indigo-500 text-white">
                {Misc.getInitials(currUser?.nome)}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p
                className="text-sm font-medium w-36 truncate"
                title={currUser?.nome}
              >
                {currUser?.nome}
              </p>
              <p className="text-xs text-muted">{currUser?.nome_grupo}</p>
            </div>
          </>
        )}
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item textValue="Perfil e Conta" onPress={onCloseDetails}>
            <FaUser className="size-4" />
            <Label>Perfil e Conta</Label>
          </Dropdown.Item>

          <Dropdown.SubmenuTrigger>
            <Dropdown.Item>
              <FaPaintbrush className="size-4" />
              <Label>Tema</Label>
              <Dropdown.SubmenuIndicator>
                <FaArrowRight className="size-4 text-muted" />
              </Dropdown.SubmenuIndicator>
            </Dropdown.Item>
            <Dropdown.Popover>
              <Dropdown.Menu
                selectedKeys={selected}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  if (keys !== "all") {
                    setSelected(new Set(keys));
                  }
                }}
              >
                <Dropdown.Item
                  id="light"
                  textValue="Claro"
                  onPress={() => setTheme("light")}
                >
                  <Dropdown.ItemIndicator />
                  <Label>Claro</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  id="dark"
                  textValue="Escuro"
                  onPress={() => setTheme("dark")}
                >
                  <Dropdown.ItemIndicator />
                  <Label>Escuro</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  id="system"
                  textValue="Sistema"
                  onPress={() => setTheme("system")}
                >
                  <Dropdown.ItemIndicator />
                  <Label>Sistema</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>

          <Dropdown.Item
            variant="danger"
            textValue="Sair"
            onPress={async () => await logout()}
          >
            <FaRightFromBracket className="size-4 text-danger" />
            <Label>Sair</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
