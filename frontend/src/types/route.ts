import type { ReactNode } from 'react'

export type Route = {
  title: string
  url: string
  icon?: ReactNode
  items?: {
    title: string
    url: string
  }[]
  isActive?: boolean
}
