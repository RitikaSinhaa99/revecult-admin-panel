import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/adminApi";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get(`/users/${id}`).then(res => setUser(res.data.user));
    API.get(`/orders/user/${id}`).then(res => setOrders(res.data));
  }, [id]);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Region: {user.region}</p>

      <h2>User Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            Order #{o._id} – {o.status} – ₹{o.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}
