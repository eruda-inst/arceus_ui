import Link from "next/link";
import { Card, Typography } from "@heroui/react";
import { FaArrowLeft } from "react-icons/fa6";

/**
 * Custom 404 Not Found page.
 * Displayed when a user navigates to a route that doesn't exist.
 * Provides a friendly message and a link to return to the home page.
 */
export default function NotFoundPage() {
  return (
    // Card centered both vertically and horizontally using absolute positioning.
    <Card className="w-125 bg-inherit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card.Header className="flex flex-col gap-y-12">
        <Card.Title className="text-[7rem] text-center font-bold">
          404
        </Card.Title>

        {/* Main error message */}
        <Typography
          weight="bold"
          align="center"
          className="text-[1.75rem] my-3"
        >
          Página não encontrada
        </Typography>
      </Card.Header>

      <Card.Content>
        {/* Descriptive text explaining possible reasons for the error */}
        <Typography color="muted" align="center">
          Não conseguimos encontrar a página que você procura. <br /> Ela pode
          ter sido movida, removida ou o endereço informado está incorreto.
        </Typography>
      </Card.Content>

      <Card.Footer>
        {/* Link to return to home page; `replace` prevents adding the 404 page to history */}
        <Link href="/" replace className="mx-auto">
          <Typography className="flex items-center gap-x-2 hover:underline">
            <FaArrowLeft /> Voltar à home
          </Typography>
        </Link>
      </Card.Footer>
    </Card>
  );
}
