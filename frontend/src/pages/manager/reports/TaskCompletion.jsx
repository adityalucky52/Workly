import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

const completionStats = {
  total: 150,
  completed: 120,
  inProgress: 25,
  overdue: 5,
  rate: 80,
};

const weeklyStats = [
  { week: "Week 1", completed: 28, target: 30 },
  { week: "Week 2", completed: 32, target: 30 },
  { week: "Week 3", completed: 30, target: 30 },
  { week: "Week 4", completed: 30, target: 30 },
];

const TaskCompletion = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Completion</h1>
        <p className="text-muted-foreground">
          Track task completion rates and trends
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionStats.total}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completionStats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionStats.rate}% completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {completionStats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">active tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {completionStats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Completion Rate</CardTitle>
          <CardDescription>Monthly task completion progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {completionStats.rate}%
              </span>
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5% vs last month
              </Badge>
            </div>
            <Progress value={completionStats.rate} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completionStats.completed} completed</span>
              <span>
                {completionStats.total - completionStats.completed} remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Breakdown</CardTitle>
          <CardDescription>Task completion by week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyStats.map((week) => (
              <div key={week.week} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{week.week}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        week.completed >= week.target
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {week.completed}/{week.target}
                    </span>
                    {week.completed >= week.target ? (
                      <Badge variant="secondary">Target Met</Badge>
                    ) : (
                      <Badge variant="outline">Below Target</Badge>
                    )}
                  </div>
                </div>
                <Progress
                  value={(week.completed / week.target) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCompletion;
