export interface MenuItem {
  _id: string
  name: string
  path: string
  icon?: string
  roles: string[]
  parent?: string
  order: number
  isActive: boolean
  children: MenuItem[]
}

export const useMenu = () => {
  const menus = useState<MenuItem[]>('app.menus', () => [])
  const loading = ref(false)
  const error = ref('')

  const fetchMenus = async () => {
    const { token } = useAuth()
    
    if (!token.value) {
      error.value = 'Authentication required'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { menus: MenuItem[] }
      }>('/api/menus', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (data.menus) {
        menus.value = data.menus
      }
    } catch (err: any) {
      console.error('Fetch menus error:', err)
      error.value = err.data?.statusMessage || 'Failed to fetch menus'
    } finally {
      loading.value = false
    }
  }

  const getMenusByRole = (role: string): MenuItem[] => {
    return menus.value.filter(menu => 
      menu.roles.includes(role) && menu.isActive
    )
  }

  const findMenuByPath = (path: string): MenuItem | null => {
    const findInMenus = (menuList: MenuItem[]): MenuItem | null => {
      for (const menu of menuList) {
        if (menu.path === path) return menu
        if (menu.children.length > 0) {
          const found = findInMenus(menu.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findInMenus(menus.value)
  }

  return {
    menus: readonly(menus),
    loading: readonly(loading),
    error: readonly(error),
    fetchMenus,
    getMenusByRole,
    findMenuByPath
  }
}