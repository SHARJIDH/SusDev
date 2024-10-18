import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FaHome } from 'react-icons/fa';
import { IoFastFood } from 'react-icons/io5';
import { FloatingNav } from '@/components/ui/floating-navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eco-Friendly Recipe Generator',
  description: 'Generate environmentally friendly recipes using AI',
};

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <FaHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "recipe",
    link: "/recipe",
    icon: <IoFastFood className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Climate",
    link: "/climate",
    icon: <IoFastFood className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Water",
    link: "/drinkwater",
    icon: <IoFastFood className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <div className="bg-black min-h-screen">
          <FloatingNav navItems={navItems} />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}