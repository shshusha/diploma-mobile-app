import { Suspense } from "react";
import { EnhancedDashboard } from "../components/enhanced-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Safety Monitor Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Real-time monitoring and alert management for user safety
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading dashboard...
                  </p>
                </div>
              </div>
            }
          >
            <EnhancedDashboard />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
