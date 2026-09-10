import DashboardLayout from '@/layout/dashboard-layout'
import { ProjectsPage } from '@/components/pages/projects/projects-page'

export default function Page() {
  return (
    <DashboardLayout>
      <ProjectsPage />
    </DashboardLayout>
  )
}
