import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  title: string;
  body: string;
  onClick?: () => void;
}

export const useNotifications = () => {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  
  useEffect(() => {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);
  
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser does not support desktop notifications",
        variant: "destructive",
      });
      return false;
    }
    
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };
  
  const showNotification = async ({ title, body, onClick }: Notification) => {
    // For browsers without notification support, fallback to toast
    if (!('Notification' in window)) {
      toast({
        title,
        description: body,
      });
      return;
    }
    
    // Request permission if not granted
    if (Notification.permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title,
          description: body,
        });
        return;
      }
    }
    
    // Create notification
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
    
    if (onClick) {
      notification.onclick = () => {
        notification.close();
        onClick();
        window.focus();
      };
    }
    
    // Also show toast for in-app awareness
    toast({
      title,
      description: body,
    });
  };
  
  return {
    permission,
    requestPermission,
    showNotification,
  };
};
