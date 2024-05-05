export default UserIndicator;

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "../atoms/Link";

function UserIndicator() {
  const user = useSelector((state: RootState) => state.user.value);

  let text: string | null = null;

  return (
    <div
      className={`w-40 h-14 rounded-xl flex flex-col items-center content-center justify-center relative ${user ? "bg-success" : "bg-error"
        }`}
    >
      {text}
      {user && (
        <div className="flex flex-col relative">
          <div className="text-xs">email: {user.email}</div>
          <div className="text-xs">uuid: {user.uuid}</div>
        </div>
      )}
      {user && (
        <Link href="/login" className="btn btn-outline btn-xs">
          Login
        </Link>
      )}
    </div>
  );
}
