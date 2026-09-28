"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { FaClipboardList, FaHouseChimney, FaUsers } from "react-icons/fa6";
import { Button, Skeleton, Typography } from "@heroui/react";
import ProfileDetails from "@/components/Modals/ProfileDetails";
import Profile from "@/components/Profile";
import { useAuthStore } from "@/stores/auth.store";
import logo from "@/public/logo.svg";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const perms = useAuthStore((state) => state.perms);
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
          <Profile onCloseDetails={() => setIsProfileModalOpen(false)} />
        </div>
      </div>

      <ProfileDetails
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
