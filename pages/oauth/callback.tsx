import { useEffect } from "react";
import { useRouter } from "next/router";
import userStore from "@/stores/userStore";

const Callback = () => {
  const router = useRouter();

  return (
    <div>
      <p style={{ color: "white" }}>Processing OAuth callback...</p>
    </div>
  );
};

export default Callback;
