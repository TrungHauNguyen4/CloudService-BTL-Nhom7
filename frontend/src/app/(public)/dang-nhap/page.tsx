import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Đăng nhập - Cloud Service',
};

export default function LoginPage() {
  redirect('/login');
}