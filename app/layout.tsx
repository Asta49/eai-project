import './globals.css';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Root layout passes children through
export default function RootLayout({ children }: Props) {
  return children;
}
