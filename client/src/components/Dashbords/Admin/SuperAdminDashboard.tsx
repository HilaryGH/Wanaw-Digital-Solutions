import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
  const features = [
    {
      title: "Add Program",
      description: "Create and manage new health & wellness programs.",
      route: "/admin/add-program",
      color: "bg-green-100",
    },
    {
      title: "Add Gift",
      description: "Add and manage gift options.",
      route: "/admin/add-gift",
      color: "bg-yellow-100",
    },
    {
      title: "Manage Membership",
      description: "Update membership plans, perks, and pricing.",
      route: "/admin/manage-membership",
      color: "bg-blue-100",
    },
    {
      title: "Manage Services",
      description: "Edit, add, or remove available services.",
      route: "/admin/manage-services",
      color: "bg-purple-100",
    },
    {
      title: "Add Service",
      description: "Manually add a new service.",
      route: "/admin/add-service",
      color: "bg-teal-100",
    },
    {
      title: "Create Blog Post",
      description: "Write and publish blog articles.",
      route: "/admin/blog-create",
      color: "bg-pink-100",
    },
    {
      title: "View Blog Posts",
      description: "Manage and view all published content.",
      route: "/admin/blog-list",
      color: "bg-orange-100",
    },
    {
      title: "Support Requests",
      description: "View and respond to support inquiries.",
      route: "/admin/support-requests",
      color: "bg-red-100",
    },
    {
      title: "User List",
      description: "View and manage registered users.",
      route: "/admin/user-lists",
      color: "bg-gray-200",
    },
    {
      title: "Membership List",
      description: "View and manage community members.",
      route: "/admin/community-list",
      color: "bg-pink-200",
    },
    {
      title: "Job Posting",
      description: "Post job opportunities.",
      route: "/admin/job-posting",
      color: "bg-indigo-100",
    },
    {
      title: "Applicant List",
      description: "Review job applicants.",
      route: "/admin/applicant-list",
      color: "bg-lime-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 ${item.color}`}
          >
            <h2 className="text-lg font-semibold mb-2 text-[#1c2b21]">
              {item.title}
            </h2>
            <p className="text-sm text-gray-700 mb-4">{item.description}</p>
            <Link
              to={item.route}
              className="inline-block bg-[#1c2b21] text-white px-4 py-2 rounded hover:bg-[#16241a] text-sm"
            >
              Go to {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
