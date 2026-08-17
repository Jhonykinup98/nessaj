import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import Sidebar from '../components/Sidebar'
import { getDashboardSummary } from '../services/api'

const STATUS_LABELS = {
  planejado: 'Planejado',
  em_andamento: 'Em andamento',
  atrasado: 'Atrasado',
  concluido: 'Concluído'
}

const STATUS_COLORS = {
  planejado: '#6B7086',
  em_andamento: '#3E63DD',
  atrasado: '#D9483C',
  concluido: '#1E9E6B'
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary()
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false))
  }, [])

  const pieData = summary?.projectsByStatus.map((s) => ({
    name: STATUS_LABELS[s.status] || s.status,
    value: s.count,
    color: STATUS_COLORS[s.status] || '#6B7086'
  })) || []

  const barData = summary?.tasksByAssignee.map((a) => ({
    name: a.assignee,
    tarefas: a.count
  })) || []

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral dos projetos e indicadores</p>

        {loading && <p>Carregando indicadores...</p>}

        {!loading && summary && (
          <>
            <div className="stat-grid">
              <div className="stat-card">
                <p className="stat-label">Projetos ativos</p>
                <p className="stat-value">{summary.totalProjects}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Projetos atrasados</p>
                <p className="stat-value overdue">{summary.projectsOverdue}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Tarefas em aberto</p>
                <p className="stat-value">{summary.tasksOpen}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Progresso médio</p>
                <p className="stat-value">{summary.averageProgress}%</p>
              </div>
            </div>

            <div className="chart-grid">
              <div className="chart-card">
                <h3>Tarefas por responsável</h3>
                {barData.length === 0 ? (
                  <p style={{ color: 'var(--ink-muted)' }}>Sem tarefas cadastradas ainda.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="tarefas" fill="#3E63DD" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="chart-card">
                <h3>Projetos por status</h3>
                {pieData.length === 0 ? (
                  <p style={{ color: 'var(--ink-muted)' }}>Sem projetos cadastrados ainda.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
