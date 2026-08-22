import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Đăng ký - Cloud Service',
};

export default function RegisterPage() {
  redirect('/login');
}