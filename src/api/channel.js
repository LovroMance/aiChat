import instance from '@/utils/request'

export const getDefaultChannel = () => {
    return instance.get('/debug/thread_info')
}
