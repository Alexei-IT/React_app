// src/App.tsx
import './styles/global.scss';
import './styles/components.scss';
import { Routes, Route } from 'react-router-dom';
import ProductListPage from './components/ProductListPage';
import ProductPage from './components/ProductPage';
import CreateProductPage from './components/CreateProductPage';
import EditProductPage from './components/EditProductPage'; // Добавляем импорт
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="text-center mb-20">
        <h1>🛍️ Product Store</h1>
        <p className="text-gray">Manage your products with ease</p>
      </header>
      
      <Navigation />
      
      <main>
        <Routes>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} /> {/* Добавляем маршрут */}
          <Route path="/" element={<ProductListPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;