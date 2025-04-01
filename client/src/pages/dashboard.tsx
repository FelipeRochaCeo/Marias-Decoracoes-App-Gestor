import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// For real implementation, we would fetch this data from the API
const mockDashboardData = {
  stats: {
    teamMembers: 8,
    activeTasks: 12,
    inventoryAlerts: 3
  },
  tasks: [
    { id: 1, title: "Update product inventory", deadline: "Today", completed: false },
    { id: 2, title: "Prepare weekly report", deadline: "Tomorrow", completed: false },
    { id: 3, title: "Order cleaning supplies", deadline: "Yesterday", completed: true },
    { id: 4, title: "Review team performance", deadline: "Friday", completed: false }
  ],
  inventory: [
    { id: 1, name: "Packaging Tape", quantity: 5, total: 25, unit: "rolls", status: "low" },
    { id: 2, name: "Thermal Labels", quantity: 1, total: 10, unit: "pack", status: "low" },
    { id: 3, name: "Cleaning Supplies", quantity: 3, total: 0, unit: "items", status: "shopping" },
    { id: 4, name: "Plastic Packaging", quantity: 45, total: 70, unit: "units", status: "ok" }
  ],
  activity: [
    { id: 1, user: { initials: "MB", name: "Maria Benson" }, action: "completed inventory count for", target: "packaging materials", time: "1 hour ago" },
    { id: 2, user: { initials: "RT", name: "Robert Thompson" }, action: "added 3 items to the", target: "cleaning supplies shopping list", time: "2 hours ago" },
    { id: 3, user: { initials: "JD", name: "John Doe" }, action: "assigned", target: "5 new tasks", time: "5 hours ago" }
  ]
};

const Dashboard = () => {
  // In a real app, we would use this query to fetch the dashboard data
  // const { data: dashboard, isLoading } = useQuery({
  //   queryKey: ['/api/dashboard'],
  // });
  
  // For demo purposes, we'll use the mock data
  const dashboard = mockDashboardData;

  return (
    <div>
      {/* Dashboard Stats Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Membros da Equipe</h3>
                  <p className="text-2xl font-semibold text-gray-800">{dashboard.stats.teamMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-secondary/10 p-3 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Tasks</h3>
                  <p className="text-2xl font-semibold text-gray-800">{dashboard.stats.activeTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-accent/10 p-3 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Inventory Alerts</h3>
                  <p className="text-2xl font-semibold text-gray-800">{dashboard.stats.inventoryAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/tasks?action=new">
            <a className="bg-white hover:bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">New Task</span>
            </a>
          </Link>
          
          <Link href="/team?action=new">
            <a className="bg-white hover:bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Adicionar Usuário</span>
            </a>
          </Link>
          
          <Link href="/inventory?action=count">
            <a className="bg-white hover:bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Contagem de Estoque</span>
            </a>
          </Link>
          
          <Link href="/chat?action=new">
            <a className="bg-white hover:bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">New Message</span>
            </a>
          </Link>
        </div>
      </div>
      
      {/* Tasks and Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Tasks */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Recent Tasks</h3>
            <Link href="/tasks">
              <a className="text-primary hover:text-primary-dark font-medium text-sm">View All</a>
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboard.tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id={`task-${task.id}`} checked={task.completed} />
                  <label 
                    htmlFor={`task-${task.id}`} 
                    className={`ml-3 text-sm font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-700"}`}
                  >
                    {task.title}
                  </label>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.completed ? "bg-gray-100 text-gray-600" :
                    task.deadline === "Today" ? "bg-secondary/10 text-secondary" :
                    task.deadline === "Tomorrow" ? "bg-accent/10 text-accent" :
                    "bg-accent/10 text-accent"
                  }`}
                >
                  {task.deadline}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Inventory Alerts */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Inventory Alerts</h3>
            <Link href="/inventory">
              <a className="text-primary hover:text-primary-dark font-medium text-sm">View All</a>
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboard.inventory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} {item.unit} remaining</p>
                  </div>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "low" ? "bg-error/10 text-error" :
                      item.status === "shopping" ? "bg-accent/10 text-accent" :
                      "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {item.status === "low" ? "Low Stock" :
                     item.status === "shopping" ? "Shopping List" :
                     "In Stock"}
                  </span>
                </div>
                {item.status !== "shopping" && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        item.status === "low" ? "bg-error" : "bg-secondary"
                      }`} 
                      style={{ width: `${(item.quantity / item.total) * 100}%` }}
                    />
                  </div>
                )}
                {item.status === "shopping" && (
                  <div className="mt-2">
                    <Link href="/inventory?view=shopping-list">
                      <a className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50">
                        View List
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Activity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Activity</h2>
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {dashboard.activity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-700 font-medium">{activity.user.initials}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{activity.user.name}</span> {activity.action} <span className="font-medium text-gray-900">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Updates */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Updates</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New module available: Advanced Analytics</p>
                <p className="text-xs text-gray-500 mt-1">Adds detailed business performance metrics and customizable dashboards</p>
              </div>
              <div className="ml-auto">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Learn More
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
