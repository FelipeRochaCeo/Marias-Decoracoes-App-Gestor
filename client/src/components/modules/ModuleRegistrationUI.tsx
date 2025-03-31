import { useState } from 'react';
import { useModuleSystem } from '@/hooks/use-module-system';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the schema for module registration
const moduleFormSchema = z.object({
  id: z.string().min(3, {
    message: "Module ID must be at least 3 characters.",
  }),
  name: z.string().min(3, {
    message: "Module name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  dependencies: z.array(z.string()),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

export const ModuleRegistrationForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { registerModule, modules } = useModuleSystem();
  const { toast } = useToast();
  
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
    "core-team",
    "core-chat",
    "core-feedback"
  ];
  
  const existingModuleIds = modules.map(m => m.id);
  
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      permissions: [],
      dependencies: [],
    },
  });
  
  const onSubmit = (data: ModuleFormValues) => {
    // Check if module ID already exists
    if (existingModuleIds.includes(data.id)) {
      toast({
        title: "Error",
        description: `Module with ID "${data.id}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    // Register the module
    registerModule({
      id: data.id,
      name: data.name,
      dependencies: data.dependencies,
      permissions: data.permissions,
      active: true,
    });
    
    toast({
      title: "Success",
      description: `Module "${data.name}" has been registered.`,
    });
    
    setIsOpen(false);
    form.reset();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Module Registration</span>
            <Button onClick={() => setIsOpen(true)}>Register New Module</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Registered modules allow extending the functionality of the system in a controlled and secure manner.
          </p>
          
          {modules.length === 0 ? (
            <div className="p-6 text-center bg-muted rounded-md">
              <p className="text-muted-foreground">No modules have been registered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="bg-muted py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">ID: {module.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`active-${module.id}`} 
                            checked={module.active} 
                            // In a real implementation this would toggle the module
                            // onCheckedChange={(checked) => toggleModule(module.id, checked)}
                          />
                          <Label htmlFor={`active-${module.id}`}>Active</Label>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Permissions:</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.permissions.length > 0 ? (
                            module.permissions.map((perm) => (
                              <span key={perm} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Dependencies:</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.dependencies.length > 0 ? (
                            module.dependencies.map((dep) => (
                              <span key={dep} className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded">
                                {dep}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register New Module</DialogTitle>
            <DialogDescription>
              Add a new module to extend system functionality. Modules can depend on other modules and request specific permissions.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module ID</FormLabel>
                    <FormControl>
                      <Input placeholder="my-custom-module" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for the module (e.g., "analytics-dashboard")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Custom Module" {...field} />
                    </FormControl>
                    <FormDescription>
                      A user-friendly name for the module
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Provides additional functionality..." {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief description of what the module does
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Permissions</FormLabel>
                      <FormDescription>
                        Select the permissions this module requires
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePermissions.map((permission) => (
                        <FormField
                          key={permission}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, permission])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== permission
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {permission}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dependencies"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Dependencies</FormLabel>
                      <FormDescription>
                        Select the modules this module depends on
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableDependencies.map((dependency) => (
                        <FormField
                          key={dependency}
                          control={form.control}
                          name="dependencies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={dependency}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(dependency)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, dependency])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== dependency
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {dependency}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Module</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};