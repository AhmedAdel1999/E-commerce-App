import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useToasts } from "react-toast-notifications"
import { decreaseProduct,increaseProduct,updateUserCart } from '../../features/userSlice'
import PaypalButton from '../../components/PaymentButton'
import "./cart.css"
import CustomBtn from '../../components/customBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'


const Cart = () => {

    const dispatch = useDispatch()
    const { addToast:notify } = useToasts()
    const {userData} = useSelector((state)=>state.user)
    let total=0

    const increment = (id) =>{
       dispatch(increaseProduct(id))
    }

    const decrement = (id) =>{
       dispatch(decreaseProduct(id))
    }

    const deleteProduct = (id) =>{
        const cart = userData.cart.filter((product)=>product.id !== id)
        dispatch(updateUserCart({
            userId:userData.id,
            updatedUser:{
                ...userData,
                cart
            }
        }))
    }

    const clearCart = () =>{
        dispatch(updateUserCart({
            userId:userData.id,
            updatedUser:{
                ...userData,
                cart:[]
            }
        }))
    }

    const tranSuccess = async(payment) => {
        try {
            const {paymentID, address} = payment;
           await dispatch(updateUserCart({
                userId:userData.id,
                updatedUser:{
                    ...userData,
                    cart:[],
                    payment:[
                        ...userData.payment,
                        {
                            paymentID,
                            address,
                            paiedProducts:[
                               ...userData.cart.map((product)=>{
                                return{
                                    id:product.id,
                                    title:product.title,
                                    category:product.category,
                                    price:product.price,
                                    quantity:product.quantity,
                                    userId:product.userId,
                                    image:product.image,
                                }
                               })
                            ],
                            createdAt:new Date()
                        }
                    ]
                }
            }))
            notify(`You Have Successfully Placed An Order.`,{
                appearance: 'success',
                autoDismiss:"true"
            })
        } catch (error) {
            notify(`${error}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
        }
    }


    return (
        <div className='cart-page'>
            {
                !userData.cart.length?
                <h2 className='no-items'>Cart Have No Items..</h2>
                :
                <div className='main-cart-container'>  
                    <div className='cart-items'>
                       {
                        userData.cart.map((product)=>{
                            total=total+(product.price*product.quantity)
                            return(
                                <div className="cart-item" key={product.id}>
                                    <div className='cart-img'>
                                        <img
                                          src={product.image}
                                          alt='cart-img'
                                          loading='lazy'
                                        />
                                        <div>
                                            <h4>{product.title}</h4>
                                            <p>Price: ${product.price}</p>
                                        </div>
                                    </div>
                                    <div className='cart-actions'>
                                        <div className='cart-quantity'>
                                            <FontAwesomeIcon onClick={()=>decrement(product.id)} icon={faMinus} />
                                            <span>{product.quantity}</span>
                                            <FontAwesomeIcon onClick={()=>increment(product.id)} icon={faPlus} />
                                        </div>
                                        <p>${product.quantity * product.price}</p>
                                        <div className='delete-item'>
                                            <FontAwesomeIcon onClick={()=>deleteProduct(product.id)} icon={faTimes} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                       }
                    </div>
                    <div className='cart-header'>
                      <div>
                        <h3>Total:${total}</h3>
                        <PaypalButton
                            total={total}
                            tranSuccess={tranSuccess} 
                        />
                      </div>
                      <CustomBtn 
                            bgColor={"#1f2f98"}
                            fontSize={"16px"}
                            content={`Clear (${userData.cart.length})`}
                            clickFun={clearCart}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default Cart
