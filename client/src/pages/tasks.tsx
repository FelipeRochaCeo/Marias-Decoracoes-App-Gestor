import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

// Mock data for tasks
const mockTasksData = {
  tasks: [
    { id: 1, title: "Update product inventory", description: "Count all packaging materials and update the system", assignee: "Maria Benson", status: "in-progress", priority: "high", dueDate: "2023-05-18" },
    { id: 2, title: "Prepare weekly report", description: "Compile sales and inventory data for weekly team meeting", assignee: "John Doe", status: "todo", priority: "medium", dueDate: "2023-05-19" },
    { id: 3, title: "Order cleaning supplies", description: "Purchase missing cleaning items from the shopping list", assignee: "Robert Thompson", status: "completed", priority: "low", dueDate: "2023-05-15" },
    { id: 4, title: "Review team performance", description: "Evaluate team metrics and prepare feedback", assignee: "John Doe", status: "todo", priority: "high", dueDate: "2023-05-20" },
    { id: 5, title: "Update website content", description: "Refresh product descriptions and images", assignee: "Maria Benson", status: "todo", priority: "medium", dueDate: "2023-05-22" },
    { id: 6, title: "Customer follow-up calls", description: "Contact recent customers for feedback", assignee: "Robert Thompson", status: "in-progress", priority: "medium", dueDate: "2023-05-18" }
  ],
  team: [
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Maria Benson", role: "Manager" },
    { id: 3, name: "Robert Thompson", role: "Employee" }
  ]
};

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // In a real app, we would use these queries to fetch the tasks data
  // const { data: tasksData, isLoading } = useQuery({
  //   queryKey: ['/api/tasks'],
  // });
  
  // For demo purposes, we'll use the mock data
  const tasksData = mockTasksData;
  
  // Filter tasks based on active tab and search query
  const filteredTasks = tasksData.tasks.filter(task => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "todo" && task.status === "todo") ||
      (activeTab === "in-progress" && task.status === "in-progress") ||
      (activeTab === "completed" && task.status === "completed");
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-accent">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-secondary">Completed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Task Management</h2>
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
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
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasksData.team.map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search tasks..."
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
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No tasks found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <Card key={task.id} className={`hover:shadow-md transition-shadow ${task.status === 'completed' ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox id={`task-${task.id}`} checked={task.status === 'completed'} />
                      <div>
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      </div>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-x-4 text-sm">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="ml-auto">
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
