import os

app_file = '/Applications/เดสก์ท็อป - MacBook Air ของ Sakonwan /Project จบ/UI1/app/src/App.jsx'
components_dir = '/Applications/เดสก์ท็อป - MacBook Air ของ Sakonwan /Project จบ/UI1/app/src/components'

if not os.path.exists(components_dir):
    os.makedirs(components_dir)

with open(app_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_block(start_str, end_str=None, match_brackets=False):
    start_idx = -1
    for i, line in enumerate(lines):
        if start_str in line:
            start_idx = i
            break
            
    if start_idx == -1: return None, None, None
    
    if match_brackets:
        open_brackets = 0
        for i in range(start_idx, len(lines)):
            open_brackets += lines[i].count('{') - lines[i].count('}')
            if open_brackets == 0:
                return start_idx, i, lines[start_idx:i+1]
    else:
        for i in range(start_idx, len(lines)):
            if end_str in lines[i]:
                return start_idx, i, lines[start_idx:i+1]
                
    return None, None, None

hr_start, hr_end, hr_content = get_block('  function HRDashboard() {', match_brackets=True)
nurse_start, nurse_end, nurse_content = get_block('  function NurseDashboard() {', match_brackets=True)
doc_start, doc_end, doc_content = get_block('  function DoctorDashboard() {', match_brackets=True)
reg_start, reg_end, reg_content = get_block('  function RegistrationDashboard() {', match_brackets=True)

# Postpone modal is inside RegistrationDashboard, so we extract it from there
postpone_start, postpone_end, postpone_content = get_block('        {postponePatient && (', ')}', match_brackets=False)
patient_start, patient_end, patient_content = get_block('      {viewDetailPatient && (', ')}', match_brackets=False)

def replace_block(lines, start, end, replacement):
    return lines[:start] + [replacement + '\n'] + lines[end+1:]

new_lines = lines.copy()

# Replace backwards so line numbers don't change
if reg_start:
    new_lines = replace_block(new_lines, reg_start, reg_end, '            {activeTab === \'REGISTRATION\' && (<RegistrationDashboard \n              activeTab={activeTab}\n              currentDatePatients={currentDatePatients}\n              formatDateDisplay={formatDateDisplay}\n              setPostponePatient={setPostponePatient}\n              updatePatient={updatePatient}\n              searchAndDateBar={SearchAndDateBar()}\n              postponePatient={postponePatient}\n              newStartDate={newStartDate}\n              setNewStartDate={setNewStartDate}\n            />)}')
if doc_start:
    new_lines = replace_block(new_lines, doc_start, doc_end, '            {activeTab === \'DOCTOR\' && (<DoctorDashboard \n              currentDatePatients={currentDatePatients}\n              activeDoctorFilter={activeDoctorFilter}\n              setActiveDoctorFilter={setActiveDoctorFilter}\n              formatDateDisplay={formatDateDisplay}\n              selectedPatientId={selectedPatientId}\n              setSelectedPatientId={setSelectedPatientId}\n              doctorForm={doctorForm}\n              setDoctorForm={setDoctorForm}\n              updatePatient={updatePatient}\n              searchAndDateBar={SearchAndDateBar()}\n              setViewDetailPatient={setViewDetailPatient}\n              patients={patients}\n            />)}')
if nurse_start:
    new_lines = replace_block(new_lines, nurse_start, nurse_end, '            {activeTab === \'NURSE\' && (<NurseDashboard \n              currentDatePatients={currentDatePatients}\n              activeNurseFilter={activeNurseFilter}\n              setActiveNurseFilter={setActiveNurseFilter}\n              formatDateDisplay={formatDateDisplay}\n              selectedPatientId={selectedPatientId}\n              setSelectedPatientId={setSelectedPatientId}\n              nurseForm={nurseForm}\n              setNurseForm={setNurseForm}\n              nurseErrors={nurseErrors}\n              setNurseErrors={setNurseErrors}\n              updatePatient={updatePatient}\n              searchAndDateBar={SearchAndDateBar()}\n              setViewDetailPatient={setViewDetailPatient}\n              patients={patients}\n            />)}')
if hr_start:
    new_lines = replace_block(new_lines, hr_start, hr_end, '            {activeTab === \'HR\' && (<HRDashboard \n              currentDatePatients={currentDatePatients}\n              activeHrFilter={activeHrFilter}\n              setActiveHrFilter={setActiveHrFilter}\n              formatDateDisplay={formatDateDisplay}\n              updatePatient={updatePatient}\n              searchAndDateBar={SearchAndDateBar()}\n              setViewDetailPatient={setViewDetailPatient}\n            />)}')

# Now for modals
if patient_start:
    # Need to update new_lines again using string match or re-run
    # Actually, the patient modal is rendered directly in App.jsx. I will just leave it inline for now, or just extract dashboards first.
    pass

with open(app_file + '.new', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Write components
def write_comp(name, original_content, props_str):
    comp_lines = original_content.copy()
    # Change `function Name() {` to `export default function Name({ props }) {`
    comp_lines[0] = f'import React from "react";\nimport {{ Users, Stethoscope, CheckCircle, Clock, Calendar, Search, AlertCircle, Activity, PauseCircle, Eye, Check, Menu, ChevronLeft, ChevronRight, UserPlus, FileCheck, Globe, Headphones, HeartPulse, ChevronDown, User, LogOut, Lock, UserX, RotateCcw, X }} from "lucide-react";\n\nexport default function {name}({{ {props_str} }}) {{\n'
    
    # We replace the local SearchAndDateBar() call with {searchAndDateBar}
    for i in range(len(comp_lines)):
        comp_lines[i] = comp_lines[i].replace('{SearchAndDateBar()}', '{searchAndDateBar}')
    
    with open(os.path.join(components_dir, f'{name}.jsx'), 'w', encoding='utf-8') as f:
        f.writelines(comp_lines)

if hr_content:
    write_comp('HRDashboard', hr_content, 'currentDatePatients, activeHrFilter, setActiveHrFilter, formatDateDisplay, updatePatient, searchAndDateBar, setViewDetailPatient')
if nurse_content:
    write_comp('NurseDashboard', nurse_content, 'currentDatePatients, activeNurseFilter, setActiveNurseFilter, formatDateDisplay, selectedPatientId, setSelectedPatientId, nurseForm, setNurseForm, nurseErrors, setNurseErrors, updatePatient, searchAndDateBar, setViewDetailPatient, patients')
if doc_content:
    write_comp('DoctorDashboard', doc_content, 'currentDatePatients, activeDoctorFilter, setActiveDoctorFilter, formatDateDisplay, selectedPatientId, setSelectedPatientId, doctorForm, setDoctorForm, updatePatient, searchAndDateBar, setViewDetailPatient, patients')
if reg_content:
    write_comp('RegistrationDashboard', reg_content, 'activeTab, currentDatePatients, formatDateDisplay, setPostponePatient, updatePatient, searchAndDateBar, postponePatient, newStartDate, setNewStartDate')

print("Refactoring prepared in App.jsx.new and components directory.")
