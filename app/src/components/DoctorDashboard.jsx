import React from "react";
import { Users, Stethoscope, CheckCircle, Clock, Calendar, Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight, UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, X } from "lucide-react";

export default function DoctorDashboard({ currentDatePatients, activeDoctorFilter, setActiveDoctorFilter, formatDateDisplay, selectedPatientId, setSelectedPatientId, doctorForm, setDoctorForm, updatePatient, searchAndDateBar, setViewDetailPatient, patients, selectedDate }) {
  const waitingDocs = patients.filter(p => p.status === 'WAITING_DOCTOR');
  const completedDocs = patients.filter(p => p.docResult && p.docResult !== '' && p.docActionDate === selectedDate);

  const displayQueue = activeDoctorFilter === 'COMPLETED' ? [...completedDocs].reverse() : [...waitingDocs].reverse();

  const stats = {
    waiting: waitingDocs.length,
    completed: completedDocs.length
  };

  const handleSelectDoctorPatient = (p) => {
    setSelectedPatientId(p.id);
    setDoctorForm({ result: p.docResult || 'HEALTHY', note: p.docNote || '', docName: p.docName !== '-' ? p.docName : 'นพ. เก่งเวช', healthProblem: Array.isArray(p.healthProblem) ? p.healthProblem : [], otherProblemText: p.otherProblemText || '' });
  };

  const [docErrors, setDocErrors] = React.useState({});
  const healthProblemRef = React.useRef(null);
  const otherProblemRef = React.useRef(null);

  const handleSaveDoctor = () => {
    let errors = {};
    if (doctorForm.result === 'UNHEALTHY' && (!doctorForm.healthProblem || doctorForm.healthProblem.length === 0)) {
      errors.healthProblem = true;
    }
    if (doctorForm.healthProblem.includes('อื่นๆ') && (!doctorForm.otherProblemText || doctorForm.otherProblemText.trim() === '')) {
      errors.otherProblemText = true;
    }

    if (Object.keys(errors).length > 0) {
      setDocErrors(errors);

      setTimeout(() => {
        if (errors.healthProblem && healthProblemRef.current) {
          healthProblemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.otherProblemText && otherProblemRef.current) {
          otherProblemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }
    setDocErrors({});

    const pt = patients.find(p => p.id === selectedPatientId);
    let nextStatus = 'WAITING_HR';

    // If HR already made a decision before the doctor, finalize the status now
    if (pt.hrAction) {
      if (pt.hrAction === 'REJECTED') nextStatus = 'REJECTED';
      else if (pt.hrAction === 'DELAYED') nextStatus = 'DELAYED';
      else if (pt.hrAction === 'COMPLETED') nextStatus = 'COMPLETED';
    }

    updatePatient(selectedPatientId, {
      status: nextStatus, docResult: doctorForm.result, docNote: doctorForm.note, docName: doctorForm.docName, healthProblem: doctorForm.healthProblem, otherProblemText: doctorForm.otherProblemText, docActionDate: selectedDate
    }, 'บันทึกคำวินิจฉัยเรียบร้อย');
    setSelectedPatientId(null);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner - Doctor */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-emerald-500 rounded-l-2xl"></div>
        <div className="bg-emerald-500 p-4 rounded-xl text-white mr-5 shadow-sm"><Activity size={32} strokeWidth={2} /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - แพทย์</h1>
          <p className="text-base font-bold text-slate-500 mt-1">สรุปความเห็นและข้อแนะนำทางการแพทย์สำหรับผู้สมัครงาน</p>
        </div>
      </div>

      {/* Search & Date */}
      {searchAndDateBar}

      {/* Pipeline Stats - Doctor */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => setActiveDoctorFilter(activeDoctorFilter === 'WAITING_DOCTOR' ? 'ALL' : 'WAITING_DOCTOR')}
          className={`bg-white rounded-2xl p-8 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeDoctorFilter === 'WAITING_DOCTOR' ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-indigo-100 hover:border-indigo-300'}`}
        >
          <div className="absolute left-0 top-3 bottom-3 w-[6px] bg-indigo-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-3 ml-3">
            <span className="text-4xl font-black text-indigo-600">{stats.waiting}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 ml-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <span className="text-xl font-bold text-slate-600">รอแพทย์วินิจฉัย</span>
          </div>
        </div>

        <div
          onClick={() => setActiveDoctorFilter(activeDoctorFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
          className={`bg-white rounded-2xl p-8 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeDoctorFilter === 'COMPLETED' ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-emerald-100 hover:border-emerald-300'}`}
        >
          <div className="absolute left-0 top-3 bottom-3 w-[6px] bg-emerald-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-3 ml-3">
            <span className="text-4xl font-black text-emerald-600">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 ml-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-xl font-bold text-slate-600">ประเมินเสร็จแล้ว</span>
          </div>
        </div>
      </div>

      {/* Form Layout Doctor */}
      <div className="flex gap-6 items-start">
        <div className="w-80 border border-slate-200 bg-white rounded-2xl flex flex-col z-0 shrink-0 shadow-sm overflow-hidden h-[700px] sticky top-4">
          <div className="p-5 border-b border-slate-200 font-black text-slate-800 text-lg flex justify-between items-center bg-slate-50/50">
            <span>{activeDoctorFilter === 'COMPLETED' ? 'บันทึกคำวินิจฉัยเรียบร้อย' : 'คิวรอวินิจฉัย'}</span>
            <span className="text-sm font-bold bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">{displayQueue.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayQueue.map(p => (
              <div key={p.id} onClick={() => handleSelectDoctorPatient(p)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPatientId === p.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                <div>
                  <h4 className="font-black text-slate-800 text-base">6930{p.id} - {p.name}</h4>
                  <span className={`text-sm font-bold ${p.status === 'WAITING_DOCTOR' ? 'text-slate-400' : 'text-emerald-500'}`}>{p.status === 'WAITING_DOCTOR' ? 'รอวินิจฉัย' : 'วินิจฉัยแล้ว'}</span>
                </div>
              </div>
            ))}
            {displayQueue.length === 0 && <div className="text-center p-10 text-slate-400 font-bold text-base">{activeDoctorFilter === 'COMPLETED' ? 'ไม่มีเคสที่วินิจฉัยแล้ว' : 'ไม่มีเคสรอวินิจฉัย'}</div>}
          </div>
        </div>

        <div className="flex-1">
          {selectedPatientId ? (() => {
            const pt = patients.find(p => p.id === selectedPatientId);
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full mb-10 min-h-[700px]">
                <div className="border-b border-slate-200 pb-5 mb-6">
                  <h2 className="text-2xl font-black text-slate-800">สรุปความเห็นและข้อแนะนำของแพทย์</h2>
                  <p className="text-lg font-semibold text-slate-500 mt-1">ผู้เข้ารับการตรวจ: <span className="text-indigo-600 font-bold">6930{pt?.id} - {pt?.name}</span> (เพศ: {pt?.gender === 'M' ? 'ชาย' : 'หญิง'}, อายุ: {pt?.age} ปี)</p>
                </div>

                <div className="space-y-6 text-lg">
                  <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                    <div><span className="font-bold text-slate-500 mr-2">ส่วนสูง:</span> <span className="font-semibold">{pt?.height || '-'} ซม.</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">น้ำหนัก:</span> <span className="font-semibold">{pt?.weight || '-'} กก.</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">รูปร่าง:</span> <span className="font-semibold">{pt?.isSlim === true ? 'Slim / Standard' : pt?.isSlim === false ? 'Overweight / Obese' : '-'}</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">รอบเอว:</span> <span className="font-semibold">{pt?.waist || '-'} ซม.</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">รอบเอว ÷ ส่วนสูง:</span> <span className="font-semibold">{pt?.waistRatio || '-'}</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">ชีพจร:</span> <span className="font-semibold">{pt?.pulse || '-'} ครั้ง/นาที</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">ความดันโลหิต:</span> <span className="font-semibold">{pt?.bp || '-'} มม.ปรอท</span></div>
                    <div><span className="font-bold text-slate-500 mr-2">สภาพจิต:</span> <span className="font-semibold">{pt?.mental || '-'} {pt?.mentalNote && `(${pt.mentalNote})`}</span></div>
                    <div className="col-span-2"><span className="font-bold text-slate-500 mr-2">อัตราไหลสูงสุด:</span> <span className="font-semibold">{pt?.flow || '-'} L/min ({pt?.flowPercent || '-'}% ของค่ามาตรฐาน)</span></div>
                    <div className="col-span-2">
                      <span className="font-bold text-slate-500 mr-2">UPT (ตรวจการตั้งครรภ์):</span>
                      <span className="font-semibold">{pt?.upt || '-'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold text-slate-500 mr-2">MAMP Test (ตรวจสารเสพติด):</span>
                      <span className="font-semibold">{pt?.mamp || '-'}</span>
                    </div>
                    <div className="col-span-2 border-t border-slate-200 pt-4 mt-2">
                      <span className="font-bold text-slate-500 mr-2">ผู้บันทึก:</span> <span className="font-bold text-slate-700">{pt?.nurseName || '-'}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-5">
                    <h4 className="font-black text-slate-800 text-xl">สรุปความเห็นแพทย์</h4>
                    <div className="flex flex-col gap-4">
                      <label className={`flex items-center gap-3 font-bold ${pt.status === 'WAITING_DOCTOR' ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}><input type="radio" disabled={pt.status !== 'WAITING_DOCTOR'} checked={doctorForm.result === 'HEALTHY'} onChange={() => setDoctorForm({ ...doctorForm, result: 'HEALTHY' })} className="w-5 h-5 text-indigo-600 shrink-0" />ไม่พบปัญหาสุขภาพที่รุนเเรงจนเป็นอุปสรรคต่อการปฏิบัติงาน</label>
                      <label className={`flex items-center gap-3 font-bold ${pt.status === 'WAITING_DOCTOR' ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}><input type="radio" disabled={pt.status !== 'WAITING_DOCTOR'} checked={doctorForm.result === 'UNHEALTHY'} onChange={() => setDoctorForm({ ...doctorForm, result: 'UNHEALTHY' })} className="w-5 h-5 text-indigo-600 shrink-0" />พบปัญหาสุขภาพที่รุนเเรงจนเป็นอุปสรรคต่อการปฏิบัติงาน</label>
                    </div>

                    {doctorForm.result === 'UNHEALTHY' && (
                      <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-300" ref={healthProblemRef}>
                        <label className="flex items-center font-bold text-slate-700 mb-2">
                          มีปัญหาสุขภาพ (เลือกได้มากกว่า 1 ข้อ) <span className="text-[#ef4444] ml-1">*</span>
                          {docErrors?.healthProblem && <span className="text-red-500 text-sm ml-3 font-bold animate-pulse">กรุณาเลือกอย่างน้อย 1 ข้อ</span>}
                        </label>
                        <div className="grid grid-cols-1 gap-3 mt-2">
                          {['ระบบเผาผลาญ', 'ระบบหัวใจและทางเดินหายใจ', 'องค์ประกอบร่างกาย', 'อื่นๆ'].map(problem => (
                            <div key={problem} className="flex flex-col gap-2">
                              <label className={`flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 transition-colors ${pt.status === 'WAITING_DOCTOR' ? 'cursor-pointer hover:border-indigo-300' : 'cursor-not-allowed opacity-80'}`}>
                                <input
                                  type="checkbox"
                                  disabled={pt.status !== 'WAITING_DOCTOR'}
                                  className="w-5 h-5 text-indigo-600 rounded"
                                  checked={doctorForm.healthProblem.includes(problem)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setDoctorForm({ ...doctorForm, healthProblem: [...doctorForm.healthProblem, problem] });
                                    } else {
                                      setDoctorForm({ ...doctorForm, healthProblem: doctorForm.healthProblem.filter(p => p !== problem) });
                                    }
                                    setDocErrors(prev => ({ ...prev, healthProblem: false }));
                                  }}
                                />
                                <span className="font-bold text-slate-700">{problem}</span>
                              </label>
                              {problem === 'อื่นๆ' && doctorForm.healthProblem.includes('อื่นๆ') && (
                                <div className="pt-1 pb-2 animate-in fade-in slide-in-from-top-2 duration-200" ref={otherProblemRef}>
                                  <input
                                    type="text"
                                    maxLength={500}
                                    readOnly={pt.status !== 'WAITING_DOCTOR'}
                                    value={doctorForm.otherProblemText || ''}
                                    onChange={e => {
                                      setDoctorForm({ ...doctorForm, otherProblemText: e.target.value });
                                      setDocErrors({ ...docErrors, otherProblemText: false });
                                    }}
                                    className={`w-full bg-white border ${docErrors?.otherProblemText ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none ${pt.status === 'WAITING_DOCTOR' ? 'focus:border-indigo-500' : 'cursor-not-allowed opacity-80'}`}
                                    placeholder="โปรดระบุปัญหาอื่นๆ..."
                                  />
                                  <div className="flex justify-between items-center mt-1">
                                    {docErrors?.otherProblemText ? <span className="text-red-500 text-xs font-bold">กรุณาระบุปัญหาอื่นๆ ที่พบ</span> : <span></span>}
                                    <div className="text-right text-xs font-bold text-slate-400">{(doctorForm.otherProblemText || '').length}/500</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <label className="block font-bold text-slate-700 mb-2">บันทึกข้อสังเกต / คำแนะนำทางการแพทย์</label>
                      <div>
                        <textarea rows={4} maxLength={500} readOnly={pt.status !== 'WAITING_DOCTOR'} value={doctorForm.note} onChange={e => setDoctorForm({ ...doctorForm, note: e.target.value })} className={`w-full bg-white border border-slate-300 rounded-xl p-4 font-bold outline-none ${pt.status === 'WAITING_DOCTOR' ? 'focus:border-indigo-500' : 'cursor-not-allowed opacity-80'}`} placeholder="กรอกผลวินิจฉัย..." />
                        <div className="text-right text-xs font-bold text-slate-400 mt-1">{(doctorForm.note || '').length}/500</div>
                      </div>

                    </div>
                  </div>

                  {/* ส่วนลงชื่อแพทย์ และ วันที่ */}
                  <div className="pt-8 pb-4 flex flex-col items-end">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-slate-700 whitespace-nowrap mb-1">ลงชื่อ</span>
                        <div className="flex flex-col">
                          <input type="text" readOnly value={doctorForm.docName} className={`w-[200px] bg-transparent border-b-2 border-dashed border-slate-400 px-2 py-1 text-center font-bold text-indigo-700 outline-none cursor-default ${pt.status !== 'WAITING_DOCTOR' ? 'opacity-80' : ''}`} placeholder="" />
                        </div>
                        <span className="font-bold text-slate-700 whitespace-nowrap mb-1">แพทย์ผู้ตรวจ</span>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="font-bold text-slate-700 whitespace-nowrap">วันที่</span>
                        <input type="text" value={new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })} readOnly className="w-[180px] bg-transparent border-b-2 border-dashed border-slate-400 px-2 py-1 text-center font-bold text-slate-600 outline-none" />
                      </div>
                    </div>
                  </div>

                  {pt.status === 'WAITING_DOCTOR' && (
                    <div className="flex justify-end pt-5 border-t border-slate-200">
                      <button onClick={handleSaveDoctor} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-md shadow-indigo-200 transition-colors">บันทึกคำวินิจฉัย</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })() : (
            <div className="h-[700px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-bold text-lg">กรุณาเลือกเคสจากคิวทางซ้าย</div>
          )}
        </div>
      </div>
    </div>
  );
}
