import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Stethoscope, CheckCircle, Clock, Calendar, 
  Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('HR');
  const [selectedDate, setSelectedDate] = useState('2026-07-23');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // 6 = July
  const [currentYear, setCurrentYear] = useState(2569);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initial Patients Data (10 Mock Data)
  const [patients, setPatients] = useState([
    {
      id: 1, name: 'สมชาย ใจดี', gender: 'M', age: 25, position: 'ฝ่ายขาย', startDate: '01/08/2569', date: '2026-07-23', status: 'WAITING_NURSE',
      height: '', weight: '', waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 2, name: 'สมหญิง รักงาน', gender: 'F', age: 28, position: 'ฝ่ายขาย', startDate: '01/08/2569', date: '2026-07-23', status: 'WAITING_NURSE',
      height: '', weight: '', waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 3, name: 'วิชัย เก่งการ', gender: 'M', age: 30, position: 'ฝ่ายขาย', startDate: '15/08/2569', date: '2026-07-23', status: 'HOLD',
      height: 170, weight: 68, waist: null, waistRatio: null, pulse: 72, bp: '120/80', flow: 450, flowPercent: 95,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล ใจดี', docName: '-'
    },
    {
      id: 4, name: 'นารี สวยงาม', gender: 'F', age: 26, position: 'ฝ่ายขาย', startDate: '01/09/2569', date: '2026-07-23', status: 'WAITING_DOCTOR',
      height: 160, weight: 52, waist: null, waistRatio: null, pulse: 75, bp: '110/70', flow: 400, flowPercent: 90,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล ใจดี', docName: '-'
    },
    {
      id: 5, name: 'บุญส่ง มั่งคั่ง', gender: 'M', age: 35, position: 'ฝ่ายขาย', startDate: '01/09/2569', date: '2026-07-23', status: 'WAITING_HR',
      height: 175, weight: 80, waist: 36, waistRatio: 0.52, pulse: 80, bp: '130/85', flow: 420, flowPercent: 88,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: 'HEALTHY', docNote: 'ร่างกายแข็งแรงสมบูรณ์ดี พร้อมทำงาน', hrAction: '', nurseName: 'พยาบาล ใจดี', docName: 'นพ. เก่งเวช'
    },
    {
      id: 6, name: 'ทวีศักดิ์ รักชาติ', gender: 'M', age: 40, position: 'ฝ่ายขาย', startDate: '01/08/2569', date: '2026-07-23', status: 'WAITING_HR',
      height: 168, weight: 70, waist: null, waistRatio: null, pulse: 76, bp: '122/82', flow: 410, flowPercent: 92,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: 'HEALTHY', docNote: 'ผ่านเกณฑ์การตรวจสุขภาพ', hrAction: '', nurseName: 'พยาบาล ใจดี', docName: 'นพ. เก่งเวช'
    },
    {
      id: 7, name: 'กิตติ มั่นคง', gender: 'M', age: 45, position: 'ฝ่ายขาย', startDate: '15/07/2569', date: '2026-07-23', status: 'COMPLETED',
      height: 172, weight: 65, waist: null, waistRatio: null, pulse: 70, bp: '120/80', flow: 460, flowPercent: 95,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: 'HEALTHY', docNote: 'สุขภาพสมบูรณ์แข็งแรง', hrAction: 'APPROVED', nurseName: 'พยาบาล ใจดี', docName: 'พญ. สมทรง'
    },
    {
      id: 8, name: 'มาลี ดีใจ', gender: 'F', age: 50, position: 'ฝ่ายขาย', startDate: '01/08/2569', date: '2026-07-23', status: 'WAITING_NURSE',
      height: '', weight: '', waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 9, name: 'สุชาติ ชาติเจริญ', gender: 'M', age: 38, position: 'ฝ่ายขาย', startDate: '01/08/2569', date: '2026-07-23', status: 'WAITING_DOCTOR',
      height: 170, weight: 75, waist: 34, waistRatio: 0.50, pulse: 78, bp: '125/85', flow: 430, flowPercent: 93,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล สมร', docName: '-'
    },
    {
      id: 10, name: 'อำนาจ มาดแมน', gender: 'M', age: 32, position: 'ฝ่ายขาย', startDate: '15/08/2569', date: '2026-07-23', status: 'WAITING_HR',
      height: 165, weight: 65, waist: null, waistRatio: null, pulse: 74, bp: '118/78', flow: 440, flowPercent: 96,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', kitQty: 1, kitReason: '',
      docResult: 'HEALTHY', docNote: 'สายตาปกติ ร่างกายพร้อมทำงาน', hrAction: '', nurseName: 'พยาบาล สมร', docName: 'นพ. เก่งเวช'
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [viewDetailPatient, setViewDetailPatient] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updatePatient = (id, updatedFields, msg) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    if (msg) showToast(msg);
  };

  const monthsThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const getDaysInMonth = (monthIndex, year) => new Date(year - 543, monthIndex + 1, 0).getDate();
  const getFirstDayOfMonth = (monthIndex, year) => new Date(year - 543, monthIndex, 1).getDay();

  const handleSelectDateCell = (dayNum) => {
    const gregorianYear = currentYear - 543;
    const mStr = String(currentMonthIndex + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    setSelectedDate(`${gregorianYear}-${mStr}-${dStr}`);
    setIsCalendarOpen(false);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const thaiYear = parseInt(y) + 543;
    return `${d}/${m}/${thaiYear}`;
  };

  const ChevronDown = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
  );

  // Component Search and Date ที่แยกกันคนละกล่อง
  const SearchAndDateBar = () => (
    <div className="flex items-center gap-4 mb-8 w-full z-20 relative">
      {/* Search Box */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[14px] p-2 pl-4 flex items-center shadow-sm">
        <Search className="text-slate-400 mr-3 shrink-0" size={22} />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อ..." 
          className="bg-transparent border-none outline-none text-lg font-bold text-slate-700 w-full placeholder:text-slate-400"
        />
      </div>
      
      {/* Date Picker Box */}
      <div className="relative shrink-0">
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center gap-3 px-6 py-3 rounded-[14px] font-bold text-lg shadow-sm transition-all border relative z-30 ${isCalendarOpen ? 'bg-white border-blue-400 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-blue-600'}`}
        >
          <Calendar size={20} className={isCalendarOpen ? 'text-blue-600' : 'text-slate-400'} />
          <span>{formatDateDisplay(selectedDate)}</span>
          <ChevronDown size={20} className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
        </button>

        {isCalendarOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />
        )}

        {isCalendarOpen && (
          <div className="absolute right-0 mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-50 w-[22rem]">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => { if (currentMonthIndex === 0) { if (currentYear > 2568) { setCurrentMonthIndex(11); setCurrentYear(currentYear - 1); } } else setCurrentMonthIndex(currentMonthIndex - 1); }} className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all" disabled={currentMonthIndex === 0 && currentYear === 2568}><ChevronLeft size={20} /></button>
              <div className="flex items-center gap-2">
                <select value={currentMonthIndex} onChange={(e) => setCurrentMonthIndex(Number(e.target.value))} className="font-black text-base text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none px-3 py-2 cursor-pointer">{monthsThai.map((month, idx) => (<option key={idx} value={idx}>{month}</option>))}</select>
                <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="font-black text-base text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none px-3 py-2 cursor-pointer">{[2569, 2568].map(year => (<option key={year} value={year}>{year}</option>))}</select>
              </div>
              <button onClick={() => { if (currentMonthIndex === 11) { if (currentYear < 2569) { setCurrentMonthIndex(0); setCurrentYear(currentYear + 1); } } else setCurrentMonthIndex(currentMonthIndex + 1); }} className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all" disabled={currentMonthIndex === 11 && currentYear === 2569}><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">{['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (<span key={d} className="text-base font-bold text-slate-400">{d}</span>))}</div>
            <div className="grid grid-cols-7 gap-1 text-center">
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
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden text-base">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-base font-bold">
          <Check size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Patient Detail Modal */}
      {viewDetailPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
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
                <div><span className="font-bold text-slate-500">รอบเอว:</span> <span className="font-semibold">{viewDetailPatient.waist || '-'} ซม.</span></div>
                <div><span className="font-bold text-slate-500">รอบเอว/ส่วนสูง:</span> <span className="font-semibold">{viewDetailPatient.waistRatio || '-'}</span></div>
                <div><span className="font-bold text-slate-500">ชีพจร:</span> <span className="font-semibold">{viewDetailPatient.pulse || '-'} ครั้ง/นาที</span></div>
                <div><span className="font-bold text-slate-500">ความดันโลหิต:</span> <span className="font-semibold">{viewDetailPatient.bp || '-'} มม.ปรอท</span></div>
                <div><span className="font-bold text-slate-500">อัตราไหลสูงสุด:</span> <span className="font-semibold">{viewDetailPatient.flow || '-'} L/min ({viewDetailPatient.flowPercent || '-'}%)</span></div>
                <div><span className="font-bold text-slate-500">สภาพจิต:</span> <span className="font-semibold">{viewDetailPatient.mental || '-'}</span></div>
                <div><span className="font-bold text-slate-500">UPT/MAMP:</span> <span className="font-semibold">{viewDetailPatient.upt || '-'} / {viewDetailPatient.mamp || '-'}</span></div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mt-4">
                <h4 className="font-black text-indigo-900 mb-2 text-lg">ความเห็นของแพทย์</h4>
                <p className="font-bold text-indigo-700 text-base">{viewDetailPatient.docResult === 'HEALTHY' ? 'ปกติ / แข็งแรงสมบูรณ์' : 'พบข้อสังเกต'}</p>
                <p className="text-slate-600 mt-2 font-semibold bg-white p-3 rounded-xl border border-indigo-50">{viewDetailPatient.docNote || 'ไม่มีหมายเหตุเพิ่มเติม'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TQM Dark Blue Sidebar */}
      <div className={`${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'} bg-[#0f3d7a] transition-all duration-300 ease-in-out flex flex-col shrink-0 z-30 shadow-xl overflow-hidden`}>
        
        {/* Logo Section */}
        <div className="h-[80px] flex items-center justify-center shrink-0 border-b border-white/10 px-4">
          <h1 className={`font-black text-white tracking-tight leading-none flex items-center ${isSidebarOpen ? 'text-4xl' : 'text-2xl'}`}>
            <span className="italic">TQM</span>
            <span className="text-blue-300 ml-1">►</span>
          </h1>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 flex-1 mt-4 w-[280px]">
          <button
            onClick={() => setActiveTab('HR')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-lg transition-all ${activeTab === 'HR' ? 'bg-white/10 text-white' : 'text-[#a3b8cc] hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={22} className="shrink-0" />
            <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>ระบบตรวจสุขภาพ</span>
          </button>
          
          <button
            onClick={() => setActiveTab('NURSE')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-lg transition-all ${activeTab === 'NURSE' ? 'bg-white/10 text-white' : 'text-[#a3b8cc] hover:bg-white/5 hover:text-white'}`}
          >
            <Stethoscope size={22} className="shrink-0" />
            <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>พยาบาล (Nurse)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('DOCTOR')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-lg transition-all ${activeTab === 'DOCTOR' ? 'bg-white/10 text-white' : 'text-[#a3b8cc] hover:bg-white/5 hover:text-white'}`}
          >
            <Activity size={22} className="shrink-0" />
            <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>แพทย์ (Doctor)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f6f9] relative">
        
        {/* Top Header with Hamburger */}
        <div className="h-[80px] bg-white border-b border-slate-200 px-6 flex items-center shrink-0 z-20 shadow-sm sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 focus:outline-none"
          >
            <Menu size={26} />
          </button>
        </div>

        {/* Scrollable Workspace Container (เลื่อนได้ทั้งหน้า) */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            {activeTab === 'HR' && <HRDashboard />}
            {activeTab === 'NURSE' && <NurseDashboard />}
            {activeTab === 'DOCTOR' && <DoctorDashboard />}
          </div>
        </div>

      </div>
    </div>
  );

  function HRDashboard() {
    const currentDatePatients = useMemo(() => patients.filter(p => p.date === selectedDate), [patients, selectedDate]);
    const totalCount = currentDatePatients.length;
    const waitingCount = currentDatePatients.filter(p => ['WAITING_NURSE', 'HOLD', 'WAITING_DOCTOR'].includes(p.status)).length;
    const waitingHrCount = currentDatePatients.filter(p => p.status === 'WAITING_HR').length;
    const completedCount = currentDatePatients.filter(p => ['COMPLETED', 'DELAYED', 'REJECTED'].includes(p.status)).length;

    return (
      <div className="flex flex-col w-full">
        {/* Header Banner - HR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-blue-600 rounded-l-2xl"></div>
          <div className="bg-blue-600 p-4 rounded-xl text-white mr-5 shadow-sm"><Users size={32} strokeWidth={2} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - ฝ่ายบุคคล</h1>
            <p className="text-base font-bold text-slate-500 mt-1">ดูสถานะ จัดการ และอนุมัติผลการตรวจสุขภาพของผู้สมัครงานทั้งหมด</p>
          </div>
        </div>

        {/* Search & Date (แยกกล่อง) */}
        <SearchAndDateBar />

        {/* Progress Pipeline Stats - Full Width Grid */}
        <div className="mb-8 relative z-0">
          {/* Dashed Line background */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-slate-300 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-blue-50/90 border-2 border-blue-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-[3.5rem] font-black text-blue-700 leading-none tracking-tight">{totalCount}</div>
              <div className="text-lg text-blue-500 font-bold mt-2">100%</div>
              <div className="text-blue-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-600"></div>เริ่มงานวันแรก
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-indigo-50/90 border-2 border-indigo-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[160px]">
              <div className="flex items-baseline gap-2">
                <span className="text-[3.5rem] font-black text-indigo-700 leading-none tracking-tight">{waitingCount}</span>
              </div>
              <div className="text-lg text-indigo-500 font-bold mt-2">{Math.round((waitingCount/totalCount)*100)||0}%</div>
              <div className="text-indigo-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></div>สถานะรอตรวจ
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-amber-50/90 border-2 border-amber-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[160px]">
              <div className="flex items-baseline gap-2">
                <span className="text-[3.5rem] font-black text-amber-700 leading-none tracking-tight">{waitingHrCount}</span>
              </div>
              <div className="text-lg text-amber-500 font-bold mt-2">{Math.round((waitingHrCount/totalCount)*100)||0}%</div>
              <div className="text-amber-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-600"></div>สถานะรออนุมัติผล
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-emerald-50/90 border-2 border-emerald-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[160px]">
              <div className="flex items-baseline gap-2">
                <span className="text-[3.5rem] font-black text-emerald-700 leading-none tracking-tight">{completedCount}</span>
              </div>
              <div className="text-lg text-emerald-500 font-bold mt-2">{Math.round((completedCount/totalCount)*100)||0}%</div>
              <div className="text-emerald-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></div>ตัดสินใจจ้างงาน
              </div>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
            <h2 className="text-lg font-black text-slate-800">รายชื่อพนักงานทั้งหมดที่มาเริ่มงานวันแรก</h2>
            <span className="text-sm font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">ทั้งหมด {currentDatePatients.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-sm font-black text-center">
                  <th className="p-4 pl-6 text-left w-16">ลำดับ</th>
                  <th className="p-4 text-left">ชื่อ - นามสกุล</th>
                  <th className="p-4 text-left">ตำแหน่ง</th>
                  <th className="p-4">วันที่เริ่มงาน</th>
                  <th className="p-4">วันที่ตรวจสุขภาพ</th>
                  <th className="p-4">สถานะ</th>
                  <th className="p-4">พยาบาลผู้ตรวจ</th>
                  <th className="p-4">แพทย์ผู้ตรวจ</th>
                  <th className="p-4">ดูผลตรวจ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentDatePatients.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors text-center font-bold text-slate-600 text-sm">
                    <td className="p-4 pl-6 text-left">{idx + 1}</td>
                    <td className="p-4 text-left text-base font-black text-slate-800">{p.name}</td>
                    <td className="p-4 text-left">{p.position}</td>
                    <td className="p-4">{p.startDate}</td>
                    <td className="p-4">{formatDateDisplay(p.date)}</td>
                    <td className="p-4">
                      {p.status === 'WAITING_NURSE' && <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[13px] font-bold border border-blue-100">รอตรวจ</span>}
                      {p.status === 'HOLD' && <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-[13px] font-bold border border-orange-100">ค้างเคส (Hold)</span>}
                      {p.status === 'WAITING_DOCTOR' && <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[13px] font-bold border border-indigo-100">รอแพทย์</span>}
                      {p.status === 'WAITING_HR' && <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[13px] font-bold border border-amber-100">รออนุมัติ</span>}
                      {p.status === 'COMPLETED' && <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[13px] font-bold border border-emerald-100">อนุมัติแล้ว</span>}
                    </td>
                    <td className="p-4">{p.nurseName}</td>
                    <td className="p-4">{p.docName}</td>
                    <td className="p-4">
                      <button onClick={() => setViewDetailPatient(p)} className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-300 text-slate-400 rounded-md transition-colors inline-flex shadow-sm">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function NurseDashboard() {
    const [nurseForm, setNurseForm] = useState({
      height: '', weight: '', isSlim: false, waist: '', waistRatio: '',
      pulse: '', bp: '', flow: '', flowPercent: '', mentalAbnormal: false, mentalText: '',
      upt: '', mamp: '', kitQty: 1, kitReason: '', nurseName: 'พยาบาล ใจดี'
    });

    const currentDatePatients = useMemo(() => patients.filter(p => p.date === selectedDate), [patients, selectedDate]);
    const queueData = currentDatePatients.filter(p => ['WAITING_NURSE', 'HOLD', 'WAITING_DOCTOR', 'WAITING_HR', 'COMPLETED'].includes(p.status));
    const displayQueue = queueData.filter(p => ['WAITING_NURSE', 'HOLD'].includes(p.status));

    const stats = {
      waiting: queueData.filter(p => p.status === 'WAITING_NURSE').length,
      hold: queueData.filter(p => p.status === 'HOLD').length,
      completed: queueData.filter(p => !['WAITING_NURSE', 'HOLD'].includes(p.status)).length
    };

    // Real-time Calculation for Waist Ratio
    useEffect(() => {
      if (nurseForm.waist && nurseForm.height) {
        const ratio = (parseFloat(nurseForm.waist) / parseFloat(nurseForm.height)).toFixed(2);
        setNurseForm(prev => ({...prev, waistRatio: ratio, isSlim: false}));
      }
    }, [nurseForm.waist, nurseForm.height]);

    // Real-time Calculation for PEF%
    useEffect(() => {
      if (nurseForm.flow && nurseForm.height && selectedPatientId) {
        const pt = patients.find(p => p.id === selectedPatientId);
        if (pt && pt.age) {
          const h = parseFloat(nurseForm.height) / 100; // in meters
          const age = pt.age;
          const pef = parseFloat(nurseForm.flow);
          let std = 0;
          if (pt.gender === 'M') {
            std = ((h * h * 5.48) + 1.58 - (age * 0.041)) * 60;
          } else {
            std = ((h * h * 3.72) + 2.24 - (age * 0.03)) * 60;
          }
          if (std > 0) {
            const pct = (pef / std) * 100;
            setNurseForm(prev => ({...prev, flowPercent: pct.toFixed(0)}));
          }
        }
      }
    }, [nurseForm.flow, nurseForm.height, selectedPatientId, patients]);

    const handleSelectPatient = (p) => {
      setSelectedPatientId(p.id);
      setNurseForm({
        height: p.height || '', weight: p.weight || '', 
        isSlim: (p.waist === null && p.height !== ''), 
        waist: p.waist || '', waistRatio: p.waistRatio || '',
        pulse: p.pulse || '', bp: p.bp || '', flow: p.flow || '', flowPercent: p.flowPercent || '', 
        mentalAbnormal: p.mental && p.mental !== 'ปกติ', mentalText: p.mental && p.mental !== 'ปกติ' ? p.mentalNote : '',
        upt: p.upt || '', mamp: p.mamp || '', kitQty: p.kitQty || 1, kitReason: p.kitReason || '',
        nurseName: p.nurseName !== '-' ? p.nurseName : 'พยาบาล ใจดี'
      });
    };

    const handleSaveNurse = (targetStatus) => {
      updatePatient(selectedPatientId, {
        height: parseFloat(nurseForm.height) || '', weight: parseFloat(nurseForm.weight) || '',
        waist: nurseForm.isSlim ? null : parseFloat(nurseForm.waist) || '',
        waistRatio: nurseForm.isSlim ? null : parseFloat(nurseForm.waistRatio) || '',
        pulse: parseInt(nurseForm.pulse) || '', bp: nurseForm.bp || '',
        flow: parseInt(nurseForm.flow) || '', flowPercent: parseInt(nurseForm.flowPercent) || '',
        mental: !nurseForm.mentalAbnormal && nurseForm.height ? 'ปกติ' : (nurseForm.mentalAbnormal ? `ผิดปกติ` : ''),
        mentalNote: nurseForm.mentalText, upt: nurseForm.upt, mamp: nurseForm.mamp,
        kitQty: nurseForm.kitQty, kitReason: nurseForm.kitReason,
        status: targetStatus, nurseName: nurseForm.nurseName
      }, targetStatus === 'HOLD' ? 'บันทึกค้างเคสเรียบร้อย' : 'ส่งข้อมูลให้แพทย์เรียบร้อย');
    };

    return (
      <div className="flex flex-col w-full">
        {/* Header Banner - Nurse */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-blue-600 rounded-l-2xl"></div>
          <div className="bg-blue-600 p-4 rounded-xl text-white mr-5 shadow-sm"><Stethoscope size={32} strokeWidth={2} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - พยาบาล</h1>
            <p className="text-base font-bold text-slate-500 mt-1">บันทึกผลการตรวจร่างกายเบื้องต้นและคัดกรองสุขภาพผู้สมัครงาน</p>
          </div>
        </div>

        {/* Search & Date */}
        <SearchAndDateBar />

        {/* Pipeline Stats - Nurse - Full Width Grid */}
        <div className="mb-8 relative z-0">
          <div className="absolute top-1/2 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-slate-300 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50/90 border-2 border-blue-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-[3.5rem] font-black text-blue-700 leading-none tracking-tight">{stats.waiting}</div>
              <div className="text-blue-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-600"></div>รอตรวจ
              </div>
            </div>
            
            <div className="bg-orange-50/90 border-2 border-orange-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-[3.5rem] font-black text-orange-700 leading-none tracking-tight">{stats.hold}</div>
              <div className="text-orange-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-600"></div>ค้างเคส (Hold)
              </div>
            </div>
            
            <div className="bg-emerald-50/90 border-2 border-emerald-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-[3.5rem] font-black text-emerald-700 leading-none tracking-tight">{stats.completed}</div>
              <div className="text-emerald-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></div>บันทึกผลเรียบร้อย
              </div>
            </div>
          </div>
        </div>

        {/* Form Layout */}
        <div className="flex gap-6 items-start">
          <div className="w-80 border border-slate-200 bg-white rounded-2xl flex flex-col z-0 shrink-0 shadow-sm overflow-hidden h-[700px] sticky top-4">
            <div className="p-5 border-b border-slate-200 font-black text-slate-800 text-lg flex justify-between items-center bg-slate-50/50">
              <span>รายชื่อรอตรวจ</span>
              <span className="text-sm font-bold bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">{displayQueue.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayQueue.map(p => (
                <div key={p.id} onClick={() => handleSelectPatient(p)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPatientId === p.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{p.name}</h4>
                    <span className="text-sm font-bold text-slate-400">{p.status === 'WAITING_NURSE' ? 'รอตรวจ' : 'ค้างเคส'}</span>
                  </div>
                </div>
              ))}
              {displayQueue.length === 0 && <div className="text-center p-10 text-slate-400 font-bold text-base">ไม่พบรายชื่อในคิว</div>}
            </div>
          </div>

          <div className="flex-1">
            {selectedPatientId ? (() => {
              const pt = patients.find(p => p.id === selectedPatientId);
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full mb-10">
                  <div className="border-b border-slate-200 pb-5 mb-6">
                    <h2 className="text-xl font-black text-slate-800">ส่วนที่ 2 การตรวจของพยาบาล</h2>
                    <p className="text-base font-semibold text-slate-500 mt-1">ผู้เข้ารับการตรวจ: <span className="text-blue-600 font-bold">{pt?.name}</span> (เพศ: {pt?.gender === 'M'?'ชาย':'หญิง'}, อายุ: {pt?.age} ปี)</p>
                  </div>

                  <div className="space-y-6 text-base">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="block font-black text-slate-700 mb-2">1. ส่วนสูง (ซม.)</label><input type="number" value={nurseForm.height} onChange={e => setNurseForm({...nurseForm, height: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" /></div>
                        <div><label className="block font-black text-slate-700 mb-2">น้ำหนัก (กก.)</label><input type="number" value={nurseForm.weight} onChange={e => setNurseForm({...nurseForm, weight: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" /></div>
                      </div>
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={nurseForm.isSlim} onChange={e => setNurseForm({...nurseForm, isSlim: e.target.checked, waist: '', waistRatio: ''})} className="w-5 h-5 text-blue-600 rounded" /><span className="font-bold text-slate-800">Slim / Standard (ข้ามไปข้อ 4)</span></label>
                        <div className="flex items-center gap-3"><input type="checkbox" checked={!nurseForm.isSlim} onChange={e => setNurseForm({...nurseForm, isSlim: !e.target.checked})} className="w-5 h-5 text-blue-600 rounded" /><span className="font-bold text-slate-800">2. Overweight / Obese</span></div>
                        {!nurseForm.isSlim && (
                          <div className="grid grid-cols-2 gap-6 pl-8 pt-2">
                            <div><label className="block font-bold text-slate-600 mb-2">รอบเอว (ซม.)</label><input type="number" value={nurseForm.waist} onChange={e => setNurseForm({...nurseForm, waist: e.target.value, isSlim: false})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" /></div>
                            <div><label className="block font-bold text-orange-600 mb-2">รอบเอว/ส่วนสูง (อัตโนมัติ)</label><input type="text" readOnly value={nurseForm.waistRatio} className="w-full bg-orange-50 border border-orange-200 rounded-xl p-3 font-bold text-orange-700 outline-none cursor-not-allowed" placeholder="-" /></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">3. ชีพจรและความดันโลหิต</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="block font-bold mb-2">ชีพจร (ครั้ง/นาที)</label><input type="number" value={nurseForm.pulse} onChange={e=>setNurseForm({...nurseForm, pulse: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" /></div>
                        <div><label className="block font-bold mb-2">ความดันโลหิต (มม.ปรอท)</label><input type="text" value={nurseForm.bp} onChange={e=>setNurseForm({...nurseForm, bp: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" placeholder="120/80" /></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">4. อัตราไหลสูงสุดของการหายใจออก (PEF)</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="block font-bold mb-2">L/min (เป่าได้)</label><input type="number" value={nurseForm.flow} onChange={e=>setNurseForm({...nurseForm, flow: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold outline-none focus:border-blue-500" /></div>
                        <div><label className="block font-bold text-orange-600 mb-2">เทียบเท่า % (อัตโนมัติ)</label><input type="text" readOnly value={nurseForm.flowPercent ? `${nurseForm.flowPercent}%` : ''} className="w-full bg-orange-50 border border-orange-200 rounded-xl p-3 font-bold text-orange-700 outline-none cursor-not-allowed" placeholder="-" /></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">5. สภาพจิต</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={!nurseForm.mentalAbnormal && nurseForm.mentalText === '' && nurseForm.height !== ''} onChange={()=>setNurseForm({...nurseForm, mentalAbnormal: false, mentalText: ''})} className="w-5 h-5" /><span className="font-bold">ไม่พบความผิดปกติ</span></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={nurseForm.mentalAbnormal || nurseForm.mentalText !== ''} onChange={()=>setNurseForm({...nurseForm, mentalAbnormal: true})} className="w-5 h-5" /><span className="font-bold">ผิดปกติ (ระบุ)</span></label>
                        {(nurseForm.mentalAbnormal || nurseForm.mentalText !== '') && <input type="text" value={nurseForm.mentalText} onChange={e=>setNurseForm({...nurseForm, mentalText: e.target.value, mentalAbnormal: true})} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold mt-2 outline-none focus:border-blue-500" placeholder="ระบุอาการผิดปกติ..." />}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">6. UPT และ MAMP Test</h4>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl"><span className="block font-black mb-3 text-slate-700">UPT (ตั้งครรภ์)</span><div className="flex gap-6"><label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" checked={nurseForm.upt === 'Negative'} onChange={()=>setNurseForm({...nurseForm, upt: 'Negative'})} className="w-5 h-5" /> Negative</label><label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" checked={nurseForm.upt === 'Positive'} onChange={()=>setNurseForm({...nurseForm, upt: 'Positive'})} className="w-5 h-5" /> Positive</label></div></div>
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl"><span className="block font-black mb-3 text-slate-700">MAMP (สารเสพติด)</span><div className="flex gap-6"><label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" checked={nurseForm.mamp === 'Negative'} onChange={()=>setNurseForm({...nurseForm, mamp: 'Negative'})} className="w-5 h-5" /> Negative</label><label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" checked={nurseForm.mamp === 'Positive'} onChange={()=>setNurseForm({...nurseForm, mamp: 'Positive'})} className="w-5 h-5" /> Positive</label></div></div>
                      </div>
                      
                      <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                        <label className="block font-black text-blue-900 mb-3">จำนวนชุดตรวจที่ใช้ (เบิกอุปกรณ์)</label>
                        <div className="flex gap-4 items-center">
                          <input type="number" min="1" value={nurseForm.kitQty} onChange={e=>setNurseForm({...nurseForm, kitQty: parseInt(e.target.value)||1})} className="w-24 bg-white border border-blue-300 rounded-lg p-2.5 font-bold text-center outline-none focus:border-blue-500" />
                          <span className="font-bold text-blue-800">ชุด</span>
                        </div>
                        {nurseForm.kitQty >= 2 && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-xl border border-red-200">
                            <label className="block font-black text-red-700 mb-2">โปรดระบุเหตุผลที่เบิกอุปกรณ์เพิ่ม *</label>
                            <select value={nurseForm.kitReason} onChange={e=>setNurseForm({...nurseForm, kitReason: e.target.value})} className="w-full bg-white border border-red-300 rounded-lg p-3 font-bold text-red-900 outline-none">
                              <option value="">-- เลือกเหตุผล --</option>
                              <option value="เครื่องมือชำรุด">1. เครื่องมือชำรุด</option>
                              <option value="ผลตรวจขึ้น Positive">2. ผลตรวจขึ้น Positive</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 pb-4">
                      <div className="flex items-end gap-3 max-w-sm ml-auto">
                        <span className="font-bold text-slate-700 whitespace-nowrap">ลงชื่อ พยาบาลผู้ตรวจ</span>
                        <input type="text" value={nurseForm.nurseName} onChange={e=>setNurseForm({...nurseForm, nurseName: e.target.value})} className="flex-1 bg-transparent border-b-2 border-dashed border-slate-400 px-2 py-1 text-center font-bold text-blue-700 outline-none focus:border-blue-500" placeholder="ระบุชื่อพยาบาล" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                      <button onClick={() => handleSaveNurse('HOLD')} className="px-6 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl font-bold transition-colors">ค้างเคส (Hold)</button>
                      <button onClick={() => handleSaveNurse('WAITING_DOCTOR')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-md shadow-blue-200 transition-colors">ส่งให้แพทย์วินิจฉัย</button>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-bold text-lg">กรุณาเลือกรายชื่อผู้รับการตรวจจากแถบด้านซ้าย</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function DoctorDashboard() {
    const [doctorForm, setDoctorForm] = useState({ result: 'HEALTHY', note: '', docName: 'นพ. เก่งเวช' });
    const currentDatePatients = useMemo(() => patients.filter(p => p.date === selectedDate), [patients, selectedDate]);
    const docQueueData = currentDatePatients.filter(p => ['WAITING_DOCTOR', 'WAITING_HR', 'COMPLETED'].includes(p.status));
    const displayQueue = docQueueData.filter(p => p.status === 'WAITING_DOCTOR');

    const stats = {
      waiting: docQueueData.filter(p => p.status === 'WAITING_DOCTOR').length,
      completed: docQueueData.filter(p => p.status !== 'WAITING_DOCTOR').length
    };

    const handleSelectDoctorPatient = (p) => {
      setSelectedPatientId(p.id);
      setDoctorForm({ result: p.docResult || 'HEALTHY', note: p.docNote || '', docName: p.docName !== '-' ? p.docName : 'นพ. เก่งเวช' });
    };

    const handleSaveDoctor = () => {
      updatePatient(selectedPatientId, {
        status: 'WAITING_HR', docResult: doctorForm.result, docNote: doctorForm.note, docName: doctorForm.docName
      }, 'บันทึกคำวินิจฉัย และส่งต่อให้ HR เรียบร้อย');
    };

    return (
      <div className="flex flex-col w-full">
        {/* Header Banner - Doctor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-blue-600 rounded-l-2xl"></div>
          <div className="bg-blue-600 p-4 rounded-xl text-white mr-5 shadow-sm"><Activity size={32} strokeWidth={2} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - แพทย์</h1>
            <p className="text-base font-bold text-slate-500 mt-1">สรุปความเห็นและข้อแนะนำทางการแพทย์สำหรับผู้สมัครงาน</p>
          </div>
        </div>

        {/* Search & Date */}
        <SearchAndDateBar />

        {/* Pipeline Stats - Doctor - Full Width Grid */}
        <div className="mb-8 relative z-0">
          <div className="absolute top-1/2 left-[25%] right-[25%] h-[2px] border-t-2 border-dashed border-slate-300 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-indigo-50/90 border-2 border-indigo-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-[3.5rem] font-black text-indigo-700 leading-none tracking-tight">{stats.waiting}</div>
              <div className="text-indigo-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></div>รอแพทย์วินิจฉัย
              </div>
            </div>
            
            <div className="bg-emerald-50/90 border-2 border-emerald-200 p-6 rounded-3xl text-center shadow-sm relative z-10 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-[3.5rem] font-black text-emerald-700 leading-none tracking-tight">{stats.completed}</div>
              <div className="text-emerald-700 font-bold text-base mt-4 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></div>ประเมินเสร็จแล้ว
              </div>
            </div>
          </div>
        </div>

        {/* Form Layout Doctor */}
        <div className="flex gap-6 items-start">
          <div className="w-80 border border-slate-200 bg-white rounded-2xl flex flex-col z-0 shrink-0 shadow-sm overflow-hidden h-[700px] sticky top-4">
            <div className="p-5 border-b border-slate-200 font-black text-slate-800 text-lg flex justify-between items-center bg-slate-50/50">
              <span>คิวรอวินิจฉัย</span>
              <span className="text-sm font-bold bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">{displayQueue.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayQueue.map(p => (
                <div key={p.id} onClick={() => handleSelectDoctorPatient(p)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPatientId === p.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{p.name}</h4>
                    <span className="text-sm font-bold text-slate-400">รอวินิจฉัย</span>
                  </div>
                </div>
              ))}
              {displayQueue.length === 0 && <div className="text-center p-10 text-slate-400 font-bold text-base">ไม่มีเคสรอวินิจฉัย</div>}
            </div>
          </div>

          <div className="flex-1">
            {selectedPatientId ? (() => {
              const pt = patients.find(p => p.id === selectedPatientId);
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full mb-10">
                  <div className="border-b border-slate-200 pb-5 mb-6">
                    <h2 className="text-xl font-black text-slate-800">สรุปความเห็นและข้อแนะนำของแพทย์</h2>
                    <p className="text-base font-semibold text-slate-500 mt-1">ผู้เข้ารับการตรวจ: <span className="text-indigo-600 font-bold">{pt?.name}</span> (เพศ: {pt?.gender === 'M'?'ชาย':'หญิง'}, อายุ: {pt?.age} ปี)</p>
                  </div>

                  <div className="space-y-6 text-base">
                    <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                      <div><span className="font-bold text-slate-500 mr-2">ส่วนสูง:</span> {pt?.height || '-'} ซม.</div>
                      <div><span className="font-bold text-slate-500 mr-2">น้ำหนัก:</span> {pt?.weight || '-'} กก.</div>
                      <div><span className="font-bold text-slate-500 mr-2">ชีพจร:</span> {pt?.pulse || '-'} ครั้ง/นาที</div>
                      <div><span className="font-bold text-slate-500 mr-2">ความดันโลหิต:</span> {pt?.bp || '-'} มม.ปรอท</div>
                      <div className="col-span-2"><span className="font-bold text-slate-500 mr-2">สภาพจิต:</span> {pt?.mental || '-'} {pt?.mentalNote && `(${pt.mentalNote})`}</div>
                      <div className="col-span-2"><span className="font-bold text-slate-500 mr-2">UPT / MAMP:</span> <span className="font-bold">{pt?.upt} / {pt?.mamp}</span></div>
                    </div>

                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-5">
                      <h4 className="font-black text-slate-800 text-lg">สรุปความเห็นแพทย์</h4>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-3 font-bold cursor-pointer"><input type="radio" checked={doctorForm.result === 'HEALTHY'} onChange={() => setDoctorForm({...doctorForm, result: 'HEALTHY'})} className="w-5 h-5 text-indigo-600" />ปกติ / แข็งแรงสมบูรณ์</label>
                        <label className="flex items-center gap-3 font-bold cursor-pointer"><input type="radio" checked={doctorForm.result === 'UNHEALTHY'} onChange={() => setDoctorForm({...doctorForm, result: 'UNHEALTHY'})} className="w-5 h-5 text-indigo-600" />พบความผิดปกติ / ต้องดูแลพิเศษ</label>
                      </div>
                      <div className="pt-2">
                        <label className="block font-bold text-slate-700 mb-2">บันทึกข้อสังเกต / คำแนะนำทางการแพทย์</label>
                        <textarea rows={4} value={doctorForm.note} onChange={e => setDoctorForm({...doctorForm, note: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-indigo-500" placeholder="กรอกผลวินิจฉัย..." />
                      </div>
                    </div>
                    
                    {/* ส่วนลงชื่อแพทย์ และ วันที่ */}
                    <div className="pt-8 pb-4 flex flex-col items-end gap-4">
                      <div className="flex items-end gap-3 max-w-sm w-full justify-end">
                        <span className="font-bold text-slate-700 whitespace-nowrap">ลงชื่อ แพทย์ผู้ตรวจ</span>
                        <input type="text" value={doctorForm.docName} onChange={e=>setDoctorForm({...doctorForm, docName: e.target.value})} className="w-48 bg-transparent border-b-2 border-dashed border-slate-400 px-2 py-1 text-center font-bold text-indigo-700 outline-none focus:border-indigo-500" placeholder="ระบุชื่อแพทย์" />
                      </div>
                      <div className="flex items-end gap-3 max-w-sm w-full justify-end pr-6">
                        <span className="font-bold text-slate-700 whitespace-nowrap">วันที่</span>
                        <input type="text" value={formatDateDisplay(pt?.date)} readOnly className="w-36 bg-transparent border-b-2 border-dashed border-slate-400 px-2 py-1 text-center font-bold text-slate-600 outline-none" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-slate-200">
                      <button onClick={handleSaveDoctor} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-md shadow-indigo-200 transition-colors">บันทึกคำวินิจฉัย และส่งต่อ HR</button>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-bold text-lg">กรุณาเลือกเคสจากคิวทางซ้าย</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}