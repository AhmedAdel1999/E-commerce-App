import axios from "axios"
const fetchInstance = axios.create({
    baseURL: "https://6638feee4253a866a24fee95.mockapi.io/ecommerce/"
})

const categories = ["books","clothes","sport","medical","shoes","electronics","furniture","beauty"]

export {fetchInstance,categories}