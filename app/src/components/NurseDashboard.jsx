import React from "react";
import { Users, Stethoscope, CheckCircle, Clock, Calendar, Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight, UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, X, Plus, Trash2 } from "lucide-react";

export default function NurseDashboard({ currentDatePatients, activeNurseFilter, setActiveNurseFilter, formatDateDisplay, selectedPatientId, setSelectedPatientId, nurseForm, setNurseForm, nurseErrors, setNurseErrors, updatePatient, searchAndDateBar, setViewDetailPatient, patients, selectedDate }) {
  const waitingNurse = currentDatePatients.filter(p => p.status === 'WAITING_NURSE');
  const holdNurse = currentDatePatients.filter(p => p.status === 'HOLD');
  const delayedNurse = currentDatePatients.filter(p => p.status === 'DELAYED');
  const completedNurse = currentDatePatients.filter(p => p.nurseName && p.nurseName !== '-' && !['WAITING_NURSE', 'HOLD', 'DELAYED'].includes(p.status));

  const displayQueue = (() => {
    if (activeNurseFilter === 'WAITING_NURSE') return [...waitingNurse].reverse();
    if (activeNurseFilter === 'HOLD') return [...holdNurse].reverse();
    if (activeNurseFilter === 'DELAYED') return [...delayedNurse].reverse();
    if (activeNurseFilter === 'COMPLETED') return [...completedNurse].reverse();
    return [...waitingNurse.reverse(), ...holdNurse.reverse(), ...delayedNurse.reverse()];
  })();

  const stats = {
    waiting: waitingNurse.length,
    hold: holdNurse.length,
    delayed: delayedNurse.length,
    completed: completedNurse.length
  };

  const handleSelectPatient = (p) => {
    if (selectedPatientId && selectedPatientId !== p.id) {
      // Auto-save draft only if the current patient is still editable by the nurse
      const currentPt = patients.find(patient => patient.id === selectedPatientId);
      if (currentPt && ['WAITING_NURSE', 'HOLD'].includes(currentPt.status)) {
        updatePatient(selectedPatientId, {
          height: nurseForm.height, weight: nurseForm.weight,
          isSlim: nurseForm.isSlim,
          waist: nurseForm.isSlim === true ? null : nurseForm.waist,
          waistRatio: nurseForm.isSlim === true ? null : nurseForm.waistRatio,
          pulse: nurseForm.pulse, bp: nurseForm.bp,
          flow: nurseForm.flow, flowPercent: nurseForm.flowPercent,
          mentalAbnormal: nurseForm.mentalAbnormal,
          mental: nurseForm.mentalAbnormal === false ? 'ปกติ' : (nurseForm.mentalAbnormal === true ? 'ผิดปกติ' : ''),
          mentalNote: nurseForm.mentalText,
          upt: nurseForm.upt, mamp: nurseForm.mamp,
          uptResults: nurseForm.uptResults, mampResults: nurseForm.mampResults,
          uptKitReasons: nurseForm.uptKitReasons, mampKitReasons: nurseForm.mampKitReasons,
          uptKitQty: nurseForm.uptKitQty, uptKitReason: (nurseForm.uptKitReasons || []).filter(Boolean).join(', '),
          mampKitQty: nurseForm.mampKitQty, mampKitReason: (nurseForm.mampKitReasons || []).filter(Boolean).join(', '),
          nurseName: nurseForm.nurseName
        }, null);
      }
    }

    setSelectedPatientId(p.id);
    setNurseErrors({});
    setNurseForm({
      height: p.height || '', weight: p.weight || '',
      isSlim: p.isSlim !== undefined ? p.isSlim : (p.height !== '' ? (p.waist === null) : null),
      waist: p.waist || '', waistRatio: p.waistRatio || '',
      pulse: p.pulse || '', bp: p.bp || '', flow: p.flow || '', flowPercent: p.flowPercent || '',
      mentalAbnormal: p.mentalAbnormal !== undefined ? p.mentalAbnormal : (p.mental === 'ปกติ' ? false : (p.mental ? true : null)),
      mentalText: p.mental && p.mental !== 'ปกติ' ? p.mentalNote : '',
      upt: p.status === 'DELAYED' ? '' : (p.upt || ''),
      mamp: p.status === 'DELAYED' ? '' : (p.mamp || ''),
      uptResults: p.status === 'DELAYED' ? [] : (p.uptResults || (p.upt ? [p.upt] : [])),
      mampResults: p.status === 'DELAYED' ? [] : (p.mampResults || (p.mamp ? [p.mamp] : [])),
      uptKitReasons: p.status === 'DELAYED' ? [] : (p.uptKitReasons || []),
      mampKitReasons: p.status === 'DELAYED' ? [] : (p.mampKitReasons || []),
      uptKitQty: p.status === 'DELAYED' ? 1 : (p.uptKitQty || 1),
      uptKitReason: p.status === 'DELAYED' ? '' : (p.uptKitReason || ''),
      mampKitQty: p.status === 'DELAYED' ? 1 : (p.mampKitQty || 1),
      mampKitReason: p.status === 'DELAYED' ? '' : (p.mampKitReason || ''),
      nurseName: p.nurseName && p.nurseName !== '-' ? p.nurseName : 'พยาบาล ใจดี'
    });
  };

  let calculatedBmi = null;
  let derivedIsSlim = nurseForm.isSlim;
  if (nurseForm.height && nurseForm.weight) {
    const h = parseFloat(nurseForm.height) / 100;
    const w = parseFloat(nurseForm.weight);
    if (h > 0 && w > 0) {
      calculatedBmi = (w / (h * h)).toFixed(2);
      derivedIsSlim = calculatedBmi < 23;
    }
  }

  const handleSaveNurse = (targetStatus) => {
    if (targetStatus !== 'HOLD') {
      const errors = {};
      const isInvalid = (val) => val === '' || val === null || val === undefined || String(val).trim() === '';

      if (isInvalid(nurseForm.height)) errors.height = true;
      if (isInvalid(nurseForm.weight)) errors.weight = true;

      if (!derivedIsSlim) {
        if (isInvalid(nurseForm.waist)) errors.waist = true;
        if (isInvalid(nurseForm.pulse)) errors.pulse = true;
        if (isInvalid(nurseForm.bp) || !nurseForm.bp.includes('/') || nurseForm.bp.split('/').some(isInvalid)) errors.bp = true;
      }

      if (isInvalid(nurseForm.flow)) errors.flow = true;
      const currentPatient = patients.find(p => p.id === selectedPatientId);
      if (currentPatient?.gender !== 'M' && isInvalid(nurseForm.upt)) errors.upt = true;
      if (isInvalid(nurseForm.mamp)) errors.mamp = true;
      if (nurseForm.mentalAbnormal && isInvalid(nurseForm.mentalText)) errors.mentalText = true;
      if (isInvalid(nurseForm.nurseName)) errors.nurseName = true;

      if (Object.keys(errors).length > 0) {
        setNurseErrors(errors);
        setTimeout(() => {
          const firstErrorEl = document.querySelector('.border-red-500');
          if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorEl.focus();
          }
        }, 100);
        return;
      }
    }

    setNurseErrors({});

    updatePatient(selectedPatientId, {
      height: nurseForm.height, weight: nurseForm.weight,
      isSlim: derivedIsSlim,
      waist: nurseForm.waist,
      waistRatio: nurseForm.waistRatio,
      pulse: nurseForm.pulse, bp: nurseForm.bp,
      flow: nurseForm.flow, flowPercent: nurseForm.flowPercent,
      mentalAbnormal: nurseForm.mentalAbnormal,
      mental: nurseForm.mentalAbnormal === false ? 'ปกติ' : (nurseForm.mentalAbnormal === true ? 'ผิดปกติ' : ''),
      mentalNote: nurseForm.mentalText, upt: nurseForm.upt, mamp: nurseForm.mamp,
      uptKitQty: nurseForm.uptKitQty, uptKitReason: (nurseForm.uptKitReasons || []).filter(Boolean).join(', '),
      uptResults: nurseForm.uptResults, uptKitReasons: nurseForm.uptKitReasons,
      mampKitQty: nurseForm.mampKitQty, mampKitReason: (nurseForm.mampKitReasons || []).filter(Boolean).join(', '),
      mampResults: nurseForm.mampResults, mampKitReasons: nurseForm.mampKitReasons,
      status: targetStatus, nurseName: nurseForm.nurseName, nurseActionDate: selectedDate
    }, targetStatus === 'HOLD' ? 'บันทึกค้างเคสเรียบร้อย' : 'ส่งข้อมูลให้แพทย์เรียบร้อย');

    setSelectedPatientId(null);
  };



  const preventInvalidNumberInput = (e) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', '.'];
    // Allow numbers, allowed keys, and Ctrl/Cmd combinations
    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner - Nurse */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center p-6 mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-emerald-500 rounded-l-2xl"></div>
        <div className="bg-emerald-500 p-4 rounded-xl text-white mr-5 shadow-sm"><Stethoscope size={32} strokeWidth={2} /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard ระบบตรวจสุขภาพ - พยาบาล</h1>
          <p className="text-base font-bold text-slate-500 mt-1">บันทึกผลการตรวจร่างกายเบื้องต้นและคัดกรองสุขภาพผู้สมัครงาน</p>
        </div>
      </div>

      {/* Search & Date */}
      {searchAndDateBar}

      {/* Pipeline Stats - Nurse */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => setActiveNurseFilter(activeNurseFilter === 'WAITING_NURSE' ? 'ALL' : 'WAITING_NURSE')}
          className={`bg-white rounded-xl p-5 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeNurseFilter === 'WAITING_NURSE' ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-blue-100 hover:border-blue-300'}`}
        >
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-blue-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-blue-600">{stats.waiting}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-semibold text-slate-600">รอตรวจ (ตรวจทั่วไป + ตรวจ LAB)</span>
          </div>
        </div>

        <div
          onClick={() => setActiveNurseFilter(activeNurseFilter === 'DELAYED' ? 'ALL' : 'DELAYED')}
          className={`bg-white rounded-xl p-5 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeNurseFilter === 'DELAYED' ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20' : 'border-purple-100 hover:border-purple-300'}`}
        >
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-purple-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-purple-600">{stats.delayed}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-sm font-semibold text-slate-600">รอตรวจ (ตรวจเฉพาะ LAB)</span>
          </div>
        </div>

        <div
          onClick={() => setActiveNurseFilter(activeNurseFilter === 'HOLD' ? 'ALL' : 'HOLD')}
          className={`bg-white rounded-xl p-5 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeNurseFilter === 'HOLD' ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20' : 'border-orange-100 hover:border-orange-300'}`}
        >
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-orange-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-orange-600">{stats.hold}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-sm font-semibold text-slate-600">ค้างเคส (Hold)</span>
          </div>
        </div>

        <div
          onClick={() => setActiveNurseFilter(activeNurseFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
          className={`bg-white rounded-xl p-5 relative overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 ${activeNurseFilter === 'COMPLETED' ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-emerald-100 hover:border-emerald-300'}`}
        >
          <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-emerald-500 rounded-r-full"></div>
          <div className="flex items-baseline gap-2 ml-2">
            <span className="text-3xl font-black text-emerald-600">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-semibold text-slate-600">บันทึกผลเรียบร้อย</span>
          </div>
        </div>
      </div>

      {/* Form Layout */}
      <div className="flex gap-6 items-start">
        <div className="w-80 border border-slate-200 bg-white rounded-2xl flex flex-col z-0 shrink-0 shadow-sm overflow-hidden h-[700px] sticky top-4">
          <div className="p-5 border-b border-slate-200 font-black text-slate-800 text-lg flex justify-between items-center bg-slate-50/50">
            <span>{activeNurseFilter === 'COMPLETED' ? 'รายชื่อตรวจเสร็จเรียบร้อย' : 'รายชื่อรอตรวจ'}</span>
            <span className="text-sm font-bold bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">{displayQueue.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayQueue.map(p => (
              <div key={p.id} onClick={() => handleSelectPatient(p)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPatientId === p.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                <div>
                  <h4 className="font-black text-slate-800 text-base">6930{p.id} - {p.name}</h4>
                  <span className="text-sm font-bold text-slate-400">{p.status === 'WAITING_NURSE' ? 'รอตรวจ' : (p.status === 'HOLD' ? 'ค้างเคส' : (p.status === 'DELAYED' ? 'เลื่อนเริ่มงาน' : 'ประเมินแล้ว'))}</span>

                </div>
                {p.status === 'WAITING_NURSE' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>}
                {p.status === 'HOLD' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></div>}
                {p.status === 'DELAYED' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></div>}
                {!['WAITING_NURSE', 'HOLD', 'DELAYED'].includes(p.status) && <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
              </div>
            ))}
            {displayQueue.length === 0 && <div className="text-center p-10 text-slate-400 font-bold text-base">ไม่พบรายชื่อในคิว</div>}
          </div>
        </div>

        <div className="flex-1">
          {selectedPatientId ? (() => {
            const pt = patients.find(p => p.id === selectedPatientId);
            const isCompleted = pt && !['WAITING_NURSE', 'HOLD', 'DELAYED'].includes(pt.status);
            const isDelayed = pt && pt.status === 'DELAYED';

            if (isCompleted) {
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full mb-10 min-h-[700px]">
                  <div className="border-b border-slate-200 pb-5 mb-6">
                    <h2 className="text-xl font-black text-slate-800">การตรวจของพยาบาล (บันทึกผลเรียบร้อย)</h2>
                    <p className="text-lg font-semibold text-slate-500 mt-1">ผู้เข้ารับการตรวจ: <span className="text-blue-600 font-bold">6930{pt?.id} - {pt?.name}</span> (เพศ: {pt?.gender === 'M' ? 'ชาย' : 'หญิง'}, อายุ: {pt?.age} ปี)</p>
                  </div>
                  <div className="space-y-6 text-base">
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={24} className="text-emerald-500" />
                        <h3 className="text-lg font-black text-emerald-800">ข้อมูลที่บันทึกแล้ว</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
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
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full mb-10 min-h-[700px]">
                <div className="border-b border-slate-200 pb-5 mb-6">
                  <h2 className="text-xl font-black text-slate-800">{isDelayed ? 'การตรวจของพยาบาล (เลื่อนเริ่มงาน)' : 'การตรวจของพยาบาล'}</h2>
                  <p className="text-base font-semibold text-slate-500 mt-1">ผู้เข้ารับการตรวจ: <span className="text-blue-600 font-bold">6930{pt?.id} - {pt?.name}</span> (เพศ: {pt?.gender === 'M' ? 'ชาย' : 'หญิง'}, อายุ: {pt?.age} ปี)</p>
                </div>

                {isDelayed ? (
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={24} className="text-emerald-500" />
                      <h3 className="text-lg font-black text-emerald-800">ข้อมูลที่บันทึกแล้ว</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
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
                  </div>
                ) : (
                  <div className="space-y-6 text-base">
                    <div>
                      <h4 className="font-black text-slate-800 mb-4 text-lg">1. ส่วนสูงและน้ำหนัก</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block font-bold mb-2">ส่วนสูง (ซม.) <span className="text-[#ef4444]">*</span></label>
                          <input type="number" min="1" onKeyDown={preventInvalidNumberInput} value={nurseForm.height} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}(\.\d{0,1})?$/.test(e.target.value)) return; setNurseForm({ ...nurseForm, height: e.target.value }); setNurseErrors(prev => ({ ...prev, height: false })); }} className={`w-full bg-white border ${nurseErrors.height ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-blue-500 shadow-sm text-slate-800`} />
                          {nurseErrors.height && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกส่วนสูง</div>}
                        </div>
                        <div>
                          <label className="block font-bold mb-2">น้ำหนัก (กก.) <span className="text-[#ef4444]">*</span></label>
                          <input type="number" min="1" onKeyDown={preventInvalidNumberInput} value={nurseForm.weight} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}(\.\d{0,1})?$/.test(e.target.value)) return; setNurseForm({ ...nurseForm, weight: e.target.value }); setNurseErrors(prev => ({ ...prev, weight: false })); }} className={`w-full bg-white border ${nurseErrors.weight ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-blue-500 shadow-sm text-slate-800`} />
                          {nurseErrors.weight && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกน้ำหนัก</div>}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="flex items-center gap-2 mt-2 mb-2">
                        <span className="font-bold text-slate-600">ค่า BMI = {calculatedBmi || '-'}</span>
                        <span className="text-slate-400">|</span>
                        <span className="font-bold text-slate-600">ผลประเมินรูปร่าง:</span>
                        <span className={`font-black ${!calculatedBmi ? 'text-slate-400' : derivedIsSlim ? 'text-[#2f65f6]' : 'text-orange-500'}`}>
                          {!calculatedBmi ? '-' : (derivedIsSlim ? 'Slim / Standard' : 'Overweight / Obese')}
                        </span>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-black text-slate-800 mb-4 text-lg">2. รอบเอว</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block font-bold text-slate-700 mb-2">รอบเอว (ซม.) {!derivedIsSlim && <span className="text-[#ef4444]">*</span>}</label>
                            <input type="number" min="1" onKeyDown={preventInvalidNumberInput} value={nurseForm.waist} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}(\.\d{0,1})?$/.test(e.target.value)) return; setNurseForm({ ...nurseForm, waist: e.target.value, isSlim: false }); setNurseErrors(prev => ({ ...prev, waist: false })); }} className={`w-full bg-white border ${nurseErrors.waist ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-[#2f65f6] shadow-sm text-slate-800`} />
                            {nurseErrors.waist && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกรอบเอว</div>}
                          </div>
                          <div><label className="block font-bold text-slate-700 mb-2">รอบเอว ÷ ส่วนสูง</label><input type="text" readOnly value={nurseForm.waistRatio} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-bold text-slate-600 outline-none cursor-not-allowed shadow-inner" placeholder="0" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">3. ชีพจรและความดันโลหิต</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block font-bold mb-2">ชีพจร (ครั้ง/นาที) {!derivedIsSlim && <span className="text-[#ef4444]">*</span>}</label>
                          <input type="number" min="1" onKeyDown={preventInvalidNumberInput} value={nurseForm.pulse} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}$/.test(e.target.value)) return; setNurseForm({ ...nurseForm, pulse: e.target.value }); setNurseErrors(prev => ({ ...prev, pulse: false })); }} className={`w-full bg-white border ${nurseErrors.pulse ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-[#2f65f6] shadow-sm`} />
                          {nurseErrors.pulse && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกชีพจร</div>}
                        </div>
                        <div>
                          <label className="block font-bold mb-2">ความดันโลหิต (มม.ปรอท) {!derivedIsSlim && <span className="text-[#ef4444]">*</span>}</label>
                          <div className="flex items-center gap-3">
                            <input type="number" min="0" onKeyDown={preventInvalidNumberInput} value={(nurseForm.bp || '').split('/')[0] || ''} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}$/.test(e.target.value)) return; const dia = (nurseForm.bp || '').split('/')[1] || ''; setNurseForm({ ...nurseForm, bp: `${e.target.value}/${dia}` }); setNurseErrors(prev => ({ ...prev, bp: false })); }} className={`w-full bg-white border ${nurseErrors.bp ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-[#2f65f6] shadow-sm text-center`} placeholder="120" />
                            <span className="font-bold text-slate-400 text-2xl">/</span>
                            <input type="number" min="0" onKeyDown={preventInvalidNumberInput} value={(nurseForm.bp || '').split('/')[1] || ''} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}$/.test(e.target.value)) return; const sys = (nurseForm.bp || '').split('/')[0] || ''; setNurseForm({ ...nurseForm, bp: `${sys}/${e.target.value}` }); setNurseErrors(prev => ({ ...prev, bp: false })); }} className={`w-full bg-white border ${nurseErrors.bp ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-[#2f65f6] shadow-sm text-center`} placeholder="80" />
                          </div>
                          {nurseErrors.bp && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกความดันโลหิตให้ครบถ้วน</div>}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">4. อัตราไหลสูงสุดของการหายใจออก (PEF)</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block font-bold mb-2">L/min (เป่าได้) <span className="text-[#ef4444]">*</span></label>
                          <input type="number" min="1" onKeyDown={preventInvalidNumberInput} value={nurseForm.flow} onChange={e => { if (e.target.value !== '' && !/^\d{0,3}$/.test(e.target.value)) return; setNurseForm({ ...nurseForm, flow: e.target.value }); setNurseErrors(prev => ({ ...prev, flow: false })); }} className={`w-full bg-white border ${nurseErrors.flow ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-xl p-3 font-bold outline-none focus:border-blue-500 shadow-sm`} />
                          {nurseErrors.flow && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอก L/min (เป่าได้)</div>}
                        </div>
                        <div><label className="block font-bold text-slate-600 mb-2">เทียบเท่า % ของค่ามาตรฐาน</label><input type="text" readOnly value={nurseForm.flowPercent ? `${nurseForm.flowPercent}%` : ''} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-bold text-slate-600 outline-none cursor-not-allowed shadow-inner" placeholder="0" /></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-black text-slate-800 mb-4 text-lg">5. สภาพจิต <span className="text-[#ef4444]">*</span></h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={nurseForm.mentalAbnormal === false} onChange={() => setNurseForm({ ...nurseForm, mentalAbnormal: false, mentalText: '' })} className="w-5 h-5" /><span className="font-bold">ไม่พบความผิดปกติ</span></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={nurseForm.mentalAbnormal === true} onChange={() => setNurseForm({ ...nurseForm, mentalAbnormal: true })} className="w-5 h-5" /><span className="font-bold">ผิดปกติ (ระบุ)</span></label>
                        {nurseForm.mentalAbnormal === true && (
                          <div>
                            <div className="mt-2">
                              <input type="text" maxLength={100} value={nurseForm.mentalText} onChange={e => { setNurseForm({ ...nurseForm, mentalText: e.target.value, mentalAbnormal: true }); setNurseErrors(prev => ({ ...prev, mentalText: false })); }} className={`w-full ${nurseErrors.mentalText ? 'bg-red-50 border-red-500' : 'bg-white border-slate-300'} border rounded-xl p-3 font-bold outline-none focus:border-blue-500 shadow-sm text-slate-800`} placeholder="ระบุอาการผิดปกติ..." />
                              <div className="text-right text-xs font-bold text-slate-400 mt-1">{(nurseForm.mentalText || '').length}/100</div>
                            </div>
                            {nurseErrors.mentalText && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกข้อมูล</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <h4 className="font-black text-slate-800 mb-4 text-lg">{isDelayed ? 'UPT และ MAMP Test' : '6. UPT และ MAMP Test'}</h4>
                  <div className="space-y-4 mb-6">
                    {/* UPT Box */}
                    <div className={`bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-4 relative transition-all ${pt?.gender === 'M' ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <span className="block font-black text-slate-700">
                          UPT (ตรวจการตั้งครรภ์)
                          {pt?.gender !== 'M' && <span className="text-[#ef4444] ml-1">*</span>}
                        </span>
                        <button type="button" onClick={() => setNurseForm({ ...nurseForm, uptKitQty: (nurseForm.uptKitQty || 1) + 1 })} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                          <Plus size={16} /> เพิ่มจำนวน
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {Array.from({ length: nurseForm.uptKitQty || 1 }).map((_, idx) => (
                          <div key={`upt-${idx}`} className={`p-4 bg-white border rounded-lg flex flex-col gap-3 shadow-sm ${nurseErrors.upt && idx === (nurseForm.uptKitQty - 1) ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                            {nurseForm.uptKitQty > 1 && (
                              <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-bold text-slate-500 text-sm">ตรวจรอบที่ {idx + 1}</span>
                                {idx > 0 && (
                                  <button type="button" onClick={() => {
                                    const newQty = nurseForm.uptKitQty - 1;
                                    const newResults = [...(nurseForm.uptResults || [])];
                                    newResults.splice(idx, 1);
                                    setNurseForm({ ...nurseForm, uptKitQty: newQty, uptResults: newResults, upt: newResults[newQty - 1] || '' });
                                  }} className="text-red-400 hover:text-red-600 transition-colors p-1 bg-red-50 hover:bg-red-100 rounded">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            )}
                            <div className="flex gap-6 mt-1 flex-wrap">
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`upt_round_${idx}`} checked={nurseForm.uptResults?.[idx] === 'Negative' || (idx === 0 && !nurseForm.uptResults?.[0] && nurseForm.upt === 'Negative')} onChange={() => {
                                  const newResults = [...(nurseForm.uptResults || [])];
                                  if (newResults.length === 0 && nurseForm.upt) newResults[0] = nurseForm.upt;
                                  newResults[idx] = 'Negative';
                                  setNurseForm({ ...nurseForm, uptResults: newResults, upt: newResults[nurseForm.uptKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, upt: false }));
                                }} className="w-5 h-5" /> Negative
                              </label>
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`upt_round_${idx}`} checked={nurseForm.uptResults?.[idx] === 'Positive' || (idx === 0 && !nurseForm.uptResults?.[0] && nurseForm.upt === 'Positive')} onChange={() => {
                                  const newResults = [...(nurseForm.uptResults || [])];
                                  if (newResults.length === 0 && nurseForm.upt) newResults[0] = nurseForm.upt;
                                  newResults[idx] = 'Positive';
                                  setNurseForm({ ...nurseForm, uptResults: newResults, upt: newResults[nurseForm.uptKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, upt: false }));
                                }} className="w-5 h-5" /> Positive
                              </label>
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`upt_round_${idx}`} checked={nurseForm.uptResults?.[idx] === 'เครื่องมือชำรุด' || (idx === 0 && !nurseForm.uptResults?.[0] && nurseForm.upt === 'เครื่องมือชำรุด')} onChange={() => {
                                  const newResults = [...(nurseForm.uptResults || [])];
                                  if (newResults.length === 0 && nurseForm.upt) newResults[0] = nurseForm.upt;
                                  newResults[idx] = 'เครื่องมือชำรุด';
                                  setNurseForm({ ...nurseForm, uptResults: newResults, upt: newResults[nurseForm.uptKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, upt: false }));
                                }} className="w-5 h-5" /> เครื่องมือชำรุด
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      {nurseErrors.upt && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกข้อมูล</div>}
                    </div>

                    {/* MAMP Box */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <span className="block font-black text-slate-700">MAMP Test (ตรวจสารเสพติด) <span className="text-[#ef4444]">*</span></span>
                        <button type="button" onClick={() => setNurseForm({ ...nurseForm, mampKitQty: (nurseForm.mampKitQty || 1) + 1 })} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                          <Plus size={16} /> เพิ่มจำนวน
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {Array.from({ length: nurseForm.mampKitQty || 1 }).map((_, idx) => (
                          <div key={`mamp-${idx}`} className={`p-4 bg-white border rounded-lg flex flex-col gap-3 shadow-sm ${nurseErrors.mamp && idx === (nurseForm.mampKitQty - 1) ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                            {nurseForm.mampKitQty > 1 && (
                              <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-bold text-slate-500 text-sm">ตรวจรอบที่ {idx + 1}</span>
                                {idx > 0 && (
                                  <button type="button" onClick={() => {
                                    const newQty = nurseForm.mampKitQty - 1;
                                    const newResults = [...(nurseForm.mampResults || [])];
                                    newResults.splice(idx, 1);
                                    setNurseForm({ ...nurseForm, mampKitQty: newQty, mampResults: newResults, mamp: newResults[newQty - 1] || '' });
                                  }} className="text-red-400 hover:text-red-600 transition-colors p-1 bg-red-50 hover:bg-red-100 rounded">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            )}
                            <div className="flex gap-6 mt-1 flex-wrap">
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`mamp_round_${idx}`} checked={nurseForm.mampResults?.[idx] === 'Negative' || (idx === 0 && !nurseForm.mampResults?.[0] && nurseForm.mamp === 'Negative')} onChange={() => {
                                  const newResults = [...(nurseForm.mampResults || [])];
                                  if (newResults.length === 0 && nurseForm.mamp) newResults[0] = nurseForm.mamp;
                                  newResults[idx] = 'Negative';
                                  setNurseForm({ ...nurseForm, mampResults: newResults, mamp: newResults[nurseForm.mampKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, mamp: false }));
                                }} className="w-5 h-5" /> Negative
                              </label>
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`mamp_round_${idx}`} checked={nurseForm.mampResults?.[idx] === 'Positive' || (idx === 0 && !nurseForm.mampResults?.[0] && nurseForm.mamp === 'Positive')} onChange={() => {
                                  const newResults = [...(nurseForm.mampResults || [])];
                                  if (newResults.length === 0 && nurseForm.mamp) newResults[0] = nurseForm.mamp;
                                  newResults[idx] = 'Positive';
                                  setNurseForm({ ...nurseForm, mampResults: newResults, mamp: newResults[nurseForm.mampKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, mamp: false }));
                                }} className="w-5 h-5" /> Positive
                              </label>
                              <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <input type="radio" name={`mamp_round_${idx}`} checked={nurseForm.mampResults?.[idx] === 'เครื่องมือชำรุด' || (idx === 0 && !nurseForm.mampResults?.[0] && nurseForm.mamp === 'เครื่องมือชำรุด')} onChange={() => {
                                  const newResults = [...(nurseForm.mampResults || [])];
                                  if (newResults.length === 0 && nurseForm.mamp) newResults[0] = nurseForm.mamp;
                                  newResults[idx] = 'เครื่องมือชำรุด';
                                  setNurseForm({ ...nurseForm, mampResults: newResults, mamp: newResults[nurseForm.mampKitQty - 1] || '' });
                                  setNurseErrors(prev => ({ ...prev, mamp: false }));
                                }} className="w-5 h-5" /> เครื่องมือชำรุด
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      {nurseErrors.mamp && <div className="text-red-500 text-sm mt-1 font-bold">กรุณากรอกข้อมูล</div>}
                    </div>
                  </div>
                </div>

                <div className="pt-8 pb-4">
                  <div className="flex items-end gap-2 max-w-md ml-auto">
                    <span className="font-bold text-slate-700 whitespace-nowrap mb-1">ลงชื่อ <span className="text-[#ef4444]">*</span></span>
                    <div className="flex-1 flex flex-col">
                      <input
                        type="text"
                        readOnly
                        value={nurseForm.nurseName}
                        className={`w-full bg-transparent border-b-2 border-dashed ${nurseErrors.nurseName ? 'border-red-500 text-red-500' : 'border-slate-400 text-blue-700'} px-2 py-1 text-center font-bold outline-none cursor-default min-w-[150px]`}
                        placeholder="-- กรุณาลงชื่อผู้ตรวจ --"
                      />
                    </div>
                    <span className="font-bold text-slate-700 whitespace-nowrap mb-1">พยาบาลผู้ตรวจ</span>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                  <button onClick={() => handleSaveNurse('HOLD')} className="px-6 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl font-bold transition-colors">ค้างเคส (Hold)</button>
                  <button onClick={() => handleSaveNurse('WAITING_DOCTOR')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-md shadow-blue-200 transition-colors">ส่งให้แพทย์วินิจฉัย</button>
                </div>
              </div>
            );
          })() : (
            <div className="h-[700px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-bold text-lg">กรุณาเลือกรายชื่อผู้รับการตรวจจากแถบด้านซ้าย</div>
          )}
        </div>
      </div>
    </div>
  );
}
