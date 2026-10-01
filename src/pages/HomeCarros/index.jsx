import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import api from '../../services/api';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrashIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditRounded';


function HomeCarros() {
  const [carros, setCarros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
  });
  const navigate = useNavigate();

  const inputPlaca = useRef();
  const inputAno = useRef();
  const inputModelo = useRef();
  const inputMarca = useRef();

  async function getCarros() {
    const carrosApi = await api.get('/carros');
    setCarros(carrosApi.data.data);
  }

  async function deleteCarros(id) {
    try {
      await api.delete(`/carros/${id}`);
      getCarros();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível excluir o veículo.';
      setError(msg);
    }
  }

  useEffect(() => {
    const fetchCarros = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await getCarros();
      } catch (err) {
        const msg = err.response?.data?.message || 'Não foi possível carregar os veículos.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarros();
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      await getCarros();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/carros/${searchTerm}`);

      if (response.data?.data) {
        setCarros([response.data.data]);
      } else {
        setCarros([]);
        setError('Veículo não encontrado para o ID especificado.');
      }
    } catch (err) {
      setCarros([]);
      const msg = err.response?.data?.message || 'Veículo não encontrado ou falha na busca.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (carroParaEditar) => {
    setEditingCar(carroParaEditar);
    setFormData({
      marca: carroParaEditar.marca.id || '',
      modelo: carroParaEditar.modelo || '',
      ano: carroParaEditar.ano || '',
      placa: carroParaEditar.placa || '',
    });
    setIsModalUpdateOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!editingCar) {
      setModalError('Erro interno: nenhum veículo selecionado para edição.');
      return;
    }

    setModalError(null);
    try {
      await api.patch(`/carros/${editingCar.id}`, formData);
      await getCarros();
      handleCloseModalUpdate();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível atualizar o veículo.';
      setModalError(msg);
    }
  };

  async function handleFormCreateSubmit(event) {
    event.preventDefault();
    setModalError(null);

    const placaDigitada = inputPlaca.current.value.trim().toUpperCase();

    try {
      await api.post('/carros', {
        placa: placaDigitada,
        ano: inputAno.current.value,
        modelo: inputModelo.current.value,
        marca: inputMarca.current.value,
      });

      await getCarros();

      inputPlaca.current.value = '';
      inputAno.current.value = '';
      inputModelo.current.value = '';
      inputMarca.current.value = '';
      handleCloseModalCreate();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível criar o veículo.';
      setModalError(msg);
    }
  }

  const handleOpenModalCreate = () => {
    setModalError(null);
    setIsModalCreateOpen(true);
  };
  const handleCloseModalCreate = () => {
    setModalError(null);
    setIsModalCreateOpen(false);
  };

  const handleCloseModalUpdate = () => {
    setModalError(null);
    setIsModalUpdateOpen(false);
    setEditingCar(null);
    setFormData({ marca: '', modelo: '', ano: '', placa: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleNavigateToMarcas = () => navigate('/carros/marcas');

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
              <p><strong>Ano:</strong> <span>{carro.ano}</span></p>
              <p><strong>Placa:</strong> <span>{carro.placa}</span></p>
            </div>
            <div>
              <button className={styles['btn-list']} aria-label="Editar veículo" onClick={() => handleEditClick(carro)}>
                <EditIcon />
              </button>
              <button aria-label="Excluir veículo" onClick={() => deleteCarros(carro.id)}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles['page-container']}>
      <header className={styles['app-header']}>
        <div className={`${styles.container} ${styles['header-content']}`}>
          <div className={styles['logo-title']}>
            <div className={styles.logo}><DirectionsCarIcon /></div>
            <h1>Meus Veículos</h1>
          </div>
          <div className={styles['header-actions']}>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleNavigateToMarcas}>
              <ListAltIcon /> Listar Marcas
            </button>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleLogout}>
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
              aria-label="Buscar por ID do veículo"
              className={styles['search-input']}
              placeholder="Buscar por ID do veículo..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles['header-actions']}>
            <button
              type="button"
              className={`${styles.btn} ${styles['btn-secondary']} ${styles['btn-search-submit']}`}
              onClick={handleSearchSubmit}
            >
              Buscar
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles['btn-secondary']} ${styles['btn-search-submit']}`}
              onClick={() => { setSearchTerm(''); getCarros(); }}
            >
              Limpar
            </button>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleOpenModalCreate}>
              <AddIcon /> Novo Veículo
            </button>
          </div>
        </div>
      </header>

      <main className={`${styles.container} ${styles['main-content']}`}>
        {renderContent()}
      </main>

      {/* MODAL DE NOVO VEÍCULO */}
      {isModalCreateOpen && (
        <div className={styles['modal-overlay']}>
          <button
            type="button"
            className={styles['modal-backdrop']}
            aria-label="Fechar modal"
            onClick={handleCloseModalCreate}
          />
          <dialog
            className={styles['modal-content']}
            aria-labelledby="modal-create-carro-title"
            open
          >
            <div className={styles['modal-header']}>
              <h2 id="modal-create-carro-title">Novo Veículo</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} aria-label="Fechar modal" onClick={handleCloseModalCreate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles['modal-subtitle']}>Preencha os dados do novo veículo</p>
            {modalError && <p className={`${styles['status-message']} ${styles['error-message']}`}>{modalError}</p>}
            <form className={styles['modal-form']} onSubmit={handleFormCreateSubmit}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="marca-create" className={styles['form-label']}>Marca</label>
                  <input type="text" id="marca-create" name="marca" placeholder="Id da Marca" ref={inputMarca} required className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="modelo-create" className={styles['form-label']}>Modelo</label>
                  <input type="text" id="modelo-create" name="modelo" placeholder="Ex: Corolla" ref={inputModelo} required className={styles['form-input']} />
                </div>
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="ano-create" className={styles['form-label']}>Ano</label>
                  <input type="number" id="ano-create" name="ano" placeholder="2025" ref={inputAno} required className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="placa-create" className={styles['form-label']}>Placa</label>
                  <input type="text" id="placa-create" name="placa" placeholder="ABC-1234" ref={inputPlaca} required className={styles['form-input']} />
                </div>
              </div>
              <div className={styles['modal-actions']}>
                <button type="button" className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleCloseModalCreate}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
                  Adicionar
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}

      {/* MODAL DE ATUALIZAR VEÍCULO */}
      {isModalUpdateOpen && (
        <div className={styles['modal-overlay']}>
          <button
            type="button"
            className={styles['modal-backdrop']}
            aria-label="Fechar modal"
            onClick={handleCloseModalUpdate}
          />
          <dialog
            className={styles['modal-content']}
            aria-labelledby="modal-update-carro-title"
            open
          >
            <div className={styles['modal-header']}>
              <h2 id="modal-update-carro-title">Atualizar Veículo</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} aria-label="Fechar modal" onClick={handleCloseModalUpdate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles['modal-subtitle']}>Atualize os dados do veículo</p>
            {modalError && <p className={`${styles['status-message']} ${styles['error-message']}`}>{modalError}</p>}
            <form className={styles['modal-form']} onSubmit={handleFormUpdateSubmit}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="marca-update" className={styles['form-label']}>Marca</label>
                  <input type="text" id="marca-update" name="marca" placeholder="Id da Marca" value={formData.marca} onChange={handleFormChange} className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="modelo-update" className={styles['form-label']}>Modelo</label>
                  <input type="text" id="modelo-update" name="modelo" placeholder="Ex: Corolla" value={formData.modelo} onChange={handleFormChange} className={styles['form-input']} />
                </div>
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="ano-update" className={styles['form-label']}>Ano</label>
                  <input type="number" id="ano-update" name="ano" placeholder="2025" value={formData.ano} onChange={handleFormChange} className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="placa-update" className={styles['form-label']}>Placa</label>
                  <input type="text" id="placa-update" name="placa" placeholder="ABC1234" value={formData.placa} onChange={handleFormChange} className={styles['form-input']} />
                </div>
              </div>
              <div className={styles['modal-actions']}>
                <button type="button" className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleCloseModalUpdate}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
                  Atualizar
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </div>
  );
}

export default HomeCarros;
