import { useTheme } from "next-themes";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface InfoItemProps {
  label: string;
  value: string | number | null;
  isCode?: boolean;
  language?: SyntaxHighlighterProps["language"];
  codeStyle?: SyntaxHighlighterProps["style"];
}

export default function InfoItem({
  label,
  value,
  isCode = false,
  language = "json5",
  codeStyle = oneDark,
}: InfoItemProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
      <p className="text-muted text-xs uppercase mb-1">{label}</p>
      {isCode ? (
        <Prism
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            backgroundColor: resolvedTheme === "dark" ? "black" : "#333",
            padding: "0.25rem 0",
          }}
          codeTagProps={{ className: "font-mono text-sm" }}
        >
          {value ? String(value) : "---"}
        </Prism>
      ) : (
        <p className="font-medium text-black dark:text-white">{value}</p>
      )}
    </div>
  );
}
