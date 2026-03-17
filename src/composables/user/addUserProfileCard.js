import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
import { sendFriendRequestAPI } from '@/api/relationship'

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
      message: '你好，很高兴认识你~',
    }

    const existingIndex = profileCards.value.findIndex((card) => card.account === nextCard.account)
    if (existingIndex >= 0) {
      profileCards.value[existingIndex] = nextCard
      return
    }

    profileCards.value.unshift(nextCard)
    console.log(profileCards.value)
  }

  const sendFriendRequest = async (form) => {
    const { data } = await sendFriendRequestAPI(form)
    console.log(data)
  }

  return {
    profileCards,
    searchUserProfile,
    sendFriendRequest,
  }
}
