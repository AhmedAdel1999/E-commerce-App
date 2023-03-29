import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/baseUrl';
const initialState = {
  token:null,
  role:null,
  isError:false,
  isSuccess:false,
  isLoading:false,
  errorMsg:"",
  successMsg:"",
  cart:[],
  status: 'idle',
};

export const register =createAsyncThunk(
  "user/register",
  async(values,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.post("/user/register",values)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

export const login =createAsyncThunk(
  "user/login",
  async(values,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.post("/user/login",values)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const logout =createAsyncThunk(
  "user/logout",
  async()=>{
    try {
      let response = await axiosInstance.get("/user/logout")
      return await response.data.accesstoken
    } catch (error) {
      return error.response
    }
  }
)

export const userInfo =createAsyncThunk(
  "user/userInfo",
  async(config,{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.get("/user/infor",config)
      return fulfillWithValue({
        role:response.data.role,
        cart:response.data.cart
      })
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)


export const addToCart =createAsyncThunk(
  "user/addToCart",
  async({cartData,config},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.patch("/user/addcart",cartData,config)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const Cartpayment =createAsyncThunk(
  "user/Cartpayment",
  async({paymentdata,config},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.post("/api/payment",{...paymentdata},config)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.successMsg="";
      state.errorMsg=""
    }),
    increaseProduct:((state,action)=>{
      state.cart.forEach((x)=>{
        if(x._id===action.payload){
          x.quantity+=1
        }
      })
    }),
    decreaseProduct:((state,action)=>{
      state.cart.forEach((x)=>{
        if(x._id===action.payload){
          x.quantity-=1
          if(x.quantity===0){
            x.quantity=1
          }
          
        }
      })
    }),
    removeProduct:((state,action)=>{
      state.cart=[...state.cart.filter((x)=>x._id!==action.payload)]
    }),
  },
  extraReducers:{

    //user register
    [register.pending]:((state)=>{
      state.isLoading=true
    }),
    [register.fulfilled]:((state)=>{
      state.isSuccess=true
      state.isLoading=false
    }),
    [register.rejected]:((state,action)=>{
      state.isError=true
      state.isLoading=false
      state.errorMsg=`${action.payload.data.msg}`
    }),

    //login user
    [login.pending]:((state)=>{
      state.isLoading=true
    }),
    [login.fulfilled]:((state,action)=>{
      state.isSuccess=true
      state.isLoading=false
      state.token=action.payload.accesstoken
    }),
    [login.rejected]:((state,action)=>{
      state.isError=true
      state.isLoading=false
      state.errorMsg=`${action.payload.data.msg}`
    }),
    
    //logout user
    [logout.fulfilled]:((state)=>{
      state.token=null
      state.role=null
    }),

    //get user info
    [userInfo.fulfilled]:((state,action)=>{
      state.cart=[...action.payload.cart]
      state.role=action.payload.role
    }),

    //add product to card
    [addToCart.fulfilled]:((state,action)=>{
      if(action.payload.cart.length>0 && action.payload.cart.length>state.cart.length ){
        state.isSuccess=true;
        state.successMsg=`A New Product Has Been Added To Card`
      }  
    }),
    [addToCart.rejected]:((state)=>{
      state.isError=true;
      state.errorMsg=`Error!! Failed To Add New Product To Card`
    }),

    [Cartpayment.fulfilled]:((state)=>{
      state.cart=[]
    }),
  }
});
export const{clearState,increaseProduct,decreaseProduct,removeProduct}=userSlice.actions
export default userSlice.reducer;
