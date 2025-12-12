<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'

import productsService from '@/services/products.service'
import categoriesService from '@/services/categories.service'

import ProductCard from '@/components/ui/ProductCard.vue'
import MainPagination from '@/components/ui/MainPagination.vue'
import InputSearch from '@/components/ui/InputSearch.vue'
import Banner from '@/assets/images/banner.png'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const currentPage = computed(() => Number(route.query.page) || 1)
const searchQuery = computed(() => route.query.search || '')
const categoryIdQuery = computed(() => route.query.category || '')

useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
    onSuccess(data) {
      console.log("HomeView: Dữ liệu nhận được từ API:", data);
        categoriesStore.setCategoriesData(data)
    },
})

const {
  isPending: isLoading,
  isError,
  error,
  refetch: refetchDefault,
} = useQuery({
  queryKey: ['products', currentPage],
  queryFn: () => productsService.getAll(currentPage.value),
  enabled: computed(() => !searchQuery.value && !categoryIdQuery.value),
  keepPreviousData: true,
  onSuccess(data) {
    productsStore.setProductsData(data)
  },
})

const { refetch: refetchByCategory } = useQuery({
  queryKey: ['products-by-category', categoryIdQuery, currentPage],
  queryFn: () => productsService.getByCategoryId(categoryIdQuery.value, currentPage.value),
  enabled: false,
  onSuccess(data) {
    productsStore.setProductsData(data)
  },
})

watch(
  () => [searchQuery.value, categoryIdQuery.value, currentPage.value],
  async ([search, categoryId, page]) => {
    if (search) {
      productsStore.setSearchQuery(search)
      const res = await productsService.searchProducts(search, page)
      productsStore.setSearchResult(res)
    } else if (categoryId) {

      const selected = categoriesStore.categories.find(c => c.id === categoryId)
      categoriesStore.setSelectedCategory(selected || null)
      await refetchByCategory()
    } else {
      categoriesStore.setSelectedCategory(null)
      productsStore.resetSearch()
      refetchDefault()
    }
  },
  { immediate: true }
)

function changeCurrentPage(page) {
  router.push({ name: 'Home', query: { ...route.query, page } })
}

function handleSearch(query) {
  const trimmed = query.trim()
  router.push({ name: 'Home', query: trimmed ? { search: trimmed, page: 1 } : { page: 1 } })
}

function handleCategoryChange(event) {
  const selectedId = event.target.value || ''
  const selected = categoriesStore.categories.find(c => c.id === selectedId)
  categoriesStore.setSelectedCategory(selected || null)

  router.push({
    name: 'Home',
    query: {
      category: selectedId || '',
      page: 1,
    },
  })
}
</script>

<template>
  <div class="page container mb-5">
    <div class="row">
      <div class="col-12 mt-3">
        <div class="mb-3">
          <img :src="Banner" alt="banner" class="img-fluid w-100 rounded-3 shadow-sm"
            style="height: 180px; object-fit: cover;" />
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4 mb-4">
          <h4 class="m-0">Products <i class="fas fa-box"></i></h4>

          <div class="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
            <select class="form-select" :value="categoriesStore.selectedCategory?.id || ''"
              @change="handleCategoryChange">
              <option value="">All Categories</option>
              <template v-if="categoriesStore.categories.length > 0">
                <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </template>
            </select>

            <InputSearch class="flex-fill" placeholder="Search products..." @search="handleSearch"
              :model-value="productsStore.searchQuery" />
          </div>

        </div>

        <div v-if="isLoading" class="text-center text-secondary py-4">
          <i class="fas fa-spinner fa-spin"></i> Loading products...
        </div>

        <div v-else-if="isError" class="text-danger py-4">
          <i class="fas fa-exclamation-triangle"></i> Error loading products!
          <div v-if="error?.message" class="mt-2">Details: {{ error.message }}</div>
        </div>

        <div v-else>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
            <div v-for="product in productsStore.hasSearchResults
                ? productsStore.searchResult.products
                : productsStore.products" :key="product.id" class="col">
              <ProductCard :name="product.name" :price="product.price" :image="product.image_url" :stock="product.stock" :size="product.size"
                :link="`/products/${product.id}`" />
            </div>
          </div>

          <div class="mt-4 d-flex justify-content-center align-items-center">
            <MainPagination :total-pages="productsStore.hasSearchResults
                ? productsStore.searchTotalPages
                : productsStore.totalPages" :current-page="productsStore.hasSearchResults
                ? productsStore.searchCurrentPage
                : productsStore.currentPage" @update:current-page="changeCurrentPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 1200px;
}
</style>