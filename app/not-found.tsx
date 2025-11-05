"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuHouse, LuTriangleAlert, LuArrowLeft } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <LuTriangleAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold">
            404 - Página Não Encontrada
          </CardTitle>
          <CardDescription className="mt-2 text-lg text-muted-foreground">
            Oops! A página que você procura não foi encontrada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A URL pode estar incorreta ou a página pode ter sido movida.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-6">
          <Button onClick={handleGoBack} variant="outline">
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Link href="/">
            <Button>
              <LuHouse className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

NotFound.displayName = "NotFound";
