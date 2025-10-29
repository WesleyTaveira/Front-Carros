import { useEffect, useState, useRef } from 'react'
import styles from './style.module.css'
import Trash from '@mui/icons-material/DeleteRounded'
import api from '../../services/api'
import { Link } from 'react-router-dom'


function CadastroUsuario() {

  const [users, setUsers] = useState([])

  const inputNome = useRef()
  const inputSenha = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersApi = await api.get('/usuarios')

    setUsers(usersApi.data.data)
  }

  async function createUsers() {
    await api.post('/usuarios', {
      nome: inputNome.current.value,
      senha: inputSenha.current.value,
      email: inputEmail.current.value
    })

    getUsers()

  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className={styles.cadastroPageWrapper}>
      <div className={styles.container}>
        <form>
          <h1 className={styles['titulo-principal']}>Cadastro de Usuários</h1>
          <h1 className={styles.subtitulos}>Nome</h1>
          <input placeholder='Ex: Wesley' name='nome' type='text' ref={inputNome} required/>

          <h1 className={styles.subtitulos}>Senha</h1>
          <input placeholder='Digite a sua senha' name='senha' type='password' ref={inputSenha} required/>

          <h1 className={styles.subtitulos}>Email</h1>
          <input placeholder='Ex: wesley@gmail.com' name='email' type='email' ref={inputEmail} required/>
          <button type='submit' onClick={createUsers}>Cadastrar</button>
        </form>


        {users.map((user) => (
          <div key={user.id} className={styles.card}>
            <div>
              <p>Id: <span>{user.id}</span></p>
              <p>Nome: <span>{user.nome}</span></p>
              <p>Email: <span>{user.email}</span></p>
            </div>
            <button onClick={() => deleteUsers(user.id)}>
              <Trash />
            </button>
          </div>
        ))}

        <div className={styles.login}>
          <h1 className={styles.subtitulos}>Tem uma conta?</h1>
          <nav>
            <Link to="/" className={styles['conecte-se']}> Conecte-se </Link>
          </nav>
        </div>
      </div>

    </div>


  )
}

export default CadastroUsuario;
