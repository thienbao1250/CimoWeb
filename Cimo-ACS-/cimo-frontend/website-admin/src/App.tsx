import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { Avatar } from '@mui/material';
import type { Branding, Navigation } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/react-router-dom';
import ImgLogo from 'assets/images/logo.png';
import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .ant-message {
    z-index: 10001 !important;
  }
`;

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Admin Management' },
  { title: 'Home', icon: <HomeRoundedIcon /> },
  { segment: 'user', title: 'User', icon: <AccountCircleRoundedIcon /> },
  { segment: 'role', title: 'Role', icon: <VerifiedUserRoundedIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'School Management' },
  { segment: 'student', title: 'Student', icon: <SchoolRoundedIcon /> },
  { segment: 'class', title: 'Class', icon: <ClassRoundedIcon /> },
  { segment: 'parent', title: 'Parent', icon: <FamilyRestroomRoundedIcon /> },
  { segment: 'checkin', title: 'Check In-Out', icon: <CheckCircleRoundedIcon /> },
  { segment: 'blog', title: 'News', icon: <NewspaperRoundedIcon /> },
];

const BRANDING: Branding = {
  title: 'CiMo Admin',
  logo: <Avatar src={ImgLogo} variant="rounded" />,
};

export default function App() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const signIn = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const signOut = useCallback(() => {
    logout();
    navigate('/login');
  }, [navigate]);

  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING} session={{ user: user as any }} authentication={{ signIn, signOut }}>
      <GlobalStyle />
      <Outlet />
    </AppProvider>
  );
}
