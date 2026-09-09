import { useTheme } from "next-themes";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Props for the InfoItem component.
 */
export interface InfoItemProps {
  /** The label displayed above the value. */
  label: string;
  /** The value to display (can be a string, number, null or undefined). */
  value: string | number | null | undefined;
  /** If true, the value is rendered as syntax-highlighted code. */
  isCode?: boolean;
  /** The language to use for syntax highlighting (default: 'json5'). */
  language?: SyntaxHighlighterProps["language"];
  /** The style object for syntax highlighting (default: oneDark). */
  codeStyle?: SyntaxHighlighterProps["style"];
}

/**
 * InfoItem – displays a labelled piece of information.
 * Optionally renders the value as a code block with syntax highlighting.
 * The background of the code block adapts to the current theme (light/dark).
 */
export default function InfoItem({
  label,
  value,
  isCode = false,
  language = "json5",
  codeStyle = oneDark,
}: InfoItemProps) {
  // Get the resolved theme (light or dark) from next-themes
  const { resolvedTheme } = useTheme();

  return (
    <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
      <p className="text-muted text-xs uppercase mb-1">{label}</p>

      {isCode ? (
        // Render value as syntax-highlighted code
        <Prism
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            // Use black background for dark mode, dark gray for light mode to ensure readability
            backgroundColor: resolvedTheme === "dark" ? "black" : "#333",
            padding: "0.25rem 0",
          }}
          codeTagProps={{ className: "font-mono text-sm" }}
        >
          {/*
            Attempt to parse the value as JSON and stringify it with indentation.
            If parsing fails (or value is falsy), fallback to "---".
          */}
          {value ? JSON.stringify(JSON.parse(String(value)), null, 2) : "---"}
        </Prism>
      ) : (
        // Render plain text value, with a fallback for null/undefined
        <p className="font-medium text-black dark:text-white">
          {value ?? "---"}
        </p>
      )}
    </div>
  );
}
