import axios from "axios";

const SHOTSTACK_API_KEY = "BkieDHwDa3BX1klRnnOrjMNzpEhJEcEYSI6ef0Fm";
const SHOTSTACK_BASE_URL = "https://api.shotstack.io/v1/edit";

export const trimVideo = async (videoUrl, start, length) => {
  const payload = {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: { type: "video", src: videoUrl },
              start: start,
              length: length,
            },
          ],
        },
      ],
    },
    output: { format: "mp4" },
  };

  try {
    const response = await axios.post(SHOTSTACK_BASE_URL, payload, {
      headers: {
        "x-api-key": SHOTSTACK_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return response.data.response.url;
  } catch (error) {
    console.error("Error trimming video:", error);
    return null;
  }
};
