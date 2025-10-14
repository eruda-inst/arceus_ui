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

export default function Home() {
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
        <ChartsGrid />
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
