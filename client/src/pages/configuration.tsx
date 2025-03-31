import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useModuleSystem } from "@/hooks/use-module-system";
import { useToast } from "@/hooks/use-toast";
import { ModuleRegistry, ModuleRegistrationForm } from "@/components/modules/ModuleRegistry";
import { ConfigVersioning } from "@/components/core/ConfigVersioning";

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
            <p className="font-medium text-yellow-700">Protected Configuration Area</p>
            <p className="mt-1">Changes to the core system configuration require administrator privileges and are tracked for audit purposes.</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-4 items-center">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: tempTheme.primary }}
                  />
                  <Input
                    id="primaryColor"
                    type="text"
                    value={tempTheme.primary}
                    onChange={(e) => updateTempTheme("primary", e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Theme Variant</Label>
                <RadioGroup 
                  value={tempTheme.variant} 
                  onValueChange={(value) => updateTempTheme("variant", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="variant-professional" />
                    <Label htmlFor="variant-professional">Professional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tint" id="variant-tint" />
                    <Label htmlFor="variant-tint">Tint</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vibrant" id="variant-vibrant" />
                    <Label htmlFor="variant-vibrant">Vibrant</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Appearance</Label>
                <RadioGroup 
                  value={tempTheme.appearance} 
                  onValueChange={(value) => updateTempTheme("appearance", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="appearance-light" />
                    <Label htmlFor="appearance-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="appearance-dark" />
                    <Label htmlFor="appearance-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="appearance-system" />
                    <Label htmlFor="appearance-system">System</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <span className="text-sm text-gray-500">{tempTheme.radius}rem</span>
                </div>
                <Slider
                  id="borderRadius"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[tempTheme.radius]}
                  onValueChange={(value) => updateTempTheme("radius", value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Square</span>
                  <span>Rounded</span>
                  <span>Pill</span>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Preview</h3>
                <div 
                  className="p-6 border rounded-md"
                  style={{ 
                    "--radius": `${tempTheme.radius}rem`,
                    borderRadius: "var(--radius)"
                  } as React.CSSProperties}
                >
                  <div className="space-y-4">
                    <div 
                      className="h-12 rounded" 
                      style={{ backgroundColor: tempTheme.primary }}
                    ></div>
                    <div className="flex gap-3">
                      <div 
                        className="px-4 py-2 text-white rounded"
                        style={{ backgroundColor: tempTheme.primary }}
                      >
                        Primary Button
                      </div>
                      <div className="px-4 py-2 border rounded">
                        Secondary Button
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="mt-6 space-y-6">
          <ModuleRegistry>
            <ModuleRegistrationForm />
          </ModuleRegistry>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6 space-y-6">
          <ConfigVersioning />
        </TabsContent>
      </Tabs>
      
      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Administrator Authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Changing system configuration requires administrator privileges. Please enter the admin password to proceed.
            </p>
            <div>
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1"
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setAdminPassword("");
                setPasswordError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Authenticate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Configuration;
