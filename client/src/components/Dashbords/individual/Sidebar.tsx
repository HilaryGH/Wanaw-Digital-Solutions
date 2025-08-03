import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="bg-green w-full md:w-64 shadow-md p-6 mb-6 md:mb-0 md:mr-6">
      <nav className="space-y-4">
        <Link to="/dashboard" className="block text-gold hover:font-semibold"> Dashboard</Link>
        <Link to="/my-gifts" className="block text-gold hover:font-semibold">My Gifts</Link>
        <Link to="/notifications" className="block text-gold hover:font-semibold">🔔 Notifications</Link>
        <Link to="/payments" className="block text-gold hover:font-semibold"> Payments</Link>
        <Link to="/settings" className="block text-gold hover:font-semibold">⚙️ Settings</Link>
        <Link to="/logout" className="block text-gold hover:font-semibold"> Logout</Link>
      </nav>
    </aside>
  );
}
