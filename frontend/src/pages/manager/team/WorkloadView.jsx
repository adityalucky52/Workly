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
import { AlertTriangle } from "lucide-react";

const teamWorkload = [
  {
    id: 1,
    name: "John Doe",
    role: "Developer",
    assigned: 5,
    completed: 3,
    workload: 75,
  },
  {
    id: 2,
    name: "Emily Davis",
    role: "Designer",
    assigned: 3,
    completed: 2,
    workload: 55,
  },
  {
    id: 3,
    name: "Alex Wilson",
    role: "Developer",
    assigned: 7,
    completed: 4,
    workload: 90,
  },
  {
    id: 4,
    name: "Sam Taylor",
    role: "QA Engineer",
    assigned: 2,
    completed: 1,
    workload: 40,
  },
  {
    id: 5,
    name: "Lisa Brown",
    role: "Developer",
    assigned: 4,
    completed: 2,
    workload: 65,
  },
];

const getWorkloadColor = (workload) => {
  if (workload >= 80) return "text-red-600";
  if (workload >= 60) return "text-yellow-600";
  return "text-green-600";
};

const WorkloadView = () => {
  const avgWorkload = Math.round(
    teamWorkload.reduce((sum, m) => sum + m.workload, 0) / teamWorkload.length,
  );
  const overloaded = teamWorkload.filter((m) => m.workload >= 80).length;

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
            <CardTitle className={`text-2xl ${getWorkloadColor(avgWorkload)}`}>
              {avgWorkload}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overloaded Members</CardDescription>
            <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
              {overloaded}
              {overloaded > 0 && <AlertTriangle className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">
              {teamWorkload.reduce((sum, m) => sum + m.assigned, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Workload Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamWorkload.map((member) => (
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
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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
                  <span className="text-muted-foreground">Assigned</span>
                  <Badge variant="outline">{member.assigned} tasks</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-green-600">{member.completed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkloadView;
