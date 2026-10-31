import { writeFile } from "node:fs/promises";
import {
  faAnchor,
  faArrowRight,
  faBars,
  faBolt,
  faBrain,
  faCheck,
  faCheckCircle,
  faChevronRight,
  faCrosshairs,
  faEnvelope,
  faJetFighter,
  faMapMarkerAlt,
  faMedal,
  faPhone,
  faShieldAlt,
  faStar,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const icons = {
  anchor: faAnchor,
  "arrow-right": faArrowRight,
  bars: faBars,
  bolt: faBolt,
  brain: faBrain,
  check: faCheck,
  "check-circle": faCheckCircle,
  "chevron-right": faChevronRight,
  crosshairs: faCrosshairs,
  envelope: faEnvelope,
  "jet-fighter": faJetFighter,
  "map-marker-alt": faMapMarkerAlt,
  medal: faMedal,
  phone: faPhone,
  "shield-alt": faShieldAlt,
  star: faStar,
  "user-tie": faUserTie,
  whatsapp: faWhatsapp,
};

const symbols = Object.entries(icons).map(([name, icon]) => {
  const [width, height, , , paths] = icon.icon;
  const pathElements = (Array.isArray(paths) ? paths : [paths])
    .map((path) => `<path fill="currentColor" d="${path}"/>`)
    .join("");

  return `<symbol id="${name}" viewBox="0 0 ${width} ${height}">${pathElements}</symbol>`;
});

await writeFile(
  new URL("../icons.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg"><metadata>Icons by Font Awesome, licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/</metadata>${symbols.join("")}</svg>\n`,
);
