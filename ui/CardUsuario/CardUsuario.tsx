import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuSettings2 } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";

interface CardUsuarioProps {
  nome: string;
  funcao: string;
}

export function CardUsuario({ nome, funcao }: CardUsuarioProps) {
  return (
    <Card className="bg-accent gap-y-2 p-2 justify-between relative">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle>{nome}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 w-fit">
        <span className="text-sm text-muted-foreground">{funcao}</span>
        <LuSettings2 className="absolute -translate-x-1/2 -translate-y-1/2 right-0 top-1/2" />
      </CardContent>
    </Card>
  );
}
