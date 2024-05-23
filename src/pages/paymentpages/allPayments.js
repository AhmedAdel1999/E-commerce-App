import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TableShared from "../../components/tableshared/tableShared"
import "./allpayments.css"


const AllPayments = () => {

    const {userData,allUsers} = useSelector((state)=>state.user)
    const allUsersPayments = allUsers.filter((user)=>user.payment.length).map((ele)=>ele.payment).flat()
    const currentPayments = userData.role==="admin"?allUsersPayments:[...userData.payment]
    


    const tableHeadr = ["Payment ID","Date of Purchased","Actions"]
    const tableBody = currentPayments&&currentPayments.map((item)=>{
        return{
            cell1:item.paymentID,
            cell2:new Date(item.createdAt).toLocaleDateString(),
            cell3: (<Link to={`/payment/${item.paymentID}`}>View</Link>)
        }
    })

    return (
        <div className="payments-page">
            <div className='payments-header'>
               <h3>All OF {userData.role==="admin"?"":userData.name} Payments</h3>
               <h4>You have {currentPayments.length} {currentPayments.length>1?"orders":"order"}</h4>
            </div>
            {
                tableBody.length?
                <div className='payments-data'>
                    <TableShared tableBody={tableBody} tableHeader={tableHeadr} />
                </div>
                :
                null
            }
        </div>
    )
}

export default AllPayments
