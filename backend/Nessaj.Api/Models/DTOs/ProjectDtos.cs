namespace Nessaj.Api.Models.DTOs;

public record CreateProjectRequest(
    string Name, string Responsible, string ClientArea, string Status,
    string Priority, DateTime StartDate, DateTime? Deadline,
    int ProgressPercent, decimal? BudgetPlanned, decimal? BudgetActual
);

public record UpdateProjectRequest(
    string Name, string Responsible, string ClientArea, string Status,
    string Priority, DateTime StartDate, DateTime? Deadline,
    int ProgressPercent, decimal? BudgetPlanned, decimal? BudgetActual
);

public record ProjectResponse(
    Guid Id, string Name, string Responsible, string ClientArea, string Status,
    string Priority, DateTime StartDate, DateTime? Deadline,
    int ProgressPercent, decimal? BudgetPlanned, decimal? BudgetActual,
    int TaskCount
);

public record CreateTaskRequest(
    Guid ProjectId, string Title, string? Description,
    string Status, string AssignedTo, string Priority, DateTime? Deadline
);

public record UpdateTaskRequest(
    string Title, string? Description,
    string Status, string AssignedTo, string Priority, DateTime? Deadline
);

public record TaskResponse(
    Guid Id, Guid ProjectId, string ProjectName, string Title, string? Description,
    string Status, string AssignedTo, string Priority, DateTime? Deadline, DateTime CreatedAt
);
