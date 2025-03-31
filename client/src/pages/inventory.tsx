import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// Mock data for inventory
const mockInventoryData = {
  items: [
    { id: 1, name: "Packaging Tape", category: "Packaging", quantity: 5, minQuantity: 10, maxQuantity: 25, unit: "rolls" },
    { id: 2, name: "Thermal Labels", category: "Office", quantity: 1, minQuantity: 5, maxQuantity: 10, unit: "pack" },
    { id: 3, name: "Plastic Packaging", category: "Packaging", quantity: 45, minQuantity: 20, maxQuantity: 70, unit: "units" },
    { id: 4, name: "Bubble Wrap", category: "Packaging", quantity: 3, minQuantity: 2, maxQuantity: 10, unit: "rolls" },
    { id: 5, name: "Shipping Boxes (Small)", category: "Packaging", quantity: 25, minQuantity: 15, maxQuantity: 50, unit: "pcs" },
    { id: 6, name: "Shipping Boxes (Medium)", category: "Packaging", quantity: 18, minQuantity: 10, maxQuantity: 40, unit: "pcs" },
    { id: 7, name: "Shipping Boxes (Large)", category: "Packaging", quantity: 7, minQuantity: 5, maxQuantity: 20, unit: "pcs" },
    { id: 8, name: "Packing Paper", category: "Packaging", quantity: 2, minQuantity: 5, maxQuantity: 15, unit: "packs" }
  ],
  shoppingList: [
    { id: 1, name: "Floor Cleaner", category: "Cleaning", quantity: 2, unit: "bottles" },
    { id: 2, name: "Paper Towels", category: "Cleaning", quantity: 5, unit: "rolls" },
    { id: 3, name: "Multi-Surface Wipes", category: "Cleaning", quantity: 3, unit: "packs" }
  ],
  recentCounts: [
    { id: 1, date: "2023-05-15", user: "Maria Benson", itemsChecked: 24 },
    { id: 2, date: "2023-05-08", user: "John Doe", itemsChecked: 22 },
    { id: 3, date: "2023-05-01", user: "Robert Thompson", itemsChecked: 25 }
  ]
};

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  
  // In a real app, we would use these queries to fetch the inventory data
  // const { data: inventory, isLoading } = useQuery({
  //   queryKey: ['/api/inventory'],
  // });
  
  // For demo purposes, we'll use the mock data
  const inventory = mockInventoryData;
  
  // Filter inventory items based on search query and low stock filter
  const filteredItems = inventory.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = !showLowStockOnly || item.quantity < item.minQuantity;
    return matchesSearch && matchesLowStock;
  });
  
  const handleUpdateQuantity = (id: number) => {
    // In a real app, we would call the API to update the quantity
    console.log(`Updating item ${id} quantity to ${newQuantity}`);
    setEditingItemId(null);
  };
  
  const handleAddToShoppingList = (item: { name: string, category: string }) => {
    // In a real app, we would call the API to add the item to the shopping list
    console.log(`Adding ${item.name} to shopping list`);
  };
  
  const renderStockStatus = (item: typeof inventory.items[0]) => {
    const percentage = (item.quantity / item.maxQuantity) * 100;
    let statusClass = "bg-secondary/10 text-secondary";
    let statusText = "In Stock";
    
    if (item.quantity < item.minQuantity) {
      statusClass = "bg-error/10 text-error";
      statusText = "Low Stock";
    } else if (item.quantity < item.minQuantity * 1.5) {
      statusClass = "bg-accent/10 text-accent";
      statusText = "Reorder Soon";
    }
    
    return (
      <>
        <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
          {statusText}
        </span>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${
              item.quantity < item.minQuantity ? "bg-error" : 
              item.quantity < item.minQuantity * 1.5 ? "bg-accent" : "bg-secondary"
            }`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </>
    );
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Management</h2>
      
      <Tabs defaultValue="inventory" onValueChange={setActiveTab} value={activeTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
          <TabsTrigger value="counts">Weekly Counts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search items..."
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
            
            <div className="flex items-center ml-auto">
              <input
                id="lowStockFilter"
                type="checkbox"
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                checked={showLowStockOnly}
                onChange={() => setShowLowStockOnly(!showLowStockOnly)}
              />
              <label htmlFor="lowStockFilter" className="ml-2 text-sm text-gray-700">
                Show low stock items only
              </label>
            </div>
            
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
              Add New Item
            </Button>
          </div>
          
          <Card>
            <div className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No inventory items found</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">Category: {item.category}</p>
                      </div>
                      
                      <div className="flex flex-col sm:items-end">
                        {editingItemId === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={newQuantity}
                              onChange={(e) => setNewQuantity(Number(e.target.value))}
                              className="w-20"
                              min={0}
                            />
                            <Button size="sm" onClick={() => handleUpdateQuantity(item.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingItemId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-700">
                                {item.quantity} {item.unit}
                              </p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setNewQuantity(item.quantity);
                                }}
                              >
                                Update
                              </Button>
                              {item.quantity < item.minQuantity && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleAddToShoppingList(item)}
                                >
                                  Add to List
                                </Button>
                              )}
                            </div>
                            {renderStockStatus(item)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="shopping" className="space-y-4 mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-800">Shopping List</h3>
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
              Add Item
            </Button>
          </div>
          
          <Card>
            <div className="divide-y divide-gray-200">
              {inventory.shoppingList.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Shopping list is empty</p>
                </div>
              ) : (
                inventory.shoppingList.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">Category: {item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {item.quantity} {item.unit}
                        </span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {inventory.shoppingList.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Button className="w-full">
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  Export List
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="counts" className="space-y-4 mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-800">Weekly Inventory Counts</h3>
            <Button className="bg-primary hover:bg-primary-dark">
              Start New Count
            </Button>
          </div>
          
          <Card>
            <div className="divide-y divide-gray-200">
              {inventory.recentCounts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No recent counts found</p>
                </div>
              ) : (
                inventory.recentCounts.map((count) => (
                  <div key={count.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          Count on {new Date(count.date).toLocaleDateString()}
                        </h3>
                        <p className="text-xs text-gray-500">By: {count.user}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <span className="text-sm font-medium text-gray-700">
                          {count.itemsChecked} items checked
                        </span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
