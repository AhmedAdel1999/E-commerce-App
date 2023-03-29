import React,{useState} from "react";
import {Link,NavLink} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faTimes,faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch,useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { logout as logoutt } from "../../features/shop/userSlice";
import { GetToken, IsAdmin, IsUser } from "../utils/UserData";
import "./navbar.css"

const Navroute = () =>{

    const{token,user,isAdmin} = {token:GetToken(),user:IsUser(),isAdmin:IsAdmin()}
    const cart = useSelector((state)=>state.user.cart)
    const dispatch = useDispatch();
    const isShowToggle = useMediaQuery({maxWidth:992})
    const[toggle,setToggle]=useState(false)

    const logout = async() =>{
      await dispatch(logoutt())
      setToggle(false)
      window.location.href="/"
    }
    let nav = ()=>{
        if(token && user){
            return(
                <React.Fragment>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/">Shop</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/history">History</NavLink></li>
                    <li><Link to="/" onClick={logout}>Logout</Link></li>
                    <li>
                        <NavLink onClick={()=>setToggle(false)} exact to="/cart">
                            <FontAwesomeIcon icon={faCartPlus} />
                            <span>{cart.length}</span>
                        </NavLink>
                    </li>
                </React.Fragment>
            )
        }else if(token && isAdmin){
            return(
                <React.Fragment>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/">Products</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/create">Create Products</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/categories">Categories</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/history">History</NavLink></li>
                    <li><Link to="/" onClick={logout}>Logout</Link></li>
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/">Shop</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/register">Register</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/login">Login</NavLink></li>
                </React.Fragment>
            )
        }
    }
    let style={
        overflow:toggle?"visible":"hidden",
        height:isShowToggle===false?"auto":toggle===true?token?isAdmin?"200px":"160px":"120px":"0px"
    }

    return(
        <div className="navbar-section">
               <div className="logo">
                    <NavLink onClick={()=>setToggle(false)} to="/">
                    {isAdmin?"ADMIN":"Online Shop"}
                    </NavLink>
                </div>
                {
               isShowToggle&&
               <div className="toggel" onClick={()=>setToggle(!toggle)}>
                   {
                       toggle?
                       <FontAwesomeIcon icon={faTimes} />
                       :
                       <FontAwesomeIcon icon={faBars} />
                   }
               </div>
           }
            <ul className="links" style={{...style}}>
               {nav()}
            </ul>
        </div>
    )
}
export default Navroute;