import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface InfoItemProps {
  label: string;
  value: string | number;
  isCode?: boolean;
  language?: string;
  codeStyle?: any;
}

function InfoItem({
  label,
  value,
  isCode = false,
  language = "json5",
  codeStyle = oneDark,
}: InfoItemProps) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <p className="text-gray-500 text-xs uppercase mb-1">{label}</p>
      {isCode ? (
        <Prism
          language={language}
          style={codeStyle}
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
        </Prism>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}

export default InfoItem;
