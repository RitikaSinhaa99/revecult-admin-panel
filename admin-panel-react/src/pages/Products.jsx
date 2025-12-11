import { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      image: "",
      stock: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
      } else {
        await API.post("/products", formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: "20px", padding: "10px 20px" }}>
        {showForm ? "Cancel" : "Add New Product"}
      </button>

      {showForm && (
        <form onSubmit={handleAddProduct} style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              step="0.01"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", minHeight: "100px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "green", color: "white", border: "none", cursor: "pointer" }}>
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.category || "N/A"}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  onClick={() => handleEditProduct(p)}
                  style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
