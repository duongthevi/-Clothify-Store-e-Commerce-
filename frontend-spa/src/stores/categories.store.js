import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
    selectedCategory: null,
  }),

  getters: {
    totalPages(state) {
      return state.metadata.lastPage
    },
    currentPage(state) {
      return state.metadata.page
    },
    categoryOptions: (state) => state.categories.map((c) => ({ label: c.name, value: c.id })),
  },

  actions: {
    setCategoriesData({ categories, metadata }) {
      this.categories = categories
      this.metadata = metadata
    },

    setSelectedCategory(category) {
      this.selectedCategory = category
    },

    setPage(page) {
      this.metadata.page = page
    },

    clear() {
      this.categories = []
      this.metadata = {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 5,
      }
      this.selectedCategory = null
    },
  },
})
