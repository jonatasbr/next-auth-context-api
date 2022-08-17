import { useContext, useEffect } from "react";
import { api } from "../../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/profile')
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Dashboard | {user?.email} </h1>
    </div>
  );
}