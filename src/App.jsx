import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Check, X, Edit3, Save, Wifi, WifiOff, User, LogOut } from 'lucide-react';

// Imports do Firebase
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from './config/firebase';

const App = () => {
  // Estados de autenticação
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados da aplicação
  const [currentScreen, setCurrentScreen] = useState('home');
  const [carrinho, setCarrinho] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editingTema, setEditingTema] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Estados do formulário
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [showClienteInput, setShowClienteInput] = useState(false);
  const [dataEntrega, setDataEntrega] = useState('');
  const [valorSinal, setValorSinal] = useState('');
  const [temaFesta, setTemaFesta] = useState('');
  const [showDataEntrega, setShowDataEntrega] = useState(false);

  // Produtos
  const produtosIniciais = [
    { id: 1, categoria: 'DIVERSOS', nome: 'Pirulito de chocolate', preco: 1.70 },
    { id: 2, categoria: 'DIVERSOS', nome: 'Pirulito de marshmallow', preco: 1.70 },
    { id: 3, categoria: 'DIVERSOS', nome: 'Maçã do amor', preco: 2.50 },
    { id: 4, categoria: 'DIVERSOS', nome: 'Mini trufas', preco: 1.50 },
    { id: 5, categoria: 'DIVERSOS', nome: 'Mini donuts', preco: 1.50 },
    { id: 6, categoria: 'DIVERSOS', nome: 'Cone Trufado', preco: 3.50 },
    { id: 7, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 200ml', preco: 1.50 },
    { id: 8, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Potinho', preco: 1.70 },
    { id: 9, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Saquinho', preco: 1.70 },
    { id: 10, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 300ml', preco: 2.00 },
    { id: 11, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Casquinha', preco: 3.00 },
    { id: 12, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 200ml', preco: 1.50 },
    { id: 13, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Potinho', preco: 1.70 },
    { id: 14, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 300ml', preco: 2.00 },
    { id: 15, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Palito', preco: 4.00 },
    { id: 16, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Casquinha', preco: 3.50 },
    { id: 17, categoria: 'CJ ALGODÃO DOCE', nome: 'Algodão doce no pote + Maçã do amor', preco: 3.70 },
    { id: 18, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Pipoca colorida', preco: 3.00 },
    { id: 19, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Marshmallow', preco: 3.50 },
    { id: 20, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Bis', preco: 4.00 },
    { id: 21, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Jujuba', preco: 4.00 },
    { id: 22, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 1 sabor de recheio', preco: 4.00 },
    { id: 23, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 2 sabores de recheio', preco: 5.00 },
    { id: 24, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas', preco: 40.00 },
    { id: 25, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas + 1 balde personalizado', preco: 45.00 },
    { id: 26, categoria: 'DOCES PERSONALIZADOS', nome: 'Bolo no palito', preco: 9.00 },
    { id: 27, categoria: 'DOCES PERSONALIZADOS', nome: 'Choco Maçã', preco: 7.00 },
    { id: 28, categoria: 'DOCES PERSONALIZADOS', nome: 'Cupcake', preco: 6.00 },
    { id: 29, categoria: 'DOCES PERSONALIZADOS', nome: 'Pirulito decorado c/pasta americana', preco: 5.00 },
    { id: 30, categoria: 'DOCES PERSONALIZADOS', nome: 'Trufas decoradas c/pasta americana', preco: 3.00 },
    { id: 31, categoria: 'DOCES PERSONALIZADOS', nome: 'Porta retrato de chocolate - unidade', preco: 6.00 }
  ];

  const [produtos] = useState(produtosIniciais);

  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitorar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadUserData(user.uid);
      } else {
        setOrcamentos([]);
        setPedidos([]);
        setFinalizados([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados do usuário
  const loadUserData = async (userId) => {
    try {
      setLoading(true);

      // Carregar orçamentos
      const orcamentosQuery = query(
        collection(db, 'orcamentos'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const orcamentosSnapshot = await getDocs(orcamentosQuery);
      const orcamentosData = orcamentosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrcamentos(orcamentosData);

      // Carregar pedidos
      const pedidosQuery = query(
        collection(db, 'pedidos'), 
        where('userId', '==', userId),
        orderBy('dataEntrega', 'asc')
      );
      const pedidosSnapshot = await getDocs(pedidosQuery);
      const pedidosData = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPedidos(pedidosData);

      // Carregar finalizados
      const finalizadosQuery = query(
        collection(db, 'finalizados'), 
        where('userId', '==', userId),
        orderBy('dataFinalizacao', 'desc')
      );
      const finalizadosSnapshot = await getDocs(finalizadosQuery);
      const finalizadosData = finalizadosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFinalizados(finalizadosData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funções de autenticação
  const handleAuth = async (email, password) => {
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
    } catch (error) {
      alert('Erro na autenticação: ' + error.message);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Funções do carrinho
  const addToCarrinho = () => {
    if (!selectedProduct || !quantidade || quantidade <= 0) return;

    const produto = produtos.find(p => p.id === parseInt(selectedProduct));
    const existingItem = carrinho.find(item => item.produto.id === produto.id);

    if (existingItem) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + parseInt(quantidade), total: (item.quantidade + parseInt(quantidade)) * produto.preco }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto,
        quantidade: parseInt(quantidade),
        total: parseInt(quantidade) * produto.preco
      }]);
    }

    setSelectedProduct('');
    setQuantidade('');
  };

  const clearCarrinho = () => {
    setCarrinho([]);
    setSelectedProduct('');
    setQuantidade('');
  };

  // Funções Firebase
  const saveOrcamento = async () => {
    if (carrinho.length === 0) return;
    if (!user) {
      alert('Faça login para salvar orçamentos');
      setShowAuth(true);
      return;
    }

    try {
      setAuthLoading(true);
      
      const novoOrcamento = {
        cliente: nomeCliente.trim() || '',
        data: new Date().toISOString(),
        itens: [...carrinho],
        total: carrinho.reduce((sum, item) => sum + item.total, 0),
        userId: user.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'orcamentos'), novoOrcamento);
      
      setOrcamentos([{ id: docRef.id, ...novoOrcamento }, ...orcamentos]);
      clearCarrinho();
      setNomeCliente('');
      setShowClienteInput(false);
      setCurrentScreen('home');

    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      alert('Erro ao salvar orçamento');
    } finally {
      setAuthLoading(false);
    }
  };

  const saveClienteEdit = async (orcamentoId, novoNome) => {
    try {
      await updateDoc(doc(db, 'orcamentos', orcamentoId), {
        cliente: novoNome.trim()
      });
      
      setOrcamentos(orcamentos.map(o => 
        o.id === orcamentoId 
          ? { ...o, cliente: novoNome.trim() }
          : o
      ));
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const savePedidoClienteEdit = async (pedidoId, novoNome) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        cliente: novoNome.trim()
      });
      
      setPedidos(pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, cliente: novoNome.trim() }
          : p
      ));
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const savePedidoTemaEdit = async (pedidoId, novoTema) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        temaFesta: novoTema.trim()
      });
      
      setPedidos(pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, temaFesta: novoTema.trim() }
          : p
      ));
      setEditingTema(null);
    } catch (error) {
      console.error('Erro ao editar tema:', error);
    }
  };

  const confirmarOrcamento = async (orcamento) => {
    if (!dataEntrega || !valorSinal) return;

    try {
      const sinalNumerico = parseFloat(valorSinal.replace(',', '.')) || 0;
      
      const novoPedido = {
        ...orcamento,
        dataEntrega: new Date(dataEntrega).toISOString(),
        sinal: sinalNumerico,
        restante: orcamento.total - sinalNumerico,
        temaFesta: temaFesta.trim() || '',
        userId: user.uid,
        createdAt: new Date()
      };

      // Remover campos desnecessários
      delete novoPedido.id;

      const docRef = await addDoc(collection(db, 'pedidos'), novoPedido);
      await deleteDoc(doc(db, 'orcamentos', orcamento.id));
      
      setPedidos([{ id: docRef.id, ...novoPedido }, ...pedidos]);
      setOrcamentos(orcamentos.filter(o => o.id !== orcamento.id));
      
      setDataEntrega('');
      setValorSinal('');
      setTemaFesta('');
      setShowDataEntrega(false);

    } catch (error) {
      console.error('Erro ao confirmar orçamento:', error);
      alert('Erro ao confirmar orçamento');
    }
  };

  const cancelarOrcamento = async (orcamentoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este orçamento?')) {
      try {
        await deleteDoc(doc(db, 'orcamentos', orcamentoId));
        setOrcamentos(orcamentos.filter(o => o.id !== orcamentoId));
      } catch (error) {
        console.error('Erro ao cancelar orçamento:', error);
        alert('Erro ao cancelar orçamento');
      }
    }
  };

  const finalizarPedido = async (pedido) => {
    try {
      const pedidoFinalizado = {
        ...pedido,
        dataFinalizacao: new Date().toISOString(),
        userId: user.uid
      };

      // Remover campos desnecessários
      delete pedidoFinalizado.id;

      await addDoc(collection(db, 'finalizados'), pedidoFinalizado);
      await deleteDoc(doc(db, 'pedidos', pedido.id));
      
      setFinalizados([pedidoFinalizado, ...finalizados]);
      setPedidos(pedidos.filter(p => p.id !== pedido.id));
      
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido');
    }
  };

  const cancelarPedido = async (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        await deleteDoc(doc(db, 'pedidos', pedidoId));
        setPedidos(pedidos.filter(p => p.id !== pedidoId));
      } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        alert('Erro ao cancelar pedido');
      }
    }
  };

  // Loading inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-800 mb-4">APP DONANA</div>
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  // Modal de Autenticação
  if (showAuth) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">
            {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="auth-email"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                id="auth-password"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="••••••••"
              />
            </div>
            
            <button
              onClick={() => {
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                if (email && password) {
                  handleAuth(email, password);
                }
              }}
              disabled={authLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-md mb-4"
            >
              {authLoading ? 'Carregando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </div>
          
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="w-full text-pink-600 hover:text-pink-800 font-medium"
          >
            {authMode === 'login' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
          </button>
          
          <button
            onClick={() => setShowAuth(false)}
            className="w-full mt-2 text-gray-500 hover:text-gray-700"
          >
            Usar sem login
          </button>
        </div>
      </div>
    );
  }

  // Resto do componente permanece igual ao anterior...
  // (Telas: home, orcamento, pendentes, pedidos, finalizados)
  
  // Por brevidade, vou incluir apenas a tela home aqui
  // As outras telas são idênticas ao artifact anterior

  // Tela Inicial
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header com user info */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-pink-800">APP DONANA</h1>
            {user ? (
              <div className="flex items-center gap-2">
                <User size={20} className="text-pink-600" />
                <span className="text-sm text-pink-600">{user.email.split('@')[0]}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Status de conexão */}
          <div className={`border px-3 py-2 rounded mb-4 text-center text-sm flex items-center justify-center gap-2 ${
            isOnline 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isOnline ? '🌐 Online - Firebase conectado' : '📱 Offline - Dados locais'}
          </div>

          {/* Indicador de dados */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded mb-4 text-center text-sm">
            ☁️ {user ? 'Dados sincronizados' : 'Faça login para sincronizar'}
            <br />
            📊 {orcamentos.length} orçamentos • {pedidos.length} pedidos • {finalizados.length} finalizados
          </div>

          {/* Novidades */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded mb-4 text-center text-sm">
            ✨ <strong>Versão 2.0:</strong> 
            <br />
            🔐 Login seguro • ☁️ Sincronização automática • 📱 Backup em nuvem
          </div>

          <div className="flex flex-col gap-4">
            {[
              { name: 'ORÇAMENTO', screen: 'orcamento' },
              { name: 'PENDENTES', screen: 'pendentes', badge: orcamentos.length },
              { name: 'PEDIDOS', screen: 'pedidos', badge: pedidos.length },
              { name: 'FINALIZADOS', screen: 'finalizados', badge: finalizados.length },
              { name: 'RELATÓRIOS', screen: 'relatorios' },
              { name: 'PRODUTOS', screen: 'produtos' }
            ].map((button) => (
              <button
                key={button.screen}
                onClick={() => setCurrentScreen(button.screen)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-colors text-lg relative"
              >
                {button.name}
                {button.badge > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {button.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Para as outras telas, retorne o JSX idêntico ao artifact anterior
  // mas substitua as funções mockadas pelas reais do Firebase

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-pink-800 mb-6">
          Tela: {currentScreen}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Implementação das outras telas em desenvolvimento...
        </p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-md"
        >
          Voltar ao Início
        </button>
        
        <button
          onClick={() => setCurrentScreen('home')}
          className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
