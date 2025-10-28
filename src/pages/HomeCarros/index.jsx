import styles from './style.module.css'
import { api } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function HomeCarros() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/home').then(res => setMsg(JSON.stringify(res.data))).catch(err => {
          console.error(err);
        });
      }, []);
    
      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');
      };


    return(
        <div>
            <h1>Home Carros</h1>
            <pre>{msg}</pre>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default HomeCarros;