"use client";

import { ReactNode, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Key } from "@heroui/react";
import { FaClipboardList, FaHouseChimney, FaUsers } from "react-icons/fa6";
import { TagGroup, Typography } from "@heroui/react";
import ProfileDetails from "@/components/Modals/ProfileDetails";
import Profile from "@/components/Profile";
import SidebarTag from "@/components/SidebarTag";
import { useAuthStore } from "@/stores/auth.store";
import logo from "@/public/logo.svg";

export interface MyTag {
  id: string;
  isDisabled: boolean;
  onPress: () => void;
  textValue: string;
  children: ReactNode;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const perms = useAuthStore((state) => state.perms);
  const hasPerm = useAuthStore((state) => state.hasPerm);

  const paths: Record<string, string> = {
    "/": "metrics",
    "/registros": "logs",
    "/usuarios": "users",
  };

  const activeTag: string = useMemo(() => {
    if (pathname) {
      return paths[pathname];
    }
    return paths["/"];
  }, [pathname]);

  const hasPermArray: Record<string, boolean> = useMemo(() => {
    return {
      metrics: hasPerm("ver:metricas"),
      logs: hasPerm("ver:logs"),
      users: hasPerm("ver:usuarios"),
    };
  }, [perms]);

  const [selected, setSelected] = useState<Iterable<Key>>(new Set([activeTag]));
  const [isProfileDetailsOpen, setIsProfileDetailOpen] =
    useState<boolean>(false);

  const tags: MyTag[] = [
    {
      id: "metrics",
      isDisabled: !hasPermArray.metrics,
      onPress: () => router.push("/"),
      textValue: "Métricas",
      children: (
        <>
          <FaHouseChimney className="size-5" /> Métricas
        </>
      ),
    },
    {
      id: "logs",
      isDisabled: !hasPermArray.logs,
      onPress: () => router.push("/registros"),
      textValue: "Registros",
      children: (
        <>
          <FaClipboardList className="size-5" /> Registros
        </>
      ),
    },
    {
      id: "users",
      isDisabled: !hasPermArray.users,
      onPress: () => router.push("/usuarios"),
      textValue: "Usuários",
      children: (
        <>
          <FaUsers className="size-5" /> Usuários
        </>
      ),
    },
  ];

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
          <TagGroup
            selectionBehavior="toggle"
            selectionMode="single"
            selectedKeys={selected}
            onSelectionChange={(key) => setSelected(key)}
          >
            <TagGroup.List className="flex flex-col">
              {tags.map(({ id, isDisabled, onPress, textValue, children }) => (
                <SidebarTag
                  perms={perms}
                  id={id}
                  isDisabled={isDisabled}
                  key={id}
                  textValue={textValue}
                  onPress={onPress}
                >
                  {children}
                </SidebarTag>
              ))}
            </TagGroup.List>
          </TagGroup>
        </nav>

        <div className="p-4 border-t space-y-4">
          <Profile onOpenDetails={() => setIsProfileDetailOpen(true)} />
        </div>
      </div>

      <ProfileDetails
        isOpen={isProfileDetailsOpen}
        onClose={() => setIsProfileDetailOpen(false)}
      />
    </>
  );
}
