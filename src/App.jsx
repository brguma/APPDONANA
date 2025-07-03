import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Check, X, Edit3, Save } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [carrinho, setCarrinho] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Produtos iniciais
  const produtosIniciais = [
    { id: 1, categoria: 'DIVERSOS', nome: 'Pirulito de chocolate e de marshmallow', preco: 1.70 },
    { id: 2, categoria: 'DIVERSOS', nome: 'Maçã do amor', preco: 2.50 },
    { id: 3, categoria: 'DIVERSOS', nome: 'Mini trufas', preco: 1.50 },
    { id: 4, categoria: 'DIVERSOS', nome: 'Mini donuts', preco: 1.50 },
    { id: 5, categoria: 'DIVERSOS', nome: 'Cone Trufado', preco: 3.50 },
    { id: 6, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 200ml', preco: 1.50 },
    { id: 7, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Potinho', preco: 1.70 },
    { id: 8, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Saquinho', preco: 1.70 },
    { id: 9, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 300ml', preco: 2.00 },
    { id: 10, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Casquinha', preco: 3.00 },
    { id: 11, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 200ml', preco: 1.50 },
    { id: 12, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Potinho', preco: 1.70 },
    { id: 13, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 300ml', preco: 2.00 },
    { id: 14, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Palito', preco: 4.00 },
    { id: 15, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Casquinha', preco: 3.50 },
    { id: 16, categoria: 'CJ ALGODÃO DOCE', nome: 'Algodão doce no pote + Maçã do amor', preco: 3.70 },
    { id: 17, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Pipoca colorida', preco: 3.00 },
    { id: 18, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Marshmallow', preco: 3.50 },
    { id: 19, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Bis', preco: 4.00 },
    { id: 20, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Jujuba', preco: 4.00 },
    { id: 21, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 1 sabor de recheio', preco: 4.00 },
    { id: 22, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 2 sabores de recheio', preco: 5.00 },
    { id: 23, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas', preco: 40.00 },
    { id: 24, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas + 1 balde personalizado', preco: 45.00 },
    { id: 25, categoria: 'DOCES PERSONALIZADOS', nome: 'Bolo no palito', preco: 9.00 },
    { id: 26, categoria: 'DOCES PERSONALIZADOS', nome: 'Choco Maçã', preco: 7.00 },
    { id: 27, categoria: 'DOCES PERSONALIZADOS', nome: 'Cupcake', preco: 6.00 },
    { id: 28, categoria: 'DOCES PERSONALIZADOS', nome: 'Pirulito', preco: 5.00 },
    { id: 29, categoria: 'DOCES PERSONALIZADOS', nome: 'Trufas', preco: 3.00 },
    { id: 30, categoria: 'DOCES PERSONALIZADOS', nome: 'Porta retrato de chocolate - unidade', preco: 6.00 }
  ];

  const [produtos, setProdutos] = useState(produtosIniciais);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [showClienteInput, setShowClienteInput] = useState(false);
  const [dataEntrega, setDataEntrega] = useState('');
  const [showDataEntrega, setShowDataEntrega] = useState(false);
  const [mesSelected, setMesSelected] = useState(new Date().getMonth() + 1);
  const [anoSelected, setAnoSelected] = useState(new Date().getFullYear());

  // 🔄 FUNÇÕES DE PERSISTÊNCIA
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return defaultValue;
    }
  };

  // 📱 CARREGAR DADOS AO INICIAR O APP
  useEffect(() => {
    const dadosSalvos = {
      orcamentos: loadFromLocalStorage('donana_orcamentos', []),
      pedidos: loadFromLocalStorage('donana_pedidos', []),
      finalizados: loadFromLocalStorage('donana_finalizados', []),
      produtos: loadFromLocalStorage('donana_produtos', produtosIniciais)
    };

    setOrcamentos(dadosSalvos.orcamentos);
    setPedidos(dadosSalvos.pedidos);
    setFinalizados(dadosSalvos.finalizados);
    setProdutos(dadosSalvos.produtos);
  }, []);

  // 💾 SALVAR AUTOMATICAMENTE QUANDO DADOS MUDAM
  useEffect(() => {
    saveToLocalStorage('donana_orcamentos', orcamentos);
  }, [orcamentos]);

  useEffect(() => {
    saveToLocalStorage('donana_pedidos', pedidos);
  }, [pedidos]);

  useEffect(() => {
    saveToLocalStorage('donana_finalizados', finalizados);
  }, [finalizados]);

  useEffect(() => {
    saveToLocalStorage('donana_produtos', produtos);
  }, [produtos]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

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

  const saveOrcamento = () => {
    if (!nomeCliente.trim() || carrinho.length === 0) return;

    const novoOrcamento = {
      id: Date.now(),
      cliente: nomeCliente,
      data: new Date().toISOString(),
      itens: [...carrinho],
      total: carrinho.reduce((sum, item) => sum + item.total, 0)
    };

    setOrcamentos([...orcamentos, novoOrcamento]);
    clearCarrinho();
    setNomeCliente('');
    setShowClienteInput(false);
    setCurrentScreen('home');
  };

  const confirmarOrcamento = (orcamentoId) => {
    if (!dataEntrega) return;

    const orcamento = orcamentos.find(o => o.id === orcamentoId);
    const novoPedido = {
      ...orcamento,
      dataEntrega: new Date(dataEntrega).toISOString()
    };

    setPedidos([...pedidos, novoPedido]);
    setOrcamentos(orcamentos.filter(o => o.id !== orcamentoId));
    setDataEntrega('');
    setShowDataEntrega(false);
  };

  const cancelarOrcamento = (orcamentoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este orçamento?')) {
      setOrcamentos(orcamentos.filter(o => o.id !== orcamentoId));
    }
  };

  const finalizarPedido = (pedidoId) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    const pedidoFinalizado = {
      ...pedido,
      dataFinalizacao: new Date().toISOString()
    };

    setFinalizados([...finalizados, pedidoFinalizado]);
    setPedidos(pedidos.filter(p => p.id !== pedidoId));
  };

  const cancelarPedido = (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      setPedidos(pedidos.filter(p => p.id !== pedidoId));
    }
  };

  const getFaturamentoMes = (mes, ano) => {
    return finalizados
      .filter(f => {
        const data = new Date(f.dataFinalizacao);
        return data.getMonth() + 1 === mes && data.getFullYear() === ano;
      })
      .reduce((sum, f) => sum + f.total, 0);
  };

  const getFaturamentoAno = (ano) => {
    return finalizados
      .filter(f => new Date(f.dataFinalizacao).getFullYear() === ano)
      .reduce((sum, f) => sum + f.total, 0);
  };

  const getPrevisaoMes = (mes, ano) => {
    return pedidos
      .filter(p => {
        const data = new Date(p.dataEntrega);
        return data.getMonth() + 1 === mes && data.getFullYear() === ano;
      })
      .reduce((sum, p) => sum + p.total, 0);
  };

  const getTotalOrcamentos = () => {
    return orcamentos.reduce((sum, o) => sum + o.total, 0);
  };

  const getVendasProduto = (produtoId, periodo) => {
    const hoje = new Date();
    const filtroData = periodo === 'mes' 
      ? (data) => data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
      : (data) => data.getFullYear() === hoje.getFullYear();

    return finalizados
      .filter(f => filtroData(new Date(f.dataFinalizacao)))
      .reduce((sum, f) => {
        const item = f.itens.find(i => i.produto.id === produtoId);
        return sum + (item ? item.quantidade : 0);
      }, 0);
  };

  const editProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const saveProduct = () => {
    setProdutos(produtos.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);
  };

  const addNewProduct = () => {
    const newProduct = {
      id: Math.max(...produtos.map(p => p.id)) + 1,
      categoria: 'NOVA CATEGORIA',
      nome: 'Novo Produto',
      preco: 0
    };
    setProdutos([...produtos, newProduct]);
    setEditingProduct(newProduct);
  };

  // 🗑️ FUNÇÃO PARA LIMPAR TODOS OS DADOS (OPCIONAL)
  const limparTodosDados = () => {
    if (window.confirm('⚠️ ATENÇÃO: Isso vai apagar TODOS os dados salvos (orçamentos, pedidos, finalizados). Tem certeza?')) {
      localStorage.removeItem('donana_orcamentos');
      localStorage.removeItem('donana_pedidos');
      localStorage.removeItem('donana_finalizados');
      localStorage.removeItem('donana_produtos');
      
      setOrcamentos([]);
      setPedidos([]);
      setFinalizados([]);
      setProdutos(produtosIniciais);
      
      alert('✅ Todos os dados foram apagados!');
    }
  };

  // Tela Inicial
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-pink-800 text-center mb-8 mt-8">
            APP DONANA
          </h1>
          
          {/* Indicador de dados salvos */}
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-center text-sm">
            💾 Dados salvos automaticamente
            <br />
            📊 {orcamentos.length} orçamentos • {pedidos.length} pedidos • {finalizados.length} finalizados
          </div>

          <div className="flex flex-col gap-4">
            {[
              { name: 'ORÇAMENTO', screen: 'orcamento' },
              { name: 'PENDENTES', screen: 'pendentes' },
              { name: 'PEDIDOS', screen: 'pedidos' },
              { name: 'FINALIZADOS', screen: 'finalizados' },
              { name: 'DETALHADOS', screen: 'detalhados' },
              { name: 'PRODUTOS', screen: 'produtos' }
            ].map((button) => (
              <button
                key={button.screen}
                onClick={() => setCurrentScreen(button.screen)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-colors text-lg"
              >
                {button.name}
              </button>
            ))}
          </div>

          {/* Botão para limpar dados (só para desenvolvimento/teste) */}
          <button
            onClick={limparTodosDados}
            className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            🗑️ Limpar Todos os Dados
          </button>
        </div>
      </div>
    );
  }

  // Tela Orçamento
  if (currentScreen === 'orcamento') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Novo Orçamento</h2>
          
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {formatCurrency(produto.preco)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>

            <button
              onClick={addToCarrinho}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Adicionar
            </button>
          </div>

          {carrinho.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">Carrinho</h3>
              {carrinho.map((item, index) => (
                <div key={index} className="border-b pb-2 mb-2">
                  <div className="text-sm font-medium">{item.produto.nome}</div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(item.produto.preco)} x {item.quantidade}</span>
                    <span className="font-bold">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
              <div className="text-lg font-bold text-right pt-2 border-t">
                Subtotal: {formatCurrency(carrinho.reduce((sum, item) => sum + item.total, 0))}
              </div>
            </div>
          )}

          {showClienteInput && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente</label>
              <input
                type="text"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveOrcamento}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowClienteInput(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-16">
            <button
              onClick={() => setShowClienteInput(true)}
              disabled={carrinho.length === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-md"
            >
              Salvar
            </button>
            <button
              onClick={clearCarrinho}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md"
            >
              Limpar
            </button>
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Pendentes
  if (currentScreen === 'pendentes') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Orçamentos Pendentes</h2>
          
          {orcamentos.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">Nenhum orçamento pendente</div>
          ) : (
            orcamentos.map((orcamento) => (
              <div key={orcamento.id} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{orcamento.cliente}</div>
                    <div className="text-sm text-gray-600">{formatDate(orcamento.data)}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(orcamento.total)}
                  </div>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  {orcamento.itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.produto.nome} x{item.quantidade}</span>
                      <span>{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>

                {showDataEntrega === orcamento.id ? (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
                    <input
                      type="date"
                      value={dataEntrega}
                      onChange={(e) => setDataEntrega(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmarOrcamento(orcamento.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setShowDataEntrega(false)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setShowDataEntrega(orcamento.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Confirmar
                    </button>
                    <button
                      onClick={() => cancelarOrcamento(orcamento.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Pedidos
  if (currentScreen === 'pedidos') {
    const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega));

    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Pedidos Confirmados</h2>
          
          {pedidosOrdenados.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">Nenhum pedido confirmado</div>
          ) : (
            pedidosOrdenados.map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{pedido.cliente}</div>
                    <div className="text-sm text-gray-600">Orçamento: {formatDate(pedido.data)}</div>
                    <div className="text-sm font-medium text-blue-600">
                      Entrega: {formatDate(pedido.dataEntrega)}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(pedido.total)}
                  </div>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  {pedido.itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.produto.nome} x{item.quantidade}</span>
                      <span>{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => finalizarPedido(pedido.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Finalizar
                  </button>
                  <button
                    onClick={() => cancelarPedido(pedido.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Finalizados
  if (currentScreen === 'finalizados') {
    const ultimosFinalizados = [...finalizados]
      .sort((a, b) => new Date(b.dataFinalizacao) - new Date(a.dataFinalizacao))
      .slice(0, 10);

    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Dashboard Financeiro</h2>
          
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Faturamento do mês:</span>
              <select
                value={mesSelected}
                onChange={(e) => setMesSelected(parseInt(e.target.value))}
                className="p-1 border border-gray-300 rounded text-sm"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getFaturamentoMes(mesSelected, anoSelected))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Faturamento anual:</span>
              <select
                value={anoSelected}
                onChange={(e) => setAnoSelected(parseInt(e.target.value))}
                className="p-1 border border-gray-300 rounded text-sm"
              >
                {[2023, 2024, 2025, 2026].map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getFaturamentoAno(anoSelected))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="font-medium mb-2">Previsão próximo mês:</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(getPrevisaoMes(new Date().getMonth() + 2, new Date().getFullYear()))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="font-medium mb-2">Total Orçamentos Pendentes:</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(getTotalOrcamentos())}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-16">
            <div className="font-medium mb-4">Últimos Pedidos Finalizados:</div>
            {ultimosFinalizados.length === 0 ? (
              <div className="text-gray-500 text-sm">Nenhum pedido finalizado</div>
            ) : (
              ultimosFinalizados.map((pedido) => (
                <div key={pedido.id} className="border-b pb-2 mb-2 last:border-b-0">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium text-sm">{pedido.cliente}</div>
                      <div className="text-xs text-gray-600">
                        {formatDate(pedido.dataFinalizacao)}
                      </div>
                    </div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(pedido.total)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Detalhados
  if (currentScreen === 'detalhados') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Vendas Detalhadas</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
            <div className="bg-pink-100 p-3 grid grid-cols-4 gap-2 font-bold text-sm">
              <div className="col-span-2">Produto</div>
              <div className="text-center">Mês</div>
              <div className="text-center">Ano</div>
            </div>
            
            {produtos.map((produto) => (
              <div key={produto.id} className="border-b p-3 grid grid-cols-4 gap-2 text-sm">
                <div className="col-span-2">
                  <div className="font-medium">{produto.nome}</div>
                  <div className="text-xs text-gray-600">{produto.categoria}</div>
                </div>
                <div className="text-center font-bold text-blue-600">
                  {getVendasProduto(produto.id, 'mes')}
                </div>
                <div className="text-center font-bold text-green-600">
                  {getVendasProduto(produto.id, 'ano')}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Produtos
  if (currentScreen === 'produtos') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-800">Produtos</h2>
            <button
              onClick={addNewProduct}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
            <div className="bg-pink-100 p-3 grid grid-cols-12 gap-2 font-bold text-sm">
              <div className="col-span-3">Categoria</div>
              <div className="col-span-5">Produto</div>
              <div className="col-span-3">Preço</div>
              <div className="col-span-1">Ação</div>
            </div>
            
            {produtos.map((produto) => (
              <div key={produto.id} className="border-b p-3">
                {editingProduct && editingProduct.id === produto.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingProduct.categoria}
                      onChange={(e) => setEditingProduct({...editingProduct, categoria: e.target.value})}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="Categoria"
                    />
                    <input
                      type="text"
                      value={editingProduct.nome}
                      onChange={(e) => setEditingProduct({...editingProduct, nome: e.target.value})}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="Nome do produto"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.preco}
                      onChange={(e) => setEditingProduct({...editingProduct, preco: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="Preço"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveProduct}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs flex items-center justify-center gap-1"
                      >
                        <Save size={12} /> Salvar
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-2 items-center text-sm">
                    <div className="col-span-3 text-xs font-medium text-pink-600">
                      {produto.categoria}
                    </div>
                    <div className="col-span-5 text-xs">
                      {produto.nome}
                    </div>
                    <div className="col-span-3 font-bold text-green-600 text-xs">
                      {formatCurrency(produto.preco)}
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => editProduct(produto)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
