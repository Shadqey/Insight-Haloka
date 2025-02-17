import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Unauthorized from './pages/Unauthorized';
import LoginPage from './pages/Login/LoginPage';
import PrivateRoute from './authorization/PrivateRoute';
import { AuthProvider } from './authorization/AuthContext';
import HalokaNavbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import DetailClient from "./pages/Clients/DetailClient";
import UserProfile from './pages/Users/UserProfile';
import ListClient from './pages/Clients/ListClient';
import UpdateClient from './pages/Clients/UpdateClient';
import HomeProduct from './pages/Products/HomeProduct';
import AddProductLine from './pages/Products/AddProductLine';
import AddProduct from './pages/Products/AddProduct';
import DetailProduct from './pages/Products/DetailProduct';
import ListProducts from './pages/Products/ListProductLine';
import DetailProductLine from './pages/Products/DetailProductLine';
import UpdateProductLine from './pages/Products/UpdateProductLine';
import AddContract from './pages/contracts/AddContract';
import AddInvoice from './pages/Invoices/AddInvoice';
import DetailContract from './pages/contracts/DetailContract';
import DetailInvoice from './pages/Invoices/DetailInvoice';
import UpdateContract from './pages/contracts/UpdateContract';
import DaftarFinance from './pages/Finance/DaftarFinance';


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <HalokaNavbar />
          <main className="form-signin">
            <Routes>
              {/* Login logout */}
              <Route path="login/" element={<LoginPage/>} ></Route>
              <Route path="unauthorized/" element={<Unauthorized />} />

              {/* Home */}
              <Route element={<PrivateRoute allowedRoles={['Manager', 'Executive','Partnership','Finance']} />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              {/* User */}
              <Route path="user/detail/:id" element={<UserProfile/>}></Route>

              {/* Client */}
              <Route path="client/" element={<ListClient/>}></Route>
              <Route path="client/detailClient/:id" element={<DetailClient/>}></Route>
              <Route element={<PrivateRoute allowedRoles={['Manager','Partnership','Executive']} />}>
                <Route path="client/:id/update" element={<UpdateClient/>}></Route>
              </Route>

              {/* Product */}
              <Route element={<PrivateRoute allowedRoles={['Manager','Partnership']} />}>
                <Route path="product/" element={<HomeProduct/>}/>
                <Route path="product/product-line/" element={<ListProducts/>}/>
                <Route path="product/product-line/add/" element={<AddProductLine/>}/>
                <Route path="product/product-line-detail/:id" element={<DetailProductLine/>}/>
                <Route path="product/product-line-update/:id" element={<UpdateProductLine/>}/>
                <Route path="product/add" element={<AddProduct/>}/>
                <Route path="product/product-detail/:id" element={<DetailProduct/>}/>
              </Route>

              {/* Contract */}
              <Route element={<PrivateRoute allowedRoles={['Manager','Partnership']} />}>
                <Route path='contract/:id' element={<AddContract/>}/>
                <Route path='contract/update/:id' element={<UpdateContract/>}/>
              </Route>
              
              <Route element={<PrivateRoute allowedRoles={['Manager','Partnership','Finance']} />}>
                <Route path='contract/contract-detail/:id' element={<DetailContract/>}/>
              </Route>

              {/* Invoice */}
              <Route element={<PrivateRoute allowedRoles={['Finance']} />}>
                <Route path="invoice/add/:id" element={<AddInvoice/>}/>
                <Route path="invoice/detail/:id" element={<DetailInvoice/>}/>
              </Route>
              
              <Route element={<PrivateRoute allowedRoles={['Manager','Partnership']} />}>
                <Route path='reports/' element={<DaftarFinance/>}/>
              </Route>

            </Routes>
          </main>
          <Footer/>
        </AuthProvider>
      </Router>
    </div>
    

  );
}

export default App;
