import { useState } from 'react'
import styles from './style.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'



function Login() {
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault();
        setErro('');
        try {
          const res = await api.post('/auth/login', { email, senha });
          const token = res.data.access_token;
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
          navigate('/home');
        } catch (err) {
          console.error(err);
          setErro('Email ou senha incorretos');
        }
      }
 
    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.container}>
                <form onSubmit={handleLogin}>
                    <h1 className={styles['titulo-principal']}>Login de Usuário</h1>
                    <h1 className={styles.subtitulos}>Email</h1>
                    <input placeholder='Digite o seu email' type='email' value ={email} onChange={e => setEmail(e.target.value)} required />
                    <h1 className={styles.subtitulos}>Senha</h1>
                    <input placeholder='Digite a sua senha' type='password' value={senha} onChange={e => setSenha(e.target.value)} required />
                    <button type='submit'>Entrar</button>
                    {erro && <p style={{ color: 'red' }}>{erro}</p>}
                </form>
                <div className={styles.cadastro}>
                    <h1 className={styles.subtitulos}>Não tem uma conta?</h1>
                    <nav>
                        <Link to="/cadastro" className={styles['cadastre-se']}>Cadastre-se</Link>
                    </nav>
                </div>
            </div>

        </div>
    )
}

export default Login;