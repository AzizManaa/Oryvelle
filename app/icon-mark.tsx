import { ImageResponse } from "next/og";

type IconMarkOptions = {
  size: number;
  ringWidth: number;
  orbSize: number;
};

export const iconContentType = "image/png";

export function createOryvelleIcon({
  size,
  ringWidth,
  orbSize,
}: IconMarkOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 68% 30%, rgba(184,154,255,0.22), transparent 38%), linear-gradient(135deg, #080510 0%, #0B0715 55%, #15102A 100%)",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: `${ringWidth}px solid rgba(0,224,199,0.28)`,
            borderRadius: 999,
            boxShadow: `0 0 ${size * 0.18}px rgba(0,224,199,0.26)`,
            display: "flex",
            height: size * 0.72,
            justifyContent: "center",
            width: size * 0.72,
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(circle, #05020A 0%, #05020A 36%, #00E0C7 42%, #67D7FF 52%, #B89AFF 72%, rgba(184,154,255,0) 76%)",
              borderRadius: 999,
              boxShadow: `0 0 ${size * 0.22}px rgba(0,224,199,0.72), inset 0 0 ${size * 0.08}px rgba(5,2,10,0.95)`,
              height: orbSize,
              width: orbSize,
            }}
          />
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
