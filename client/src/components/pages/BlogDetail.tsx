import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../../api/api";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/blog/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error: ${res.status} - ${errText}`);
        }
        return res.json();
      })
      .then((data) => setPost(data))
      .catch((err) => {
        console.error("Fetch blog error:", err);
        setError("Blog post not found or server error.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-[#1c2b21]">{post.title}</h1>
      {post.coverImage && (
        <img
          src={`http://localhost:5000${post.coverImage}`}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <p className="text-gray-500 text-sm mb-4">
        Posted on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="prose max-w-none">{post.content}</div>
    </div>
  );
};

export default BlogDetail;

