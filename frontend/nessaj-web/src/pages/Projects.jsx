import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FormInput from '../components/FormInput'
import { useAuth } from '../context/AuthContext'
import { getProjects, createProject } from '../services/api'

const STATUS_LABELS = {
  planejado: 'Planejado',
  em_andamento: 'Em andamento',
  atrasado: 'Atrasado',
  concluido: 'Concluído'
}

const emptyForm = {
  name: '', responsible: '', clientArea: '', status: 'planejado',
  priority: 'media', startDate: '', deadline: '', progressPercent: 0,
  budgetPlanned: '', budgetActual: ''
}

export default function Projects() {
  const { user } = useAuth()
  const canManage = user?.role === 'admin' || user?.role === 'gestor'

 const [projects, setProjects] = useState([])
const [loading, setLoading] = useState(true)
const [showForm, setShowForm] = useState(false)
const [form, setForm] = useState(emptyForm)
const [error, setError] = useState('')

function loadProjects() {
  getProjects().then(({ data }) => setProjects(data)).finally(() => setLoading(false))
}

useEffect(() => { loadProjects() }, [])

function update(field) {
  return (e) => setForm({ ...form, [field]: e.target.value })
}

async function handleCreate(e) {
  e.preventDefault()
  setError('')
  try {
    await createProject({
      ...form,
      progressPercent: Number(form.progressPercent),
      budgetPlanned: form.budgetPlanned ? Number(form.budgetPlanned) : null,
      budgetActual: form.budgetActual ? Number(form.budgetActual) : null,
      deadline: form.deadline || null
    })
    setForm(emptyForm)
    setShowForm(false)
    loadProjects()
  } catch (err) {
    setError(err.response?.data?.message || 'Erro ao criar o projeto.')
  }
}

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <div className="card-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Projetos</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Todos os projetos cadastrados</p>
          </div>
          {canManage && (
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : '+ Novo projeto'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="card">
            <form onSubmit={handleCreate}>
              <FormInput label="Nome do projeto" value={form.name} onChange={update('name')} />
              <FormInput label="Responsável" value={form.responsible} onChange={update('responsible')} />
              <FormInput label="Cliente / Área" value={form.clientArea} onChange={update('clientArea')} />

              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={update('status')}>
                  <option value="planejado">Planejado</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>

              <div className="field">
                <label>Prioridade</label>
                <select value={form.priority} onChange={update('priority')}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <FormInput label="Data de início" type="date" value={form.startDate} onChange={update('startDate')} />
              <FormInput label="Prazo" type="date" value={form.deadline} onChange={update('deadline')} required={false} />
              <FormInput label="% concluído" type="number" value={form.progressPercent} onChange={update('progressPercent')} />
              <FormInput label="Orçamento previsto" type="number" value={form.budgetPlanned} onChange={update('budgetPlanned')} required={false} />
              <FormInput label="Orçamento realizado" type="number" value={form.budgetActual} onChange={update('budgetActual')} required={false} />
              

              
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="btn-primary">Salvar projeto</button>
            </form>
          </div>
        )}

        <div className="card">
          {loading && <p>Carregando...</p>}
          {!loading && projects.length === 0 && <p style={{ color: 'var(--ink-muted)' }}>Nenhum projeto cadastrado ainda.</p>}
          {!loading && projects.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Prazo</th>
                  <th>Tarefas</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/projetos/${p.id}`}>{p.name}</Link></td>
                    <td>{p.responsible}</td>
                    <td><span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status] || p.status}</span></td>
                    <td>{p.progressPercent}%</td>
                    <td>{p.deadline ? new Date(p.deadline).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>{p.taskCount}</td>
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