namespace Nessaj.Api.Models.DTOs;

public record StatusCount(string Status, int Count);
public record AssigneeCount(string Assignee, int Count);

public record DashboardSummary(
    int TotalProjects,
    int ProjectsOverdue,
    int TasksOpen,
    double AverageProgress,
    List<StatusCount> ProjectsByStatus,
    List<AssigneeCount> TasksByAssignee
);
