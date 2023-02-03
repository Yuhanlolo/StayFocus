import Svg, {Circle, Path} from 'react-native-svg';
import {ColorValue} from 'react-native';

interface IconProps {
  size: number;
  color: ColorValue;
}

export function LeftArrow({size, color}: IconProps) {
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

export function HamburgerMenu({size, color}: IconProps) {
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

export function Gear({size, color}: IconProps) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
      <Path fill="none" d="M0 0H256V256H0z" />
      <Circle
        cx={128}
        cy={128}
        r={48}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={24}
      />
      <Path
        d="M197.4 80.7a73.6 73.6 0 016.3 10.9l25.9 14.4a102 102 0 01.1 44l-26 14.4a73.6 73.6 0 01-6.3 10.9l.5 29.7a104 104 0 01-38.1 22.1l-25.5-15.3a88.3 88.3 0 01-12.6 0L96.3 227a102.6 102.6 0 01-38.2-22l.5-29.6a80.1 80.1 0 01-6.3-11L26.4 150a102 102 0 01-.1-44l26-14.4a73.6 73.6 0 016.3-10.9L58.1 51a104 104 0 0138.1-22.1l25.5 15.3a88.3 88.3 0 0112.6 0L159.7 29a102.6 102.6 0 0138.2 22z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={24}
      />
    </Svg>
  );
}

export function CaretDown({size, color}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 18L5 6H19Z" fill={color} />
    </Svg>
  );
}

export function CaretUp({size, color}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="2 0 22 24" fill="none">
      <Path d="M12 6L5 18H19Z" fill={color} />
    </Svg>
  );
}
