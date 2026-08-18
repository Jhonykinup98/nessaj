using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nessaj.Api.Data;
using Nessaj.Api.Models;
using Nessaj.Api.Models.DTOs;

namespace Nessaj.Api.Controllers;

[ApiController]
[Route("projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) => _db = db;

    private bool CanManage => User.IsInRole(Roles.Admin) || User.IsInRole(Roles.Gestor);

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _db.Projects
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectResponse(
                p.Id, p.Name, p.Responsible, p.ClientArea, p.Status, p.Priority,
                p.StartDate, p.Deadline, p.ProgressPercent, p.BudgetPlanned, p.BudgetActual,
                p.Tasks.Count))
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(Guid id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        return Ok(new ProjectResponse(
            project.Id, project.Name, project.Responsible, project.ClientArea, project.Status,
            project.Priority, project.StartDate, project.Deadline, project.ProgressPercent,
            project.BudgetPlanned, project.BudgetActual, project.Tasks.Count));
    }
    [HttpPost]
    public async Task<IActionResult> CreateProject(CreateProjectRequest request)
    {
        if (!CanManage) return Forbid();

        var project = new Project
        {
            Name = request.Name,
            Responsible = request.Responsible,
            ClientArea = request.ClientArea,
            Status = request.Status,
            Priority = request.Priority,
            StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc),
            Deadline = request.Deadline.HasValue
                ? DateTime.SpecifyKind(request.Deadline.Value, DateTimeKind.Utc)
                : null,
            ProgressPercent = request.ProgressPercent,
            BudgetPlanned = request.BudgetPlanned,
            BudgetActual = request.BudgetActual,
            CreatedAt = DateTime.UtcNow 
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return Ok(new ProjectResponse(
            project.Id, project.Name, project.Responsible, project.ClientArea, project.Status,
            project.Priority, project.StartDate, project.Deadline, project.ProgressPercent,
            project.BudgetPlanned, project.BudgetActual, 0));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, UpdateProjectRequest request)
    {
        if (!CanManage) return Forbid();

        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        project.Name = request.Name;
        project.Responsible = request.Responsible;
        project.ClientArea = request.ClientArea;
        project.Status = request.Status;
        project.Priority = request.Priority;
        project.StartDate = request.StartDate;
        project.Deadline = request.Deadline;
        project.ProgressPercent = request.ProgressPercent;
        project.BudgetPlanned = request.BudgetPlanned;
        project.BudgetActual = request.BudgetActual;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Projeto atualizado." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        if (!User.IsInRole(Roles.Admin)) return Forbid();

        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Projeto removido." });
    }
}
