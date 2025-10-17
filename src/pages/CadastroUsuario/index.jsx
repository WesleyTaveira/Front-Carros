import './style.css'
import Trash from '@mui/icons-material/Delete'

function CadastroUsuario() {

  const users = [
    {
      id: '1',
      name: 'Carlos',
      age: 33,
      email: 'carlos@email.com,'

    },
    {
      id: '2',
      name: 'Marcos',
      age: 25,
      email: 'mar@email.com,'

    }
  ]

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input name='Nome' type='text' />
        <input name='idade' type='number' />
        <input name='email' type='email' />
        <button type='button'>Cadastrar</button>
      </form>


      {users.map((user) => (
        <div key={user.id}>
          <div>
            <p>Nome:{user.name}</p>
            <p>Idade: {user.age}</p>
            <p>Email: {user.email}</p>
          </div>
          <button>
            <img src={Trash} />
          </button>
        </div>
      ))}


    </div>
  )
}

export default CadastroUsuario
