namespace Nessaj.Api.Models;

public static class ProjectStatus
{
    public const string Planejado = "planejado";
    public const string EmAndamento = "em_andamento";
    public const string Atrasado = "atrasado";
    public const string Concluido = "concluido";
}

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Responsible { get; set; } = string.Empty;
    public string ClientArea { get; set; } = string.Empty;
    public string Status { get; set; } = ProjectStatus.Planejado;
    public string Priority { get; set; } = "media";
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? Deadline { get; set; }
    public int ProgressPercent { get; set; } = 0;
    public decimal? BudgetPlanned { get; set; }
    public decimal? BudgetActual { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ProjectTask> Tasks { get; set; } = new();
}
