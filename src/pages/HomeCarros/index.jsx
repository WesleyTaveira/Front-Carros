import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './style.module.css';
import api from '../../services/api'

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; 
import ListAltIcon from '@mui/icons-material/ListAlt'; 

// --- Componente do Card de Carro (Exemplo Básico) ---
// Você precisará adaptar este componente para mostrar os dados reais do seu carro
function CarCard({ carro }) {
  return (
    <div className={styles["car-card"]}>
      <p><strong>ID:</strong> {carro.id}</p>
      <p><strong>Marca:</strong> {carro.marca}</p>
      <p><strong>Modelo:</strong> {carro.modelo}</p>
      <p><strong>Placa:</strong> {carro.placa}</p>
      {/* Adicione outros detalhes e botões de ação (editar/excluir) aqui */}
    </div>
  );
}

// --- Componente Principal da Página ---
function HomeCarros() {
  const [carros, setCarros] = useState([]); // Lista de carros do backend
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro
  const [searchTerm, setSearchTerm] = useState(''); // Valor da barra de busca
  const [isModalOpen, setIsModalOpen] = useState(false); // Visibilidade do modal
  const navigate = useNavigate(); // Hook para navegação programática

  // --- Efeito para buscar os carros do backend ao montar ---
  useEffect(() => {
    // Simulação de chamada de API
    const fetchCarros = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ---- SUBSTITUA PELA SUA LÓGICA DE FETCH REAL ----
        console.log("Buscando todos os carros...");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da rede
        // Exemplo de dados mockados:
        const dadosMockados = [
          { id: '1', marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' },
          { id: '2', marca: 'Honda', modelo: 'Civic', placa: 'DEF-5678' },
        ];
        // Se você buscar dados reais:
        // const response = await fetch('/api/carros'); // Sua URL de backend
        // if (!response.ok) throw new Error('Falha ao buscar carros');
        // const data = await response.json();
        // setCarros(data);
        setCarros(dadosMockados); // Use os dados mockados por enquanto
        // ---- FIM DA SUBSTITUIÇÃO ----
      } catch (err) {
        console.error("Erro ao buscar carros:", err);
        setError("Não foi possível carregar os veículos.");
        setCarros([]); // Limpa a lista em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarros();
  }, []); // Array vazio faz rodar apenas na montagem inicial

  // --- Funções de Manipulação ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Impede recarregamento da página
    if (!searchTerm.trim()) {
      // Se a busca estiver vazia, talvez recarregar todos? Ou mostrar aviso?
      // Por enquanto, vamos apenas logar.
      console.log("Campo de busca vazio, buscando todos (implementar recarga se necessário)");
       // Você pode chamar a função fetchCarros() novamente aqui se quiser recarregar tudo.
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // ---- SUBSTITUA PELA SUA LÓGICA DE BUSCA POR ID ----
      console.log(`Buscando carro com ID: ${searchTerm}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
      // Exemplo mockado:
      const carroEncontrado = carros.find(c => c.id === searchTerm); // Busca simples no mock
      // Se você buscar no backend:
      // const response = await fetch(`/api/carros/${searchTerm}`);
      // if (response.status === 404) {
      //   setCarros([]); // Limpa se não encontrar
      // } else if (!response.ok) {
      //   throw new Error('Falha ao buscar carro por ID');
      // } else {
      //   const data = await response.json();
      //   setCarros([data]); // Mostra apenas o carro encontrado
      // }
       setCarros(carroEncontrado ? [carroEncontrado] : []); // Atualiza a lista com o resultado
      // ---- FIM DA SUBSTITUIÇÃO ----
    } catch (err) {
      console.error("Erro ao buscar carro por ID:", err);
      setError("Não foi possível realizar a busca.");
      setCarros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Simulação de adicionar novo carro (você precisará conectar ao backend)
  const handleAddCarro = (event) => {
    event.preventDefault();
    console.log("Formulário de novo carro enviado (implementar lógica de API)");
    // Pegar os dados do formulário (ex: usando estado ou FormData)
    // Enviar para a API POST /api/carros
    // Se sucesso:
    handleCloseModal();
    // Idealmente, recarregar a lista de carros para incluir o novo
    // fetchCarros(); // Ou atualizar o estado localmente
  };

  const handleLogout = () => {
    console.log("Logout (implementar lógica)");
    // Limpar token, redirecionar para login, etc.
    navigate('/'); // Exemplo: redireciona para a raiz (Login)
  };

  const handleNavigateToMarcas = () => {
    console.log("Navegar para Marcas (implementar rota se necessário)");
    // navigate('/marcas'); // Descomente se tiver a rota /marcas
  };

 
  const renderContent = () => {
    if (isLoading) {
      return <p className={styles["status-message"]}>Carregando veículos...</p>;
    }
    if (error) {
      return <p className={styles["status-message error-message"]}>{error}</p>;
    }
    if (carros.length === 0) {
      return <p className={styles["empty-state-message"]}>Nenhum veículo encontrado</p>;
    }
    return (
      <div className={styles["car-list"]}>
        {carros.map((carro) => (
          <CarCard key={carro.id} carro={carro} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles["page-container"]}>
      {/* CABEÇALHO */}
      <header className={styles["app-header"]}>
        <div className={styles["container header-content"]}>
          <div className={styles["logo-title"]}>
            <div className ={styles.logo}>
              <DirectionsCarIcon />
            </div>
            <h1>Meus Veículos</h1>
          </div>
          <div className={styles["header-actions"]}>
            <button className={styles["btn-Marcas"]} onClick={handleNavigateToMarcas}>
              <ListAltIcon />
              Listar Marcas
            </button>
            <button className={styles["btn-Marcas"]} onClick={handleLogout}>
              <LogoutIcon />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.container}>
        {/* BARRA DE AÇÕES */}
        <form className={styles["action-bar"]} onSubmit={handleSearchSubmit}>
          <div className={styles["search-bar"]}>
            <SearchIcon className={styles["search-icon"]} />
            <input
              type="text"
              className={styles["search-input"]}
              placeholder="Buscar por ID do veículo..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className={styles["btn-veiculo"]} onClick={handleOpenModal}>
              <AddIcon />
              Novo Veículo
            </button>
          </div>
          {/* O botão de submit agora faz parte do form da busca */}
          <button type="submit" className={styles["btn-Marcas"]}>
             Buscar
          </button>
        </form>

        {/* LISTA DE CARROS OU ESTADO VAZIO */}
        {renderContent()}
      </main>

      {/* MODAL DE NOVO VEÍCULO */}
      {isModalOpen && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h2>Novo Veículo</h2>
              <button className={styles["btn-Marcas"]} onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <p className={styles["modal-subtitle"]}>Preencha os dados do novo veículo</p>

            {/* Formulário do Modal */}
            <form className={styles["modal-form"]} onSubmit={handleAddCarro}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="marca">Marca *</label>
                  <input type="text" id="marca" name="marca" placeholder="Ex: Toyota" required />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="modelo">Modelo *</label>
                  <input type="text" id="modelo" name="modelo" placeholder="Ex: Corolla" required />
                </div>
              </div>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="ano">Ano *</label>
                  <input type="number" id="ano" name="ano" placeholder="Ex: 2025" required />
                </div>
                 <div className={styles["form-group"]}>
                  <label htmlFor="placa">Placa *</label>
                  <input type="text" id="placa" name="placa" placeholder="ABC-1234" required />
                </div>
              </div>
               
              <div className={styles["modal-actions"]}>
                <button type="button" className={styles["btn-Marcas"]} onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles["btn-Marcas"]}>
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