import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default function PageLayout({ 
  children, 
  title, 
  description, 
  breadcrumbs = [],
  className = ''
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className={`max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 ${className}`}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Beranda
            </Link>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
