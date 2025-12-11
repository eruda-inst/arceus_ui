import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function DistribuicaoStatusCodes() {
  const [distribuicao, setDistribuicao] = useState([]);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.distribuicao_status_codes !== undefined) {
        setDistribuicao(data.distribuicao_status_codes);
      }
    },
    onOpen: () => {
      sendMetricaRequest("distribuicao_status_codes");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Status Codes (todo o período)</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <BarChartComponent
            data={distribuicao}
            xKey="status_code"
            yKey="total"
            barSize={60}
            fill="var(--chart-2)"
            activeBarColor="var(--chart-2)"
            labelText="Total"
          />
        ) : (
          <Skeleton className="h-[300px]" />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoStatusCodes.displayName = "DistribuicaoStatusCodes";
