import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

export const fetchProducts = (params = {}) =>
  client.get("/products", { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  client.get(`/products/${slug}`).then((r) => r.data);

export const fetchCategories = () =>
  client.get("/categories").then((r) => r.data);

export const createOrder = (payload) =>
  client.post("/orders", payload).then((r) => r.data);

export const fetchOrder = (orderNumber) =>
  client.get(`/orders/${orderNumber}`).then((r) => r.data);

export const formatPrice = (value, currency = "EUR") =>
  new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default client;
