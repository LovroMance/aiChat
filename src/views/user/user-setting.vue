<script setup>
import { useAddUserProfileCard } from '@/composables/user/addUserProfileCard'
const { searchUserProfile } = useAddUserProfileCard()
</script>

<template>
  <div>
    <button @click="searchUserProfile({ account: 12345678 })">Search User Profile</button>
  </div>
</template>
