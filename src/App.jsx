import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <a href="/" className="logo">
            Product Store
          </a>
          <nav>
            <a href="/">Products</a>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
