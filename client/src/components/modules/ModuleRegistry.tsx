import { useEffect, ReactNode, useState } from 'react';
import { useModuleSystem } from '@/hooks/use-module-system';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Module } from '@/store/moduleStore';

interface ModuleRegistryProps {
  children: ReactNode;
}

interface ModuleProps {
  id: string;
  name: string;
  dependencies?: string[];
  permissions?: string[];
  children: ReactNode;
}

export const ModuleRegistry = ({ children }: ModuleRegistryProps) => {
  return <>{children}</>;
};

export const RegisteredModule = ({ 
  id, 
  name, 
  children, 
  dependencies = [], 
  permissions = [] 
}: ModuleProps) => {
  const { modules, registerModule } = useModuleSystem();
  
  // Register the module on mount if not already registered
  useEffect(() => {
    const isRegistered = modules.some(m => m.id === id);
    
    if (!isRegistered) {
      registerModule({
        id,
        name,
        dependencies,
        permissions,
        active: true
      });
    }
  }, [id, name, dependencies, permissions, modules, registerModule]);
  
  // Check if module is active and dependencies are satisfied
  const isActive = modules.find(m => m.id === id)?.active ?? false;
  
  const areDependenciesSatisfied = dependencies.every(depId => 
    modules.some(m => m.id === depId && m.active)
  );
  
  if (!isActive || !areDependenciesSatisfied) {
    return null;
  }
  
  return <>{children}</>;
};

interface NewModuleFormState {
  id: string;
  name: string;
  dependencies: string[];
  permissions: string[];
  active: boolean;
}

export const ModuleRegistrationForm = () => {
  const { modules, registerModule, toggleModule } = useModuleSystem();
  const { toast } = useToast();
  const [newModule, setNewModule] = useState<NewModuleFormState>({
    id: '',
    name: '',
    dependencies: [],
    permissions: [],
    active: true
  });

  // Handle input changes for new module
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewModule({
      ...newModule,
      [name]: value
    });
  };

  // Handle dependency checkbox changes
  const handleDependencyChange = (moduleId: string, checked: boolean) => {
    if (checked) {
      setNewModule({
        ...newModule,
        dependencies: [...newModule.dependencies, moduleId]
      });
    } else {
      setNewModule({
        ...newModule,
        dependencies: newModule.dependencies.filter(id => id !== moduleId)
      });
    }
  };

  // Register a new module
  const handleRegisterModule = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newModule.id.trim() || !newModule.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Module ID and name are required.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if module ID already exists
    if (modules.some(m => m.id === newModule.id)) {
      toast({
        title: "Module Exists",
        description: `A module with ID "${newModule.id}" already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    // Register the module
    registerModule({
      id: newModule.id,
      name: newModule.name,
      dependencies: newModule.dependencies,
      permissions: newModule.permissions,
      active: newModule.active
    });
    
    toast({
      title: "Module Registered",
      description: `"${newModule.name}" has been successfully registered.`
    });
    
    // Reset form
    setNewModule({
      id: '',
      name: '',
      dependencies: [],
      permissions: [],
      active: true
    });
  };

  // Toggle module active state
  const handleToggleModule = (moduleId: string) => {
    toggleModule(moduleId);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Register New Module</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterModule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moduleId">Module ID</Label>
                <Input
                  id="moduleId"
                  name="id"
                  value={newModule.id}
                  onChange={handleInputChange}
                  placeholder="e.g., inventory-analytics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduleName">Module Name</Label>
                <Input
                  id="moduleName"
                  name="name"
                  value={newModule.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Inventory Analytics"
                />
              </div>
            </div>
            
            {modules.length > 0 && (
              <div className="space-y-2">
                <Label>Dependencies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {modules.map(module => (
                    <div key={module.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dep-${module.id}`}
                        checked={newModule.dependencies.includes(module.id)}
                        onCheckedChange={(checked) => 
                          handleDependencyChange(module.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`dep-${module.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {module.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="module-active"
                checked={newModule.active}
                onCheckedChange={(checked) => 
                  setNewModule({ ...newModule, active: checked })
                }
              />
              <Label htmlFor="module-active">Active</Label>
            </div>
            
            <Button type="submit">Register Module</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Registered Modules</CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <p className="text-muted-foreground">No modules registered yet.</p>
          ) : (
            <div className="space-y-4">
              {modules.map(module => (
                <div key={module.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{module.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`toggle-${module.id}`}
                        checked={module.active}
                        onCheckedChange={() => handleToggleModule(module.id)}
                      />
                      <Label htmlFor={`toggle-${module.id}`} className="text-sm">
                        {module.active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">ID: {module.id}</div>
                  {module.dependencies.length > 0 && (
                    <div className="text-sm mb-1">
                      <span className="font-medium">Dependencies:</span>{" "}
                      {module.dependencies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};