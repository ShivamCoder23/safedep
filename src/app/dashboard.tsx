"use client";

import DependenciesTable from "@/components/package-dependencies";
import DependencyGraph from "@/components/package-dependencyGraph";
import PackageDetails from "@/components/package-Info";
import VersionLists from "@/components/package-versions";
import Vulnerabilities from "@/components/package-vulnerabilities";
import PackageInfo from "@/components/packages-licenses";
import ProjectInsights from "@/components/projectinsight";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import React, { useState, JSX } from "react";
import ExpressImage from "../assests/images/express.png";
import { ComponentProps } from "@/lib/types";

interface InsightData {
  packageVersion?: {
    package?: {
      name: string;
    };
    version: string;
  };
  insight?: {
    dependencies: Array<{
      package: { name: string };
      version: string;
    }>;
    vulnerabilities: Array<{
      id: { value: string };
      summary: string;
      severities: Array<{ risk: string }>;
      publishedAt: string;
      modifiedAt: string;
      aliases: Array<{ value: string }>;
    }>;
    projectInsights: {
      project: {
        name: string;
        url: string;
      };
      scorecard: {
        score: number;
        checks: {
          name: string;
          score: number;
        }[];
      };
      stars: number;
      forks: number;
      issues: {
        open: number;
      };
    }[];
    licenses: {
      licenses: Array<{
        licenseId: string;
      }>;
    };
  };
}

interface DashboardProps {
  insights?: InsightData;
  error?: string;
}

const sideBarItems: {
  title: string;
  icon: JSX.Element;
  component: React.ComponentType<ComponentProps> | null;
}[] = [
  {
    title: "Express",
    icon: <Image src={ExpressImage} alt="Express" width={20} height={20} />,
    component: null,
  },
];

export default function PackageDashboard({ insights, error }: DashboardProps) {
  const [activeComponent, setActiveComponent] =
    useState<React.ComponentType<ComponentProps> | null>(null); // Use the union type here

  if (error) {
    return <div className="text-red-500 p-4">Error are: {error}</div>;
  }

  if (!insights) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Packages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sideBarItems.map((item, index) => (
                    <SidebarMenuItem
                      key={index}
                      onClick={() => setActiveComponent(() => item.component)}
                    >
                      <SidebarMenuButton>
                        {item.icon} {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />

        <div className="flex-1 p-8">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Package Info</TabsTrigger>
              <TabsTrigger value="vulnerabilites">Vulnerabilities</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="versions">Available versions</TabsTrigger>
              <TabsTrigger value="insights">Dependency Graph</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 p-2">
                <div>
                  <PackageDetails insights={insights} />
                  <PackageInfo insights={insights} />
                </div>
                <div>
                  <ProjectInsights insights={insights} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="vulnerabilites">
              <Vulnerabilities insights={insights} />
            </TabsContent>
            <TabsContent value="dependencies">
              <DependenciesTable insights={insights} />
            </TabsContent>

            <TabsContent value="versions">
              <VersionLists insights={insights} />
            </TabsContent>
            <TabsContent value="insights">
              <DependencyGraph insights={insights} />
            </TabsContent>
          </Tabs>

          {activeComponent &&
            React.createElement(activeComponent, { insights })}
        </div>
      </div>
    </>
  );
}
