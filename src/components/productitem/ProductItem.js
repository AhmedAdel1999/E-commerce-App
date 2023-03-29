import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import "./productitem.css"
const  ProductItem = ({product, isAdmin, deleteProduct, chekProduct,addTocart}) => {
    const cart = useSelector((state)=>state.user.cart)

    const check = () =>{
        let check = false
        cart.forEach(ele => {
            if(ele._id===product._id){
                    check=true
            }
        });
        return check
    }
    
    return (
        <div className="product_card">
            {
                isAdmin && <input type="checkbox" checked={product.checked}
                onChange={() => chekProduct(product._id)} />
            }
           <img src={product.images.url} alt="" />

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <span>${product.price}</span>
                <p>{product.description}</p>
            </div>
            <div className="row_btn">
            {
                isAdmin?
                <>
                    <Link id="btn_buy" to="#!" 
                    onClick={() =>deleteProduct(product._id, { public_id: product.images.public_id})}>
                        Delete
                    </Link>
                    <Link id="btn_view" to={`/edit/${product._id}`}>
                        Edit
                    </Link>
                </>
                : <>
                    <Link id="btn_buy" to="#!" onClick={() => addTocart(product)}>
                        {check()?"inCart":"Buy"}
                    </Link>
                    <Link id="btn_view" to={`/detail/${product._id}`}>
                        View
                    </Link>
                </>
            }  
            </div> 
        </div>
    )
}

export default ProductItem
