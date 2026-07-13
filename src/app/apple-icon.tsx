import { ImageResponse } from "next/og";
import { invitationConfig } from "@/config/invitation";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { bride, groom } = invitationConfig.couple;
  const initials = `${bride[0]}${groom[0]}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #d4b876, #8f6d31)",
          color: "#fdf8f0",
          fontSize: 84,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
        }}
      >
        {initials}
      </div>
    ),
    size
  );
}
