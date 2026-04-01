import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AuthGuard from 'guards/AuthGuard';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AuthGuard>
  );
}
