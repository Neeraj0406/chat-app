import { PrivateRoute } from "../auth/Auth";

export default function Home() {

  return (
    <PrivateRoute>Hello</PrivateRoute>
  );
}


