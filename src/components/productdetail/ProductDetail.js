import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { addToCart,userInfo,clearState } from '../../features/shop/userSlice'
import { useToasts } from "react-toast-notifications"
import {useParams} from 'react-router-dom'
import { GetConfig } from '../utils/UserData'
import ProductItem from '../productitem/ProductItem'
import "./productdetail.css"

function ProductDetail() {
    const {id} = useParams()
    const dispatch = useDispatch()
    const config = GetConfig()
    const {addToast:notify} = useToasts()
    const products = useSelector((state)=>state.product.products)
    const {cart,token,isError,isSuccess,errorMsg,successMsg} = useSelector((state)=>state.user)
    let detailProduct=products.filter((ele)=>ele._id===id)[0]


    useEffect(()=>{
        dispatch(clearState())
    },[])

    useEffect(()=>{
        const fun = async () =>{
            await dispatch(userInfo(config))
            dispatch(clearState())
        }
        if(isSuccess){
            notify(`${successMsg}`,{
                appearance: 'success',
                autoDismiss:"true"
            })
            fun();
        }else if(isError){
            notify(`${errorMsg}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
        }
    },[isError,isSuccess])

    const chech = (id) =>{
        let chech=false;
        cart.forEach((x)=>{
          if(x._id===id){
            chech=true
          }
        })
        return chech
    }
    const addTocart = async (product) =>{
        const cartData={cart: [...cart, {...product, quantity: 1}]}
        if(token){
            if(chech(product._id)){
                notify(`This Product Already In The Cart`,{
                    appearance: 'warning',
                    autoDismiss:"true"
                })
            }else{
              await dispatch(addToCart({cartData,config}))
            }
        }else{
            notify(`You Have To Login First`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
        }
    }
    return (
        <div className='product-detail'>
            <div className="detail">
                <div className='prod-img'>
                   <img src={detailProduct.images.url} alt="" />
                </div>
                <div className="box-detail">
                    <div className="header">
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <span>$ {detailProduct.price}</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p style={{fontWeight:"bold"}}>Sold: {detailProduct.sold}</p>
                    <button className="cart"
                    onClick={() => addTocart(detailProduct)}>
                        {chech(detailProduct._id)?"inCart":"Buy Now"}
                    </button>
                </div>
            </div>

            <div className='related-products'>
                <h2>Related products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category 
                                ? <ProductItem key={product._id} product={product} addTocart={addTocart} /> : null
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
