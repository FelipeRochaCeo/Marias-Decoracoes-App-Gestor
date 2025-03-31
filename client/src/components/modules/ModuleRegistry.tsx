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
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const moduleFormSchema = z.object({
  id: z.string().min(3, "Module ID must be at least 3 characters"),
  name: z.string().min(3, "Module name must be at least 3 characters"),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

export const ModuleRegistrationForm = ({ onSubmit }: { onSubmit: (data: ModuleFormValues) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const availablePermissions = [
    "dashboard", 
    "inventory", 
    "inventory_view", 
    "team", 
    "chat", 
    "tasks", 
    "feedback", 
    "configuration"
  ];
  
  const availableDependencies = [
    "core-dashboard",
    "core-inventory",
    "core-tasks",
    "core-chat",
    "core-feedback"
  ];
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      dependencies: [],
      permissions: [],
    },
  });
  
  const selectedPermissions = watch("permissions") || [];
  const selectedDependencies = watch("dependencies") || [];
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setValue("permissions", [...selectedPermissions, permission], { shouldValidate: true });
    } else {
      setValue("permissions", selectedPermissions.filter(p => p !== permission), { shouldValidate: true });
    }
  };
  
  const handleDependencyChange = (dependency: string, checked: boolean) => {
    if (checked) {
      setValue("dependencies", [...selectedDependencies, dependency], { shouldValidate: true });
    } else {
      setValue("dependencies", selectedDependencies.filter(d => d !== dependency), { shouldValidate: true });
    }
  };
  
  const handleFormSubmit = (data: ModuleFormValues) => {
    onSubmit(data);
    setIsOpen(false);
    reset();
    toast({
      title: "Module Registered",
      description: `${data.name} has been successfully registered.`,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Register New Module</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Module</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moduleId" className="text-right">
                Module ID
              </Label>
              <div className="col-span-3">
                <Input
                  id="moduleId"
                  placeholder="e.g., my-module"
                  {...register("id")}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Module Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="e.g., My Custom Module"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  placeholder="Brief description of what this module does"
                  {...register("description")}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Dependencies</Label>
              <div className="col-span-3">
                <ScrollArea className="h-20 rounded border p-2">
                  {availableDependencies.map((dependency) => (
                    <div key={dependency} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`dependency-${dependency}`}
                        checked={selectedDependencies.includes(dependency)}
                        onCheckedChange={(checked) => 
                          handleDependencyChange(dependency, checked === true)
                        }
                      />
                      <Label 
                        htmlFor={`dependency-${dependency}`}
                        className="text-sm font-normal"
                      >
                        {dependency}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Permissions
              </Label>
              <div className="col-span-3">
                <ScrollArea className="h-40 rounded border p-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`permission-${permission}`}
                        checked={selectedPermissions.includes(permission)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission, checked === true)
                        }
                      />
                      <Label 
                        htmlFor={`permission-${permission}`}
                        className="text-sm font-normal"
                      >
                        {permission}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
                {errors.permissions && (
                  <p className="text-red-500 text-sm mt-1">{errors.permissions.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Register Module</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Exporting the main ModuleRegistry component
export const ModuleRegistry = () => {
  const [modules, setModules] = useState<any[]>([]);
  
  const handleRegisterModule = (moduleData: ModuleFormValues) => {
    // In a real app, this would call an API endpoint
    setModules([...modules, { ...moduleData, registeredAt: new Date() }]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Module Registry</h2>
        <ModuleRegistrationForm onSubmit={handleRegisterModule} />
      </div>
      
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No custom modules registered yet
                </td>
              </tr>
            ) : (
              modules.map((module) => (
                <tr key={module.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.registeredAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-600">Disable</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModuleRegistry;
