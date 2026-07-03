import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base">
      <AdminSidebar />
      <div className="pl-64 pt-16">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
