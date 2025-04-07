import { useState } from "react";
import { useNotices, Notice } from "@/context/NoticeContext";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { NoticeCard } from "@/components/NoticeCard";
import { NoticeForm } from "@/components/NoticeForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const Dashboard = () => {
  const { notices } = useNotices();
  const { currentUser } = useAuth();
  const { canCreate } = useNotices();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const filteredNotices = notices
    .filter((notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Filters and Notice Form */}
            <div className="space-y-6 md:col-span-1">
              {/* Filters */}
              <div className="bg-card rounded-lg border p-4 space-y-4">
                <h2 className="text-lg font-medium">Filters</h2>

                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notices..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select
                      defaultValue={sortOrder}
                      onValueChange={(value: "newest" | "oldest") =>
                        setSortOrder(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      defaultValue={priorityFilter}
                      onValueChange={(
                        value: "all" | "high" | "medium" | "low"
                      ) => setPriorityFilter(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setSortOrder("newest");
                    setPriorityFilter("all");
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>

              {/* Notice Form (visible only to teachers and admins) */}
              {canCreate && <NoticeForm />}
            </div>

            {/* Right column - Notices */}
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold mb-6">Notice Board</h1>

              {filteredNotices.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotices.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted/40 rounded-lg border p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No notices found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || priorityFilter !== "all"
                      ? "Try adjusting your filters to see more notices"
                      : "There are no notices available at this time"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
