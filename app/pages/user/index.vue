<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  name: 'User',
})

interface User {
  id: number
  name: string
  email: string
  age?: number
  created_at: string
  updated_at: string
}

interface UsersResponse {
  data: User[]
}

const loading = ref(false)
const finished = ref(false)

const { data: usersData, pending: _pending, error: _error, refresh: _refresh } = await useFetch<UsersResponse>('/api/users')

const list = computed(() => usersData.value?.data || [])
async function onLoad() {
  loading.value = true
  console.warn('onLoad')
  loading.value = false
}
</script>

<template>
  <div>
    <van-button>刷新</van-button>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.id" :title="item.name">
        <div>{{ item.email }}</div>
      </van-cell>
    </van-list>
  </div>
</template>
