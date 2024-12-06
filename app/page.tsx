"use client"
import { useState, useEffect, ChangeEvent } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
  category: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data: Post[] = await response.json();
        console.log('API Response:', data); 

        const englishPosts = data.filter(
          (post) =>
            /^[\x00-\x7F]*$/.test(post.title) && /^[\x00-\x7F]*$/.test(post.body)
        );

        const categories = ['Technology', 'Design', 'Web Development'];
        const categorizedPosts = englishPosts.map((post, index) => ({
          ...post,
          category: categories[index % categories.length],
        }));

        setPosts(categorizedPosts);
        setFilteredPosts(categorizedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle search functionality
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) &&
        (category === 'all' || post.category === category)
    );

    setFilteredPosts(filtered);
  };

  // Handle category filtering
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) &&
        (selectedCategory === 'all' || post.category === selectedCategory)
    );

    setFilteredPosts(filtered);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Blog Search</h1>
        <p className="text-gray-600 mt-2">Search by title or category</p>
      </header>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 mb-6">
        {/* Search Bar and Category Filter in Small View */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          {/* Search Bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title or category..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Filter */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-2/5"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Web Development">Web Development</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-600">Loading posts...</p>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.body}</p>
              <span className="text-sm text-white bg-blue-500 px-3 py-1 rounded-md mt-4 inline-block">
                {post.category}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results found</p>
      )}
    </div>
  );
}
