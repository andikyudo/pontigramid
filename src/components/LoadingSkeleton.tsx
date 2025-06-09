/**
 * Loading skeleton components for better UX
 * Replaces spinners with content-aware skeletons
 */

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`}></div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      <div className="p-4 space-y-3">
        {/* Category badge skeleton */}
        <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="w-full h-5 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function BreakingNewsSliderSkeleton() {
  return (
    <div className="relative h-96 bg-gray-900 animate-pulse">
      <div className="absolute inset-0 bg-gray-800"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Badge skeleton */}
          <div className="w-24 h-6 bg-gray-600 rounded-full"></div>
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="w-full h-8 bg-gray-600 rounded"></div>
            <div className="w-3/4 h-8 bg-gray-600 rounded"></div>
          </div>
          
          {/* Meta skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-4 bg-gray-600 rounded"></div>
            <div className="w-24 h-4 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RunningTextSkeleton() {
  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden animate-pulse">
      <div className="flex items-center">
        <div className="bg-red-800 px-4 py-1 text-sm font-bold flex-shrink-0">
          <div className="w-16 h-4 bg-red-700 rounded"></div>
        </div>
        <div className="flex-1 px-4">
          <div className="w-96 h-4 bg-red-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function TrendingNewsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-3">
        <div className="w-48 h-8 bg-gray-200 rounded mx-auto"></div>
        <div className="w-64 h-4 bg-gray-200 rounded mx-auto"></div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="flex items-start space-x-4">
              {/* Image skeleton */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
              
              <div className="flex-1 space-y-2">
                {/* Title skeleton */}
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                
                {/* Meta skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  <div className="w-12 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
        <div className="w-2 h-4 bg-gray-200 rounded"></div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
        <div className="w-2 h-4 bg-gray-200 rounded"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Category badge skeleton */}
      <div className="w-24 h-6 bg-gray-200 rounded-full mb-4"></div>
      
      {/* Title skeleton */}
      <div className="space-y-3 mb-6">
        <div className="w-full h-8 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
      </div>
      
      {/* Meta info skeleton */}
      <div className="flex items-center space-x-6 mb-8 pb-4 border-b">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Featured image skeleton */}
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg mb-8"></div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
