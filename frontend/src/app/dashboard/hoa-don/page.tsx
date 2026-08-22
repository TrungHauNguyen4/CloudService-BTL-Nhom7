export default function BillingPage() {
  const transactions = [
    { id: 'INV-2026-0801', date: '01/08/2026', desc: 'Thanh toán chu kỳ tháng 7/2026', amount: '- 450,000 đ', status: 'Thành công' },
    { id: 'DEP-2026-0715', date: '15/07/2026', desc: 'Nạp tiền qua VNPay', amount: '+ 1,000,000 đ', status: 'Thành công' },
    { id: 'INV-2026-0701', date: '01/07/2026', desc: 'Thanh toán chu kỳ tháng 6/2026', amount: '- 320,000 đ', status: 'Thành công' },
  ];

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Hóa đơn & Thanh toán</h1>
      </header>

      <main className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Số Dư */}
          <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-lg shadow-slate-900/20 flex items-center justify-between text-white border border-slate-700">
            <div>
              <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Số dư hiện tại (Credit)</p>
              <h3 className="text-4xl md:text-5xl font-black">1,250,000 <span className="text-2xl text-slate-500 font-medium">VNĐ</span></h3>
              <p className="mt-4 text-sm text-slate-400">Chi phí dự kiến tháng này: <strong className="text-white">450,000 VNĐ</strong></p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5">
              Nạp tiền ngay
            </button>
          </div>

          {/* Card Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-slate-500 font-semibold text-sm mb-4">Phương thức mặc định</p>
            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-black italic">VISA</div>
              <div>
                <p className="font-bold text-slate-800">**** **** **** 4242</p>
                <p className="text-xs text-slate-500">Hết hạn: 12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng Lịch sử giao dịch */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Lịch sử giao dịch</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Mã giao dịch</th>
                  <th className="p-4">Ngày thực hiện</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4 text-right">Số tiền</th>
                  <th className="p-4 text-right pr-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500">{txn.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-600">{txn.date}</td>
                    <td className="p-4 text-sm text-slate-700">{txn.desc}</td>
                    <td className={`p-4 text-right font-bold ${txn.amount.includes('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {txn.amount}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}