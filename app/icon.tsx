import { createOryvelleIcon, iconContentType } from "./icon-mark";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = iconContentType;

export default function Icon() {
  return createOryvelleIcon({
    size: size.width,
    ringWidth: 1,
    orbSize: 18,
  });
}
