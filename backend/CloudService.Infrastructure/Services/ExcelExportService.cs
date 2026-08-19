using ClosedXML.Excel;
using CloudService.Domain.Entities;

namespace CloudService.Infrastructure.Services;

public class ExcelExportService
{
    public byte[] ExportOrdersToExcel(
        IEnumerable<OrderRequest> orders)
    {
        using var workbook = new XLWorkbook();

        var worksheet = workbook.Worksheets.Add("Đơn hàng");

        // Header
        worksheet.Cell(1, 1).Value = "Mã đơn";
        worksheet.Cell(1, 2).Value = "Tên khách hàng";
        worksheet.Cell(1, 3).Value = "Email";
        worksheet.Cell(1, 4).Value = "Gói dịch vụ";
        worksheet.Cell(1, 5).Value = "Chu kỳ";
        worksheet.Cell(1, 6).Value = "Trạng thái";
        worksheet.Cell(1, 7).Value = "Ngày tạo";

        var headerRange = worksheet.Range(1, 1, 1, 7);

        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;

        foreach (var order in orders)
        {
            worksheet.Cell(row, 1).Value = order.Id.ToString();
            worksheet.Cell(row, 2).Value = order.CustomerName;
            worksheet.Cell(row, 3).Value = order.Email;
            worksheet.Cell(row, 4).Value = order.ServiceName;
            worksheet.Cell(row, 5).Value = order.BillingCycle.ToString();
            worksheet.Cell(row, 6).Value = order.Status.ToString();
            worksheet.Cell(row, 7).Value =
                order.CreatedAt.ToString("dd/MM/yyyy HH:mm");

            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();

        workbook.SaveAs(stream);

        return stream.ToArray();
    }
}