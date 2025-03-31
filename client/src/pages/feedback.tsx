import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

// Mock data for feedback
const mockFeedbackData = {
  feedback: [
    { id: 1, title: "Inventory Count Improvement", description: "Could we add barcode scanning to make inventory counting faster?", type: "suggestion", visibility: "all", status: "open", submittedBy: "Maria Benson", date: "2023-05-10" },
    { id: 2, title: "App performance issues", description: "The app becomes slow when generating large reports", type: "issue", visibility: "admin", status: "in-review", submittedBy: "Robert Thompson", date: "2023-05-12" },
    { id: 3, title: "New feature request: Calendar view", description: "It would be helpful to have a calendar view for tasks and deadlines", type: "suggestion", visibility: "all", status: "open", submittedBy: "John Doe", date: "2023-05-15" },
    { id: 4, title: "Mobile navigation improvements", description: "The bottom navigation bar could use larger touch targets", type: "suggestion", visibility: "admin", status: "planned", submittedBy: "Maria Benson", date: "2023-05-05" },
    { id: 5, title: "Error when uploading images", description: "Getting an error when trying to upload images to tasks", type: "issue", visibility: "admin", status: "resolved", submittedBy: "Robert Thompson", date: "2023-05-01" }
  ]
};

const Feedback = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isNewFeedbackOpen, setIsNewFeedbackOpen] = useState(false);
  const [feedbackDetail, setFeedbackDetail] = useState<any | null>(null);
  
  // In a real app, we would use this query to fetch the feedback data
  // const { data: feedbackData, isLoading } = useQuery({
  //   queryKey: ['/api/feedback'],
  // });
  
  // For demo purposes, we'll use the mock data
  const feedbackData = mockFeedbackData;
  
  // Filter feedback based on active tab
  const filteredFeedback = feedbackData.feedback.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "suggestions") return item.type === "suggestion";
    if (activeTab === "issues") return item.type === "issue";
    if (activeTab === "my-feedback") return item.submittedBy === "John Doe"; // In real app, this would be the current user
    return true;
  });
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // In a real app, we would submit this to the server
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    
    setIsNewFeedbackOpen(false);
    form.reset();
  };
  
  const getFeedbackTypeBadge = (type: string) => {
    return (
      <Badge variant={type === "suggestion" ? "default" : "destructive"}>
        {type === "suggestion" ? "Suggestion" : "Issue"}
      </Badge>
    );
  };
  
  const getFeedbackStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline">Open</Badge>;
      case 'in-review':
        return <Badge variant="default" className="bg-primary">In Review</Badge>;
      case 'planned':
        return <Badge variant="default" className="bg-accent">Planned</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-secondary">Resolved</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Feedback & Suggestions</h2>
        <Dialog open={isNewFeedbackOpen} onOpenChange={setIsNewFeedbackOpen}>
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
              Submit Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Feedback or Suggestion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitFeedback} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Brief summary of your feedback" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Provide details about your feedback" required />
              </div>
              <div>
                <Label>Type</Label>
                <RadioGroup defaultValue="suggestion" name="type">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suggestion" id="suggestion" />
                    <Label htmlFor="suggestion">Suggestion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="issue" id="issue" />
                    <Label htmlFor="issue">Issue</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Visibility</Label>
                <RadioGroup defaultValue="all" name="visibility">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-users" />
                    <Label htmlFor="all-users">Visible to all team members</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin-only" />
                    <Label htmlFor="admin-only">Administrators only</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsNewFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Feedback</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="my-feedback">My Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No feedback found</p>
              </CardContent>
            </Card>
          ) : (
            filteredFeedback.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getFeedbackTypeBadge(item.type)}
                      {getFeedbackStatusBadge(item.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{item.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Submitted by: {item.submittedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Visibility: {item.visibility === "all" ? "All Team Members" : "Administrators Only"}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeedbackDetail(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Feedback Detail Dialog */}
      {feedbackDetail && (
        <Dialog open={!!feedbackDetail} onOpenChange={() => setFeedbackDetail(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{feedbackDetail.title}</DialogTitle>
                <div className="flex items-center gap-2">
                  {getFeedbackTypeBadge(feedbackDetail.type)}
                  {getFeedbackStatusBadge(feedbackDetail.status)}
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="mt-1 text-sm text-gray-600">{feedbackDetail.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700">Submitted By</h4>
                  <p className="text-gray-600">{feedbackDetail.submittedBy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Date</h4>
                  <p className="text-gray-600">{new Date(feedbackDetail.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Visibility</h4>
                  <p className="text-gray-600">
                    {feedbackDetail.visibility === "all" ? "All Team Members" : "Administrators Only"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <p className="text-gray-600 capitalize">{feedbackDetail.status.replace('-', ' ')}</p>
                </div>
              </div>
              {/* Admin actions would be conditionally rendered here based on user role */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add Comment</h4>
                <Textarea placeholder="Type your comment here..." className="mb-2" />
                <div className="flex justify-end">
                  <Button>Post Comment</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Feedback;
