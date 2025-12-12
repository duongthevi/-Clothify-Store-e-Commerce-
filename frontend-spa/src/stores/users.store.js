import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
    selectedUser: null,
    searchQuery: '',
    searchResult: {
      users: [],
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
      return state.searchQuery.trim() !== '' && state.searchResult.users.length > 0
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
    setUsersData({ users, metadata }) {
      this.users = users
      this.metadata = metadata
    },

    setSelectedUser(user) {
      this.selectedUser = user
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setSearchResult({ users, metadata }) {
      this.searchResult.users = users
      this.searchResult.metadata = metadata
    },

    resetSearch() {
      this.searchQuery = ''
      this.searchResult = {
        users: [],
        metadata: {
          totalRecords: 0,
          firstPage: 1,
          lastPage: 1,
          page: 1,
          limit: 5,
        },
      }
    },

    clear() {
      this.users = []
      this.metadata = {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 5,
      }
      this.selectedUser = null
      this.resetSearch()
    },
  },
})
