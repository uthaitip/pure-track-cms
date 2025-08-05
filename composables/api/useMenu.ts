import type { MenuItem } from '../interfaces/common'

export const useMenu = () => {
  const menus = useState<MenuItem[]>('app.menus', () => [])
  const loading = useState<boolean>('app.menus.loading', () => false)
  const error = useState<string>('app.menus.error', () => '')
  const lastFetchedRole = useState<string>('app.menus.lastRole', () => '')

  const fetchMenus = async (forceRefresh = false) => {
    const { token, user } = useAuth()
    console.log('------------->', user);
    
    if (!token.value || !user.value?.role?.name) {
      error.value = 'Authentication required'
      return
    }

    // Prevent duplicate calls for the same role (unless force refresh)
    if (!forceRefresh && lastFetchedRole.value === user.value.role.name && menus.value.length > 0) {
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

      console.log('data ====== menus ===>', data);
      if (data.menus) {
        menus.value = data.menus
        lastFetchedRole.value = user.value.role.name
      }
    } catch (err: any) {
      console.error('Fetch menus error:', err)
      error.value = err.data?.statusMessage || 'Failed to fetch menus'
    } finally {
      loading.value = false
    }
  }

  const getMenusByRole = (role: string): MenuItem[] => {
    const ab = menus.value.filter(menu => 
      menu.roles.includes(role)
    );
    console.log('ab ====>', ab);
    return menus.value.filter(menu => 
      menu.roles.includes(role)
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

  const createMenu = async (menuData: Partial<MenuItem>) => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { menu: MenuItem }
        message: string
      }>('/api/menus/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: menuData
      })

      // Clear cache to force refresh on next fetch
      lastFetchedRole.value = ''

      return data.menu
    } catch (err: any) {
      console.error('Create menu error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to create menu')
    }
  }

  const updateMenu = async (menuId: string, menuData: Partial<MenuItem>) => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { menu: MenuItem }
        message: string
      }>(`/api/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: menuData
      })

      // Clear cache to force refresh on next fetch
      lastFetchedRole.value = ''

      return data.menu
    } catch (err: any) {
      console.error('Update menu error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to update menu')
    }
  }

  const deleteMenu = async (menuId: string) => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      await $fetch<{
        success: boolean
        data: { deletedId: string }
        message: string
      }>(`/api/menus/${menuId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      // Clear cache to force refresh on next fetch
      lastFetchedRole.value = ''

      return true
    } catch (err: any) {
      console.error('Delete menu error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to delete menu')
    }
  }

  return {
    menus: readonly(menus),
    loading: readonly(loading),
    error: readonly(error),
    fetchMenus,
    getMenusByRole,
    findMenuByPath,
    createMenu,
    updateMenu,
    deleteMenu
  }
}