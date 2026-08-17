import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await loginUser({ email, password })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao entrar.')
    }
  }

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <h1 className="auth-title">NESSAJ</h1>
        <p className="auth-subtitle">Entrar na plataforma</p>

        <form onSubmit={handleSubmit}>
          <FormInput label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Entrar
          </button>
        </form>

        <p className="footer-text">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
