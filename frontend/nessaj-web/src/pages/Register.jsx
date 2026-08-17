import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { registerUser } from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar.')
    }
  }

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <h1 className="auth-title">Criar conta</h1>
        <p className="auth-subtitle">Acesso inicial como usuário</p>

        <form onSubmit={handleSubmit}>
          <FormInput label="Nome" value={form.name} onChange={update('name')} />
          <FormInput label="E-mail" type="email" value={form.email} onChange={update('email')} />
          <FormInput label="Senha" type="password" value={form.password} onChange={update('password')} />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Cadastrar
          </button>
        </form>

        <p className="footer-text">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
