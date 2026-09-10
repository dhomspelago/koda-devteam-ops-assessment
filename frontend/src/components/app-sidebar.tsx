'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarRoutes } from '@/app/constants/sidebar-route'
import { useAuthClient } from '@/providers/auth-provider'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? '/'
  const router = useRouter()
  const authClient = useAuthClient()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push('/auth/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="px-2 py-1.5 text-sm font-semibold tracking-tight">
          Koda Assessment
        </div>
      </SidebarHeader>
      <SidebarContent>
        {SidebarRoutes.map((item) => {
          const isActive =
            item.url === '/'
              ? pathname === '/'
              : pathname === item.url || pathname.startsWith(`${item.url}/`)

          return (
            <SidebarGroup key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive}
                  render={<Link href={item.url} />}
                >
                  {item.icon} <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            disabled={isSigningOut}
            onClick={() => void handleSignOut()}
          >
            <LogOut />
            <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
