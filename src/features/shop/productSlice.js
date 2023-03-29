import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/baseUrl';
const initialState = {
  isError:false,
  isSuccess:false,
  isLoading:false,
  successMsg:"",
  errorMsg:"",
  result:0,
  products: [],
  status: 'idle',
};

export const createProduct =createAsyncThunk(
  "product/createProduct",
  async({product, formData,config,imgConfig},{fulfillWithValue,rejectWithValue})=>{
    try {
      const res = await axiosInstance.post('/api/upload',formData,{...imgConfig})
      const images=await res.data
      let response = await axiosInstance.post("/api/products",{...product,images},{...config})
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const UpdateProduct =createAsyncThunk(
  "product/UpdateProduct",
  async({id,product,image,formData,config,imgConfig},{fulfillWithValue,rejectWithValue})=>{
    try {
      if(image.url){
        let response = await axiosInstance.put(`/api/products/${id}`,{...product,images:{...image}},{...config})
        return fulfillWithValue(await response.data)
      }else{ 
        const res = await axiosInstance.post('/api/upload',formData,{...imgConfig})
        const images=await res.data
        let response = await axiosInstance.put(`/api/products/${id}`,{...product,images},{...config})
        return fulfillWithValue(await response.data)
      }
      
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

const deleteItem = async(id,public_id,config) =>{
  let destroy= axiosInstance.post("/api/destroy",{public_id},{...config})
  let response = axiosInstance.delete(`/api/products/${id}`,{...config})
  await destroy
  await response
}

export const deleteProduct =createAsyncThunk(
  "product/deleteProduct",
  async({id,publicid,config},{fulfillWithValue,rejectWithValue})=>{
    try {
      await deleteItem(id,publicid,config)
      return fulfillWithValue(true)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

export const deleteCheckedProducts =createAsyncThunk(
  "product/deleteCheckedProducts",
  async({products,config},{fulfillWithValue,rejectWithValue})=>{
    let testCheck=false;
    for(let i=0; i<products.length; i++){
      try {
        if(products[i].checked===true){
          testCheck=true
         await deleteItem(products[i]._id,{public_id:products[i].images.public_id},config)
        }
      }catch (error) {
        return rejectWithValue(error.response)
      }
    }
    if(testCheck===false){
      return rejectWithValue(false)
    }else{
      return fulfillWithValue(true)
    }
    
  }
)
export const ourProducts =createAsyncThunk(
  "product/ourProducts",
  async({page,category,sort,search},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    //check all products
    checkAllPro:((state,action)=>{
      let newProduct =[]
       state.products.forEach((x)=>{
          let newpro={...x,checked:action.payload}
          newProduct.push(newpro)
        })
        state.products=[...newProduct]
    }),

    //check one product
    checkOnePro:((state,action)=>{
      state.products.forEach((x)=>{
        if(x._id===action.payload){
          x.checked=!x.checked
        }
      })
    }),

    //clear state
    clearState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.successMsg="";
      state.errorMsg="";
    })
  },
  extraReducers:{


    //create new product
    [createProduct.pending]:((state)=>{
      state.isLoading=true;
    }),
    [createProduct.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`A New Product Has Been Add Successfully`
    }),
    [createProduct.rejected]:((state)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=` Error!! Failed To Add A New Product`
    }),

    //update product
    [UpdateProduct.pending]:((state)=>{
      state.isLoading=true;
    }),
    [UpdateProduct.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`Product Has Been Updated Successfully`
    }),
    [UpdateProduct.rejected]:((state)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=` Error!! Failed To Update Product`
    }),

    //delete one product
    [deleteProduct.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.successMsg=`Product Has Been Deleted Successfully`
    }),
    [deleteProduct.rejected]:((state)=>{
      state.isError=true;
      state.errorMsg=`Error!! Failed To Delete Product`
    }),

    //delete all products
    [deleteCheckedProducts.fulfilled]:((state)=>{
      state.isSuccess=true
      state.successMsg=`Checked Products Have Been Deleted`
    }),
    [deleteCheckedProducts.rejected]:((state,action)=>{
      state.isError=true
      state.errorMsg=action.payload===false?"You Have To Check Some Products First":"Error!! Failed To Delete Products"
    }),

    //get all products
    [ourProducts.fulfilled]:((state,action)=>{
      state.products=[...action.payload.products]
      state.result=action.payload.result
    }),
  }
});

export const { checkAllPro,checkOnePro,clearState } = productSlice.actions
export default productSlice.reducer;
