import styles from './style.module.css'
import { api } from '../../services/api'
import { useNavigate, Link} from 'react-router-dom'
import { useState } from 'react';

function HomeMarcas() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    
      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');
      };


    return(
        <div>
            <h1>Home Marcas</h1>
            <pre>{msg}</pre>
            <button onClick={handleLogout}>Logout</button>
            <nav>
                <Link to="/carros" > Lista de Carros</Link>
            </nav>
        </div>
    )
}

export default HomeMarcas;