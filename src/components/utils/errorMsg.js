import React from "react";
import { Alert } from "react-bootstrap";
const ErrorMsg = ({msg}) =>{
    return(
        <div>
            <Alert variant="danger">
                {msg}
            </Alert>
        </div>
    )
}
export default ErrorMsg;