
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotices, Notice } from "@/context/NoticeContext";
import { Header } from "@/components/Header";
import { NoticeCard } from "@/components/NoticeCard";
import { UserManagement } from "@/components/UserManagement";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const { notices, deleteNotice } = useNotices();
  const [activeTab, setActiveTab] = useState("users");
  
  // Only admin can access this page
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="notices">Notice Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserManagement />
                
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-4">Admin Guide</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">
                        As an admin, you can add new users to the system. They can be teachers, students, or additional administrators.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">
                        Admins can delete any notice, regardless of who posted it. Teachers can only delete their own notices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notices" className="mt-6">
              <div className="space-y-6">
                <div className="bg-card border rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-2">Notice Management</h2>
                  <p className="text-sm text-muted-foreground">
                    As an admin, you can view and delete any notices from the system. Use this power responsibly.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {notices.length > 0 ? (
                    notices.map((notice) => (
                      <NoticeCard key={notice.id} notice={notice} />
                    ))
                  ) : (
                    <div className="bg-muted/40 rounded-lg border p-8 text-center">
                      <h3 className="text-xl font-medium mb-2">No notices found</h3>
                      <p className="text-muted-foreground">
                        There are no notices available at this time
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
