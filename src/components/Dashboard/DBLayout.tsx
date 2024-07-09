import React from "react";
import DashboardHeader from "./Header";
import { Sidebar } from "./Sidebar";

interface IDBLayout {
  children: React.ReactNode;
}

export default function DBLayout({ children }: IDBLayout) {
  return (
    <div>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="w-full" style={{ height: 'calc(100vh - 72px)', overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
