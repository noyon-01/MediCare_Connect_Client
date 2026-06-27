"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <button className="btn btn-ghost btn-circle"></button>;

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
      className="btn btn-ghost btn-circle"
    >
      {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
