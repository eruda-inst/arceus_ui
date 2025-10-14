import { FaChartLine } from "react-icons/fa6";
import { PageHeader } from "@/app/components/PageHeader";
import { PageSidebar } from "@/app/components/PageSidebar";
import { SidebarTitle } from "@/app/components/SidebarTitle";
import { SidebarNav } from "@/app/components/SidebarNav";
import { SidebarNavItem } from "@/app/components/SidebarNavItem";
import { PageContent } from "@/app/components/PageContent";
import { MetricsGrid } from "@/app/components/MetricsGrid";
import { ChartsGrid } from "@/app/components/ChartsGrid";
import { BottomGrid } from "@/app/components/BottomGrid";
import { TopEndpoints } from "@/app/components/TopEndpoints";
import { LastErrorRequests } from "@/app/components/LastErrorRequests";
import { RecentRequestsLog } from "@/app/components/RecentRequestLog";
import { ChartWrapper } from "./components/ChartWrapper";
import { LineChartComponent } from "./components/LineChartComponent";
import { BarChartComponent } from "./components/BarChartComponent";

export default function Home() {
  const lineData = [
    { hour: "00:00", totalRequests: 234 },
    { hour: "01:00", totalRequests: 156 },
    { hour: "02:00", totalRequests: 89 },
    { hour: "03:00", totalRequests: 67 },
    { hour: "04:00", totalRequests: 45 },
    { hour: "05:00", totalRequests: 78 },
    { hour: "06:00", totalRequests: 189 },
    { hour: "07:00", totalRequests: 456 },
    { hour: "08:00", totalRequests: 789 },
    { hour: "09:00", totalRequests: 892 },
    { hour: "10:00", totalRequests: 945 },
    { hour: "11:00", totalRequests: 876 },
    { hour: "12:00", totalRequests: 912 },
    { hour: "13:00", totalRequests: 834 },
    { hour: "14:00", totalRequests: 897 },
    { hour: "15:00", totalRequests: 923 },
    { hour: "16:00", totalRequests: 878 },
    { hour: "17:00", totalRequests: 765 },
    { hour: "18:00", totalRequests: 689 },
    { hour: "19:00", totalRequests: 723 },
    { hour: "20:00", totalRequests: 812 },
    { hour: "21:00", totalRequests: 745 },
    { hour: "22:00", totalRequests: 567 },
    { hour: "23:00", totalRequests: 389 },
  ];

  const barData = [
    { statusCode: "200", total: 85 },
    { statusCode: "201", total: 42 },
    { statusCode: "202", total: 28 },
    { statusCode: "204", total: 15 },
    { statusCode: "400", total: 23 },
    { statusCode: "404", total: 67 },
    { statusCode: "405", total: 8 },
    { statusCode: "422", total: 12 },
    { statusCode: "500", total: 5 },
  ];

  return (
    <>
      <PageHeader />
      <PageSidebar>
        <SidebarTitle>Aggregator &middot; Monitor</SidebarTitle>
        <SidebarNav>
          <SidebarNavItem>
            <FaChartLine /> Dashboard
          </SidebarNavItem>
        </SidebarNav>
      </PageSidebar>
      <PageContent>
        <MetricsGrid />
        <ChartsGrid>
          <ChartWrapper>
            <h3 className="text-left w-full">Requisições por Hora</h3>
            <LineChartComponent
              data={lineData}
              xKey="hour"
              yKey="totalRequests"
              lineName="Número de Requisições"
              showDots={true}
            />
          </ChartWrapper>
          <ChartWrapper>
            <h3 className="text-left w-full">Distribuição de Status Codes</h3>
            <BarChartComponent
              data={barData}
              xKey="statusCode"
              yKey="total"
              barName="Número de Ocorrências"
            />
          </ChartWrapper>
        </ChartsGrid>
        <BottomGrid>
          <TopEndpoints />
          <LastErrorRequests />
        </BottomGrid>
        <RecentRequestsLog />
      </PageContent>
    </>
  );
}

Home.displayName = "Home";
