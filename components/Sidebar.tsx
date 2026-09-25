"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Key } from "react-aria";
import { useTheme } from "next-themes";
import clsx from "clsx";
import {
  FaArrowRight,
  FaClipboardList,
  FaHouseChimney,
  FaPaintbrush,
  FaRightFromBracket,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Skeleton,
  Typography,
} from "@heroui/react";
import ProfileDetails from "@/components/Modals/ProfileDetails";
import { useAuthStore } from "@/stores/auth.store";
import Misc from "@/helpers/Misc.helper";
import logo from "@/public/logo.svg";

export default function Sidebar() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<Key>>(
    new Set([theme || "system"]),
  );

  const currentUser = useAuthStore((state) => state.currentUser);
  const perms = useAuthStore((state) => state.perms);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasPerm = useAuthStore((state) => state.hasPerm);

  return (
    <>
      <div className="flex w-64 flex-col fixed inset-y-0 bg-surface-secondary dark:bg-surface border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <div className="flex items-center gap-3">
            <Image alt="Arceus" className="size-8" src={logo} />
            <Typography
              type="h1"
              weight="bold"
              className="text-xl text-purple-500"
            >
              Arceus
            </Typography>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {perms ? (
            <Button
              isDisabled={!hasPerm("ver:metricas")}
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/"
                  ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white"
                  : "bg-inherit",
              )}
              onPress={() => router.push("/")}
            >
              <FaHouseChimney className="size-5" /> Métricas
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}

          {perms ? (
            <Button
              isDisabled={!hasPerm("ver:logs")}
              onPress={() => router.push("/registros")}
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/registros"
                  ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white"
                  : "bg-inherit",
              )}
            >
              <FaClipboardList className="size-5" /> Registros
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}

          {perms ? (
            <Button
              isDisabled={!hasPerm("ver:usuarios")}
              onPress={() => router.push("/usuarios")}
              className={clsx(
                "text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white",
                pathname === "/usuarios"
                  ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white"
                  : "bg-inherit",
              )}
            >
              <FaUsers className="size-5" /> Usuários
            </Button>
          ) : (
            <Skeleton className="w-full h-12 rounded-3xl" />
          )}
        </nav>

        <div className="p-4 border-t space-y-4">
          <Dropdown>
            <Dropdown.Trigger className="justify-start gap-x-3 p-3 h-14 w-full flex">
              {!isAuthenticated ? (
                <Skeleton className="w-full h-10 rounded-full" />
              ) : (
                <>
                  <Avatar size="sm">
                    <Avatar.Fallback className="bg-linear-to-r from-purple-500 to-indigo-500 text-white">
                      {Misc.getInitials(currentUser?.nome)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p
                      className="text-sm font-medium w-36 truncate"
                      title={currentUser?.nome}
                    >
                      {currentUser?.nome}
                    </p>
                    <p className="text-xs text-muted">
                      {currentUser?.nome_grupo}
                    </p>
                  </div>
                </>
              )}
            </Dropdown.Trigger>

            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item
                  textValue="Perfil e Conta"
                  onPress={() => setIsProfileModalOpen(true)}
                >
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
        </div>
      </div>

      <ProfileDetails
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
