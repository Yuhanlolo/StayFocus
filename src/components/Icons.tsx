import Svg, { Path } from "react-native-svg";
import { ColorValue } from "react-native";

interface IconProps {
  size: number;
  color: ColorValue;
}

export function LeftArrow({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
      <Path fill="none" d="M0 0h256v256H0z" />
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M216 128H40M112 56l-72 72 72 72"
      />
    </Svg>
  );
}

export function HamburgerMenu({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
      <Path fill="none" d="M0 0H256V256H0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M40 128L216 128"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M40 64L216 64"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M40 192L216 192"
      />
    </Svg>
  );
}
