
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useNotices, Notice, NoticePriority } from "@/context/NoticeContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const priorityColors: Record<NoticePriority, string> = {
  high: "text-priority-high",
  medium: "text-priority-medium",
  low: "text-priority-low",
};

export function NoticeCard({ notice }: { notice: Notice }) {
  const { deleteNotice, canDelete } = useNotices();
  
  // Convert API priority format (uppercase) to component format (lowercase)
  const priority = (notice.priority.toLowerCase() || "medium") as NoticePriority;

  const handleDelete = async () => {
    try {
      await deleteNotice(notice.id);
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  return (
    <Card className={`notice-card animate-in ${priority}-priority`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{notice.title}</CardTitle>
            <CardDescription className="text-sm">
              Posted by {notice.author?.name} on {format(new Date(notice.createdAt), "PPP")}
            </CardDescription>
          </div>
          
          {/* <Badge className={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </Badge> */}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="whitespace-pre-line">{notice.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          {notice.expiresAt && (
            <span>Expires: {format(new Date(notice.expiresAt), "PPP")}</span>
          )}
        </div>
        
        {canDelete(notice) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete notice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
