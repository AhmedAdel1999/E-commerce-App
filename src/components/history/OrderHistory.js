import React,{useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Orderhistory } from '../../features/shop/historySlice'
import { Link } from 'react-router-dom'
import { GetConfig, IsAdmin } from '../utils/UserData'
import "./OrderHistory.css"

const OrderHistory = () => {

    const {config,isAdmin} = {config:GetConfig(),isAdmin:IsAdmin()}
    const history = useSelector((state)=>state.history.history)
    const dispatch = useDispatch()

    useEffect(() => {
        if(isAdmin){
            dispatch(Orderhistory({path:'/api/payment',config}))
        }else{
            dispatch(Orderhistory({path:'/user/history',config})) 
        } 
    },[dispatch,isAdmin])

    return (
        <div className="history-page">
            <h2>History</h2>

            <h4>You have {history.length} ordered</h4>

            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date of Purchased</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                <td><Link to={`/history/${items._id}`}>View</Link></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory
