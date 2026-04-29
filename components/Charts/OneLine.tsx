import { Card } from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OneLineChartProps {
  data: Record<string, any>[];
  label: string;
  name?: string;
  dataKey: string;
  lineDataKey?: string;
  lineColor?: string;
  activeDotColor?: string;
  isLoading?: boolean;
  hideXAxis?: boolean;
}

function OneLineChart({
  data,
  label,
  name = "Total de requisições",
  dataKey,
  lineDataKey = "total_requisicoes",
  lineColor = "#21e8fa",
  activeDotColor = "#fa7b20",
  isLoading = false,
  hideXAxis = false,
}: OneLineChartProps) {
  return (
    <>
      {isLoading ? (
        <span className="text-center self-center">Carregando...</span>
      ) : data?.length > 0 ? (
        <Card>
          <Card.Header>
            <Card.Title className="text-lg font-bold">{label}</Card.Title>
          </Card.Header>
          <Card.Content>
            <LineChart
              style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "500px",
                aspectRatio: 1.618,
              }}
              responsive
              data={data}
              margin={{ top: 50, right: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} hide={hideXAxis} />
              <YAxis width="auto" />
              <Tooltip
                itemStyle={{}}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                  borderRadius: "5px",
                  color: "#f9fafb",
                }}
                labelStyle={{}}
                wrapperStyle={{ borderRadius: "10px" }}
                separator=": "
                cursor={{
                  fillOpacity: 0.5,
                  fill: lineColor,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={lineDataKey}
                stroke={lineColor}
                activeDot={{ fill: activeDotColor }}
                label={{ position: "top", fontSize: 12 }}
                name={name}
              />
            </LineChart>
          </Card.Content>
        </Card>
      ) : (
        <span className="text-center self-center">Sem dados disponíveis.</span>
      )}
    </>
  );
}

export default OneLineChart;
