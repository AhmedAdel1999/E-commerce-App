import React from 'react'
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'
import TableShared from '../../components/tableshared/tableShared'
import "./allpayments.css"


const PaymentDetails = () => {

    const {id} = useParams()
    const {userData,allUsers} = useSelector((state)=>state.user)
    const allUsersPayments = allUsers.filter((user)=>user.payment.length).map((ele)=>ele.payment).flat()
    const currentPayments = userData.role==="admin"?allUsersPayments:[...userData.payment]
    const paymentData = currentPayments.filter((item)=>item.paymentID===id)[0]


    const tableUserHeader=["Name","Address","Postal Code","Country Code"]
    const tableDetailsHeader=["Image","Product Name","Quantity","Price"]

    const tableUserBody=[
        {
            cell1:paymentData.address.recipient_name,
            cell2:paymentData.address.line1 + " - " + paymentData.address.city,
            cell3:paymentData.address.postal_code,
            cell4:paymentData.address.country_code
        }
    ]

    const tableDetailsBody = paymentData.paiedProducts.map((item)=>{
        return{
            cell1:(<img alt='product-img' src={item.image} loading='lazy' />),
            cell2:item.title,
            cell3:item.quantity,
            cell4:`$${item.price}`
        }
    })

    
    return (
        <div className="payments-page">
            <div className='payments-data'>
               <TableShared tableHeader={tableUserHeader} tableBody={tableUserBody} />
            </div>
            <div className='payments-data'>
            <TableShared tableHeader={tableDetailsHeader} tableBody={tableDetailsBody} />
            </div>
        </div>
    )
}

export default PaymentDetails
