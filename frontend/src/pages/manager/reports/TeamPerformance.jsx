import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";
import { TrendingUp, CheckCircle2, Clock, Target } from "lucide-react";

const teamPerformance = [
  { id: 1, name: "John Doe", completed: 28, onTime: 25, efficiency: 89 },
  { id: 2, name: "Emily Davis", completed: 32, onTime: 30, efficiency: 94 },
  { id: 3, name: "Alex Wilson", completed: 24, onTime: 20, efficiency: 83 },
  { id: 4, name: "Sam Taylor", completed: 35, onTime: 33, efficiency: 94 },
  { id: 5, name: "Lisa Brown", completed: 21, onTime: 18, efficiency: 86 },
];

const TeamPerformance = () => {
  const totalCompleted = teamPerformance.reduce(
    (sum, m) => sum + m.completed,
    0,
  );
  const avgEfficiency = Math.round(
    teamPerformance.reduce((sum, m) => sum + m.efficiency, 0) /
      teamPerformance.length,
  );

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
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">tasks this month</p>
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
              {avgEfficiency}%
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
            <div className="text-2xl font-bold">
              {Math.round(
                (teamPerformance.reduce((sum, m) => sum + m.onTime, 0) /
                  totalCompleted) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">delivered on time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Sam Taylor</div>
            <p className="text-xs text-muted-foreground">94% efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamPerformance.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
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
                    variant={member.efficiency >= 90 ? "default" : "secondary"}
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
    </div>
  );
};

export default TeamPerformance;
