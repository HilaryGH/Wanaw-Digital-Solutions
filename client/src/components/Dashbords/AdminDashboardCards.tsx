import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminDashboardCards() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role || "");
  }, []);

  const features = [
    {
      title: "Add Program",
      description: "Create and manage new health & wellness programs.",
      route: "/admin/add-program",
      color: "bg-green-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "Add Gift",
      description: "Add gift options and customize corporate gifting.",
      route: "/admin/add-gift",
      color: "bg-yellow-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "Manage Membership",
      description: "Update membership plans, perks, and pricing.",
      route: "/admin/manage-membership",
      color: "bg-blue-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "Manage Services",
      description: "Edit, add, or remove available services.",
      route: "/admin/manage-services",
      color: "bg-purple-100",
      roles: ["super_admin"],
    },
    {
      title: "Add Service",
      description: "Manually add a new service as admin.",
      route: "/admin/add-service",
      color: "bg-teal-100",
      roles: ["super_admin"],
    },
    {
      title: "Create Blog Post",
      description: "Write and publish blog articles for the platform.",
      route: "/admin/blog-create",
      color: "bg-pink-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "View Blog Posts",
      description: "Manage and view all published blog content.",
      route: "/admin/blog-list",
      color: "bg-orange-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "Support Requests",
      description: "View and respond to submitted support inquiries.",
      route: "/admin/support-requests",
      color: "bg-red-100",
      roles: ["super_admin", "customer_support_admin"],
    },
    {
      title: "User Lists",
      description: "View and respond to registered users.",
      route: "/admin/user-lists",
      color: "bg-gray-100",
      roles: ["super_admin"],
    },
    {
      title: "Membership Lists",
      description: "View and respond to registered users.",
      route: "/admin/community-list",
      color: "bg-pink-100",
      roles: ["super_admin"],
    },
    {
      title: "Job Posting",
      description: "View and respond to registered users.",
      route: "/admin/job-posting",
      color: "bg-pink-100",
      roles: ["super_admin", "marketing_admin"],
    },
    {
      title: "Applicant List",
      description: "View and respond to job applicants.",
      route: "/admin/applicant-list",
      color: "bg-pink-100",
      roles: ["super_admin", "customer_support_admin"],
    },
     {
      title: "GiftList and confirm",
      description: "View and respond to job applicants.",
      route: "/admin/gift-list & confirm",
      color: "bg-pink-100",
      roles: ["super_admin", "customer_support_admin"],
    },
  ];

  const visibleFeatures = features.filter((feature) =>
    feature.roles.includes(userRole)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6 text-[#1c2b21]">
        Admin Dashboard
      </h1>

      {visibleFeatures.length === 0 ? (
        <p className="text-gray-600">You don't have access to any admin tools.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFeatures.map((item, index) => (
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
      )}
    </div>
  );
}



