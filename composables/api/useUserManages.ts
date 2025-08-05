import type { MenuItem } from '../interfaces/common'

export const useUsersManageMent = () => {
    const user = useState<any[]>('app.users', () => [])
    const loading = useState<boolean>('app.users.loading', () => false)
    const error = useState<string>('app.users.error', () => '')
      const lastFetchedRole = useState<string>('app.users.lastRole', () => '')


    const fetchUserManagement = async (forceRefresh = false) => { 
        const { token, user } = useAuth();

        if (!token.value || !user.value?.role?.name) {
            error.value = 'Authentication required'
            return
        }

        // Prevent duplicate calls for the same role (unless force refresh)
        if (!forceRefresh && lastFetchedRole.value === user.value.role.name && user.value.length > 0) {
            return
        }

        loading.value = true
        error.value = ''

        try {
            const { data } = await $fetch<{
                success: boolean
                data: { users: MenuItem[] }
            }>('/api/users', {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            console.log('data ====== menus ===>', data);
            if (data.users) {
                user.value = data.users
            }
        } catch (err: any) {
            console.error('Fetch menus error:', err)
            error.value = err.data?.statusMessage || 'Failed to fetch menus'
        } finally {
            loading.value = false
        }
    } 
}