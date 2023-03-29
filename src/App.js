import React, { useEffect, useState } from 'react';
import {BrowserRouter,Route,Switch} from "react-router-dom"
import Products from './components/products/Products';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navroute from './components/navroute/Navroute';
import CreateProducts  from './components/createproduct/CreateProduct';
import Cart from './components/cart/Cart';
import ProductDetail from './components/productdetail/ProductDetail';
import Categories from './components/category/Categories';
import OrderHistory from './components/history/OrderHistory';
import OrderDetails from './components/history/OrderDetails';
import ScrollButton from './components/scrollbutton/scrollButton';
import PageNotFound from './components/pagenotfound/PageNotFound';
import { IsAdmin, IsLogged, GetConfig } from './components/utils/UserData';
import { useDispatch, useSelector } from 'react-redux';
import { userInfo } from './features/shop/userSlice';
import './App.css';


    const  App = () => {
    const isLogged =  IsLogged()
    const isAdmin=IsAdmin()
    const config= GetConfig()
    const dispatch = useDispatch();
    const[AppHeight,setAppHeight]=useState(`100vh`)
    const token = useSelector((state)=>state.user.token)
    
    useEffect(()=>{
    const fun = async() =>{
      if(token){
        await dispatch(userInfo(config))
      }
    }
    setAppHeight(`${window.innerHeight - 1}px`)
    fun();
    },[token])
  return (
    <div className="App" style={{height:AppHeight}}>
      <BrowserRouter>
         <Navroute />
         <ScrollButton />
         <Switch>
           <Route path="/" exact strict component={Products} />
           <Route path="/register" exact strict component={Register} />
           <Route path="/login" exact strict component={Login}/>
           <Route path="/create" exact strict component={isAdmin?CreateProducts:PageNotFound}/>
           <Route path="/edit/:id" exact strict component={isAdmin?CreateProducts:PageNotFound}/>
           <Route path="/categories" exact strict component={isAdmin?Categories:PageNotFound}/>
           <Route path="/history" exact strict component={isLogged?OrderHistory:PageNotFound}/>
           <Route path="/history/:id" exact strict component={isLogged?OrderDetails:PageNotFound}/>
           <Route path="/cart" exact strict component={isLogged?Cart:PageNotFound}/>
           <Route path="/detail/:id" exact strict component={ProductDetail}/>
           <Route path="*" component={PageNotFound} />
         </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;