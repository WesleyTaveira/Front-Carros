import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import api from '../../services/api';

// --- Ícones ---
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrashIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditRounded';


// --- Componente Principal ---
function HomeCarros() {
  const [carros, setCarros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false); // Para o modal
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
  });
  const navigate = useNavigate();

  const inputPlaca = useRef()
  const inputAno = useRef()
  const inputModelo = useRef()
  const inputMarca = useRef()

  async function getCarros() {
    const carrosApi = await api.get('/carros')

    setCarros(carrosApi.data.data)
  }



  async function deleteCarros(id) {
    await api.delete(`/carros/${id}`)

    getCarros()
  }

  useEffect(() => {
    const fetchCarros = async () => {
      setIsLoading(true);
      setError(null);
      console.log("Buscando todos os carros...");
      await new Promise(resolve => setTimeout(resolve, 500)); // Seu delay

      try {
        await getCarros();
      } catch (e) {
        console.error("Falha ao buscar carros:", e);
        setError("Não foi possível carregar os veículos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarros();
  }, []); // O array vazio está correto, para rodar só uma vez.

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = async (event) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Se a barra de busca estiver vazia, recarrega todos os carros
    if (!searchTerm.trim()) {
      console.log("Busca vazia, recarregando todos os veículos...");
      await getCarros();
      return;
    }

    // Inicia o estado de carregamento
    setIsLoading(true);
    setError(null);
    console.log(`Buscando veículo com ID: ${searchTerm}`);

    try {
      const response = await api.get(`/carros/${searchTerm}`);

      console.log("Resposta da API (busca por ID):", response);

      if (response.data && response.data.data) {
        setCarros([response.data.data]); // Coloca o carro encontrado (em um array) no estado
      } else {
        setCarros([]);
        setError("Veículo não encontrado para o ID especificado.");
      }

    } catch (e) {
      console.error("Falha ao buscar veículo por ID:", e);
      setCarros([]); // Limpa a lista de carros
      setError("Veículo não encontrado ou falha na busca.");
    } finally {
      setIsLoading(false); // Para o 'loading' em qualquer cenário (sucesso ou erro)
    }
  };

  const handleEditClick = (carroParaEditar) => {
    console.log("Carro recebido para editar:", carroParaEditar);
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
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormUpdateSubmit = async (event) => {
    event.preventDefault();

    // Verifica se estamos realmente no modo de edição
    if (!editingCar) {
      console.error("Erro: Tentativa de submeter formulário sem um carro em edição.");
      alert("Ocorreu um erro. Verifique o console do navegador para mais detalhes.");
      return;
    }

    console.log(`Atualizando carro com ID: ${editingCar.id}`);
    console.log("Novos dados:", formData);

    try {
      await api.patch(`/carros/${editingCar.id}`, formData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula API
      console.log("Carro atualizado com sucesso!");

      getCarros();
      handleCloseModalUpdate();
    } catch (err) {
      console.error("Erro ao atualizar carro:", err);
      alert("Ocorreu um erro. Verifique o console do navegador para mais detalhes.");

    }
  };

  async function handleFormCreateSubmit(event) {
    event.preventDefault();

    const placaDigitada = inputPlaca.current.value.trim().toUpperCase();

    try {
      await api.post("/carros", {
        placa: placaDigitada,
        ano: inputAno.current.value,
        modelo: inputModelo.current.value,
        marca: inputMarca.current.value
      });

      await getCarros(); // Recarrega a lista do banco

      // Limpa e fecha o modal
      inputPlaca.current.value = "";
      inputAno.current.value = "";
      inputModelo.current.value = "";
      inputMarca.current.value = "";
      handleCloseModalCreate();

    } catch (err) {

      console.log("!!! ERRO AO CRIAR CARRO (DEBUG) !!!");

      // 'err.response' é o mais importante se for um erro de API (4xx, 5xx)
      if (err.response) {
        console.log("Dados do Erro (err.response):", err.response);
        console.log("Status Code:", err.response.status);
        console.log("Mensagem de Erro:", err.response.data);
      } else {
        // Se 'err.response' não existir, é outro tipo de erro (ex: rede)
        console.log("Erro completo (sem err.response):", err);
      }

      alert("Ocorreu um erro. Verifique o console do navegador para mais detalhes.");

    }

  }



  const handleOpenModalCreate = () => setIsModalCreateOpen(true); // Abre o modal
  const handleCloseModalCreate = () => setIsModalCreateOpen(false); // Fecha o modal

  const handleOpenModalUpdate = () => setIsModalUpdateOpen(true); // Abre o modal
  const handleCloseModalUpdate = () => {
    setIsModalUpdateOpen(false);
    setEditingCar(null);
    setFormData({ marca: '', modelo: '', ano: '', placa: '' });
  }

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
              <p><strong>Ano:</strong> <span>{carro.ano}</span></p>
              <p><strong>Placa:</strong> <span>{carro.placa}</span></p>
            </div>
            <div>
              <button className={styles['btn-list']} onClick={() => handleEditClick(carro)}>
                <EditIcon />
              </button>
              <button >
                <TrashIcon onClick={() => deleteCarros(carro.id)} />
              </button>
            </div>
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
              onClick={() => getCarros()}
            >
              Limpar
            </button>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleOpenModalCreate}>
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

      {/* MODAL DE NOVO VEÍCULO */}
      {isModalCreateOpen && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModalCreate}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>Novo Veículo</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} onClick={handleCloseModalCreate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Preencha os dados do novo veículo</p>
            <form className={styles["modal-form"]} onSubmit={handleFormCreateSubmit}>
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
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleCloseModalCreate} >
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ATUALIZAR VEÍCULO */}
      {isModalUpdateOpen && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModalUpdate}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>Atualizar Veículo</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} onClick={handleCloseModalUpdate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Atualize os dados do veículo</p>
            <form className={styles["modal-form"]} onSubmit={handleFormUpdateSubmit} >
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="marca" className={styles['form-label']}>Marca</label>
                  <input type="text" id="marca" name="marca" placeholder="Id da Marca" value={formData.marca} onChange={handleFormChange} className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="modelo" className={styles['form-label']}>Modelo</label>
                  <input type="text" id="modelo" name="modelo" placeholder="Ex: Corolla" value={formData.modelo} onChange={handleFormChange} className={styles['form-input']} />
                </div>
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="ano" className={styles['form-label']}>Ano</label>
                  <input type="number" id="ano" name="ano" placeholder="2025" value={formData.ano} onChange={handleFormChange} className={styles['form-input']} />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="placa" className={styles['form-label']}>Placa</label>
                  <input type="text" id="placa" name="placa" placeholder="ABC1234" value={formData.placa} onChange={handleFormChange} className={styles['form-input']} />
                </div>
              </div>

              <div className={styles["modal-actions"]}>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleCloseModalUpdate} >
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
                  Atualizar
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