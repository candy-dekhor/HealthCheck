import React from 'react';

export default function PatientDetailModal({ viewDetailPatient, setViewDetailPatient, activeTab }) {
  if (!viewDetailPatient) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800">ผลการตรวจสุขภาพ</h3>
            <p className="text-base text-slate-500 font-semibold mt-1">พนักงาน: {viewDetailPatient.name}</p>
          </div>
          <button onClick={() => setViewDetailPatient(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-base transition-colors">ปิดหน้าต่าง</button>
        </div>
        <div className="space-y-4 text-base">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div><span className="font-bold text-slate-500">ส่วนสูง:</span> <span className="font-semibold">{viewDetailPatient.height || '-'} ซม.</span></div>
            <div><span className="font-bold text-slate-500">น้ำหนัก:</span> <span className="font-semibold">{viewDetailPatient.weight || '-'} กก.</span></div>
            <div><span className="font-bold text-slate-500">รูปร่าง:</span> <span className="font-semibold">{viewDetailPatient.isSlim === true ? 'Slim / Standard' : viewDetailPatient.isSlim === false ? 'Overweight / Obese' : '-'}</span></div>
            <div><span className="font-bold text-slate-500">รอบเอว:</span> <span className="font-semibold">{viewDetailPatient.waist || '-'} ซม.</span></div>
            <div><span className="font-bold text-slate-500">รอบเอว ÷ ส่วนสูง:</span> <span className="font-semibold">{viewDetailPatient.waistRatio || '-'}</span></div>
            <div><span className="font-bold text-slate-500">ชีพจร:</span> <span className="font-semibold">{viewDetailPatient.pulse || '-'} ครั้ง/นาที</span></div>
            <div><span className="font-bold text-slate-500">ความดันโลหิต:</span> <span className="font-semibold">{viewDetailPatient.bp || '-'} มม.ปรอท</span></div>
            <div><span className="font-bold text-slate-500">สภาพจิต:</span> <span className="font-semibold">{viewDetailPatient.mental || '-'}</span></div>
            <div className="col-span-2"><span className="font-bold text-slate-500">อัตราไหลสูงสุด:</span> <span className="font-semibold">{viewDetailPatient.flow || '-'} L/min ({viewDetailPatient.flowPercent || '-'}% ของค่ามาตรฐาน)</span></div>
            <div className="col-span-2">
              <div>
                <span className="font-bold text-slate-500">UPT (ตรวจการตั้งครรภ์):</span>{' '}
                <span className="font-semibold">{viewDetailPatient.upt || '-'}</span>
              </div>
              {(activeTab === 'HR' || activeTab === 'REGISTRATION') && viewDetailPatient.uptKitQty > 1 && (
                <div className="mt-2 text-sm bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-600 font-bold mb-2">รายละเอียดการตรวจ ({viewDetailPatient.uptKitQty} รอบ):</div>
                  <div className="space-y-2">
                    {Array.from({ length: viewDetailPatient.uptKitQty }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                        <span className="font-semibold text-slate-600">รอบที่ {idx + 1}:</span>
                        <span className={`font-bold ${viewDetailPatient.uptResults?.[idx] === 'Negative' ? 'text-emerald-600' : viewDetailPatient.uptResults?.[idx] === 'Positive' ? 'text-red-600' : 'text-slate-600'}`}>
                          {viewDetailPatient.uptResults?.[idx] || (idx === viewDetailPatient.uptKitQty - 1 ? viewDetailPatient.upt : '-')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-2">
              <div>
                <span className="font-bold text-slate-500">MAMP Test (ตรวจสารเสพติด):</span>{' '}
                <span className="font-semibold">{viewDetailPatient.mamp || '-'}</span>
              </div>
              {(activeTab === 'HR' || activeTab === 'REGISTRATION') && viewDetailPatient.mampKitQty > 1 && (
                <div className="mt-2 text-sm bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-600 font-bold mb-2">รายละเอียดการตรวจ ({viewDetailPatient.mampKitQty} รอบ):</div>
                  <div className="space-y-2">
                    {Array.from({ length: viewDetailPatient.mampKitQty }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                        <span className="font-semibold text-slate-600">รอบที่ {idx + 1}:</span>
                        <span className={`font-bold ${viewDetailPatient.mampResults?.[idx] === 'Negative' ? 'text-emerald-600' : viewDetailPatient.mampResults?.[idx] === 'Positive' ? 'text-red-600' : 'text-slate-600'}`}>
                          {viewDetailPatient.mampResults?.[idx] || (idx === viewDetailPatient.mampKitQty - 1 ? viewDetailPatient.mamp : '-')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {viewDetailPatient.docResult ? (
            <div className={`p-6 rounded-2xl border mt-4 ${viewDetailPatient.docResult === 'HEALTHY' ? 'bg-indigo-50 border-indigo-100' : 'bg-red-50 border-red-200'}`}>
              <h4 className="font-black mb-2 text-lg text-slate-800">ความเห็นของแพทย์</h4>
              <p className={`font-bold text-base ${viewDetailPatient.docResult === 'HEALTHY' ? 'text-indigo-700' : 'text-red-700'}`}>{viewDetailPatient.docResult === 'HEALTHY' ? 'ไม่พบปัญหาสุขภาพที่รุนเเรงจนเป็นอุปสรรคต่อการปฏิบัติงาน' : 'พบปัญหาสุขภาพที่รุนเเรงจนเป็นอุปสรรคต่อการปฏิบัติงาน'}</p>
              {viewDetailPatient.docResult !== 'HEALTHY' && viewDetailPatient.healthProblem && viewDetailPatient.healthProblem.length > 0 && (
                <p className="text-red-600 font-bold mt-2">ปัญหาที่พบ: {viewDetailPatient.healthProblem.map(prob => prob === 'อื่นๆ' && viewDetailPatient.otherProblemText ? `อื่นๆ (${viewDetailPatient.otherProblemText})` : prob).join(', ')}</p>
              )}
              <p className={`text-slate-600 mt-2 font-semibold bg-white p-3 rounded-xl border ${viewDetailPatient.docResult === 'HEALTHY' ? 'border-indigo-50' : 'border-red-100'}`}>{viewDetailPatient.docNote || 'ไม่มีหมายเหตุเพิ่มเติม'}</p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border mt-4 bg-slate-50 border-slate-200 text-center">
              <h4 className="font-black mb-2 text-lg text-slate-600">ความเห็นของแพทย์</h4>
              <p className="font-bold text-base text-slate-400">รอแพทย์สรุปความเห็น และข้อแนะนำ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
