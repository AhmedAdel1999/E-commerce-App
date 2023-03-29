import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useToasts } from "react-toast-notifications"
import PaypalButton from './PaymentButton'
import { GetConfig } from '../utils/UserData'
import { decreaseProduct, increaseProduct, removeProduct,Cartpayment, addToCart } from '../../features/shop/userSlice'
import "./cart.css"
const Cart = () => {
    const config = GetConfig()
    const dispatch = useDispatch()
    const { addToast:notify } = useToasts()
    const cart = useSelector((state)=>state.user.cart)
    let total=0

    const increment = (id) =>{
       dispatch(increaseProduct(id))
    }

    const decrement = (id) =>{
       dispatch(decreaseProduct(id))
    }

    const deleteProduct = async(id) =>{
        const cartData = {cart:[...cart.filter((x)=>x._id!==id)]}
        //eslint-disable-next-line no-restricted-globals
        if(confirm("Do You Want To Delete This Product?")===true){
            await dispatch(removeProduct(id))
            dispatch(addToCart({cartData,config}))
        }
    }
    const tranSuccess = async(payment) => {
        try {
            const {paymentID, address} = payment;
            const cartData={cart: []}
            await dispatch(Cartpayment({paymentdata:{paymentID,address,cart},config:config}))
            await dispatch(addToCart({cartData,config}))
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


    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "3rem"}}>Cart Empty</h2> 

    return (
        <div className='cart-section'>
            {
                cart.map((product)=>{
                    total=total+(product.price*product.quantity)
                    return(
                        <div className="cart-item" key={product._id}>
                            <div className='delete-item'>
                                <span onClick={() => deleteProduct(product._id)}>X</span>
                            </div>
                            <div className='item-details'>
                                <div className='item-img'>
                                   <img src={product.images.url} alt="" /> 
                                </div>
                                <div className='item-info'>
                                    <h2>{product.title}</h2>
                                    <h3>$ {product.price * product.quantity}</h3>
                                    <p>{product.description}</p>
                                    <p>{product.content}</p>
                                    <div className="amount-controll">
                                        <button onClick={() => decrement(product._id)}> - </button>
                                        <span>{product.quantity}</span>
                                        <button onClick={() => increment(product._id)}> + </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })  
            }
            <div className="total-amount">
                <PaypalButton
                total={total}
                tranSuccess={tranSuccess} />
                <h3>Total: $ {total}</h3>
            </div>
        </div>
    )
}

export default Cart
