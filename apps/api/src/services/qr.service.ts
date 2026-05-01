import QRCode from "qrcode";

export interface QrOptions {
  color?: { dark?: string; light?: string };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  width?: number;
}

export async function generateQrDataUrl(url: string, opts: QrOptions = {}): Promise<string> {
  return QRCode.toDataURL(url, {
    width: opts.width ?? 400,
    errorCorrectionLevel: opts.errorCorrectionLevel ?? "M",
    color: {
      dark: opts.color?.dark ?? "#000000",
      light: opts.color?.light ?? "#FFFFFF",
    },
    margin: 2,
  });
}

export async function generateQrSvg(url: string, opts: QrOptions = {}): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: opts.errorCorrectionLevel ?? "M",
    color: {
      dark: opts.color?.dark ?? "#000000",
      light: opts.color?.light ?? "#FFFFFF",
    },
    margin: 2,
  });
}
