import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface InfoItemProps {
  label: string;
  value: string | number;
  isCode?: boolean;
  language?: string; // opcional, padrão 'json'
}

function InfoItem({
  label,
  value,
  isCode = false,
  language = "json",
}: InfoItemProps) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <p className="text-gray-500 text-xs uppercase mb-1">{label}</p>
      {isCode ? (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            backgroundColor: "transparent",
            padding: "0.25rem 0",
          }}
          codeTagProps={{ className: "font-mono text-sm" }}
        >
          {String(value)}
        </SyntaxHighlighter>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}

export default InfoItem;
