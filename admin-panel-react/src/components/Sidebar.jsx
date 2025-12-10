import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#222",
      color: "white",
      height: "100vh",
      padding: "20px"
    }}>
      <h2>Admin Panel</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={{ color: "#fff" }}>Dashboard</Link></li>
        <li><Link to="/users" style={{ color: "#fff" }}>Users</Link></li>
        <li><Link to="/orders" style={{ color: "#fff" }}>Orders</Link></li>
        <li><Link to="/products" style={{ color: "#fff" }}>Products</Link></li>
      </ul>
    </div>
  );
}
