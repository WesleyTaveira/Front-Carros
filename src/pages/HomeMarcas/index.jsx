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
function HomeMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false); // Para o modal
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingMarca, seteditingMarca] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
  });
  const navigate = useNavigate();

  const inputNome = useRef()
  const inputCarros = useRef()
  

  async function getMarcas() {
    const marcasApi = await api.get('/marcas')

    setMarcas(marcasApi.data.data)
  }



  async function deleteMarcas(id) {
    await api.delete(`/marcas/${id}`)

    getMarcas()
  }

  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true);
      setError(null);
      console.log("Buscando todas as marcas...");
      await new Promise(resolve => setTimeout(resolve, 500)); // Seu delay

      try {
        await getMarcas();
      } catch (e) {
        console.error("Falha ao buscar marcas:", e);
        setError("Não foi possível carregar as marcas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarcas();
  }, []); // O array vazio está correto, para rodar só uma vez.

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = async (event) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Se a barra de busca estiver vazia, recarrega todos os marcas
    if (!searchTerm.trim()) {
      console.log("Busca vazia, recarregando todos os Marcas...");
      await getMarcas();
      return;
    }

    // Inicia o estado de carregamento
    setIsLoading(true);
    setError(null);
    console.log(`Buscando marca com ID: ${searchTerm}`);

    try {
      const response = await api.get(`/marcas/${searchTerm}`);

      console.log("Resposta da API (busca por ID):", response);

      if (response.data && response.data.data) {
        setMarcas([response.data.data]); // Coloca o marca encontrado (em um array) no estado
      } else {
        setMarcas([]);
        setError("Marca não encontrada para o ID especificado.");
      }

    } catch (e) {
      console.error("Falha ao buscar marca por ID:", e);
      setMarcas([]); // Limpa a lista de marcas
      setError("Marca não encontrada ou falha na busca.");
    } finally {
      setIsLoading(false); // Para o 'loading' em qualquer cenário (sucesso ou erro)
    }
  };

  const handleEditClick = (marcaParaEditar) => {
    console.log("marca recebido para editar:", marcaParaEditar);
    seteditingMarca(marcaParaEditar);


    setFormData({
      marca: marcaParaEditar.nome || ''
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
    if (!editingMarca) {
      console.error("Erro: Tentativa de submeter formulário sem um marca em edição.");
      alert("Ocorreu um erro. Verifique o console do navegador para mais detalhes.");
      return;
    }

    console.log(`Atualizando marca com ID: ${editingMarca.id}`);
    console.log("Novos dados:", formData);

    try {
      await api.patch(`/marcas/${editingMarca.id}`, formData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula API
      console.log("Marca atualizada com sucesso!");

      getMarcas();
      handleCloseModalUpdate();
    } catch (err) {
      console.error("Erro ao atualizar marca:", err);
      alert("Ocorreu um erro. Verifique o console do navegador para mais detalhes.");

    }
  };

  async function handleFormCreateSubmit(event) {
    event.preventDefault();

    const nomeDigitado = inputNome.current.value.trim().toUpperCase();

    try {
      await api.post("/marcas", {
        nome: nomeDigitado,
      });

      await getMarcas(); // Recarrega a lista do banco

      // Limpa e fecha o modal
      inputNome.current.value = "";
      handleCloseModalCreate();

    } catch (err) {

      console.log("!!! ERRO AO CRIAR marca (DEBUG) !!!");

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
    seteditingMarca(null);
    setFormData({ marca: '', modelo: '', ano: '', placa: '' });
  }

  const handleLogout = () => {
    navigate('/');
  };
  const handleNavigateToCarros = () => {
    navigate('/carros');
  };

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
              <button className={styles['btn-list']} onClick={() => handleEditClick(marca)}>
                <EditIcon />
              </button>
              <button >
                <TrashIcon onClick={() => deleteMarcas(marca.id)} />
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
            <h1>Minhas Marcas</h1>
          </div>
          <div className={styles['header-actions']}>
            <button className={`${styles.btn} ${styles['btn-header-action']}`} onClick={handleNavigateToCarros}> {/* Classe alterada */}
              <ListAltIcon /> Listar Carros
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
              onClick={() => getMarcas()}
            >
              Limpar
            </button>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleOpenModalCreate}>
              <AddIcon /> Nova Marca
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={`${styles.container} ${styles['main-content']}`}>

        {/* LISTA DE MARCAS OU ESTADO VAZIO */}
        {renderContent()}
      </main>

      {/* MODAL DE NOVA MARCA */}
      {isModalCreateOpen && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModalCreate}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>Nova Marca</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} onClick={handleCloseModalCreate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Preencha os dados da nova Marca</p>
            <form className={styles["modal-form"]} onSubmit={handleFormCreateSubmit}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="marca" className={styles['form-label']}>Nome</label>
                  <input type="text" id="nome" name="nome" placeholder="Ex: Fiat" ref={inputNome} required className={styles['form-input']} />
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

      {/* MODAL DE ATUALIZAR Marca */}
      {isModalUpdateOpen && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModalUpdate}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>Atualizar Marca</h2>
              <button className={`${styles.btn} ${styles['btn-icon']}`} onClick={handleCloseModalUpdate}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Atualize os dados da Marca</p>
            <form className={styles["modal-form"]} onSubmit={handleFormUpdateSubmit} >
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="marca" className={styles['form-label']}>Marca</label>
                  <input type="text" id="nome" name="nome" placeholder="Ex: Fiat" value={formData.nome} onChange={handleFormChange} className={styles['form-input']} />
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

export default HomeMarcas;