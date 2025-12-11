export function Header() {
  return (
    <header className="bg-card fixed top-0 w-full ml-sidebar-width p-4 flex items-center justify-between h-page-header-height z-10 border-b">
      <h2 className="text-lg font-semibold">
        Sistema de Monitoramento em Tempo Real
      </h2>
    </header>
  );
}

Header.displayName = "Header";
