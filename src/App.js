import React from 'react';
import { Route,Routes,BrowserRouter } from 'react-router-dom';
import Cart from './pages/cartPage/Cart';
import Login from './pages/authPage/Login';
import Register from './pages/authPage/Register';
import Products from './pages/productsPage/Products';
import ProductDetail from './pages/productDetailPage/ProductDetail';
import CreateProducts  from './pages/createproductPage/CreateProduct';
import AllPayments from './pages/paymentpages/allPayments';
import PaymentDetails from './pages/paymentpages/paymentDetails';
import ScrollButton from './components/scrollbutton/scrollButton';
import PageNotFound from './pages/pagenotfound/PageNotFound';
import ProtectedAdmin from './components/protectedAdmin';
import ProtectedRoute from "./components/protectedRoute"
import Navbar from './components/header/header';
import './App.css';




const  App = () => {    
  return (
    <div className="App">
      <BrowserRouter>
         <Navbar />
         <ScrollButton />
         <Routes>
           <Route path="/" element={<Products />} />
           <Route path="/register" element={<Register />} />
           <Route path="/login" element={<Login />}/>
           <Route path="/createproduct" element={<ProtectedAdmin><CreateProducts /></ProtectedAdmin>} />
           <Route path="/editproduct/:id" element={<ProtectedAdmin><CreateProducts /></ProtectedAdmin>} />
           <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
           <Route path="/payments" element={<ProtectedRoute><AllPayments /></ProtectedRoute>}/>
           <Route path="/payment/:id" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>}/>
           <Route path="/productdetails/:id" element={<ProductDetail />}/>
           <Route path="*" element={<PageNotFound />} />
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;