import { useTheme } from "../state/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark/light mode">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
