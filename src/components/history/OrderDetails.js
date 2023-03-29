import React from 'react'
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'
import "./OrderHistory.css"

const OrderDetails = () => {

    const {id} = useParams()
    const history = useSelector((state)=>state.history.history)
    const products = useSelector((state)=>state.product.products)
    let orderDetails=history.filter((ele)=>ele._id===id)[0];

    const isProductExist = (proId) =>{
       let test=false
       products.forEach(ele => {
           if(ele._id===proId){test=true}
       });
       return test;
    }

    if(Object.keys(orderDetails).length === 0) return null;
    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Country Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetails.address.recipient_name}</td>
                        <td>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                        <td>{orderDetails.address.postal_code}</td>
                        <td>{orderDetails.address.country_code}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>image</th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map((item)=>{
                            if(isProductExist(item._id)){
                                return(
                                    <tr key={item._id}>
                                        <td><img src={item.images.url} alt="" /></td>
                                        <td>{item.title}</td>
                                        <td>{item.quantity}</td>
                                        <td>$ {item.price * item.quantity}</td>
                                    </tr>
                                )
                            }else{
                                return(
                                <tr key={Math.random()}>
                                    <td>my be the admin delete this products</td>
                                </tr>
                                )
                            }
                        })
                    }
                    
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetails
