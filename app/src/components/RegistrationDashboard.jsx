import React from "react";
import { Users, Stethoscope, CheckCircle, Clock, Calendar, Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight, UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, X } from "lucide-react";

export default function RegistrationDashboard({ activeTab, currentDatePatients, formatDateDisplay, setPostponePatient, updatePatient, searchAndDateBar, postponePatient, newStartDate, setNewStartDate, searchTerm, setSearchTerm, isCalendarOpen, setIsCalendarOpen, selectedDate, monthsThai, currentMonthIndex, setCurrentMonthIndex, currentYear, setCurrentYear, getFirstDayOfMonth, getDaysInMonth, handleSelectDateCell, setViewDetailPatient }) {
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalCount = currentDatePatients.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalCount, currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = currentDatePatients.slice(startIndex, startIndex + itemsPerPage);

  const [isPostponeCalendarOpen, setIsPostponeCalendarOpen] = React.useState(false);
  const [postponeMonthIndex, setPostponeMonthIndex] = React.useState(currentMonthIndex);
  const [postponeYear, setPostponeYear] = React.useState(currentYear);

  const [evaluatePatient, setEvaluatePatient] = React.useState(null);
  const [evaluationStatus, setEvaluationStatus] = React.useState(null);
  const [evaluationNote, setEvaluationNote] = React.useState('');

  const handleSelectPostponeDateCell = (day) => {
    const mStr = String(postponeMonthIndex + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    setNewStartDate(`${dStr}/${mStr}/${postponeYear}`);
    setIsPostponeCalendarOpen(false);
  };

  const handleRegistrationAction = (patientId, action, extraData = null) => {
    let updatedFields = {};
    if (action === 'DELAY') updatedFields = { status: 'DELAYED', delayedDate: extraData, hrAction: 'DELAYED', hrActionDate: selectedDate, evaluateNote: 'เลื่อนวันเริ่มงาน' };
    else if (action === 'APPROVE') updatedFields = { status: 'COMPLETED', evaluateNote: extraData, hrAction: 'COMPLETED', hrActionDate: selectedDate };
    else if (action === 'REJECT') updatedFields = { status: 'REJECTED', evaluateNote: extraData, hrAction: 'REJECTED', hrActionDate: selectedDate };
    else if (action === 'RESET') updatedFields = { status: 'WAITING_NURSE', evaluateNote: '', hrAction: '', hrActionDate: '' };

    updatePatient(patientId, updatedFields, 'บันทึกข้อมูลเรียบร้อยแล้ว');
  };

  return (
    <div className="flex flex-col w-full gap-5">

      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-[26px] font-black text-[#26588c] tracking-tight mb-0.5">ลงทะเบียนเริ่มงาน</h1>
          <p className="text-[13px] font-bold text-slate-500 leading-snug">
            จัดการข้อมูลและสถานะการรายงานตัวของ<br />พนักงานใหม่
          </p>
        </div>

        <div className="flex items-center gap-5">
          <button className="bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2.5 shadow-[0_4px_14px_rgba(239,68,68,0.5)] transition-all text-[13px]">
            <UserX size={16} strokeWidth={2.5} />
            สิ้นวัน (ปรับเป็น No Show)
          </button>
          <div className="bg-white border border-slate-100 rounded-xl px-5 h-[52px] flex items-center gap-5 shadow-sm min-w-[290px] relative">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-slate-500" strokeWidth={2.5} />
              <span className="font-bold text-slate-600 text-[13px]">วันที่เริ่มงาน:</span>
            </div>
            <div
              className="border border-slate-300 rounded-md bg-white px-2 py-1 shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <input type="text" value={formatDateDisplay(selectedDate)} readOnly className="font-bold text-slate-800 bg-transparent outline-none w-[90px] text-center text-[13px] cursor-pointer pointer-events-none" />
            </div>

            {isCalendarOpen && <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />}
            {isCalendarOpen && (
              <div className="absolute right-0 top-full mt-4 bg-white border border-slate-300 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 z-50 w-[22rem]">
                <div className="absolute -top-2.5 right-[65px] w-5 h-5 bg-white border-t border-l border-slate-300 transform rotate-45 rounded-sm"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <button onClick={() => { if (currentMonthIndex === 0) { if (currentYear > 2568) { setCurrentMonthIndex(11); setCurrentYear(currentYear - 1); } } else setCurrentMonthIndex(currentMonthIndex - 1); }} className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all" disabled={currentMonthIndex === 0 && currentYear === 2568}><ChevronLeft size={20} /></button>
                  <div className="flex items-center gap-2">
                    <select value={currentMonthIndex} onChange={(e) => setCurrentMonthIndex(Number(e.target.value))} className="font-black text-base text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none px-3 py-2 cursor-pointer">{monthsThai.map((month, idx) => (<option key={idx} value={idx}>{month}</option>))}</select>
                    <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="font-black text-base text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none px-3 py-2 cursor-pointer">{[2569, 2568].map(year => (<option key={year} value={year}>{year}</option>))}</select>
                  </div>
                  <button onClick={() => { if (currentMonthIndex === 11) { if (currentYear < 2569) { setCurrentMonthIndex(0); setCurrentYear(currentYear + 1); } } else setCurrentMonthIndex(currentMonthIndex + 1); }} className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all" disabled={currentMonthIndex === 11 && currentYear === 2569}><ChevronRight size={20} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2 relative z-10">{['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (<span key={d} className="text-base font-bold text-slate-400">{d}</span>))}</div>
                <div className="grid grid-cols-7 gap-1 text-center relative z-10">
                  {Array.from({ length: getFirstDayOfMonth(currentMonthIndex, currentYear) }).map((_, i) => (<div key={`empty-${i}`} />))}
                  {Array.from({ length: getDaysInMonth(currentMonthIndex, currentYear) }).map((_, i) => {
                    const dayNum = i + 1;
                    const gregorianYear = currentYear - 543;
                    const mStr = String(currentMonthIndex + 1).padStart(2, '0');
                    const dStr = String(dayNum).padStart(2, '0');
                    const dateStrFull = `${gregorianYear}-${mStr}-${dStr}`;
                    return (
                      <button key={dayNum} onClick={() => handleSelectDateCell(dayNum)} className={`h-12 w-12 mx-auto rounded-xl font-bold flex items-center justify-center text-base transition-all ${selectedDate === dateStrFull ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}>{dayNum}</button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Big Search Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[88px] flex justify-center items-center w-full px-6">
        <div className="border border-slate-300 rounded-xl px-5 h-[50px] flex items-center w-[600px] bg-[#f8f9fa] transition-colors focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-400">
          <Search className="text-slate-400 mr-3 shrink-0" size={20} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="สแกนหรือพิมพ์เลขบัตรประชาชนแล้วกด Enter..."
            className="bg-transparent border-none outline-none text-[15px] font-semibold text-slate-700 w-full placeholder:text-slate-400/80 h-full"
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <div className="text-[14px] font-bold text-slate-600">
            พนักงานทั้งหมดที่ต้องเริ่มงานในวันนี้: <span className="text-blue-600">{totalCount}</span> คน
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 h-10 flex items-center shadow-sm w-[280px] transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input
              type="text"
              placeholder="ค้นหาชื่อ-นามสกุล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] font-semibold text-slate-700 w-full placeholder:text-slate-400 h-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto px-6 pb-6 bg-white">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-500 text-[12px] font-bold">
                <th className="py-2 px-6 whitespace-nowrap border-b border-transparent">ชื่อ-นามสกุล</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">รหัสพนักงาน</th>
                <th className="py-2 px-4 whitespace-nowrap border-b border-transparent">ตำแหน่ง / หน่วยงาน</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">วันที่เริ่มงาน / เลื่อน</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">สถานะ</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">ผลการประเมิน</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">หมายเหตุ</th>
                <th className="py-2 px-4 whitespace-nowrap text-center border-b border-transparent">ผลตรวจสุขภาพ</th>
                <th className="py-2 px-6 whitespace-nowrap text-center border-b border-transparent">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((p, idx) => {
                const index = startIndex + idx;
                const isRejected = p.status === 'REJECTED';
                const isDelayed = p.status === 'DELAYED';
                const isCompleted = p.status === 'COMPLETED';
                const isFinished = isRejected || isDelayed || isCompleted;

                const leftColor = isRejected ? 'bg-red-500' : isDelayed ? 'bg-orange-500' : isCompleted ? 'bg-emerald-500' : 'bg-slate-400';
                const isAbnormal = p.docResult === 'ไม่ผ่าน' || p.docResult === 'ผ่านแบบมีเงื่อนไข' || p.upt === 'Positive' || p.mamp === 'Positive' || p.mentalAbnormal === true;

                return (
                  <tr key={p.id} className={`group shadow-sm hover:shadow-md transition-shadow ${isFinished ? 'bg-white' : 'bg-[#f8f9fa]'}`}>
                    <td className={`py-4 px-6 relative rounded-l-2xl border-y border-l ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${leftColor}`}></div>
                      <div className="flex items-center gap-3 pl-2">
                        <div className={`w-11 h-11 rounded-xl ${isFinished ? 'bg-slate-300' : 'bg-[#7c83fd]'} text-white flex items-center justify-center font-bold text-[20px] shrink-0 shadow-sm`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[14px] text-slate-800 whitespace-nowrap">{p.name}</div>
                          <div className="font-semibold text-[11px] text-slate-400 tracking-wide mt-0.5">110080057298{p.id % 10}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-center border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      <span className="bg-blue-50/50 border border-blue-200/60 text-[#3b82f6] px-2.5 py-1 rounded-md font-bold text-[13px] inline-block shadow-sm">
                        6930{30 - index}
                      </span>
                    </td>
                    <td className={`py-4 px-4 border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      <div className="font-bold text-[13px] text-slate-800 whitespace-nowrap">{p.position}</div>
                      <div className="font-semibold text-[11px] text-slate-500 mt-1 max-w-[150px] leading-tight">
                        -
                      </div>
                      {isFinished && (
                        <span className="border border-slate-300 text-slate-500 rounded px-1.5 py-0.5 text-[9px] font-bold mt-2 inline-block">BACK</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      <div className="font-bold text-[13px] text-slate-800 text-center whitespace-nowrap">{formatDateDisplay(p.date)}</div>
                      {isDelayed && (
                        <div className="text-center mt-1">
                          <span className="text-slate-400 text-[11px] font-semibold">เลื่อนเป็น</span>
                          <br />
                          <span className="text-slate-600 text-[11px] font-bold">{p.delayedDate || '01/08/2569'}</span>
                        </div>
                      )}
                      {isDelayed && (
                        <div className="flex justify-center mt-2">
                          <div className="border border-[#fde68a] bg-[#fef3c7] text-[#d97706] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 shadow-sm">
                            <AlertCircle size={12} strokeWidth={2.5} /> เลื่อน 1 ครั้ง
                          </div>
                        </div>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-center border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      {isRejected ? (
                        <span className="bg-[#ef4444] text-white px-4 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm">ยกเลิกเริ่มงาน</span>
                      ) : isDelayed ? (
                        <span className="bg-[#6b7280] text-white px-4 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm">เลื่อนวันเริ่มงาน</span>
                      ) : (
                        <span className="bg-[#bbf7d0] text-[#15803d] px-4 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm">รายงานตัวแล้ว</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-center border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      {isFinished ? (
                        isDelayed ? (
                          <span className="text-slate-400 font-bold">-</span>
                        ) : (
                          <button className={`${isRejected ? 'bg-[#ef4444]' : 'bg-emerald-500'} text-white px-5 py-1.5 rounded-full font-bold text-[12px] whitespace-nowrap shadow-sm transition-colors cursor-default`}>
                            {isRejected ? 'ไม่ผ่าน' : 'ผ่าน'}
                          </button>
                        )
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'} align-middle`}>
                      {isRejected ? (
                        <div className="text-[12px] text-slate-600 font-semibold max-w-[130px] leading-tight break-words mx-auto text-center">
                          {p.evaluateNote || '-'}
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 font-bold">-</div>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-center border-y ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      {p.status === 'WAITING_NURSE' ? (
                        <span className="text-slate-400 font-semibold text-[13px]">รอตรวจ</span>
                      ) : p.status === 'HOLD' ? (
                        <span className="text-orange-500 font-semibold text-[13px]">กำลังตรวจ</span>
                      ) : p.nurseName && p.nurseName !== '-' ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <button onClick={() => setViewDetailPatient(p)} className="bg-emerald-50/80 border border-emerald-200 text-emerald-600 px-4 py-1.5 rounded-full font-bold text-[12px] flex items-center justify-center gap-1.5 mx-auto hover:bg-emerald-100 transition-colors whitespace-nowrap shadow-sm">
                            <Activity size={14} strokeWidth={2.5} /> ดูผลตรวจ
                          </button>
                          {isAbnormal && <span className="text-red-500 text-[11px] font-bold mt-0.5">* พบความผิดปกติ</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className={`py-4 px-6 text-center border-y border-r rounded-r-2xl ${isFinished ? 'border-slate-200' : 'border-slate-300'}`}>
                      {isFinished ? (
                        <div className="flex items-center justify-center">
                          <button onClick={() => handleRegistrationAction(p.id, 'RESET')} className="text-slate-500 border border-slate-300 hover:bg-slate-100 p-1.5 rounded-full transition-colors shadow-sm shrink-0" title="ย้อนกลับ (Undo)">
                            <RotateCcw size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setPostponePatient(p)} className="border border-orange-400 text-orange-500 bg-white px-4 py-1.5 rounded-full font-bold text-[11px] shadow-sm hover:bg-orange-50 whitespace-nowrap">
                            เลื่อนวันเริ่มงาน
                          </button>
                          <button onClick={() => setEvaluatePatient(p)} className="border border-emerald-500 text-emerald-600 bg-white px-4 py-1.5 rounded-full font-bold text-[11px] shadow-sm hover:bg-emerald-50 whitespace-nowrap">
                            ประเมินผล
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {currentDatePatients.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400 font-bold text-[15px]">
                    ไม่มีรายชื่อพนักงานที่ต้องเริ่มงานในวันนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination / Footer */}
          <div className="mt-2 flex justify-between items-center border-t border-slate-200 pt-5">
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

      {/* Postpone Modal */}
      {postponePatient && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPostponePatient(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-visible" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-[20px] font-bold text-slate-800">เลื่อนวันเริ่มงาน</h3>
              <button onClick={() => setPostponePatient(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block font-bold text-slate-700 mb-2 text-[15px]">ชื่อผู้สมัคร</label>
                <div className="bg-slate-200/70 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-400 cursor-not-allowed text-[15px]">
                  {postponePatient.name}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2 text-[15px]">วันที่เริ่มงานใหม่ <span className="text-[#ef4444]">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    onClick={() => setIsPostponeCalendarOpen(true)}
                    placeholder="วว/ดด/ปปปป"
                    className={`w-full border rounded-xl px-4 py-3 font-bold text-slate-800 outline-none transition-all text-[15px] ${isPostponeCalendarOpen ? 'border-[#2f65f6] ring-4 ring-[#2f65f6]/10 bg-white' : 'border-slate-300 focus:border-[#2f65f6] focus:ring-4 focus:ring-[#2f65f6]/10'}`}
                  />
                  {newStartDate && (
                    <button onClick={() => setNewStartDate('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#004b93] hover:text-blue-900 z-10">
                      <div className="bg-[#004b93] rounded-full p-[3px] text-white">
                        <X size={12} strokeWidth={3.5} />
                      </div>
                    </button>
                  )}

                  {isPostponeCalendarOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsPostponeCalendarOpen(false)} />
                      <div className="absolute left-0 bottom-full mb-3 bg-white border border-slate-300 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 z-50 w-[22rem]">
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b border-r border-slate-300 transform rotate-45 rounded-sm"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                          <button onClick={() => { if (postponeMonthIndex === 0) { if (postponeYear > 2568) { setPostponeMonthIndex(11); setPostponeYear(postponeYear - 1); } } else setPostponeMonthIndex(postponeMonthIndex - 1); }} className="p-2 hover:bg-slate-100 rounded-full border border-slate-200 disabled:opacity-30 transition-all" disabled={postponeMonthIndex === 0 && postponeYear === 2568}><ChevronLeft size={20} className="text-[#2f65f6]" /></button>
                          <div className="flex items-center gap-2">
                            <select value={postponeMonthIndex} onChange={(e) => setPostponeMonthIndex(Number(e.target.value))} className="font-black text-[15px] text-slate-800 bg-white border border-slate-200 rounded-xl outline-none px-3 py-2 cursor-pointer shadow-sm hover:border-slate-300">{monthsThai.map((month, idx) => (<option key={idx} value={idx}>{month}</option>))}</select>
                            <select value={postponeYear} onChange={(e) => setPostponeYear(Number(e.target.value))} className="font-black text-[15px] text-slate-800 bg-white border border-slate-200 rounded-xl outline-none px-3 py-2 cursor-pointer shadow-sm hover:border-slate-300">{[2569, 2568].map(year => (<option key={year} value={year}>{year}</option>))}</select>
                          </div>
                          <button onClick={() => { if (postponeMonthIndex === 11) { if (postponeYear < 2569) { setPostponeMonthIndex(0); setPostponeYear(postponeYear + 1); } } else setPostponeMonthIndex(postponeMonthIndex + 1); }} className="p-2 hover:bg-slate-100 rounded-full border border-slate-200 disabled:opacity-30 transition-all" disabled={postponeMonthIndex === 11 && postponeYear === 2569}><ChevronRight size={20} className="text-[#2f65f6]" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-3 relative z-10">{['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (<span key={d} className="text-[13px] font-bold text-slate-800">{d}</span>))}</div>
                        <div className="grid grid-cols-7 gap-1 text-center relative z-10">
                          {Array.from({ length: getFirstDayOfMonth(postponeMonthIndex, postponeYear) }).map((_, i) => {
                            const prevMonthDays = getDaysInMonth(postponeMonthIndex === 0 ? 11 : postponeMonthIndex - 1, postponeMonthIndex === 0 ? postponeYear - 1 : postponeYear);
                            const dayNum = prevMonthDays - getFirstDayOfMonth(postponeMonthIndex, postponeYear) + i + 1;
                            return <div key={`prev-${i}`} className="h-[38px] w-[38px] mx-auto rounded-lg font-bold flex items-center justify-center text-[15px] text-[#d97706]/40">{dayNum}</div>
                          })}
                          {Array.from({ length: getDaysInMonth(postponeMonthIndex, postponeYear) }).map((_, i) => {
                            const dayNum = i + 1;
                            const mStr = String(postponeMonthIndex + 1).padStart(2, '0');
                            const dStr = String(dayNum).padStart(2, '0');
                            const dateStrFull = `${dStr}/${mStr}/${postponeYear}`;
                            const isSelected = newStartDate === dateStrFull;
                            return (
                              <button key={dayNum} onClick={() => handleSelectPostponeDateCell(dayNum)} className={`h-[38px] w-[38px] mx-auto rounded-lg font-bold flex items-center justify-center text-[15px] transition-all ${isSelected ? 'bg-[#004b93] text-white shadow-md' : 'hover:bg-slate-100 text-[#d97706]'}`}>{dayNum}</button>
                            );
                          })}
                          {Array.from({ length: 42 - (getFirstDayOfMonth(postponeMonthIndex, postponeYear) + getDaysInMonth(postponeMonthIndex, postponeYear)) }).map((_, i) => (
                            <div key={`next-${i}`} className="h-[38px] w-[38px] mx-auto rounded-lg font-bold flex items-center justify-center text-[15px] text-[#d97706]/40">{i + 1}</div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
              <button onClick={() => setPostponePatient(null)} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-[14px]">ยกเลิก</button>
              <button
                onClick={() => {
                  handleRegistrationAction(postponePatient.id, 'DELAY', newStartDate);
                  setPostponePatient(null);
                  setNewStartDate('04/08/2569');
                }}
                className="px-6 py-2.5 bg-[#2f65f6] text-white font-bold rounded-xl hover:bg-[#1a55e6] transition-colors text-[14px]"
              >
                ยืนยันการเลื่อน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluate Modal */}
      {evaluatePatient && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto" onClick={() => { setEvaluatePatient(null); setEvaluationStatus(null); setEvaluationNote(''); }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-visible my-auto" onClick={e => e.stopPropagation()}>
            <div className="p-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#7ca2bb] flex items-center justify-center mb-6">
                <span className="text-[#7ca2bb] text-5xl font-black mb-1">?</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">การประเมินผลการรายงานตัวเริ่มงาน</h3>
              <p className="text-[15px] font-bold text-[#476073] mb-6">ประเมินผลการเริ่มงานของผู้สมัคร: <span className="text-slate-900">{evaluatePatient.name}</span></p>

              <div className="flex gap-4 w-full mb-6">
                <button
                  onClick={() => setEvaluationStatus('PASS')}
                  className={`flex-1 border-2 rounded-xl py-6 flex flex-col items-center gap-3 transition-all ${evaluationStatus === 'PASS' ? 'border-[#10b981] bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${evaluationStatus === 'PASS' ? 'border-[#10b981]' : 'border-slate-300'}`}>
                    {evaluationStatus === 'PASS' && <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>}
                  </div>
                  <span className={`font-bold text-[16px] ${evaluationStatus === 'PASS' ? 'text-[#10b981]' : 'text-[#6b7280]'}`}>ผ่าน</span>
                </button>
                <button
                  onClick={() => setEvaluationStatus('FAIL')}
                  className={`flex-1 border-2 rounded-xl py-6 flex flex-col items-center gap-3 transition-all ${evaluationStatus === 'FAIL' ? 'border-[#ef4444] bg-red-50/50' : 'border-slate-200 hover:border-red-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${evaluationStatus === 'FAIL' ? 'border-[#ef4444]' : 'border-slate-300'}`}>
                    {evaluationStatus === 'FAIL' && <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>}
                  </div>
                  <span className={`font-bold text-[16px] ${evaluationStatus === 'FAIL' ? 'text-[#ef4444]' : 'text-[#6b7280]'}`}>ไม่ผ่าน</span>
                </button>
              </div>

              <div className="w-full text-left">
                <label className="block font-bold text-[#476073] mb-2 text-[15px]">ระบุเหตุผล / หมายเหตุการประเมิน</label>
                <textarea
                  value={evaluationNote}
                  onChange={(e) => setEvaluationNote(e.target.value)}
                  placeholder="กรุณาระบุเหตุผลการประเมิน..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-[#2f65f6] focus:ring-4 focus:ring-[#2f65f6]/10 transition-all text-[15px] resize-none h-32"
                />
              </div>
            </div>

            <div className="flex justify-center gap-3 px-6 pb-8 bg-white rounded-b-xl">
              <button
                onClick={() => { setEvaluatePatient(null); setEvaluationStatus(null); setEvaluationNote(''); }}
                className="px-8 py-3 bg-[#6b7280] text-white font-bold rounded-md hover:bg-slate-600 transition-colors text-[16px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (evaluationStatus) {
                    handleRegistrationAction(evaluatePatient.id, evaluationStatus === 'PASS' ? 'APPROVE' : 'REJECT', evaluationNote);
                    setEvaluatePatient(null);
                    setEvaluationStatus(null);
                    setEvaluationNote('');
                  }
                }}
                disabled={!evaluationStatus}
                className="px-8 py-3 bg-[#10b981] text-white font-bold rounded-md hover:bg-emerald-600 transition-colors text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                บันทึกผลการประเมิน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
