import React from "react"
import { Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
const CustomBtn = ({content,isLoading=false,bgColor,fontSize,link,type,clickFun=()=>{}}) =>{

    let styles = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        outline: "none",
        border: "none",
        borderRadius: "7px",
        padding: "7px 15px",
        backgroundColor:bgColor,
        color: "#fff",
        fontWeight: "bold",
        fontSize
    }
    return(
        <button 
            type={type?type:"button"} 
            style={{...styles }}
            onClick={clickFun}
        >
            {
                link?
                <Link 
                    style={{
                        color:"#fff",
                        textDecoration:"none",
                        display:"block",
                        width:"100%",
                        height:"100%",
                    }}
                    to={link}
                >
                    {content}
                </Link>
                :
                <React.Fragment>
                    <span>{content}</span>
                    {
                        isLoading&&
                        <Spinner animation="border"  style={{width:"20px",height:"20px"}} />
                    }
                </React.Fragment>
            }
        </button>
    )
}
export default CustomBtn