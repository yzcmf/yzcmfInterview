import React from 'react';

const Posts: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Posts</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No posts available yet. Create your first post!</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts; 