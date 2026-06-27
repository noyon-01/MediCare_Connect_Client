"use client";
import { useState } from "react";

export default function UserAvatar({ user }) {
  const [imageError, setImageError] = useState(false);

  const initial = user?.name ? user.name.charAt(0) : "U";

  if (user?.image && !imageError) {
    return (
      <img 
        alt="Avatar" 
        src={user.image} 
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)} 
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="text-xs uppercase font-bold">{initial}</span>
  );
}
