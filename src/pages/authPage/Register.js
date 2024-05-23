import React, { useEffect } from "react";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { cleanUserState,register } from "../../features/userSlice";
import { useToasts } from "react-toast-notifications";
import ErrorMsg from "../../utils/errorMsg"
import CustomBtn from "../../components/customBtn";
import * as Yup from "yup";
import "./auth.css"






const Register = () => {

  const {isRegisterLoading,isSuccessRegister,isRegisterError,registerErrMessage} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { addToast:notify } = useToasts()


  useEffect(()=>{
    if(isSuccessRegister){
      dispatch(cleanUserState())
      notify(`User Register Successfully`,
      {appearance: 'success',autoDismiss:"true"})
      navigate("/")
    }
  },[isSuccessRegister])

  const onSubmit = async(values)=>{
    dispatch(register({...values,role:"user"}))
  }


  

  const schema = () =>{
    const schema = Yup.object().shape({
      name:Yup.string().min(3, 'Too Short!').required("required"),
      email:Yup.string().email("email must be like this example@gmail.com").required("required"),
      password:Yup.string().min(6, 'Too Short!').required("required"),
    })
    return schema
  }


  return (
    <div className="auth">
        <div className="auth-content">
          <h3 className="auth-header">
             Register Form
          </h3>
          {
            isRegisterError&&
            <ErrorMsg msg={registerErrMessage} />
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

              <CustomBtn 
                  content={"Register"} type="submit"
                  isLoading={isRegisterLoading}
                  bgColor={"#1f2f98"} fontSize={"18px"} 
              />
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
