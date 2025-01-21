import QRCode from 'qrcode';

export async function generateQRCode(userId: string, eventId: string, tickets: number): Promise<string> {
  const data = {
    userId,
    eventId,
    tickets,
    date: new Date().toISOString(),
  };

  // Generate the QR code (as a data URL or string)
  return await QRCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: 'H' });
}
