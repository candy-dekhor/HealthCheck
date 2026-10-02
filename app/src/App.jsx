import PatientDetailModal from "./components/PatientDetailModal";

import HRDashboard from "./components/HRDashboard";
import NurseDashboard from "./components/NurseDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import RegistrationDashboard from "./components/RegistrationDashboard";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Stethoscope, CheckCircle, Clock, Calendar,
  Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight,
  UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, FileDown, X
} from 'lucide-react';
import * as XLSX from 'xlsx-js-style';

const getTodayStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const todayStr = getTodayStr();
const todayFormatted = `${todayStr.split('-')[2]}/${todayStr.split('-')[1]}/${new Date().getFullYear() + 543}`;


export default function App() {
  const [activeTab, setActiveTab] = useState('REGISTRATION');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear() + 543);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // States for Postpone Modal
  const [postponePatient, setPostponePatient] = useState(null);
  const [newStartDate, setNewStartDate] = useState('04/08/2569');

  const [nurseForm, setNurseForm] = useState({
    height: '', weight: '', isSlim: false, waist: '', waistRatio: '',
    pulse: '', bp: '', flow: '', flowPercent: '', mentalAbnormal: false, mentalText: '',
    upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '', nurseName: 'พยาบาล ใจดี'
  });
  const [nurseErrors, setNurseErrors] = useState({});
  const [doctorForm, setDoctorForm] = useState({ result: 'HEALTHY', note: '', docName: 'นพ. เก่งเวช', healthProblem: [] });

  // Initial Patients Data (10 Mock Data on 3 Aug)
  const [patients, setPatients] = useState([
    {
      id: 1, name: 'สมชาย ใจดี', gender: 'M', age: 25, position: 'พนักงานขาย', department: 'MK 1 - (การตลาด 1/2)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_NURSE',
      height: '', weight: '', waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 2, name: 'สมหญิง รักงาน', gender: 'F', age: 28, position: 'พนักงานขาย', department: 'MK 10 - (การตลาด 10/1)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_NURSE',
      height: '', weight: '', waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 3, name: 'วิชัย เก่งการ', gender: 'M', age: 30, position: 'พนักงานขาย', department: 'MK 1 - (การตลาด 1/6)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_DOCTOR',
      isSlim: false, height: 165, weight: 68, waist: 32, waistRatio: 0.49, pulse: 76, bp: '120/80', flow: 450, flowPercent: 98,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล สมร', docName: '-'
    },
    {
      id: 4, name: 'นารี สวยงาม', gender: 'F', age: 26, position: 'พนักงานขาย', department: 'MK 2 - (การตลาด 2/3)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_HR',
      isSlim: false, height: 160, weight: 55, waist: 28, waistRatio: 0.44, pulse: 72, bp: '115/75', flow: 420, flowPercent: 95,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: 'HEALTHY', docNote: '', hrAction: '', nurseName: 'พยาบาล สมร', docName: 'นพ. เก่งเวช', docActionDate: '2026-08-03', nurseActionDate: '2026-08-03'
    },
    {
      id: 5, name: 'บุญส่ง มั่งคั่ง', gender: 'M', age: 35, position: 'พนักงานขาย', department: 'MK 3 - (การตลาด 3/10)', startDate: '03/08/2569', date: '2026-08-03', status: 'COMPLETED',
      isSlim: false, height: 178, weight: 80, waist: 34, waistRatio: 0.48, pulse: 78, bp: '125/85', flow: 500, flowPercent: 100,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: 'HEALTHY', docNote: '', hrAction: 'COMPLETED', nurseName: 'พยาบาล ใจดี', docName: 'พญ. สมศรี', docActionDate: '2026-08-03', nurseActionDate: '2026-08-03', hrActionDate: '2026-08-03'
    },
    {
      id: 6, name: 'ทวีศักดิ์ รักชาติ', gender: 'M', age: 40, position: 'พนักงานขาย', department: 'MK 4 - (การตลาด 4/6)', startDate: '03/08/2569', date: '2026-08-03', status: 'DELAYED', delayedDate: '10/08/2569', evaluateNote: 'เลื่อนวันเริ่มงาน',
      isSlim: false, height: 172, weight: 85, waist: 36, waistRatio: 0.53, pulse: 88, bp: '160/100', flow: 400, flowPercent: 88,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: 'WARNING', docNote: 'ความดันโลหิตสูง', hrAction: 'DELAYED', nurseName: 'พยาบาล ใจดี', docName: 'นพ. เก่งเวช'
    },
    {
      id: 7, name: 'อนงค์ นงนุช', gender: 'F', age: 45, position: 'พนักงานขาย', department: 'MK 7 - (การตลาด 7/6)', startDate: '03/08/2569', date: '2026-08-03', status: 'REJECTED', evaluateNote: 'ไม่ผ่านการประเมิน',
      isSlim: false, height: 155, weight: 50, waist: 27, waistRatio: 0.44, pulse: 75, bp: '120/80', flow: 380, flowPercent: 90,
      mental: 'ปกติ', mentalNote: '', upt: 'Positive', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: 'DANGER', docNote: 'พบสารเสพติดในร่างกาย', hrAction: 'REJECTED', nurseName: 'พยาบาล สมร', docName: 'พญ. สมศรี'
    },
    {
      id: 8, name: 'มาลี ดีใจ', gender: 'F', age: 50, position: 'พนักงานขาย', department: 'RN 1 - (ต่ออายุ 1/5)', startDate: '03/08/2569', date: '2026-08-03', status: 'HOLD',
      isSlim: false, height: 158, weight: 62, waist: 28, waistRatio: 0.44, pulse: 80, bp: '140/90', flow: '', flowPercent: '',
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล ใจดี', docName: '-'
    },
    {
      id: 9, name: 'สุชาติ ชาติเจริญ', gender: 'M', age: 38, position: 'พนักงานขาย', department: 'MK CO 6/4 - (การตลาด CO 6/4)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_DOCTOR',
      isSlim: false, height: 170, weight: 75, waist: 34, waistRatio: 0.50, pulse: 78, bp: '125/85', flow: 430, flowPercent: 93,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: 'พยาบาล สมร', docName: '-'
    },
    {
      id: 20, name: 'อำนาจ มาดแมน', gender: 'M', age: 32, position: 'พนักงานขาย', department: 'MK 4 - (การตลาด 4/6)', startDate: '03/08/2569', date: '2026-08-03', status: 'WAITING_HR',
      isSlim: false, height: 165, weight: 65, waist: 30, waistRatio: 0.45, pulse: 74, bp: '118/78', flow: 440, flowPercent: 96,
      mental: 'ปกติ', mentalNote: '', upt: 'Negative', mamp: 'Negative', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: 'HEALTHY', docNote: 'สุขภาพปกติ', hrAction: '', nurseName: 'พยาบาล สมร', docName: 'นพ. เก่งเวช'
    },
    {
      id: 21, name: 'ภูมิใจ ภักดี', gender: 'M', age: 24, position: 'พนักงานขาย', department: 'MK 7 - (การตลาด 7/6)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 172, weight: 68, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 22, name: 'สายชล คงทน', gender: 'F', age: 29, position: 'พนักงานขาย', department: 'MK 8 - (การตลาด 8/4)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 158, weight: 52, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 23, name: 'ตะวัน ส่องแสง', gender: 'M', age: 22, position: 'พนักงานขาย', department: 'RN 1 - (ต่ออายุ 1/5)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 180, weight: 75, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 24, name: 'พิมพ์ดาว พราวฟ้า', gender: 'F', age: 27, position: 'พนักงานขาย', department: 'RN 2 - (ต่ออายุ 2/5)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 165, weight: 60, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 25, name: 'นพดล คนดี', gender: 'M', age: 31, position: 'พนักงานขาย', department: 'MK 10 - (การตลาด 10/1)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 168, weight: 70, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 16, name: 'อรทัย ใจงาม', gender: 'F', age: 26, position: 'พนักงานขาย', department: 'MK 5 - (การตลาด 5/2)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 155, weight: 48, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 17, name: 'ยิ่งยง ทรงพลัง', gender: 'M', age: 35, position: 'พนักงานขาย', department: 'RN 3 - (ต่ออายุ 3/5)', startDate: todayFormatted, date: todayStr, status: 'WAITING_NURSE',
      height: 175, weight: 82, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 18, name: 'ฟ้าใส ใจบริสุทธิ์', gender: 'F', age: 23, position: 'พนักงานขาย', department: 'MK 2 - (การตลาด 2/3)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 162, weight: 55, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 19, name: 'ชลธี ศรีสวัสดิ์', gender: 'M', age: 28, position: 'พนักงานขาย', department: 'MK 3 - (การตลาด 3/10)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 169, weight: 64, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 26, name: 'พรพิมล ยลโฉม', gender: 'F', age: 30, position: 'พนักงานขาย', department: 'MK 4 - (การตลาด 4/6)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 159, weight: 58, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 27, name: 'ศุภชัย ใจเด็ด', gender: 'M', age: 33, position: 'พนักงานขาย', department: 'MK 7 - (การตลาด 7/6)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 177, weight: 78, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 28, name: 'กมลวรรณ ปัญญา', gender: 'F', age: 25, position: 'พนักงานขาย', department: 'RN 1 - (ต่ออายุ 1/5)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 161, weight: 49, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 29, name: 'พิเชษฐ์ เลิศล้ำ', gender: 'M', age: 27, position: 'พนักงานขาย', department: 'MK CO 6/4 - (การตลาด CO 6/4)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 171, weight: 66, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 30, name: 'ดาริกา ฟ้าสาง', gender: 'F', age: 24, position: 'พนักงานขาย', department: 'MK 8 - (การตลาด 8/4)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 157, weight: 53, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    },
    {
      id: 31, name: 'ธนพล ร่ำรวย', gender: 'M', age: 29, position: 'พนักงานขาย', department: 'RN 2 - (ต่ออายุ 2/5)', startDate: '14/08/2569', date: '2026-08-14', status: 'WAITING_NURSE',
      height: 174, weight: 72, waist: '', waistRatio: '', pulse: '', bp: '', flow: '', flowPercent: '',
      mental: '', mentalNote: '', upt: '', mamp: '', uptKitQty: 1, uptKitReason: '', mampKitQty: 1, mampKitReason: '',
      docResult: '', docNote: '', hrAction: '', nurseName: '-', docName: '-'
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [viewDetailPatient, setViewDetailPatient] = useState(null);
  const [activeNurseFilter, setActiveNurseFilter] = useState('ALL');
  const [activeDoctorFilter, setActiveDoctorFilter] = useState('ALL');
  const [activeHrFilter, setActiveHrFilter] = useState('ALL');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Set default export dates when modal opens
  useEffect(() => {
    if (isExportModalOpen) {
      setExportStartDate(selectedDate);
      setExportEndDate(selectedDate);
    }
  }, [isExportModalOpen, selectedDate]);

  // Filter patients based on export date range
  const patientsToExport = useMemo(() => {
    const exportedList = [];

    // Helper: '28/09/2569' -> '2026-09-28'
    const parseThaiDateToISO = (thaiDateStr) => {
      if (!thaiDateStr) return null;
      const parts = thaiDateStr.split('/');
      if (parts.length !== 3) return null;
      const y = parseInt(parts[2], 10) - 543;
      const m = parts[1].padStart(2, '0');
      const d = parts[0].padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    patients.forEach(p => {
      // Check first visit
      if (p.date && p.date >= exportStartDate && p.date <= exportEndDate) {
        exportedList.push({ ...p, isSecondVisitExport: false });
      }
      // Check second visit
      if (p.delayedDate) {
        const dDateIso = parseThaiDateToISO(p.delayedDate);
        if (dDateIso && dDateIso >= exportStartDate && dDateIso <= exportEndDate) {
          exportedList.push({ ...p, isSecondVisitExport: true });
        }
      }
    });

    return exportedList;
  }, [patients, exportStartDate, exportEndDate]);

  const handleExportExcel = () => {
    setIsExporting(true);

    // Simulate loading UX
    setTimeout(() => {
      let totalGeneral = 0;
      let totalLung = 0;
      let totalDrug = 0;
      let totalPregnancy = 0;
      let maxNoteWidth = 10; // สำหรับปรับขนาดคอลัมน์หมายเหตุอัตโนมัติ

      // 1. Prepare data
      const wsData = [
        // Title Row
        [`ข้อมูลรายชื่อพนักงานตรวจสุขภาพ ช่วงวันที่ ${formatDateDisplay(exportStartDate)} ถึง ${formatDateDisplay(exportEndDate)}`],
        [], // Empty row for spacing
        // Header Row 1
        ['ลำดับ', 'ประเภทพนักงาน', 'รหัสพนักงาน', 'ชื่อ - สกุล', 'แผนก/ห้อง', 'วันที่เริ่มงาน', 'วันที่เลื่อนเริ่มงาน', 'รายการตรวจสุขภาพ', '', '', '', 'หมายเหตุ'],
        // Header Row 2
        ['', '', '', '', '', '', '', 'ตรวจทั่วไป', 'ตรวจปอด', 'สารเสพติด', 'การตั้งครรภ์', '']
      ];

      // 2. Map Patients Data
      patientsToExport.forEach((pt, index) => {
        const isSecondVisit = pt.isSecondVisitExport;
        const isNurseDone = !['WAITING_NURSE', 'HOLD'].includes(pt.status);

        const generalVal = (!isSecondVisit && isNurseDone && pt.nurseName && pt.nurseName !== '-') ? 1 : '-';
        const lungVal = (!isSecondVisit && isNurseDone && pt.flow && pt.flow !== '-') ? 1 : '-';
        const drugVal = (isNurseDone && (pt.mamp === 'Negative' || pt.mamp === 'Positive')) ? (pt.mampKitQty || 1) : '-';
        const pregVal = (isNurseDone && (pt.upt === 'Negative' || pt.upt === 'Positive')) ? (pt.uptKitQty || 1) : '-';

        if (generalVal !== '-') totalGeneral += generalVal;
        if (lungVal !== '-') totalLung += lungVal;
        if (drugVal !== '-') totalDrug += drugVal;
        if (pregVal !== '-') totalPregnancy += pregVal;

        const kitReasons = [];
        if (pt.mampKitQty > 1) {
          const rounds = Array.from({ length: pt.mampKitQty }).map((_, i) => `รอบ ${i + 1}.${pt.mampResults?.[i] || 'ไม่ระบุ'}`).join(' ');
          kitReasons.push(`สารเสพติด(${pt.mampKitQty}ชุด): ${rounds}`);
        }
        if (pt.uptKitQty > 1) {
          const rounds = Array.from({ length: pt.uptKitQty }).map((_, i) => `รอบ ${i + 1}.${pt.uptResults?.[i] || 'ไม่ระบุ'}`).join(' ');
          kitReasons.push(`ครรภ์(${pt.uptKitQty}ชุด): ${rounds}`);
        }
        const noteVal = kitReasons.length > 0 ? kitReasons.join(' | ') : '-';

        // คำนวณหาความยาวสูงสุดของข้อความหมายเหตุ
        if (noteVal !== '-' && noteVal.length > maxNoteWidth) {
          maxNoteWidth = noteVal.length;
        }

        const prefix = pt.gender === 'M' ? 'นาย ' : (pt.gender === 'F' ? 'นางสาว ' : '');

        // Helper to format DD/MM/YYYY to Thai date
        const formatDelayedDate = (dDate) => {
          if (!dDate) return '-';
          const parts = dDate.split('/');
          if (parts.length !== 3) return dDate;
          const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
          return `${parseInt(parts[0], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[2]}`;
        };

        wsData.push([
          index + 1,
          'สัญญาจ้าง', // Mock Employee Type
          String(pt.id).padStart(6, '0'), // 6-digit Employee ID
          `${prefix}${pt.name}`,
          pt.department || pt.position || '-',
          pt.date ? formatDateThaiFull(pt.date) : '-',
          pt.delayedDate ? formatDelayedDate(pt.delayedDate) : '-',
          generalVal,
          lungVal,
          drugVal,
          pregVal,
          noteVal
        ]);
      });

      // Add Total Row
      wsData.push([
        'รวมจำนวนที่ใช้ (รายการ)', '', '', '', '', '', '',
        totalGeneral,
        totalLung,
        totalDrug,
        totalPregnancy,
        ''
      ]);

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const totalRowIndex = wsData.length - 1;

      // Apply styles to all cells
      const borderAll = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      };

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
          if (!ws[cellAddress]) {
            ws[cellAddress] = { t: 's', v: '' }; // Create empty cell object for styling
          }

          const cell = ws[cellAddress];
          if (!cell.s) cell.s = {};

          // Default style for data
          cell.s.font = { name: 'Arial', sz: 10 };
          cell.s.alignment = { vertical: 'center', horizontal: 'center' };

          // Left align "ชื่อ - สกุล" (Column D / Index 3) for data rows
          if (R >= 4 && R !== totalRowIndex && C === 3) {
            cell.s.alignment = { vertical: 'center', horizontal: 'left' };
          }

          if (R === 0) {
            // Title
            cell.s.font = { name: 'Arial', sz: 12, bold: true };
          } else if (R === 2 || R === 3) {
            // Headers
            cell.s.font = { name: 'Arial', sz: 10, bold: true };
            cell.s.border = borderAll;
            if (C >= 7 && C <= 10) {
              cell.s.fill = { fgColor: { rgb: "E2EFDA" } }; // Light Green
            } else {
              cell.s.fill = { fgColor: { rgb: "BDD7EE" } }; // Light Blue
            }
          } else if (R >= 4) {
            // Data & Total Rows
            cell.s.border = borderAll;

            if (R === totalRowIndex) {
              cell.s.font = { name: 'Arial', sz: 10, bold: true };
              if (C >= 7 && C <= 10) {
                cell.s.fill = { fgColor: { rgb: "FCE4D6" } }; // Peach/Orange
              }
            }
          }
        }
      }

      // 3. Merge Cells (for headers and total row)
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Merge Title
        { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }, // ลำดับ
        { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // ประเภทพนักงาน
        { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } }, // รหัสพนักงาน
        { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } }, // ชื่อ - สกุล
        { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } }, // แผนก/ห้อง
        { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } }, // วันที่เริ่มงาน
        { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } }, // วันที่เลื่อนเริ่มงาน
        { s: { r: 2, c: 7 }, e: { r: 2, c: 10 } }, // รายการตรวจสุขภาพ (Merge 4 cols)
        { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } }, // หมายเหตุ
        { s: { r: totalRowIndex, c: 0 }, e: { r: totalRowIndex, c: 6 } } // Merge Total Row Text
      ];

      // 4. Set Column Widths
      ws['!cols'] = [
        { wch: 8 },  // ลำดับ
        { wch: 18 }, // ประเภทพนักงาน
        { wch: 15 }, // รหัสพนักงาน
        { wch: 25 }, // ชื่อ - สกุล
        { wch: 20 }, // แผนก/ห้อง
        { wch: 15 }, // วันที่เริ่มงาน
        { wch: 18 }, // วันที่เลื่อนเริ่มงาน
        { wch: 12 }, // ตรวจทั่วไป
        { wch: 12 }, // ตรวจปอด
        { wch: 12 }, // สารเสพติด
        { wch: 12 }, // การตั้งครรภ์
        { wch: Math.max(15, Math.ceil(maxNoteWidth * 0.75)) }, // หมายเหตุ (ปรับเผื่อภาษาไทย)
      ];

      // 5. Page Setup (บังคับให้ Excel เปิดมาเป็นหน้าแนวนอน และบีบให้อยู่ในหน้าเดียวเวลาพริ้นต์)
      if (!ws['!pageSetup']) ws['!pageSetup'] = {};
      ws['!pageSetup'].orientation = 'landscape';
      ws['!pageSetup'].paperSize = 9; // 9 = A4

      // 6. Generate and Download
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Health_Check_Report");
      XLSX.writeFile(wb, `HR_Report_${exportStartDate}_to_${exportEndDate}.xlsx`);

      setIsExporting(false);
      setIsExportModalOpen(false);
      showToast('ส่งออกไฟล์ Excel สำเร็จ');
    }, 800); // 800ms loading delay for UX
  };

  const currentDatePatients = useMemo(() => {
    let data = patients.filter(p => p.date === selectedDate);
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(lowerSearch) || (`6930${p.id}`).includes(lowerSearch));
    }
    return data;
  }, [patients, selectedDate, searchTerm]);

  // Real-time Calculation for Waist Ratio
  useEffect(() => {
    if (nurseForm.waist && nurseForm.height) {
      const ratio = (parseFloat(nurseForm.waist) / parseFloat(nurseForm.height)).toFixed(2);
      setNurseForm(prev => ({ ...prev, waistRatio: ratio, isSlim: false }));
    } else {
      setNurseForm(prev => ({ ...prev, waistRatio: 0 }));
    }
  }, [nurseForm.waist, nurseForm.height]);

  // Real-time Calculation for BMI and isSlim auto-selection
  useEffect(() => {
    if (nurseForm.height && nurseForm.weight) {
      const h = parseFloat(nurseForm.height) / 100;
      const w = parseFloat(nurseForm.weight);
      if (h > 0 && w > 0) {
        const bmi = w / (h * h);
        const slim = bmi < 23; // Asian BMI standard (BMI < 23 is Normal/Slim)
        setNurseForm(prev => ({ ...prev, isSlim: slim }));
      }
    }
  }, [nurseForm.height, nurseForm.weight]);

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
          setNurseForm(prev => ({ ...prev, flowPercent: pct.toFixed(0) }));
        }
      }
    } else {
      setNurseForm(prev => ({ ...prev, flowPercent: 0 }));
    }
  }, [nurseForm.flow, nurseForm.height, selectedPatientId, patients]);

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

  const formatDateThaiFull = (dateStr) => {
    if (!dateStr) return '';
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const [y, m, d] = dateStr.split('-');
    const thaiYear = parseInt(y) + 543;
    const monthName = months[parseInt(m) - 1];
    return `${parseInt(d)} ${monthName} ${thaiYear}`;
  };

  const CustomDatePicker = ({ value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const initialDate = value ? new Date(value) : new Date();
    const [monthIdx, setMonthIdx] = useState(initialDate.getMonth());
    const [year, setYear] = useState(initialDate.getFullYear() + 543);

    return (
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 flex justify-between items-center hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer"
        >
          <span>{value ? formatDateThaiFull(value) : placeholder}</span>
          <Calendar size={18} className="text-emerald-500" />
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-4 z-50 w-72">
              <div className="absolute -top-2.5 left-6 w-5 h-5 bg-white border-t border-l border-slate-300 transform rotate-45 rounded-sm"></div>
              <div className="flex justify-between items-center mb-4 relative z-10">
                <button onClick={() => { if (monthIdx === 0) { setMonthIdx(11); setYear(year - 1); } else setMonthIdx(monthIdx - 1); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"><ChevronLeft size={18} /></button>
                <div className="flex items-center gap-1">
                  <select value={monthIdx} onChange={(e) => setMonthIdx(Number(e.target.value))} className="font-bold text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none px-2 py-1 cursor-pointer">{monthsThai.map((m, i) => (<option key={i} value={i}>{m}</option>))}</select>
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="font-bold text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none px-2 py-1 cursor-pointer">{Array.from({ length: 5 }, (_, i) => year - 2 + i).map(y => (<option key={y} value={y}>{y}</option>))}</select>
                </div>
                <button onClick={() => { if (monthIdx === 11) { setMonthIdx(0); setYear(year + 1); } else setMonthIdx(monthIdx + 1); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-1 relative z-10">{['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (<span key={d} className="text-xs font-bold text-slate-400">{d}</span>))}</div>
              <div className="grid grid-cols-7 gap-1 text-center relative z-10">
                {Array.from({ length: getFirstDayOfMonth(monthIdx, year) }).map((_, i) => (<div key={`empty-${i}`} />))}
                {Array.from({ length: getDaysInMonth(monthIdx, year) }).map((_, i) => {
                  const d = i + 1;
                  const fullDate = `${year - 543}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  return (
                    <button key={d} onClick={() => { onChange(fullDate); setIsOpen(false); }} className={`h-8 w-8 mx-auto rounded-lg font-bold flex items-center justify-center text-sm transition-all ${value === fullDate ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}>{d}</button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const ChevronDown = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
  );

  // Component Search and Date ที่แยกกันคนละกล่อง
  const SearchAndDateBar = () => (
    <div className="flex items-center gap-4 mb-6 w-full z-20 relative">
      {/* Search Box */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 h-14 flex items-center shadow-sm transition-colors hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
        <Search className="text-slate-400 mr-3 shrink-0" size={20} />
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ รหัสพนักงาน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-base font-semibold text-slate-700 w-full placeholder:text-slate-400 h-full"
        />
      </div>

      {/* Date Picker Box */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center justify-center gap-3 px-6 h-14 rounded-2xl font-bold text-base shadow-sm transition-all border relative z-30 ${isCalendarOpen ? 'bg-white border-blue-400 text-blue-700 ring-4 ring-blue-500/10' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
        >
          <Calendar size={20} className={isCalendarOpen ? 'text-blue-600' : 'text-slate-500'} />
          <span>{formatDateDisplay(selectedDate)}</span>
          <ChevronDown size={20} className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
        </button>

        {isCalendarOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />
        )}

        {isCalendarOpen && (
          <div className="absolute right-0 mt-4 bg-white border border-slate-300 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 z-50 w-[22rem]">
            <div className="absolute -top-2.5 right-12 w-5 h-5 bg-white border-t border-l border-slate-300 transform rotate-45 rounded-sm"></div>
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

      {/* Export to Excel Box */}
      {activeTab === 'HR' && (
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="shrink-0 flex items-center justify-center gap-2 px-6 h-14 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
        >
          <FileDown size={20} />
          <span>Export Excel</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden text-base">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-base font-bold">
          <Check size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Patient Detail Modal */}
      <PatientDetailModal viewDetailPatient={viewDetailPatient} setViewDetailPatient={setViewDetailPatient} activeTab={activeTab} />

      {/* TQM Sidebar */}
      <div className={`flex flex-col shrink-0 z-30 shadow-xl overflow-y-auto overflow-x-hidden transition-all duration-300 ${isSidebarOpen ? 'w-[260px]' : 'w-0'}`} style={{ background: 'linear-gradient(180deg, #1a6fb5 0%, #1565a8 100%)' }}>

        {/* Logo */}
        <div className="px-4 py-3">
          <img src="data:image/webp;base64,UklGRngBAABXRUJQVlA4TGsBAAAviEAMEA8w//M///Mf8JAcbV/7OB+jwDpydDYtuAJTgtvJ/iHHo0vYVnBug3U8LjqJGTF8h/8P1EJE/yeApCBSADwCcB1QCrnSbg4a6YCnUyS95rREUoA6k0lSiV4rixWaUVAtKk2hXaRBC4h0aCukoHUHdCUPaIHq0e3MCihhUbRIA2RBdyiiJAJISh0IgEjQj3KYaKNoAYIBjZqPtwAaBnSt+HgE+o4y4aI4jRPnT9B3QrCbweXBtLfC3QyPd9pX6Z9lpr1sX0P/GiYkvG5fQ/sd+mrAc99+h/bft4n/tv329TC1X/ULXw+u2dER/cIXjnykoO99oa1KVrh3matBiCRYXOKquomdYrQkkXzL6iJN0Ril/5RqI6FFRt8upVoQxS/At64yVAuZ+Lgq9G2Fx8ha/2Qy3VwLSMp95KBUmkLbV7g9KiS56gZnSAHLvLCYTgs3h4U/oZEMJxTyt5wQKYknoJjI1QkAJgAA" width="95" alt="TQM Logo" />
        </div>

        {/* Menu */}
        <nav className="flex-1 px-0 pb-6">

          {/* ระบบ Candidate Pool */}
          <div className="px-4 pt-4 pb-1">
            <span className="text-white/80 font-semibold text-[13px]">ระบบ Candidate Pool</span>
          </div>
          <a className="flex items-center gap-3 px-4 py-2 text-white/80 text-[14px] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" /></svg>
            <span>รายชื่อผู้สมัคร</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-white/80 text-[14px] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 576 512"><path d="M304 240l0-223.4c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16L304 240zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4L256 288 412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288l238.4 0z" /></svg>
            <span>Admin Dashboard</span>
          </a>

          {/* ระบบ Job Offer */}
          <div className="px-4 pt-5 pb-1">
            <span className="text-white/80 font-semibold text-[13px]">ระบบ Job Offer</span>
          </div>
          <a className="flex items-center gap-3 px-4 py-2 text-white/80 text-[14px] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-19.3c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2l-64 0c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2L80 448c-8.8 0-16-7.2-16-16s7.2-16 16-16l8.2 0c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8 8.9 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6l0-43.6-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z" /></svg>
            <span>เสนอจ้าง (Job Offer)</span>
          </a>

          {/* ระบบ HR RC Interview Management */}
          <div className="px-4 pt-5 pb-1">
            <span className="text-white/80 font-semibold text-[13px]">ระบบ HR RC Interview Management</span>
          </div>
          <a className="flex items-center gap-3 px-4 py-2 text-white/80 text-[14px] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64c0-17.4-6.9-33.1-18.1-44.6L366 161.7c5.3-12.1-.2-26.3-12.3-31.6s-26.3 .2-31.6 12.3L257.9 288c-.6 0-1.3 0-1.9 0c-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>
            <span>แดชบอร์ดต้นสังกัด</span>
          </a>

          {/* ระบบลงทะเบียนพนักงาน */}
          <div className="px-4 pt-5 pb-1">
            <span className="text-white/80 font-semibold text-[13px]">ระบบลงทะเบียนพนักงาน</span>
          </div>
          <button
            onClick={() => setActiveTab('REGISTRATION')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all ${activeTab === 'REGISTRATION' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
          >
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
            <span>ลงทะเบียนเริ่มงาน</span>
          </button>

          {/* ระบบตรวจสุขภาพ */}
          <div className="px-4 pt-5 pb-1">
            <span className="text-white/80 font-semibold text-[13px]">ระบบตรวจสุขภาพ</span>
          </div>
          <button
            onClick={() => setActiveTab('HR')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all ${activeTab === 'HR' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
          >
            <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
            <span>การจัดการข้อมูลพนักงานขาย</span>
          </button>
          <button
            onClick={() => setActiveTab('NURSE')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all ${activeTab === 'NURSE' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
          >
            <HeartPulse size={18} className="shrink-0" />
            <span>การบันทึกผลการตรวจสุขภาพ</span>
          </button>
          <button
            onClick={() => setActiveTab('DOCTOR')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all ${activeTab === 'DOCTOR' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
          >
            <Stethoscope size={18} className="shrink-0" />
            <span className="truncate">การอนุมัติผลการตรวจสุขภาพ</span>
          </button>

        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-blue-50 relative">

        {/* Top Header with Hamburger */}
        <div className="h-[64px] bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-50 shadow-sm sticky top-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 focus:outline-none"
          >
            <Menu size={26} />
          </button>

          {/* User Profile */}
          <div className="relative">
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <span className="text-slate-500 font-semibold text-lg">ยินดีต้อนรับ, <span className="text-slate-800 font-bold">{activeTab === 'NURSE' ? 'คุณ พยาบาล' : activeTab === 'DOCTOR' ? 'คุณหมอ' : 'คุณเอกภพ น้อยคล้าย'}</span></span>
              <div className="w-10 h-10 bg-[#1e1e1e] rounded-full flex items-center justify-center text-white ml-2">
                <User size={22} />
              </div>
              <ChevronDown size={20} className="text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                <div className="absolute right-0 top-full mt-4 w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="bg-[#242424] p-5 flex items-center gap-4 text-white">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#242424] shrink-0">
                      <User size={30} />
                    </div>
                    <div>
                      <div className="font-bold text-lg leading-tight">{activeTab === 'NURSE' ? 'คุณ พยาบาล' : activeTab === 'DOCTOR' ? 'คุณหมอ' : 'คุณเอกภพ น้อยคล้าย'}</div>
                      <div className="text-white/80 font-semibold text-[15px] mt-1.5 tracking-wide">รหัสพนักงาน: 683088</div>
                    </div>
                  </div>
                  <div className="p-2 bg-white">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 text-slate-600 font-bold transition-colors text-left rounded-md text-[15px]">
                      <Lock size={20} className="text-slate-500" fill="currentColor" /> เปลี่ยนรหัสผ่าน
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 text-slate-600 font-bold transition-colors text-left rounded-md mt-1 text-[15px]">
                      <LogOut size={20} className="text-slate-500" /> ออกจากระบบ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Workspace Container (เลื่อนได้ทั้งหน้า) */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            {activeTab === 'HR' && (
              <HRDashboard
                currentDatePatients={currentDatePatients}
                activeHrFilter={activeHrFilter}
                setActiveHrFilter={setActiveHrFilter}
                formatDateDisplay={formatDateDisplay}
                updatePatient={updatePatient}
                searchAndDateBar={SearchAndDateBar()}
                setViewDetailPatient={setViewDetailPatient}
                patients={patients}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'NURSE' && (
              <NurseDashboard
                currentDatePatients={currentDatePatients}
                activeNurseFilter={activeNurseFilter}
                setActiveNurseFilter={setActiveNurseFilter}
                formatDateDisplay={formatDateDisplay}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                nurseForm={nurseForm}
                setNurseForm={setNurseForm}
                nurseErrors={nurseErrors}
                setNurseErrors={setNurseErrors}
                updatePatient={updatePatient}
                searchAndDateBar={SearchAndDateBar()}
                setViewDetailPatient={setViewDetailPatient}
                patients={patients}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'DOCTOR' && (
              <DoctorDashboard
                currentDatePatients={currentDatePatients}
                activeDoctorFilter={activeDoctorFilter}
                setActiveDoctorFilter={setActiveDoctorFilter}
                formatDateDisplay={formatDateDisplay}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                doctorForm={doctorForm}
                setDoctorForm={setDoctorForm}
                updatePatient={updatePatient}
                searchAndDateBar={SearchAndDateBar()}
                setViewDetailPatient={setViewDetailPatient}
                patients={patients}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'REGISTRATION' && (
              <RegistrationDashboard
                activeTab={activeTab}
                currentDatePatients={currentDatePatients}
                formatDateDisplay={formatDateDisplay}
                setPostponePatient={setPostponePatient}
                updatePatient={updatePatient}
                searchAndDateBar={SearchAndDateBar()}
                postponePatient={postponePatient}
                newStartDate={newStartDate}
                setNewStartDate={setNewStartDate}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
                selectedDate={selectedDate}
                monthsThai={monthsThai}
                currentMonthIndex={currentMonthIndex}
                setCurrentMonthIndex={setCurrentMonthIndex}
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
                getFirstDayOfMonth={getFirstDayOfMonth}
                getDaysInMonth={getDaysInMonth}
                handleSelectDateCell={handleSelectDateCell}
                setViewDetailPatient={setViewDetailPatient}
              />
            )}
          </div>
        </div>

      </div>

      {/* Export Modal Placeholder */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-6 relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileDown className="text-emerald-500" />
                Export to Excel
              </h2>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="py-2">
              {/* Date Range Picker */}
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-full sm:w-56">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ตั้งแต่วันที่</label>
                  <CustomDatePicker
                    value={exportStartDate}
                    onChange={setExportStartDate}
                    placeholder="เลือกวันที่"
                  />
                </div>
                <div className="hidden sm:block text-slate-300 font-bold mt-4">-</div>
                <div className="w-full sm:w-56">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ถึงวันที่</label>
                  <CustomDatePicker
                    value={exportEndDate}
                    onChange={setExportEndDate}
                    placeholder="เลือกวันที่"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-600 font-medium text-sm flex items-center gap-2">
                  <Eye size={18} className="text-emerald-500" />
                  ตัวอย่างตาราง
                </p>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                  พบข้อมูลทั้งหมด {patientsToExport.length} รายการ
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar shadow-inner bg-slate-50">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[800px]">
                  <thead className="bg-white text-slate-600 sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200 text-center" rowSpan="2">ลำดับ</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200 text-center" rowSpan="2">ประเภทพนักงาน</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200" rowSpan="2">รหัสพนักงาน</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200" rowSpan="2">ชื่อ - สกุล</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200" rowSpan="2">แผนก/ห้อง</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200" rowSpan="2">วันที่เริ่มงาน</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200" rowSpan="2">วันที่เลื่อนเริ่มงาน</th>
                      <th className="px-3 py-2.5 border-b border-r border-slate-200 text-center" colSpan="4">รายการตรวจสุขภาพ</th>
                      <th className="px-3 py-2.5 border-b border-slate-200" rowSpan="2">หมายเหตุ</th>
                    </tr>
                    <tr>
                      <th className="px-3 py-2 border-b border-r border-slate-200 text-center bg-slate-50">ตรวจทั่วไป</th>
                      <th className="px-3 py-2 border-b border-r border-slate-200 text-center bg-slate-50">ตรวจปอด</th>
                      <th className="px-3 py-2 border-b border-r border-slate-200 text-center bg-slate-50">สารเสพติด</th>
                      <th className="px-3 py-2 border-b border-r border-slate-200 text-center bg-slate-50">ครรภ์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientsToExport.slice(0, 3).map((pt, i) => {
                      const isSecondVisit = pt.isSecondVisitExport;
                      const isNurseDone = !['WAITING_NURSE', 'HOLD'].includes(pt.status);
                      const generalVal = (!isSecondVisit && isNurseDone && pt.nurseName && pt.nurseName !== '-') ? 1 : '-';
                      const lungVal = (!isSecondVisit && isNurseDone && pt.flow && pt.flow !== '-') ? 1 : '-';
                      const drugVal = (isNurseDone && (pt.mamp === 'Negative' || pt.mamp === 'Positive')) ? (pt.mampKitQty || 1) : '-';
                      const pregVal = (isNurseDone && (pt.upt === 'Negative' || pt.upt === 'Positive')) ? (pt.uptKitQty || 1) : '-';

                      const kitReasons = [];
                      if (pt.mampKitQty > 1) {
                        const rounds = Array.from({ length: pt.mampKitQty }).map((_, idx) => `รอบ ${idx + 1}.${pt.mampResults?.[idx] || 'ไม่ระบุ'}`).join(' ');
                        kitReasons.push(`สารเสพติด(${pt.mampKitQty}ชุด): ${rounds}`);
                      }
                      if (pt.uptKitQty > 1) {
                        const rounds = Array.from({ length: pt.uptKitQty }).map((_, idx) => `รอบ ${idx + 1}.${pt.uptResults?.[idx] || 'ไม่ระบุ'}`).join(' ');
                        kitReasons.push(`ครรภ์(${pt.uptKitQty}ชุด): ${rounds}`);
                      }
                      const noteVal = kitReasons.length > 0 ? kitReasons.join(' | ') : '-';

                      return (
                        <tr key={pt.id + (isSecondVisit ? '-delayed' : '-first')} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center font-medium text-slate-400">{i + 1}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center text-slate-600">สัญญาจ้าง</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-slate-600">{String(pt.id).padStart(6, '0')}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 font-bold text-slate-700">
                            {pt.gender === 'M' ? 'นาย ' : (pt.gender === 'F' ? 'นางสาว ' : '')}{pt.name}
                          </td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-slate-600">{pt.department || pt.position || '-'}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-slate-600">{pt.date ? formatDateThaiFull(pt.date) : '-'}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-slate-600">{pt.delayedDate ? formatDateThaiFull(parseThaiDateToISO(pt.delayedDate)) : '-'}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center text-slate-600">{generalVal}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center text-slate-600">{lungVal}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center text-slate-600">{drugVal}</td>
                          <td className="px-3 py-2.5 border-r border-slate-100 text-center text-slate-600">{pregVal}</td>
                          <td className="px-3 py-2.5 text-slate-500">{noteVal}</td>
                        </tr>
                      );
                    })}
                    {patientsToExport.length > 3 && (
                      <tr>
                        <td colSpan="12" className="px-3 py-4 text-center text-slate-500 bg-slate-50/80 italic font-medium">
                          ...ยังมีข้อมูลที่ถูกซ่อนไว้อีก {patientsToExport.length - 3} รายการ (จะแสดงครบใน Excel)
                        </td>
                      </tr>
                    )}
                    {patientsToExport.length === 0 && (
                      <tr>
                        <td colSpan="12" className="px-3 py-10 text-center bg-white">
                          <div className="flex flex-col items-center justify-center opacity-40">
                            <Search size={32} className="mb-2" />
                            <span className="font-semibold text-sm">ไม่พบข้อมูลผู้รับการตรวจในช่วงเวลาที่คุณเลือก</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
              <button onClick={() => setIsExportModalOpen(false)} disabled={isExporting} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50">
                ยกเลิก
              </button>
              <button
                onClick={handleExportExcel}
                disabled={isExporting || patientsToExport.length === 0}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? <RotateCcw size={18} className="animate-spin" /> : <FileDown size={18} />}
                {isExporting ? 'กำลังสร้างไฟล์...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}