import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Define the ConfigSnapshot type to match the one from the store
interface ConfigSnapshot {
  id: string;
  timestamp: Date;
  changes: string[];
  author: string;
  diff: string;
  config?: Record<string, any>;
}

// Mock data for demonstration
const mockSnapshots: ConfigSnapshot[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    changes: ['Changed primary color', 'Updated border radius'],
    author: 'Admin',
    diff: '{"primary":"#3B82F6","radius":0.5} -> {"primary":"#8B5CF6","radius":0.75}',
    config: {
      primary: '#8B5CF6',
      radius: 0.75,
      appearance: 'light',
      variant: 'professional'
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    changes: ['Switched to dark mode', 'Changed primary color'],
    author: 'Admin',
    diff: '{"primary":"#8B5CF6","appearance":"light"} -> {"primary":"#06B6D4","appearance":"dark"}',
    config: {
      primary: '#06B6D4',
      radius: 0.75,
      appearance: 'dark',
      variant: 'professional'
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    changes: ['Changed to vibrant variant'],
    author: 'System',
    diff: '{"variant":"professional"} -> {"variant":"vibrant"}',
    config: {
      primary: '#06B6D4',
      radius: 0.75,
      appearance: 'dark',
      variant: 'vibrant'
    }
  }
];

export const ConfigVersioning = () => {
  const [snapshots, setSnapshots] = useState<ConfigSnapshot[]>(mockSnapshots);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Format date to a readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  const handleRestoreSnapshot = (snapshotId: string) => {
    // In a real app, this would call a store method to restore the configuration
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (snapshot) {
      toast({
        title: "Configuration Restored",
        description: `Restored to version from ${formatDate(snapshot.timestamp)}`,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration History</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertTitle>About Configuration Versioning</AlertTitle>
          <AlertDescription>
            Configuration snapshots are automatically created when you make changes to system settings.
            You can restore to a previous configuration state if needed.
          </AlertDescription>
        </Alert>
        
        {snapshots.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No configuration snapshots available</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Accordion type="single" collapsible className="w-full">
              {snapshots.map((snapshot) => (
                <AccordionItem key={snapshot.id} value={snapshot.id}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatDate(snapshot.timestamp)}</span>
                        <Badge variant="outline" className="ml-2">
                          {snapshot.author}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {snapshot.changes.length} changes
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="space-y-3">
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Changes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {snapshot.changes.map((change, index) => (
                            <li key={index}>{change}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {snapshot.config && (
                        <div className="text-sm">
                          <h4 className="font-medium mb-2">Configuration:</h4>
                          <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                            <pre>{JSON.stringify(snapshot.config, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleRestoreSnapshot(snapshot.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Restore This Version
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};