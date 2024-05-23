import React, { useEffect } from "react";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { cleanUserState,login } from "../../features/userSlice";
import { useToasts } from "react-toast-notifications";
import ErrorMsg from "../../utils/errorMsg"
import CustomBtn from "../../components/customBtn";
import * as Yup from "yup";
import "./auth.css"



const Login = () => {

  const {isLoggedINLoading,isSuccessLoggedIn,isLoginError,loginErrMessage} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { addToast:notify } = useToasts()

  const onSubmit = async(values)=>{
    dispatch(login(values))
  }


  useEffect(()=>{
    if(isSuccessLoggedIn){
      dispatch(cleanUserState())
      notify(`Welcome You Have Successfully Logged In`,
      {appearance: 'success',autoDismiss:"true"})
      navigate("/")
    }
  },[isSuccessLoggedIn])

  const schema = () =>{
    const schema = Yup.object().shape({
      email:Yup.string().email("email must be like this example@gmail.com").required("required"),
      password:Yup.string().min(6, 'Too Short!').required("required"),
    })
    return schema
  }


  return (
    <div className="auth">
        <div className="auth-content">
          <h3 className="auth-header">
            Login Form
          </h3>
          {
            isLoginError&&
            <ErrorMsg msg={loginErrMessage} />
          }
          <Formik 
            initialValues={{
            email:"admin@gmail.com",
            password:"123456",
            }}
            onSubmit={onSubmit}
            validationSchema={schema}
          >
            <Form>
              <div>
                <Field type="email" name="email" placeholder="Email*" />
                <ErrorMessage name="email" component="span" />
              </div>

              <div>
                <Field type="password" name="password" placeholder="Password*" />
                <ErrorMessage name="password" component="span" />
              </div>

              <CustomBtn 
                  content={"Login"} type="submit"
                  isLoading={isLoggedINLoading}
                  bgColor={"#1f2f98"} fontSize={"18px"} 
              />
            </Form>
          </Formik>
          <div className="redirect">
                <span>Do you have account?</span>
                <span><Link to="/register">Register</Link></span>
              </div>
        </div>
    </div>
  );
}

export default Login;
