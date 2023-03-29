import React, { useEffect } from "react";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import { useDispatch,useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { clearState,register } from "../../features/shop/userSlice";
import { useToasts } from "react-toast-notifications";
import Load from "../utils/Load";
import ErrorMsg from "../utils/errorMsg"
import * as Yup from "yup";
import "./auth.css"




const Register = () => {

  const{isSuccess,isError,isLoading,errorMsg} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const history = useHistory()
  const { addToast:notify } = useToasts()

  const onSubmit = async(values)=>{
    dispatch(register(values))
  }

  useEffect(()=>{
    dispatch(clearState())
  },[])

  useEffect(()=>{
    if(isSuccess){
      dispatch(clearState())
      notify(`User Register Successfully`,
      {appearance: 'success',autoDismiss:"true"})
      history.push("/login")
    }
  },[isError,isSuccess])

  const schema = () =>{
    const schema = Yup.object().shape({
      name:Yup.string().min(3, 'Too Short!').required("required"),
      email:Yup.string().email("email must be like this example@gmail.com").required("required"),
      password:Yup.string().min(6, 'Too Short!').required("required"),
    })
    return schema
  }

  if(isLoading){
    return <Load />
  }

  return (
    <div className="auth">
        <div className="auth-content">
          <div className="auth-header">
            <span><FontAwesomeIcon icon={faLock} /></span>
            <span>Register</span>
          </div>
          {
            isError&&
            <ErrorMsg msg={errorMsg} />
          }
          <Formik 
            initialValues={{
            name:"",
            email:"",
            password:"",
            }}
            onSubmit={onSubmit}
            validationSchema={schema}
          >
            <Form>
              <div>
                <Field type="text" name="name" placeholder="Username*" />
                <ErrorMessage name="name" component="span" />
              </div>

              <div>
                <Field type="email" name="email" placeholder="Email*" />
                <ErrorMessage name="email" component="span" />
              </div>

              <div>
                <Field type="password" name="password" placeholder="Password*" />
                <ErrorMessage name="password" component="span" />
              </div>

              <button type="submit">Register</button>
            </Form>
          </Formik>
          <div className="redirect">
                <span>Already have account?</span>
                <span><Link to="/login">Login</Link></span>
              </div>
        </div>
    </div>
  );
}

export default Register;
