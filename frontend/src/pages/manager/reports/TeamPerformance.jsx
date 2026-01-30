import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
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
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Loader2,
  Users,
} from "lucide-react";
import { managerAPI } from "../../../services/api";

const TeamPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [teamStats, setTeamStats] = useState([]);
  const [summary, setSummary] = useState({
    totalCompleted: 0,
    avgEfficiency: 0,
    onTimeRate: 0,
    topPerformer: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch team members and assigned tasks
        const [teamRes, taskRes] = await Promise.all([
          managerAPI.getTeamMembers(),
          managerAPI.getAssignedTasks({ limit: 1000 }),
        ]);

        if (teamRes.data.success && taskRes.data.success) {
          const members = teamRes.data.data;
          const tasks = taskRes.data.data;

          const memberStats = members
            .map((member) => {
              const memberTasks = tasks.filter(
                (t) => t.assignee?._id === member._id,
              );

              const completedTasks = memberTasks.filter(
                (t) => t.status === "Completed",
              );
              const completedCount = completedTasks.length;

              // On Time Calculation
              const onTimeCount = completedTasks.filter((t) => {
                if (!t.dueDate) return true; // Assume on time if no due date????? Or ignore? Let's assume on time.
                return new Date(t.updatedAt) <= new Date(t.dueDate);
              }).length;

              // Efficiency: (On Time / Total Completed) * 100
              // If no completed tasks, efficiency is 0? Or 100? Let's say 0 for now to avoid top performer being someone with 0 tasks.
              const efficiency =
                completedCount > 0
                  ? Math.round((onTimeCount / completedCount) * 100)
                  : 0;

              // To be displayed/used
              return {
                id: member._id,
                name: `${member.firstName} ${member.lastName}`,
                avatar: member.avatar,
                completed: completedCount,
                onTime: onTimeCount,
                efficiency,
              };
            })
            .sort(
              (a, b) =>
                b.efficiency - a.efficiency || b.completed - a.completed,
            );

          setTeamStats(memberStats);

          // Summary Stats
          const totalCompleted = memberStats.reduce(
            (sum, m) => sum + m.completed,
            0,
          );
          const totalOnTime = memberStats.reduce((sum, m) => sum + m.onTime, 0);

          // Avg Efficiency of the team
          const activeMembers = memberStats.filter((m) => m.completed > 0);
          const avgEfficiency =
            activeMembers.length > 0
              ? Math.round(
                  activeMembers.reduce((sum, m) => sum + m.efficiency, 0) /
                    activeMembers.length,
                )
              : 0;

          // Global On-Time Rate
          const onTimeRate =
            totalCompleted > 0
              ? Math.round((totalOnTime / totalCompleted) * 100)
              : 0;

          const topPerformer =
            memberStats.length > 0 && memberStats[0].completed > 0
              ? memberStats[0]
              : null;

          setSummary({
            totalCompleted,
            avgEfficiency,
            onTimeRate,
            topPerformer,
          });
        }
      } catch (error) {
        console.error("Failed to fetch team performance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Calculating performance...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Performance</h1>
        <p className="text-muted-foreground">
          Analyze your team's performance metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">tasks all time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Efficiency
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary.avgEfficiency}%
            </div>
            <p className="text-xs text-muted-foreground">team average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.onTimeRate}%</div>
            <p className="text-xs text-muted-foreground">delivered on time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div
              className="text-lg font-bold truncate"
              title={summary.topPerformer?.name}
            >
              {summary.topPerformer ? summary.topPerformer.name : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.topPerformer
                ? `${summary.topPerformer.efficiency}% efficiency`
                : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cards */}
      {teamStats.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No team data available for performance review.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamStats.map((member) => (
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
                    <Badge
                      variant={
                        member.efficiency >= 90 ? "default" : "secondary"
                      }
                    >
                      {member.efficiency >= 90 ? "Top Performer" : "Good"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Efficiency</span>
                    <span className="font-bold">{member.efficiency}%</span>
                  </div>
                  <Progress value={member.efficiency} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {member.completed}
                      </p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {member.onTime}
                      </p>
                      <p className="text-xs text-muted-foreground">On Time</p>
                    </div>
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

export default TeamPerformance;
