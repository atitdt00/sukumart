import Sidebar from "../../../Components/dashboard/Sidebar";
import Header from "../../../Components/dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-64 z-40">
          <Header />
        </div>

        {/* Page Content */}
        <main className="pt-20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}