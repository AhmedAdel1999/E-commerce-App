import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import {fetchInstance} from '../utils/constants';

const initialState = {
  userData:{},
  allUsers:[],
  isRegisterLoading:false,
  isLoggedINLoading:false,
  isSuccessLoggedIn:false,
  isSuccessRegister:false,
  isLoginError:false,
  isRegisterError:false,
  loginErrMessage:"",
  registerErrMessage:"",
  updateUserCartError:false,
  updateUserCartErrMsg:"",
};

export const register =createAsyncThunk(
  "users/register",
  async(obj,{ rejectWithValue,fulfillWithValue })=>{

    const {email} = obj
    let isExist = false

    try{
      const response = await fetchInstance.get("/users")
      const data = await response.data

      if(data.length>0){
          for(let i=0; i<data.length; i++){
            if(data[i].email===email){
              isExist = true
              return rejectWithValue("This User Is Already Registered");
            }
          }

          if(!isExist){
            const response = await fetchInstance.post("/users",obj)
            const data = await response.data
            return fulfillWithValue(data)
          }
        
      }else{
        const response = await fetchInstance.post("/users",obj)
        const data = await response.data
        return fulfillWithValue(data)
      }

    }catch(error){
        return rejectWithValue(error.response.data)
    }
  }
)



export const login =createAsyncThunk(
  "users/login",
  async(obj,{ rejectWithValue,fulfillWithValue })=>{

    const{password,email}=obj
    let isExist = false
    let userId

    try{

      const response = await fetchInstance.get("/users")
      const data = await response.data

      if(data.length){

        for(let i=0; i<data.length; i++){
            if(data[i].email===email&&data[i].password===password){
                isExist=true
                 userId=data[i].id
                break;
            }
        }

        if(isExist){
          let currentUser = data.filter((user)=>user.id===userId)[0]
          return fulfillWithValue({...currentUser})
        }else{
          return rejectWithValue("user not found or password don,t match")
        }

      }else{
        return rejectWithValue("user not found")
      }

    }catch(error){
        return rejectWithValue(error.response.data)
    }
  }
)

export const updateUserCart =createAsyncThunk(
  "user/updateUserCart",
  async({updatedUser,userId},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await fetchInstance.put(`users/${userId}`,updatedUser)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)


export const getAllUsers =createAsyncThunk(
  "user/getAllUsers",
  async(undefined,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await fetchInstance.get(`users`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    clearUserData:((state)=>{
      state.userData={}
      state.allUsers=[]
    }),

    cleanUserState:((state)=>{
      state.isRegisterLoading = false;
      state.isLoggedINLoading = false;
      state.isSuccessLoggedIn = false;
      state.isSuccessRegister = false;
      state.isLoginError = false;
      state.isRegisterError = false;
      state.loginErrMessage = "";
      state.registerErrMessage = ""
      state.loadProductToCart=false;
      state.updateUserCartError=false;
      state.updateUserCartErrMsg="";
    }),

    increaseProduct:((state,action)=>{
      state.userData.cart.forEach((product)=>{
        if(product.id===action.payload){
          product.quantity+=1
        }
      })
    }),
    decreaseProduct:((state,action)=>{
      state.userData.cart.forEach((product)=>{
        if(product.id===action.payload){
          if(product.quantity===1){
            product.quantity=1
          }else{
            product.quantity-=1
          }
        }
      })
    }),
  },
  extraReducers:{

    //register actions
    [register.pending]:((state)=>{
      state.isRegisterLoading=true
    }),
  
    [register.fulfilled]:((state,action)=>{
      state.isSuccessRegister=true
      state.isRegisterLoading=false
      state.userData={
        ...action.payload,
        token:Math.random().toString(36).slice(2)
      }
    }),

    [register.rejected]:((state,action)=>{
      state.isRegisterError=true
      state.isRegisterLoading=false
      state.registerErrMessage=action.payload
    }),

     
    //login actions
    [login.pending]:((state)=>{
      state.isLoggedINLoading=true
    }),

    [login.fulfilled]:((state,action)=>{
      state.isSuccessLoggedIn=true
      state.isLoggedINLoading=false
      state.userData={
        ...action.payload,
        token:Math.random().toString(36).slice(2)
      }
    }),

    [login.rejected]:((state,action)=>{
      state.isLoginError=true
      state.isLoggedINLoading=false
      state.loginErrMessage=action.payload
    }),

    //add product to cart
    [updateUserCart.fulfilled]:((state,action)=>{
      state.userData={...action.payload}
    }),

    [updateUserCart.rejected]:((state)=>{
      state.updateUserCartError=true
      state.updateUserCartErrMsg="Failed To Update User Cart"
    }),

    //get all users
    [getAllUsers.fulfilled]:((state,action)=>{
      state.allUsers=[...action.payload]
    }),
  }
});
export const { clearUserData,cleanUserState,increaseProduct,decreaseProduct } = userSlice.actions
export default userSlice.reducer;
