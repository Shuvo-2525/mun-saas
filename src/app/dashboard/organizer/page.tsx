"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrganizerDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Page Setup */}
        <div className="glass-card p-6 rounded-2xl border border-destructive/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Page Setup</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl font-bold text-destructive mb-4">1</div>
            <h3 className="text-lg font-semibold text-destructive mb-2">Add Key Information</h3>
            <p className="text-sm text-muted-foreground mb-4">0 / 3 Steps Complete</p>
          </div>
        </div>

        {/* Application Setup */}
        <div className="glass-card p-6 rounded-2xl border border-destructive/20 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Application Setup</h2>
            <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs flex items-center gap-1">
              Get Verified <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="flex flex-col items-center justify-center border border-destructive/20 rounded-xl py-6">
              <div className="text-4xl font-bold text-destructive mb-2">2</div>
              <h3 className="text-sm font-semibold text-destructive mb-1 text-center">Add Committees</h3>
              <p className="text-xs text-muted-foreground">0 / 2 Steps Complete</p>
            </div>
            
            <div className="flex flex-col items-center justify-center border border-destructive/20 rounded-xl py-6">
              <div className="text-4xl font-bold text-destructive mb-2">3</div>
              <h3 className="text-sm font-semibold text-destructive mb-1 text-center">Setup Payments</h3>
              <p className="text-xs text-muted-foreground">0 / 1 Step Complete</p>
            </div>
            
            <div className="flex flex-col items-center justify-center border border-destructive/20 rounded-xl py-6">
              <div className="text-4xl font-bold text-destructive mb-2">4</div>
              <h3 className="text-sm font-semibold text-destructive mb-1 text-center">Configure Applications</h3>
              <p className="text-xs text-muted-foreground">0 / 3 Steps Complete</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Statistics Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-[160px] bg-secondary/5">
              <div className="text-3xl font-bold text-yellow-500 mb-2">€0.00</div>
              <p className="text-sm text-muted-foreground">Income Last Week</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-[160px] bg-secondary/5">
              <div className="text-3xl font-bold mb-2">€0.00</div>
              <p className="text-sm text-muted-foreground">Total Income</p>
            </div>
          </div>
          
          <div className="glass-card p-0 rounded-2xl overflow-hidden border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="text-left font-semibold p-4 border-b border-border/40">Applications</th>
                  <th className="text-center font-semibold p-4 border-b border-border/40">Last Week</th>
                  <th className="text-center font-semibold p-4 border-b border-border/40">Total</th>
                  <th className="text-center font-semibold p-4 border-b border-border/40">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr>
                  <td className="p-4">Delegates <span className="text-muted-foreground ml-1">ⓘ</span></td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr>
                  <td className="p-4">Chairs</td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr>
                  <td className="p-4">Faculty Advisors</td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr>
                  <td className="p-4">Observers</td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr className="bg-secondary/5">
                  <td className="p-4 font-medium">Delegations</td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center font-medium">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr className="bg-secondary/5">
                  <td className="p-4 font-medium">'Expected' Delegation Members <span className="text-muted-foreground ml-1">ⓘ</span></td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center font-medium">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr className="bg-secondary/5">
                  <td className="p-4 font-medium">Registered Delegation Members <span className="text-muted-foreground ml-1">ⓘ</span></td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center font-medium">0</td>
                  <td className="p-4 text-center">0</td>
                </tr>
                <tr className="border-t-2 border-border/50 bg-secondary/10">
                  <td className="p-4 font-bold">Total Paid Participants <span className="text-muted-foreground ml-1">ⓘ</span></td>
                  <td className="p-4 text-center text-muted-foreground">+0</td>
                  <td className="p-4 text-center"></td>
                  <td className="p-4 text-center font-bold">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold">Statistics Graph</h2>
        <div className="glass-card h-[300px] rounded-2xl border border-border/50 flex flex-col items-center justify-center text-muted-foreground">
          <p>Graph visualization</p>
        </div>
      </div>
    </div>
  );
}
