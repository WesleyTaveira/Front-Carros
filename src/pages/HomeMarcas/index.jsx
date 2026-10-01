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


function HomeMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({ nome: '' });
  const navigate = useNavigate();

  const inputNome = useRef();

  async function getMarcas() {
    const marcasApi = await api.get('/marcas');
    setMarcas(marcasApi.data.data);
  }

  async function deleteMarcas(id) {
    try {
      await api.delete(`/marcas/${id}`);
      getMarcas();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível excluir a marca.';
      setError(msg);
    }
  }

  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await getMarcas();
      } catch (err) {
        const msg = err.response?.data?.message || 'Não foi possível carregar as marcas.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarcas();
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      await getMarcas();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/marcas/${searchTerm}`);

      if (response.data?.data) {
        setMarcas([response.data.data]);
      } else {
        setMarcas([]);
        setError('Marca não encontrada para o ID especificado.');
      }
    } catch (err) {
      setMarcas([]);
      const msg = err.response?.data?.message || 'Marca não encontrada ou falha na busca.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (marcaParaEditar) => {
    setEditingMarca(marcaParaEditar);
    setFormData({ nome: marcaParaEditar.nome || '' });
    setIsModalUpdateOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!editingMarca) {
      setModalError('Erro interno: nenhuma marca selecionada para edição.');
      return;
    }

    setModalError(null);
    try {
      await api.patch(`/marcas/${editingMarca.id}`, formData);
      await getMarcas();
      handleCloseModalUpdate();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível atualizar a marca.';
      setModalError(msg);
    }
  };

  async function handleFormCreateSubmit(event) {
    event.preventDefault();
    setModalError(null);

    const nomeDigitado = inputNome.current.value.trim().toUpperCase();

    try {
      await api.post('/marcas', { nome: nomeDigitado });
      await getMarcas();
      inputNome.current.value = '';
      handleCloseModalCreate();
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível criar a marca.';
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
    setEditingMarca(null);
    setFormData({ nome: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleNavigateToCarros = () => navigate('/carros');

  const renderContent = () => {
    if (isLoading) return <p className={styles['status-message']}>Carregando Marcas...</p>;
    if (error) return <p className={`${styles['status-message']} ${styles['error-message']}`}>{error}</p>;
    if (marcas.length === 0 && !searchTerm.trim()) return <h1 className={styles['empty-state-message']}>Nenhuma Marca encontrada</h1>;
    if (marcas.length === 0 && searchTerm.trim()) return <p className={styles['status-message']}>Nenhuma Marca encontrada para o ID "{searchTerm}"</p>;

    return (
      <div className={styles['marca-list']}>
        {marcas.map((marca) => (
          <div key={marca.id} className={styles['marca-card']}>
            <div className={styles['marca-info']}>
              <p><strong>ID:</strong> <span>{marca.id}</span></p>
              <p><strong>Marca:</strong> <span>{marca.nome}</span></p>
              <p><strong>Carros:</strong> <span>{(marca.carros || []).map(carro => carro.placa).join(', ')}</span></p>
            </div>
            <div>
              <button className={styles['btn-list']} aria-label="Editar marca" onClick={() => handleEditClick(marca)}>
                <EditIcon />
              </button>
              <button aria-label="Excluir marca" onClick={() => deleteMarcas(marca.id)}>
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
            <h1>Minhas Marcas</h1>
          </div>
          <div className={styles['header-actions']}>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleNavigateToCarros}>
              <ListAltIcon /> Listar Carros
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
              aria-label="Buscar por ID da Marca"
              className={styles['search-input']}
              placeholder="Buscar por ID da Marca..."
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
              onClick={() => { setSearchTerm(''); getMarcas(); }}
            >
              Limpar
            </button>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleOpenModalCreate}>
              <AddIcon /> Nova Marca
            </button>
          </div>
        </div>
      </header>

      <main className={`${styles.container} ${styles['main-content']}`}>
        {renderContent()}
      </main>

      {/* MODAL DE NOVA MARCA */}
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
            aria-labelledby="modal-create-marca-title"
            open
          >
            <div className={styles['modal-header']}>
              <h2 id="modal-create-marca-title">Nova Marca</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} aria-label="Fechar modal" onClick={handleCloseModalCreate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles['modal-subtitle']}>Preencha os dados da nova Marca</p>
            {modalError && <p className={`${styles['status-message']} ${styles['error-message']}`}>{modalError}</p>}
            <form className={styles['modal-form']} onSubmit={handleFormCreateSubmit}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="nome-create" className={styles['form-label']}>Nome</label>
                  <input type="text" id="nome-create" name="nome" placeholder="Ex: Fiat" ref={inputNome} required className={styles['form-input']} />
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

      {/* MODAL DE ATUALIZAR MARCA */}
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
            aria-labelledby="modal-update-marca-title"
            open
          >
            <div className={styles['modal-header']}>
              <h2 id="modal-update-marca-title">Atualizar Marca</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} aria-label="Fechar modal" onClick={handleCloseModalUpdate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles['modal-subtitle']}>Atualize os dados da Marca</p>
            {modalError && <p className={`${styles['status-message']} ${styles['error-message']}`}>{modalError}</p>}
            <form className={styles['modal-form']} onSubmit={handleFormUpdateSubmit}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="nome-update" className={styles['form-label']}>Nome</label>
                  <input type="text" id="nome-update" name="nome" placeholder="Ex: Fiat" value={formData.nome} onChange={handleFormChange} className={styles['form-input']} />
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

export default HomeMarcas;
