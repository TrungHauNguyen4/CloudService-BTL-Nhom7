using QRCoder;

namespace CloudService.Infrastructure.Services;

public class QrCodeService
{
    /// <summary>
    /// Sinh QR Code từ text, trả về chuỗi Base64 PNG.
    /// </summary>
    public string GenerateQrCodeBase64(string text)
    {
        using var qrGenerator = new QRCodeGenerator();

        using var qrCodeData = qrGenerator.CreateQrCode(
            text,
            QRCodeGenerator.ECCLevel.Q);

        using var qrCode = new PngByteQRCode(qrCodeData);

        byte[] qrCodeBytes = qrCode.GetGraphic(10);

        return Convert.ToBase64String(qrCodeBytes);
    }
}