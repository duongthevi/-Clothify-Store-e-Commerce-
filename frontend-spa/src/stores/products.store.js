import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
    selectedProduct: null,
    searchQuery: '',
    searchResult: {
      products: [],
      metadata: {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 5,
      },
    },
  }),

  getters: {
    hasSearchResults(state) {
      return state.searchQuery.trim() !== '' && state.searchResult.products.length > 0
    },
    totalPages(state) {
      return state.metadata.lastPage
    },
    currentPage(state) {
      return state.metadata.page
    },
    searchTotalPages(state) {
      return state.searchResult.metadata.lastPage
    },
    searchCurrentPage(state) {
      return state.searchResult.metadata.page
    },
  },

  actions: {
    // Dữ liệu chính
    setProductsData({ products, metadata }) {
      this.products = products
      this.metadata = metadata
      this.setPage(metadata.page)
    },
    setPage(page) {
      this.metadata.page = page
    },
    setLimit(limit) {
      this.metadata.limit = limit
    },

    // Tìm kiếm
    setSearchQuery(query) {
      this.searchQuery = query
    },
    setSearchResult({ products, metadata }) {
      this.searchResult.products = products
      this.searchResult.metadata = metadata
    },
    setSearchPage(page) {
      this.searchResult.metadata.page = page
    },
    setSearchLimit(limit) {
      this.searchResult.metadata.limit = limit
    },

    setSelectedProduct(product) {
      this.selectedProduct = product
    },

    // Reset
    resetSearch() {
      this.searchQuery = ''
      this.searchResult = {
        products: [],
        metadata: {
          totalRecords: 0,
          firstPage: 1,
          lastPage: 1,
          page: 1,
          limit: 5,
        },
      }
    },
    resetMetadata() {
      this.metadata = {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 5,
      }
    },
    clear() {
      this.products = []
      this.selectedProduct = null
      this.resetMetadata()
      this.resetSearch()
    },
  },
})
