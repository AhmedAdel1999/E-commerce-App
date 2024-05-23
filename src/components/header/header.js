import React,{useEffect, useState} from "react";
import {Link,NavLink, useNavigate} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faTimes,faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch,useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { clearUserData } from "../../features/userSlice";
import logo from "../../assets/logo.png"
import "./header.css"

const Navbar = () =>{
    
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {userData} = useSelector((state)=>state.user)
    const showToggle = useMediaQuery({maxWidth:900})
    const[toggle,setToggle]=useState(false)

    const logout = async() =>{
      await dispatch(clearUserData())
      setToggle(false)
      navigate("/")
    }

    useEffect(()=>{
        if(!showToggle){
            setToggle(false)
        }
    },[showToggle])


    let navItems = ()=>{
        if(userData && userData.role==="user"){
            return(
                <React.Fragment>
                    <NavLink onClick={()=>setToggle(false)} to="/">Shop</NavLink>
                    <NavLink onClick={()=>setToggle(false)} to="/payments">payments</NavLink>
                    <Link to="/" onClick={logout}>Logout</Link>
                    <NavLink className="cart-icon" onClick={()=>setToggle(false)} to="/cart">
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span>{userData.cart.length}</span>
                    </NavLink>
                    
                </React.Fragment>
            )
        }else if(userData && userData.role==="admin"){
            return(
                <React.Fragment>
                    <NavLink onClick={()=>setToggle(false)} to="/">Shop</NavLink>
                    <NavLink onClick={()=>setToggle(false)} to="/createproduct">Create Product</NavLink>
                    <NavLink onClick={()=>setToggle(false)} to="/payments">payments</NavLink>
                    <Link to="/" onClick={logout}>Logout</Link>
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                    <NavLink onClick={()=>setToggle(false)} to="/">Shop</NavLink>
                    <NavLink onClick={()=>setToggle(false)} to="/register">Register</NavLink>
                    <NavLink onClick={()=>setToggle(false)} to="/login">Login</NavLink>
                </React.Fragment>
            )
        }
    }

    return(
        <header className="main-header">
            <div className="logo">
                <NavLink onClick={()=>setToggle(false)} to="/">
                    <img
                    loading="lazy"
                    alt="logo-img"
                    src={logo} 
                    />
                </NavLink>
            </div>
            {
                showToggle&&
                <div className="toggeler" onClick={()=>setToggle(!toggle)}>
                    {
                        toggle?
                        <FontAwesomeIcon icon={faTimes} />
                        :
                        <FontAwesomeIcon icon={faBars} />
                    }
                </div>
            }
            <nav 
               className={`routes`}
               style={{
                height:showToggle?toggle?"auto":"0px":"auto",
                padding:showToggle?toggle?"10px 0px":"0px":"0px",
               }}
            >
                {navItems()}
            </nav>
        </header>
    )
}
export default Navbar;