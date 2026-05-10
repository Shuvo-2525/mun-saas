"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The settings module is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You will soon be able to manage your notifications, security preferences, and integration settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
