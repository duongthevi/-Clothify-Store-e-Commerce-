import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'
import { useProductsStore } from '@/stores/products.store'

function makeProductsService() {
  const API_URL = '/api/products'

  async function getAll(page, limit = 8) {
    const authStore = useAuthStore()
    const productStore = useProductsStore()

    const url = `${API_URL}?page=${page}&limit=${limit}`
    const data = await efetch(url, {
      headers: authStore.authHeaders(),
    })

    productStore.setProductsData({
      products: data.products,
      metadata: data.metadata,
    })

    return data
  }

  async function create(data) {
    const authStore = useAuthStore()
    let options = {
      method: 'POST',
      headers: authStore.authHeaders(true),
      body: null,
      auth: true,
    }

    if (data instanceof FormData) {
      options.body = data
      delete options.headers['Content-Type']
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }

    return await efetch(API_URL, options)
  }

  async function update(id, data) {
    const authStore = useAuthStore()
    let options = {
      method: 'PATCH',
      headers: authStore.authHeaders(true),
      body: null,
      auth: true,
    }

    if (data instanceof FormData) {
      options.body = data
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }

    return await efetch(`${API_URL}/${id}`, options)
  }

  async function remove(id) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authStore.authHeaders(),
    })
  }

  async function getProductsByCategoryId(categoryId) {
    const authStore = useAuthStore()
    const productStore = useProductsStore()
    const data = await efetch(`${API_URL}/category/${categoryId}`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })
    productStore.setProductsData({
      products: data.products,
      metadata: data.metadata,
    })
    return data
  }

  async function searchProducts(query, page = 1, limit = 8) {
    const authStore = useAuthStore()
    const productStore = useProductsStore()

    const url = `${API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    const data = await efetch(url, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })

    productStore.setSearchResult({
      products: data.products,
      metadata: data.metadata,
    })
    return data
  }

  async function getProductById(id) {
    const authStore = useAuthStore()
    const productStore = useProductsStore()
    const data = await efetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })
    const product = data.product || data
    if (product) {
      productStore.setSelectedProduct(product)
    }
    return product
  }

  return {
    getAll,
    create,
    update,
    remove,
    getProductsByCategoryId,
    searchProducts,
    getProductById,
  }
}

export default makeProductsService()
