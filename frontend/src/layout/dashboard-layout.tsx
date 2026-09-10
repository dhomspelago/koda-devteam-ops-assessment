'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

const formatSegmentLabel = (segment: string) => {
  if (!segment) return ''
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const buildBreadcrumbs = (pathname: string) => {
  if (pathname === '/') {
    return [
      { href: '/', label: 'Assessment' },
      { href: '/', label: 'Users' },
    ]
  }

  const segments = pathname.split('/').filter(Boolean)
  return [
    { href: '/', label: 'Assessment' },
    ...segments.map((segment, index) => ({
      href: '/' + segments.slice(0, index + 1).join('/'),
      label: formatSegmentLabel(segment),
    })),
  ]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? '/'
  const crumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && <BreadcrumbSeparator className="block" />}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
