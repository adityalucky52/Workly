import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";
import { AlertTriangle, Loader2, Users } from "lucide-react";
import { managerAPI } from "../../../services/api";

const getWorkloadColor = (workload) => {
  if (workload >= 80) return "text-red-600";
  if (workload >= 60) return "text-yellow-600";
  return "text-green-600";
};

const WorkloadView = () => {
  const [loading, setLoading] = useState(true);
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [stats, setStats] = useState({
    avgWorkload: 0,
    overloaded: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        setLoading(true);
        const [teamRes, tasksRes] = await Promise.all([
          managerAPI.getTeamMembers(),
          managerAPI.getAssignedTasks({ limit: 1000 }),
        ]);

        if (teamRes.data.success) {
          const members = teamRes.data.data;
          const allTasks = tasksRes.data.success ? tasksRes.data.data : [];

          const processedMembers = members
            .map((member) => {
              const memberTasks = allTasks.filter(
                (t) => t.assignee?._id === member._id,
              );
              const assigned = memberTasks.length;
              const completed = memberTasks.filter(
                (t) => t.status === "Completed",
              ).length;
              const active = memberTasks.filter(
                (t) => t.status !== "Completed" && t.status !== "Cancelled",
              ).length;

              // Workload Calc: (Active / 5) * 100.
              let workload = Math.round((active / 5) * 100);
              if (workload > 100) workload = 100;

              return {
                id: member._id,
                name: `${member.firstName} ${member.lastName}`,
                avatar: member.avatar,
                role: member.role || "Employee",
                assigned,
                completed,
                active,
                workload,
              };
            })
            .sort((a, b) => b.workload - a.workload); // Sort by workload descending

          setTeamWorkload(processedMembers);

          // Calculate summary stats
          const totalWorkload = processedMembers.reduce(
            (sum, m) => sum + m.workload,
            0,
          );
          const avgWorkload = processedMembers.length
            ? Math.round(totalWorkload / processedMembers.length)
            : 0;
          const overloaded = processedMembers.filter(
            (m) => m.workload >= 80,
          ).length;
          const totalTasks = processedMembers.reduce(
            (sum, m) => sum + m.assigned,
            0,
          );

          setStats({
            avgWorkload,
            overloaded,
            totalTasks,
          });
        }
      } catch (error) {
        console.error("Failed to fetch workload data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkload();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Calculating workload...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workload View</h1>
        <p className="text-muted-foreground">
          Monitor your team's workload distribution
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Workload</CardDescription>
            <CardTitle
              className={`text-2xl ${getWorkloadColor(stats.avgWorkload)}`}
            >
              {stats.avgWorkload}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overloaded Members</CardDescription>
            <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
              {stats.overloaded}
              {stats.overloaded > 0 && <AlertTriangle className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">{stats.totalTasks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Workload Cards */}
      {teamWorkload.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-1">No team members found</h3>
          <p>Your team members will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamWorkload.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Workload</span>
                    <span
                      className={`font-bold ${getWorkloadColor(member.workload)}`}
                    >
                      {member.workload}%
                    </span>
                  </div>
                  <Progress value={member.workload} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Assigned Tasks
                    </span>
                    <Badge variant="outline">{member.assigned}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="text-green-600 font-medium">
                      {member.completed}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active/Pending
                    </span>
                    <span className="text-blue-600 font-medium">
                      {member.active}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkloadView;
