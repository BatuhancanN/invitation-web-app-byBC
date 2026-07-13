import { ImageResponse } from "next/og";
import { invitationConfig } from "@/config/invitation";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "50%",
          color: "#fdf8f0",
          fontSize: 30,
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
