import './style.css'
import Trash from '../../assets/trash.svg'

function CadastroUsuario() {
 

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input name='Nome' type='text'/>
        <input name='idade' type='number'/>
        <input name='email' type='email'/>
        <button type='button'>Cadastrar</button>
      </form>

      <div>
        <div>
          <p>Nome:</p>
          <p>Idade:</p>
          <p>Email:</p>
        </div>
        <button>
          <img src={Trash}/>
        </button>

      </div>


    </div>
  )
}

export default CadastroUsuario
