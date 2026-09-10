import { Route } from '@/types/route'
import { FileBarChart, Users } from 'lucide-react'

export const SidebarRoutes: Route[] = [
  {
    title: 'Users',
    icon: <Users />,
    url: '/',
  },
  {
    title: 'Projects',
    icon: <FileBarChart />,
    url: '/projects',
  },
]
