import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@Pages/Home';
import Login from '@Pages/Login';
import axios from 'axios';
import Vendor from '@Pages/Dashboard/Vendor';
import Products from '@/Pages/Dashboard/Vendor/Products';
import { Brands } from './Pages/Dashboard/Vendor/Brands';
import { Manufacturers } from './Pages/Dashboard/Vendor/Manufacturers';
import { Toaster } from '@components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


axios.defaults.baseURL = "http://localhost:5279/api/";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('theShop')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/vendor/products" element={<Products />} />
            <Route path="/vendor/manufacturers" element={<Manufacturers />} />
            <Route path="/vendor/brands" element={<Brands />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
