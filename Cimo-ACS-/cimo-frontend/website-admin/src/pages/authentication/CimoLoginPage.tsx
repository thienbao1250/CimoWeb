import { SignInPage } from '@toolpad/core/SignInPage';
import GuestGuard from 'guards/AuthGuard';
import useAuth from 'hooks/useAuth';
import { get } from 'lodash';

export default function CimoLoginPage() {
  const { login, isLoggedIn } = useAuth();
  return (
    <GuestGuard>
      <SignInPage
        providers={[{ id: 'credentials', name: 'Credentials' }]}
        signIn={async (provider, formData, callbackUrl) => {
          try {
            await login(formData.get('email'), formData.get('password'));
          } catch (error) {
            return {
              error: error instanceof Error ? get(error, 'response.data.error.message', 'Đã có lỗi xảy ra') : 'An error occurred',
            };
          }
          return {};
        }}
        sx={{
          '.MuiAvatar-root': {
            width: 150,
            height: 150,
            borderRadius: 2,
          },
        }}
        slotProps={{
          emailField: { defaultValue: 'cimoadmin', label: 'Username', type: 'text' },
          passwordField: { defaultValue: ',a8^oB9jk£0£5ee' },
        }}
      />
    </GuestGuard>
  );
}
