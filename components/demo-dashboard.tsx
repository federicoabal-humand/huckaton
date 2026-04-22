"use client";

import { Users, FileText, BarChart3, Settings, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DemoDashboard() {
  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">H</span>
              </div>
              <span className="hidden font-semibold text-foreground sm:block">Humand Admin</span>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card sm:block">
          <nav className="flex flex-col gap-1 p-4">
            {[
              { icon: BarChart3, label: "Dashboard", active: true },
              { icon: Users, label: "Users", active: false },
              { icon: FileText, label: "Reports", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Users", value: "12,345", change: "+12%" },
              { label: "Active Sessions", value: "1,234", change: "+5%" },
              { label: "Reports", value: "89", change: "-3%" },
              { label: "Avg. Response", value: "2.4h", change: "-15%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span
                    className={`text-xs font-medium ${
                      stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold text-foreground">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="mt-1 h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold text-foreground">Quick Actions</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Add User", "Create Report", "View Analytics", "Settings"].map((action) => (
                  <Button key={action} variant="outline" className="justify-start">
                    {action}
                  </Button>
                ))}
              </div>
              <div className="mt-6 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-sm font-medium text-primary">
                  Click the HuReport button in the top-right corner to report an issue!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
