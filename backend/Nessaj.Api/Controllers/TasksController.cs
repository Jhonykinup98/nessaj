using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nessaj.Api.Data;
using Nessaj.Api.Models;
using Nessaj.Api.Models.DTOs;

namespace Nessaj.Api.Controllers;

[ApiController]
[Route("tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] Guid? projectId)
    {
        var query = _db.Tasks.Include(t => t.Project).AsQueryable();
        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TaskResponse(
                t.Id, t.ProjectId, t.Project!.Name, t.Title, t.Description,
                t.Status, t.AssignedTo, t.Priority, t.Deadline, t.CreatedAt))
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskRequest request)
    {
        var project = await _db.Projects.FindAsync(request.ProjectId);
        if (project is null) return NotFound(new { message = "Projeto não encontrado." });

        var task = new ProjectTask
        {
            ProjectId = request.ProjectId,
            Title = request.Title,
            Description = request.Description,
            Status = request.Status,
            AssignedTo = request.AssignedTo,
            Priority = request.Priority,
            Deadline = request.Deadline.HasValue
                ? DateTime.SpecifyKind(request.Deadline.Value, DateTimeKind.Utc)
                : null
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return Ok(new TaskResponse(
            task.Id, task.ProjectId, project.Name, task.Title, task.Description,
            task.Status, task.AssignedTo, task.Priority, task.Deadline, task.CreatedAt));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, UpdateTaskRequest request)
    {
        var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id);
        if (task is null) return NotFound();

        task.Title = request.Title;
        task.Description = request.Description;
        task.Status = request.Status;
        task.AssignedTo = request.AssignedTo;
        task.Priority = request.Priority;
        task.Deadline = request.Deadline.HasValue
            ? DateTime.SpecifyKind(request.Deadline.Value, DateTimeKind.Utc)
            : null;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Tarefa atualizada." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Tarefa removida." });
    }
}
