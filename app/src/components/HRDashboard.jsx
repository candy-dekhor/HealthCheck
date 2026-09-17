import React from "react";
import { Users, Stethoscope, CheckCircle, Clock, Calendar, Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight, UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, X } from "lucide-react";

export default function HRDashboard({ currentDatePatients, activeHrFilter, setActiveHrFilter, formatDateDisplay, updatePatient, searchAndDateBar, setViewDetailPatient, patients, selectedDate }) {
  const waitNursePatients = currentDatePatients.filter(p => ['WAITING_NURSE', 'HOLD'].includes(p.status));
  const waitHrPatients = currentDatePatients.filter(p => ['WAITING_HR', 'WAITING_DOCTOR'].includes(p.status) && !p.hrAction);
  const completedPatients = currentDatePatients.filter(p => p.hrAction || ['COMPLETED', 'REJECTED', 'DELAYED'].includes(p.status));

  const totalCount = currentDatePatients.length;
  const handleHRDecision = (id, decision) => {
    const pt = currentDatePatients.find(p => p.id === id);
    let status = pt.status;
    let msg = '';

    if (pt.status === 'WAITING_HR' || pt.status === 'COMPLETED' || pt.status === 'REJECTED' || pt.status === 'DELAYED') {
      if (decision === 'REJECTED') status = 'REJECTED';
      else if (decision === 'DELAYED') status = 'DELAYED';
      else if (decision === 'COMPLETED') status = 'COMPLETED';
    }
    let updatedNote = '';
    if (decision === 'REJECTED') { msg = 'บันทึกไม่รับเข้าทำงานเรียบร้อย'; updatedNote = 'ไม่ผ่านการประเมิน'; }
    else if (decision === 'DELAYED') { msg = 'บันทึกเลื่อนเริ่มงานเรียบร้อย'; updatedNote = 'เลื่อนวันเริ่มงาน'; }
    else if (decision === 'COMPLETED') { msg = 'บันทึกรับเข้าทำงานเรียบร้อย'; updatedNote = 'ผ่านการประเมิน'; }

    updatePatient(id, { status: status, hrAction: decision, hrActionDate: selectedDate, evaluateNote: updatedNote }, msg);
  };
  const waitingCount = waitNursePatients.length;
  const waitingHrCount = waitHrPatients.length;
  const completedCount = completedPatients.length;

  const filteredPatients = (() => {
    if (activeHrFilter === 'WAITING') return [...waitNursePatients].reverse();
    if (activeHrFilter === 'WAITING_HR') return [...waitHrPatients].reverse();
    if (activeHrFilter === 'COMPLETED') return [...completedPatients].reverse();
    return [...waitHrPatients.reverse(), ...waitNursePatients.reverse(), ...completedPatients.reverse()];
  })();

  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  const currentTotalCount = filteredPatients.length;
  const totalPages = Math.ceil(currentTotalCount / itemsPerPage) || 1;

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentTotalCount, currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-emerald-500 rounded-l-2xl"></div>
        <div className="bg-emerald-500 p-4 rounded-xl text-white mr-5 shadow-sm"><Users size={32} strokeWidth={2} /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - ฝ่ายบุคคล</h1>
          <p className="text-base font-bold text-slate-500 mt-1">ดูสถานะ จัดการ และอนุมัติผลการตรวจสุขภาพของผู้สมัครงานทั้งหมด</p>
        </div>
      </div>

      {searchAndDateBar}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Card 1 - รายชื่อพนักงานทั้งหมด */}
        <div onClick={() => setActiveHrFilter('ALL')} className={`bg-white rounded-xl p-5 relative overflow-hidden cursor-pointer transition-all ${activeHrFilter === 'ALL' ? 'border-2 border-blue-400 shadow-md' : 'border border-blue-100 hover:border-blue-300'}`}>
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-blue-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-blue-600">{totalCount}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-semibold text-slate-600">พนักงานทั้งหมด</span>
          </div>
        </div>

        {/* Card 2 - สถานะรอตรวจ */}
        <div onClick={() => setActiveHrFilter('WAITING')} className={`bg-white rounded-xl p-5 relative overflow-hidden cursor-pointer transition-all ${activeHrFilter === 'WAITING' ? 'border-2 border-indigo-400 shadow-md' : 'border border-indigo-100 hover:border-indigo-300'}`}>
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-indigo-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-indigo-600">{waitingCount}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-sm font-semibold text-slate-600">สถานะรอตรวจ</span>
          </div>
        </div>

        {/* Card 3 - ตัดสินใจจ้างงาน */}
        <div onClick={() => setActiveHrFilter('COMPLETED')} className={`bg-white rounded-xl p-5 relative overflow-hidden cursor-pointer transition-all ${activeHrFilter === 'COMPLETED' ? 'border-2 border-emerald-400 shadow-md' : 'border border-emerald-100 hover:border-emerald-300'}`}>
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-emerald-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-semibold text-slate-600">ตัดสินใจจ้างงาน</span>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">รายชื่อพนักงานทั้งหมดที่มาเริ่มงานวันแรก</h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg">ทั้งหมด {filteredPatients.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[13px] font-semibold text-center">
                <th className="px-5 py-3.5 text-left w-16">ลำดับ</th>
                <th className="px-4 py-3.5 text-left">ชื่อ - นามสกุล</th>
                <th className="px-4 py-3.5 text-center">รหัสพนักงาน</th>
                <th className="px-4 py-3.5 text-left">ตำแหน่ง</th>

                <th className="px-4 py-3.5">วันที่ตรวจสุขภาพ</th>
                <th className="px-4 py-3.5">ผลการจ้างงาน</th>
                <th className="px-4 py-3.5">หมายเหตุ</th>
                <th className="px-4 py-3.5">พยาบาลผู้ตรวจ</th>
                <th className="px-4 py-3.5">แพทย์ผู้ตรวจ</th>
                <th className="px-4 py-3.5">ผลตรวจสุขภาพ</th>
                {activeHrFilter === 'WAITING_HR' && <th className="px-4 py-3.5">การตัดสินใจจ้างงาน</th>}
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((p, idx) => {
                const globalIdx = startIndex + idx + 1;
                const isAbnormal = p.docResult === 'UNHEALTHY' || p.upt === 'Positive' || p.mamp === 'Positive' || p.mentalAbnormal === true;
                return (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-center text-slate-600 text-sm">
                    <td className="px-5 py-4 text-left text-slate-400">{globalIdx}</td>
                    <td className="px-4 py-4 text-left font-bold text-slate-800">{p.name}</td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-500">6930{p.id}</td>
                    <td className="px-4 py-4 text-left text-slate-500">{p.position}</td>

                    <td className="px-4 py-4">{formatDateDisplay(p.date)}</td>
                    <td className="px-4 py-4">
                      {p.status === 'REJECTED' ? (
                        <button className="bg-[#ef4444] text-white px-5 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm transition-colors cursor-default">
                          ไม่ผ่าน
                        </button>
                      ) : p.status === 'COMPLETED' ? (
                        <button className="bg-emerald-500 text-white px-5 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm transition-colors cursor-default">
                          ผ่าน
                        </button>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {p.status === 'DELAYED' || p.hrAction === 'DELAYED' ? (
                        <div className="text-[12px] text-slate-600 font-semibold max-w-[130px] leading-tight break-words mx-auto text-center">
                          {p.evaluateNote || 'เลื่อนวันเริ่มงาน'}
                          {p.delayedDate && (
                            <div className="text-orange-600 font-bold mt-1">วันที่: {p.delayedDate}</div>
                          )}
                        </div>
                      ) : p.evaluateNote ? (
                        <div className="text-[12px] text-slate-600 font-semibold max-w-[130px] leading-tight break-words mx-auto text-center">
                          {p.evaluateNote}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {['WAITING_NURSE', 'HOLD'].includes(p.status) ? '-' : (p.nurseName || '-')}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {['WAITING_NURSE', 'HOLD', 'WAITING_DOCTOR'].includes(p.status) ? '-' : (p.docName || '-')}
                    </td>
                    <td className="px-4 py-4">
                      {p.status === 'WAITING_NURSE' ? (
                        <span className="text-slate-400 font-semibold text-sm">รอตรวจ</span>
                      ) : p.status === 'HOLD' ? (
                        <span className="text-orange-500 font-semibold text-sm">กำลังตรวจ</span>
                      ) : p.nurseName && p.nurseName !== '-' ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <button onClick={() => setViewDetailPatient(p)} className="mx-auto flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[13px] font-bold hover:bg-emerald-100 transition-colors shadow-sm">
                            <FileCheck size={14} />
                            ดูผลตรวจ
                          </button>
                          {isAbnormal && <span className="text-red-500 text-[11px] font-bold mt-0.5">* พบความผิดปกติ</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    {activeHrFilter === 'WAITING_HR' && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <button onClick={() => handleHRDecision(p.id, 'DELAYED')} className="px-3 py-1.5 bg-amber-50 text-amber-500 rounded-md text-xs font-semibold hover:bg-amber-100 transition-colors">เลื่อน</button>
                          <button onClick={() => handleHRDecision(p.id, 'COMPLETED')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm">รับทำงาน</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {currentPatients.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400 font-bold text-[15px]">
                    ไม่มีรายชื่อพนักงานในสถานะนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination / Footer */}
          <div className="mt-2 flex justify-between items-center border-t border-slate-200 pt-5 px-5 pb-5">
            <div className="flex items-center gap-3 text-slate-600 text-[13px] font-bold">
              แสดง:
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 bg-white outline-none appearance-none font-bold text-slate-700 shadow-sm cursor-pointer hover:border-slate-400 transition-colors">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" strokeWidth={3} />
              </div>
            </div>
            <div className="flex items-center bg-[#f1f5f9] rounded-xl p-1 text-[13px] font-bold text-slate-600 shadow-inner">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-1.5 rounded-lg transition-colors ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-slate-200 cursor-pointer text-slate-700'}`}>ก่อนหน้า</button>
              <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">{currentPage} / {totalPages}</div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-1.5 rounded-lg transition-colors ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-slate-200 cursor-pointer text-slate-700'}`}>ถัดไป</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
