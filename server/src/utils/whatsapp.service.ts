import { asyncHandler } from "./asyncHandler";

const whatsappApiUri = process.env.WHATSAPP_API_URI;
const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;

if (!whatsappApiUri || !whatsappAccessToken) {
  throw new Error("Missing WhatsApp API credentials");
}

export const sendWhatsAppMessage = async (
  to: string,
  message: string
): Promise<void> => {
  try {
    const res = await fetch(whatsappApiUri, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: {
          body: message,
        },
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`WhatsApp API failed: ${res.status} ${errText}`);
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};
