import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Ring } from 'react-cssfx-loading';
import "./productcard.css"
import CustomBtn from '../customBtn';

const  ProductCard = ({product,deleteProduct,isDeleting,checkProduct,addTocart}) => {

    const {userData} = useSelector((state)=>state.user)
    const [currentProID,setCurrentProID] = useState("")

    const isProductINCart = () =>{
        let check = false
        userData.cart?.forEach(ele => {
            if(ele.id===product.id){
                    check=true
            }
        });
        return check
    }
    
    return (
        <div className="product_card">
            {
                userData.role==="admin" && <input type="checkbox" checked={product.checked}
                onChange={() => checkProduct(product.id)} />
            }
           <img src={product.image} alt="product-item-img" loading='lazy' />

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <p>
                    <span>price:</span>
                    <span>${product.price}</span>
                </p>
                <p>
                    <span>category:</span>
                    <span>{product.category}</span>
                </p>
            </div>
            <div className="products-actions">
            {
                userData.role==="admin"?
                <>
                    <CustomBtn 
                      content={"Delete"} bgColor={"#1f2f98"}
                      isLoading={isDeleting&&(currentProID===product.id)}
                      fontSize={"16px"}
                      clickFun={()=>{
                        deleteProduct(product.id)
                        setCurrentProID(product.id)
                      }}
                    />
                    <CustomBtn 
                      content={"Edit"} bgColor={"#1f2f98"}
                      fontSize={"16px"}
                      link={`/editproduct/${product.id}`}
                    />
                </>
                : 
                <>
                    {
                        isProductINCart()?
                        <CustomBtn 
                            content={"inCart"} bgColor={"#1f2f98"}
                            fontSize={"16px"}
                        />
                        :
                        <CustomBtn 
                            content={"Add Cart"} bgColor={"#1f2f98"}
                            isLoading={currentProID===product.id && userData.token}
                            fontSize={"16px"}
                            clickFun={()=>{
                                addTocart(product)
                                setCurrentProID(product.id)
                            }}
                        />
                    }
                    <CustomBtn 
                      content={"View"} bgColor={"#1f2f98"}
                      fontSize={"16px"}
                      link={`/productdetails/${product.id}`}
                    />
                </>
            }  
            </div> 
        </div>
    )
}

export default ProductCard
