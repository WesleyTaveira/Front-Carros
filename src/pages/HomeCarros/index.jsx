import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css'; // Usa CSS Modules
import api from '../../services/api';

// --- Ícones ---
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrashIcon from '@mui/icons-material/Delete';


// --- Componente Principal ---
function HomeCarros() {
  const [carros, setCarros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Para o modal
  const navigate = useNavigate();

  const inputPlaca = useRef()
  const inputAno = useRef()
  const inputModelo = useRef()
  const inputMarca = useRef()

  async function getCarros() {
    const carrosApi = await api.get('/carros')

    setCarros(carrosApi.data.data)
  }

  async function createCarros() {
      await api.post('/carros', {
        placa: inputPlaca.current.value,
        ano: inputAno.current.value,
        modelo: inputModelo.current.value,
        marca: inputMarca.current.value
      })
  
      getCarros()
  
  }

  async function deleteCarros(id) {
      await api.delete(`/carros/${id}`)
  
      getCarros()
  }

  useEffect(() => {
    const fetchCarros = async () => {
      setIsLoading(true); setError(null);
      console.log("Buscando todos os carros...");
      await new Promise(resolve => setTimeout(resolve, 500));
      getCarros();
      setIsLoading(false);
    };
    fetchCarros();
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); setError(null);
    await new Promise(resolve => setTimeout(resolve, 300));
    const carroEncontrado = carros.find(c => c.id === searchTerm);
    setCarros(carroEncontrado ? [carroEncontrado] : []);
    setIsLoading(false);
    if (!carroEncontrado && searchTerm.trim()) setError("Carro não encontrado para o ID especificado."); else setError(null);
  };

  const handleOpenModal = () => setIsModalOpen(true); // Abre o modal
  const handleCloseModal = () => setIsModalOpen(false); // Fecha o modal

  /*const handleAddCarro = (event) => {
     event.preventDefault();
     console.log("Lógica para adicionar carro no backend.");
     // Simulação de adição
     const novoCarroId = (carros.length + 1).toString();
     const novoCarro = { id: novoCarroId, marca: "Novo", modelo: "Veículo", placa: "XXX-0000" };
     setCarros(prev => [...prev, novoCarro]);
     handleCloseModal();
  };*/

  const handleLogout = () => {
    navigate('/');
  };
  const handleNavigateToMarcas = () => {
    navigate('/carros/marcas'); 
  };

  const renderContent = () => {
    if (isLoading) return <p className={styles['status-message']}>Carregando veículos...</p>;
    if (error) return <p className={`${styles['status-message']} ${styles['error-message']}`}>{error}</p>;
    if (carros.length === 0 && !searchTerm.trim()) return <h1 className={styles['empty-state-message']}>Nenhum veículo encontrado</h1>;
    if (carros.length === 0 && searchTerm.trim()) return <p className={styles['status-message']}>Nenhum veículo encontrado para o ID "{searchTerm}"</p>;

    return (
      <div className={styles['car-list']}>
        {carros.map((carro) => (
          <div key={carro.id} className={styles['car-card']}>
          <div className={styles['car-info']}>
            <p><strong>ID:</strong> <span>{carro.id}</span></p>
            <p><strong>Marca:</strong> <span>{carro.marca.nome}</span></p>
            <p><strong>Modelo:</strong> <span>{carro.modelo}</span></p>
            <p><strong>Placa:</strong> <span>{carro.placa}</span></p>
          </div>
          <button >
              <TrashIcon onClick={() => deleteCarros(carro.id)}/>
          </button>
        </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles['page-container']}>
      {/* CABEÇALHO */}
      <header className={styles['app-header']}>
        <div className={`${styles.container} ${styles['header-content']}`}>
          <div className={styles['logo-title']}>
            <div className={styles.logo}><DirectionsCarIcon /></div>
            <h1>Meus Veículos</h1>
          </div>
          <div className={styles['header-actions']}>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleNavigateToMarcas}> {/* Classe alterada */}
              <ListAltIcon /> Listar Marcas
            </button>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleLogout}> {/* Classe alterada */}
              <LogoutIcon /> Sair
            </button>
          </div>
        </div>
      </header>
      <header className={styles['search-header']}>
        <div className={`${styles.container} ${styles['header-content']}`}>
        <div className={styles['search-bar']}>
              <SearchIcon className={styles['search-icon']} />
              <input
                type="text"
                className={styles['search-input']}
                placeholder="Buscar por ID do veículo..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
          </div>
          <div className={styles['header-actions']}>
          <button type="submit" className={`${styles.btn} ${styles['btn-secondary']} ${styles['btn-search-submit']}`}>
               Buscar
            </button>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleOpenModal}>
            <AddIcon /> Novo Veículo
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={`${styles.container} ${styles['main-content']}`}>

        {/* LISTA DE CARROS OU ESTADO VAZIO */}
        {renderContent()}
      </main>

      {/* MODAL DE NOVO VEÍCULO (Ajuste o conteúdo do seu modal aqui) */}
      {isModalOpen && (
         <div className={styles["modal-overlay"]} onClick={handleCloseModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>Novo Veículo</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Preencha os dados do novo veículo</p>
            <form className={styles["modal-form"]} >
              <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                      <label htmlFor="marca" className={styles['form-label']}>Marca</label>
                      <input type="text" id="marca" name="marca" placeholder="Id da Marca" ref={inputMarca} required className={styles['form-input']} />
                  </div>
                   <div className={styles['form-group']}>
                      <label htmlFor="modelo" className={styles['form-label']}>Modelo</label>
                      <input type="text" id="modelo" name="modelo" placeholder="Ex: Corolla" ref={inputModelo} required className={styles['form-input']} />
                  </div>
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="ano" className={styles['form-label']}>Ano</label>
                  <input type="number" id="ano" name="ano" placeholder="2025" ref={inputAno} required className={styles['form-input']} />
                </div>
                 <div className={styles['form-group']}>
                  <label htmlFor="placa" className={styles['form-label']}>Placa</label>
                  <input type="text" id="placa" name="placa" placeholder="ABC-1234" ref={inputPlaca} required className={styles['form-input']} />
                </div>
              </div>

              <div className={styles["modal-actions"]}>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleCloseModal} >
                  Cancelar
                </button>
                <button type="submit" onClick={createCarros} className={`${styles.btn} ${styles['btn-primary']}`}>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeCarros;