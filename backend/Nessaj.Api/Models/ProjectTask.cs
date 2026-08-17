namespace Nessaj.Api.Models;

public static class ProjectTaskStatus
{
    public const string Backlog = "backlog";
    public const string EmAndamento = "em_andamento";
    public const string EmValidacao = "em_validacao";
    public const string Concluido = "concluido";
}

public class ProjectTask
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = ProjectTaskStatus.Backlog;    
    public string AssignedTo { get; set; } = string.Empty;
    public string Priority { get; set; } = "media";
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
