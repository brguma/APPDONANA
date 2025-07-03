# Estrutura Correta dos Arquivos

## 📁 Pasta src/ deve conter:

### src/App.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, X, Edit3, Save } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [carrinho, setCarrinho] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Produtos iniciais baseados na sua tabela
  const [produtos, setProdutos] = useState([
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
  ]);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [showClienteInput, setShowClienteInput] = useState(false);
  const [dataEntrega, setDataEntrega] = useState('');
  const [showDataEntrega, setShowDataEntrega] = useState(false);
  const [mesSelected, setMesSelected] = useState(new Date().getMonth() + 1);
  const [anoSelected, setAnoSelected] = useState(new Date().getFullYear());

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

  // Tela Inicial
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-pink-800 text-center mb-8 mt-8">
            APP DONANA
          </h1>
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
        </div>
      </div>
    );
  }

  // [Resto do código das outras telas - é muito longo, mas é o mesmo código que mostrei antes]
  // Por brevidade, não vou repetir todo aqui, mas você deve usar o código completo do App.jsx

  return null;
};

export default App;
```

### src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  color-scheme: light;
  color: rgba(0, 0, 0, 0.87);
  background-color: #ffffff;
  
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

/* Melhorias de usabilidade mobile */
@media (max-width: 768px) {
  body {
    touch-action: manipulation;
  }
  
  input, select, button {
    font-size: 16px; /* Evita zoom no iOS */
  }
}
```
