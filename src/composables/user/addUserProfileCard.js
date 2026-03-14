import { ref } from 'vue'
import { getUserInfo } from '@/api/user'

export function useAddUserProfileCard() {
  const profileCards = ref([])

  const searchUserProfile = async (account) => {
    if (!account) return
    const {
      data: { data: user },
    } = await getUserInfo(account)
    if (!user) return

    const nextCard = {
      ...user,
      signature: '这个人很懒，什么都没有留下',
    }

    const existingIndex = profileCards.value.findIndex((card) => card.account === nextCard.account)
    if (existingIndex >= 0) {
      profileCards.value[existingIndex] = nextCard
      return
    }

    profileCards.value.unshift(nextCard)
    console.log(profileCards.value)
  }

  return {
    profileCards,
    searchUserProfile,
  }
}
