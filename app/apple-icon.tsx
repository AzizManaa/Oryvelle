import { createOryvelleIcon, iconContentType } from "./icon-mark";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = iconContentType;

export default function AppleIcon() {
  return createOryvelleIcon({
    size: size.width,
    ringWidth: 4,
    orbSize: 96,
  });
}
