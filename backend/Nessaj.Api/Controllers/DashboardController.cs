using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nessaj.Api.Data;
using Nessaj.Api.Models;
using Nessaj.Api.Models.DTOs;

namespace Nessaj.Api.Controllers;

[ApiController]
[Route("dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var projects = await _db.Projects.ToListAsync();
        var tasks = await _db.Tasks.ToListAsync();

        var totalProjects = projects.Count;

        var overdue = projects.Count(p =>
            p.Deadline.HasValue &&
            p.Deadline.Value < DateTime.UtcNow &&
            p.Status != ProjectStatus.Concluido);

        var openTasks = tasks.Count(t => t.Status != ProjectTaskStatus.Concluido);

        var averageProgress = projects.Count > 0
            ? Math.Round(projects.Average(p => p.ProgressPercent), 1)
            : 0;

        var byStatus = projects
            .GroupBy(p => p.Status)
            .Select(g => new StatusCount(g.Key, g.Count()))
            .ToList();

        var byAssignee = tasks
            .Where(t => !string.IsNullOrWhiteSpace(t.AssignedTo))
            .GroupBy(t => t.AssignedTo)
            .Select(g => new AssigneeCount(g.Key, g.Count()))
            .OrderByDescending(a => a.Count)
            .ToList();

        var summary = new DashboardSummary(
            totalProjects, overdue, openTasks, averageProgress, byStatus, byAssignee);

        return Ok(summary);
    }
}
