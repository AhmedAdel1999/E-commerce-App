import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useToasts } from "react-toast-notifications"
import {useParams} from 'react-router-dom'
import { cleanUserState, updateUserCart } from '../../features/userSlice'
import ProductItem from '../../components/productcard/Productcard'
import CustomBtn from '../../components/customBtn'
import "./productdetail.css"


function ProductDetail() {
    const {id} = useParams()
    const dispatch = useDispatch()
    const {addToast:notify} = useToasts()
    const [loading,setLoading] = useState(false)
    const {products} = useSelector((state)=>state.product)
    const {userData,updateUserCartError,updateUserCartErrMsg} = useSelector((state)=>state.user)
    let productDetail=products.filter((ele)=>ele.id===id)[0]


    useEffect(()=>{
        if(updateUserCartError){
            notify(`${updateUserCartErrMsg}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
            dispatch(cleanUserState())
        }
    },[updateUserCartError])

    const isProductINCart = (id) =>{
        let check = false
        userData.cart?.forEach(ele => {
            if(ele.id===id){
                    check=true
            }
        });
        return check
    }


    const addTocart = async (product) =>{
        if(userData.token){
            const cart = [...userData.cart, {...product, quantity: 1}]
            let updatedUser={
                ...userData,
                cart
            }
            await dispatch(updateUserCart({updatedUser,userId:userData.id}))
            setLoading(false)
        }else{
            notify(`You Have To Login First`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
            setLoading(false)
        }
    }


    return (
        <div className='product-detail-page'>
            <div className="detail">
                <div className='prod-img'>
                   <img src={productDetail.image} alt="product-img" />
                </div>
                <div className="box-detail">
                    <p>Category: {productDetail.category}</p>
                    <p>Price: ${productDetail.price}</p>
                    <h2>{productDetail.title}</h2>
                    <p className='prod-des'>{productDetail.description}</p>
                    {
                        isProductINCart(productDetail.id)?
                        <CustomBtn 
                          bgColor={"#1f2f98"}
                          content={"inCart"} fontSize={"16px"}
                        />
                        :
                        <CustomBtn 
                          bgColor={"#1f2f98"}
                          content={"inCart"}  fontSize={"16px"}
                          isLoading={loading && userData.token}
                          clickFun={()=>{
                            addTocart(productDetail)
                            setLoading(true)
                          }}
                        />
                    }
                </div>
            </div>

            <div className='related-products'>
                <h2>Related products</h2>
                <div className="all-related">
                    {
                        products.map(product => {
                            return product.category === productDetail.category 
                                ? <ProductItem key={product.id} product={product} addTocart={addTocart} /> : null
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
