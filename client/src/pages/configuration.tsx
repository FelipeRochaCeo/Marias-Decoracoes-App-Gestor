import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ModuleRegistrationForm } from "@/components/modules/ModuleRegistrationUI";
import { ConfigVersioning } from "@/components/core/ConfigVersioning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";


const Configuration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, updateTheme, createSnapshot } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  const [tempTheme, setTempTheme] = useState({
    primary: theme.primary || "#4F46E5",
    variant: theme.variant || "professional",
    appearance: theme.appearance || "light",
    radius: theme.radius || 0.5
  });

  const handleApplyChanges = () => {
    // Only admins can change configuration
    if (user?.role !== "Admin") {
      setIsPasswordDialogOpen(true);
      return;
    }

    applyChanges();
  };

  const handlePasswordSubmit = () => {
    // For demo purposes, hardcoded password "admin123"
    if (adminPassword === "admin123") {
      setIsPasswordDialogOpen(false);
      setAdminPassword("");
      setPasswordError("");
      applyChanges();
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const applyChanges = () => {
    // Update theme and create snapshot
    updateTheme({
      primary: tempTheme.primary,
      variant: tempTheme.variant as any,
      appearance: tempTheme.appearance as any,
      radius: tempTheme.radius
    });

    createSnapshot({
      changes: Object.keys(pendingChanges).map(key => 
        `Changed ${key} from ${theme[key as keyof typeof theme]} to ${pendingChanges[key]}`
      ),
      author: user?.username || "Admin"
    });

    toast({
      title: "Configuration Updated",
      description: "Your changes have been applied successfully.",
    });

    setPendingChanges({});
  };

  const updateTempTheme = (key: string, value: any) => {
    setTempTheme(prev => ({ ...prev, [key]: value }));
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">System Configuration</h2>
        <div className="flex gap-2">
          {Object.keys(pendingChanges).length > 0 && (
            <Button onClick={handleApplyChanges} className="bg-primary hover:bg-primary-dark">
              Apply Changes
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p>These settings control the appearance and behavior of the system.</p>
            <p className="mt-1">Changes will affect all users and require admin privileges.</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="version-history">Version History</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primaryColor" className="text-right">
                    Primary Color
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={tempTheme.primary}
                      onChange={(e) => updateTempTheme("primary", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input 
                      type="text"
                      value={tempTheme.primary}
                      onChange={(e) => updateTempTheme("primary", e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="variant" className="text-right">
                    UI Variant
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="variant"
                      value={tempTheme.variant}
                      onChange={(e) => updateTempTheme("variant", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="professional">Professional</option>
                      <option value="tint">Tint</option>
                      <option value="vibrant">Vibrant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appearance" className="text-right">
                    Appearance
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="appearance"
                      value={tempTheme.appearance}
                      onChange={(e) => updateTempTheme("appearance", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="radius" className="text-right">
                    Corner Radius
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="radius"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={tempTheme.radius}
                      onChange={(e) => updateTempTheme("radius", parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span>{tempTheme.radius}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="mt-4">
          <ModuleRegistrationForm />
        </TabsContent>

        <TabsContent value="version-history" className="mt-4">
          <ConfigVersioning />
        </TabsContent>

        <TabsContent value="advanced" className="mt-4">
          <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-500">Advanced settings will be available in a future update.</p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Verification Required</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adminPassword" className="text-right">
                Password
              </Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-500 text-center">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Configuration;