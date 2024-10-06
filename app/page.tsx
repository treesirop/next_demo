"use client";
import { useState, useEffect } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
} from "../server/actions/crud";

type Post = {
  id: string;
  drugName: string;
  createdAt: string;
  updatedAt: string;
};

type GetAllPostsResult =
  | {
      posts: Post[];
      totalPages: number;
      currentPage: number;
    }
  | { error: string };

export default function Home() {
  const [drugName, setDrugName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.drugName.includes(searchKeyword)
    );
    setFilteredPosts(filtered);
  }, [searchKeyword, posts]);

  const fetchPosts = async (page = currentPage) => {
    const result = await getAllPosts(page);
    if ("error" in result) {
      console.error(result.error);
    } else {
      const formattedPosts = result.posts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toLocaleString(),
        updatedAt: new Date(post.updatedAt).toLocaleString(),
      }));
      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("drugName", drugName);
    const result = await createPost(formData);
    if (result.success) {
      setDrugName("");
      fetchPosts();
    } else {
      console.error(result.error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    const formData = new FormData();
    formData.append("drugName", drugName);
    const result = await updatePost(selectedPost.id, formData);
    if (result.success) {
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              drugName: drugName,
              updatedAt: new Date().toLocaleString(),
            }
          : post
      );
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setDrugName("");
      setSelectedPost(null);
    } else {
      console.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deletePost(id);
    if (result.success) {
      fetchPosts();
    } else {
      console.error(result.error);
    }
  };

  const handleEdit = (post: Post) => {
    setDrugName(post.drugName);
    setSelectedPost(post);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">药品记录</h1>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={drugName}
          onChange={(e) => setDrugName(e.target.value)}
          className="border p-2 mr-2 flex-grow"
          placeholder="药品名称"
        />
        {selectedPost ? (
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2">
            更新
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white p-2"
          >
            创建
          </button>
        )}
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="border p-2 ml-2 flex-grow"
          placeholder="搜索药品名称"
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-center">药品名称</th>
            <th className="border p-2 text-center">创建时间</th>
            <th className="border p-2 text-center">更新时间</th>
            <th className="border p-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td className="border p-2 text-center">{post.drugName}</td>
              <td className="border p-2 text-center">{post.createdAt}</td>
              <td className="border p-2 text-center">{post.updatedAt}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white p-1"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white p-2 mr-2"
        >
          上一页
        </button>
        <span className="p-2">
          第 {currentPage} 页，共 {totalPages} 页
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
