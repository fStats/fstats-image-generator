import {Color} from "../types";

const colorMap: Record<Color, string> = {
    "alizarin": "#e74c3c",
    "carrot": "#e67e22",
    "sun-flower": "#f1c40f",
    "emerald": "#2ecc71",
    "turquoise": "#1abc9c",
    "peter-river": "#3498db",
    "amethyst": "#9b59b6",
};

export const nameToColor = (color: Color): string => colorMap[color];
