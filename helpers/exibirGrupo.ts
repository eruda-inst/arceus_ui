import { GrupoUsuario, GrupoUsuarioExibido } from "@/types/grupo";

function exibirGrupo(grupo: GrupoUsuario): GrupoUsuarioExibido {
  if (grupo === GrupoUsuario.Administrador) {
    return GrupoUsuarioExibido.Administrador;
  }
  if (grupo === GrupoUsuario.SuperAdministrador) {
    return GrupoUsuarioExibido.SuperAdministrador;
  }
  return GrupoUsuarioExibido.Usuario;
}

export { exibirGrupo };
