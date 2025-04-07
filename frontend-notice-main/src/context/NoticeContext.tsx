
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth, UserRole } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/context/auth/AuthProvider";

export type NoticePriority = "high" | "medium" | "low";

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  expiresAt?: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  priority: NoticePriority;
}

interface NoticeContextType {
  notices: Notice[];
  addNotice: (title: string, content: string, expiresAt?: Date, priority?: NoticePriority) => Promise<void>;
  deleteNotice: (noticeId: string) => Promise<void>;
  canDelete: (notice: Notice) => boolean;
  canCreate: boolean;
}

const NoticeContext = createContext<NoticeContextType>({
  notices: [],
  addNotice: async () => {},
  deleteNotice: async () => {},
  canDelete: () => false,
  canCreate: false
});

export const useNotices = () => useContext(NoticeContext);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Check permissions based on user role
  const canCreate = currentUser?.role === "teacher" || currentUser?.role === "admin" || 
                    currentUser?.role === "TEACHER" || currentUser?.role === "ADMIN";
  
  const canDelete = (notice: Notice) => {
    if (!currentUser) return false;
    if (currentUser.role === "admin" || currentUser.role === "ADMIN") return true;
    if ((currentUser.role === "teacher" || currentUser.role === "TEACHER") && 
        notice.author.id === currentUser.id) return true;
    return false;
  };

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/notices');
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notices",
        });
      }
    };

    if (currentUser) {
      fetchNotices();
    }
  }, [currentUser, toast]);

  // Add a new notice
  const addNotice = async (
    title: string, 
    content: string, 
    expiresAt?: Date,
    priority: NoticePriority = "medium"
  ) => {
    if (!currentUser || (currentUser.role !== "teacher" && currentUser.role !== "admin" && 
                          currentUser.role !== "TEACHER" && currentUser.role !== "ADMIN")) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only teachers and admins can create notices",
      });
      throw new Error("Permission denied");
    }

    try {
      const response = await api.post('/notices', {
        title,
        content,
        expiresAt,
        priority: priority.toUpperCase()
      });
      
      // Add the new notice to state
      setNotices(prev => [response.data, ...prev]);
      
      toast({
        title: "Notice created",
        description: "Your notice has been published successfully",
      });
    } catch (error) {
      console.error('Error creating notice:', error);
      toast({
        variant: "destructive",
        title: "Failed to create notice",
        description: "There was an error creating your notice",
      });
      throw error;
    }
  };

  // Delete a notice
  const deleteNotice = async (noticeId: string) => {
    const noticeToDelete = notices.find(n => n.id === noticeId);
    
    if (!noticeToDelete) {
      toast({
        variant: "destructive",
        title: "Notice not found",
        description: "The notice you're trying to delete doesn't exist",
      });
      throw new Error("Notice not found");
    }
    
    if (!canDelete(noticeToDelete)) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to delete this notice",
      });
      throw new Error("Permission denied");
    }
    
    try {
      await api.delete(`/notices/${noticeId}`);
      
      // Remove the deleted notice from state
      setNotices(prev => prev.filter(notice => notice.id !== noticeId));
      
      toast({
        title: "Notice deleted",
        description: "The notice has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete notice",
        description: "There was an error deleting the notice",
      });
      throw error;
    }
  };

  return (
    <NoticeContext.Provider 
      value={{ 
        notices, 
        addNotice, 
        deleteNotice, 
        canDelete,
        canCreate
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};
