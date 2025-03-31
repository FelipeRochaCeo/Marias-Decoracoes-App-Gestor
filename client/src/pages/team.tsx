import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// Mock data for team members - in real app, would come from API
const mockTeamData = {
  members: [
    { id: 1, name: "John Doe", username: "john", role: "Admin", email: "john@example.com", status: "active", avatar: "JD" },
    { id: 2, name: "Maria Benson", username: "maria", role: "Manager", email: "maria@example.com", status: "active", avatar: "MB" },
    { id: 3, name: "Robert Thompson", username: "robert", role: "Employee", email: "robert@example.com", status: "active", avatar: "RT" },
    { id: 4, name: "Sarah Wilson", username: "sarah", role: "Employee", email: "sarah@example.com", status: "inactive", avatar: "SW" }
  ],
  roles: [
    { id: 1, name: "Admin", permissions: ["*"] },
    { id: 2, name: "Manager", permissions: ["inventory", "team", "chat", "tasks"] },
    { id: 3, name: "Employee", permissions: ["chat", "tasks", "inventory_view"] }
  ]
};

const Team = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  
  // In a real app, we would use these queries to fetch the team data
  // const { data: teamData, isLoading } = useQuery({
  //   queryKey: ['/api/team'],
  // });
  
  // For demo purposes, we'll use the mock data
  const teamData = mockTeamData;
  
  // Filter team members based on search query
  const filteredMembers = teamData.members.filter(member => {
    return (
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call the API to create a new member
    toast({
      title: "Member Added",
      description: "The team member has been successfully added.",
    });
    setIsNewMemberOpen(false);
  };
  
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call the API to create a new role
    toast({
      title: "Role Created",
      description: "The new role has been successfully created.",
    });
    setIsNewRoleOpen(false);
  };
  
  const handleViewMember = (member: any) => {
    setSelectedMember(member);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Team Management</h2>
        {user?.role === "Admin" && (
          <Dialog open={isNewMemberOpen} onOpenChange={setIsNewMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMember} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Enter full name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email address" required />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="Enter username" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Enter password" required />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamData.roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsNewMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Member</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-4 space-y-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-2.5 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No team members found</p>
                </CardContent>
              </Card>
            ) : (
              filteredMembers.map(member => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className={member.role === "Admin" ? "bg-primary text-white" : "bg-gray-200"}>
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={member.role === "Admin" ? "default" : member.role === "Manager" ? "secondary" : "outline"}>
                        {member.role}
                      </Badge>
                      <Badge variant={member.status === "active" ? "secondary" : "destructive"}>
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewMember(member)}
                      >
                        View Details
                      </Button>
                      {user?.role === "Admin" && (
                        <Button variant="ghost" size="sm" className="ml-2">
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="mt-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Roles & Permissions</h3>
            {user?.role === "Admin" && (
              <Dialog open={isNewRoleOpen} onOpenChange={setIsNewRoleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateRole} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input id="roleName" name="roleName" placeholder="Enter role name" required />
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-dashboard" name="permissions[]" value="dashboard" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-dashboard" className="text-sm">Dashboard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-inventory" name="permissions[]" value="inventory" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-inventory" className="text-sm">Inventory (Full)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-inventory-view" name="permissions[]" value="inventory_view" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-inventory-view" className="text-sm">Inventory (View)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-team" name="permissions[]" value="team" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-team" className="text-sm">Team Management</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-chat" name="permissions[]" value="chat" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-chat" className="text-sm">Chat</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-tasks" name="permissions[]" value="tasks" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-tasks" className="text-sm">Tasks</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-feedback" name="permissions[]" value="feedback" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-feedback" className="text-sm">Feedback</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm-config" name="permissions[]" value="configuration" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                          <Label htmlFor="perm-config" className="text-sm">Configuration</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" type="button" onClick={() => setIsNewRoleOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Role</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="space-y-4">
            {teamData.roles.map(role => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    {user?.role === "Admin" && role.name !== "Admin" && (
                      <Button variant="outline" size="sm">Edit Role</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.includes("*") ? (
                      <Badge variant="default" className="bg-primary">All Permissions</Badge>
                    ) : (
                      role.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Team Members with this Role</h4>
                  <div className="flex flex-wrap gap-2">
                    {teamData.members
                      .filter(member => member.role === role.name)
                      .map(member => (
                        <Badge key={member.id} variant="secondary">
                          {member.name}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Member Detail Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={selectedMember.role === "Admin" ? "bg-primary text-white" : "bg-gray-200"}>
                    {selectedMember.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedMember.name}</h3>
                  <Badge variant={selectedMember.role === "Admin" ? "default" : selectedMember.role === "Manager" ? "secondary" : "outline"}>
                    {selectedMember.role}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700">Username</h4>
                  <p className="text-gray-600">{selectedMember.username}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Email</h4>
                  <p className="text-gray-600">{selectedMember.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <Badge variant={selectedMember.status === "active" ? "secondary" : "destructive"}>
                    {selectedMember.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              {user?.role === "Admin" && (
                <div className="border-t pt-4 mt-4 flex justify-end gap-2">
                  <Button variant="outline">Reset Password</Button>
                  <Button 
                    variant={selectedMember.status === "active" ? "destructive" : "default"}
                  >
                    {selectedMember.status === "active" ? "Deactivate" : "Activate"} Account
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Team;
