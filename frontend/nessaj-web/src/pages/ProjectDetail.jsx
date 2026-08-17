import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import FormInput from '../components/FormInput'
import { getProject, getTasks, createTask, updateTask } from '../services/api'

const STATUS_LABELS = {
  backlog: 'Backlog',
  em_andamento: 'Em andamento',
  em_validacao: 'Em validação',
  concluido: 'Concluído'
}

const emptyForm = { title: '', description: '', status: 'backlog', assignedTo: '', priority: 'media', deadline: '' }

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function load() {
    getProject(id).then(({ data }) => setProject(data))
    getTasks(id).then(({ data }) => setTasks(data))
  }

  useEffect(() => { load() }, [id])

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleCreate(e) {
    e.preventDefault()
    await createTask({ ...form, projectId: id, deadline: form.deadline || null })
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  async function handleStatusChange(task, newStatus) {
    await updateTask(task.id, { ...task, status: newStatus })
    load()
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Link to="/projetos" style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>← Voltar para projetos</Link>

        {project && (
          <>
            <h1 className="page-title" style={{ marginTop: '0.6rem' }}>{project.name}</h1>
            <p className="page-subtitle">
              {project.responsible} · {project.clientArea} · {project.progressPercent}% concluído
            </p>
          </>
        )}

        <div className="card-header">
          <h3 style={{ margin: 0 }}>Tarefas</h3>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Nova tarefa'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <form onSubmit={handleCreate}>
              <FormInput label="Título" value={form.title} onChange={update('title')} />
              <FormInput label="Descrição" value={form.description} onChange={update('description')} required={false} />
              <FormInput label="Responsável" value={form.assignedTo} onChange={update('assignedTo')} />

              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={update('status')}>
                  <option value="backlog">Backlog</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="em_validacao">Em validação</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>

              <FormInput label="Prazo" type="date" value={form.deadline} onChange={update('deadline')} required={false} />

              <button type="submit" className="btn-primary">Salvar tarefa</button>
            </form>
          </div>
        )}

        <div className="card">
          {tasks.length === 0 && <p style={{ color: 'var(--ink-muted)' }}>Nenhuma tarefa cadastrada ainda.</p>}
          {tasks.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.assignedTo}</td>
                    <td>
                      <select value={t.status} onChange={(e) => handleStatusChange(t, e.target.value)}>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>{t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
