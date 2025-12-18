"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTituloPaginaSimples } from "@/hooks/useTituloPagina";

export default function Forbidden() {
  useTituloPaginaSimples("Absol · 403");
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Ban className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold">
            403 - Acesso Proibido
          </CardTitle>
          <CardDescription className="mt-2 text-lg text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Verifique suas permissões ou entre em contato com o administrador.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-6">
          <Link href="/">
            <Button className="hover:cursor-pointer">
              <House className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
