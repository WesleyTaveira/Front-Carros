import './style.css'
import Trash from '@mui/icons-material/Delete'

function CadastroUsuario() {

  const users = [
    {
      id: '1',
      name: 'Carlos',
      pwd: '123',
      email: 'carlos@email.com'

    },
    {
      id: '2',
      name: 'Marcos',
      pwd: '1234',
      email: 'marcos@email.com'

    },
    {
      id: '3',
      name: 'Julio',
      pwd: '12345',
      email: 'julio@email.com'

    }
  ]

  return (
    <div className='container'>
      <form>
        <h1 className="titulo-principal">Cadastro de Usuários</h1>
        <h1 className="subtitulos">Nome</h1>
        <input placeholder='Ex: Wesley' name='Nome' type='text' />

        <h1 className="subtitulos">Senha</h1>
        <input placeholder='Ex: 12345' name='senha' type='type' />

        <h1 className="subtitulos">Email</h1>
        <input placeholder='Ex: wesley@gmail.com' name='email' type='email' />
        <button type='button'>Cadastrar</button>
      </form>


      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Senha: <span>{user.pwd}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button>
            <img src={Trash} />
          </button>
        </div>
      ))}


    </div>
  )
}

export default CadastroUsuario;
