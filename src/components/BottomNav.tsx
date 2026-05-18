import type { IconType } from "react-icons";
import {
  GiBackpack,
  GiDiceTwentyFacesTwenty,
  GiMagicSwirl,
  GiScrollUnfurled,
} from "react-icons/gi";

const navItems: Array<{ label: string; Icon: IconType }> = [
  { label: "Ficha", Icon: GiScrollUnfurled },
  { label: "Bolsa", Icon: GiBackpack },
  { label: "Dados", Icon: GiDiceTwentyFacesTwenty },
  { label: "Magias", Icon: GiMagicSwirl },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {navItems.map((item) => (
        <button
          aria-label={item.label}
          className={item.label === "Ficha" ? "is-active" : ""}
          title={item.label}
          type="button"
          key={item.label}
        >
          <item.Icon aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
