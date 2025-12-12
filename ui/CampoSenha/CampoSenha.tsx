import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";

interface CampoSenhaProps {
  id: string;
  label: string;
  placeholder?: string;
  validation?: any;
  register: any;
  errors: any;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

export default function CampoSenha({
  id,
  label,
  placeholder = "Senha segura",
  validation,
  register,
  errors,
  showPassword,
  onToggleVisibility,
}: CampoSenhaProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={
            id === "confirmarSenha" ? "new-password" : "current-password"
          }
          className="pl-10 pr-12"
          placeholder={placeholder}
          {...register(id, validation)}
        />
        <Button
          type="button"
          onClick={onToggleVisibility}
          className="bg-inherit absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors hover:bg-inherit hover:cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {errors[id] && (
        <span className="text-destructive text-sm">{errors[id].message}</span>
      )}
    </Field>
  );
}

CampoSenha.displayName = "CampoSenha";
