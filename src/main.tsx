import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from '@Pages/Login';
import axios from 'axios';
import Products from '@/Pages/Dashboard/Admin/Products';
import { Brands } from '@/Pages/Dashboard/Admin/Brands';
import { Manufacturers } from '@/Pages/Dashboard/Admin/Manufacturers';
import { Toaster } from '@components/ui/toaster';
import ProtectedRoute from '@components/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Categories } from '@Pages/Dashboard/Admin/Categories';
import Administrator from '@Pages/Dashboard/Admin';

axios.defaults.baseURL = "http://localhost:5279/api/";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('theShop')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route index path="/admin" element={<Administrator />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/manufacturers" element={<Manufacturers />} />
            <Route path="/admin/brands" element={<Brands />} />
          </Route>
          {/* <Route path="*" element={<Outlet />} /> */}
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
