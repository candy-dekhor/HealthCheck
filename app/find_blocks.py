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

def write_component(name, content, imports):
    with open(os.path.join(components_dir, f'{name}.jsx'), 'w', encoding='utf-8') as f:
        f.write(imports + '\n\n')
        f.write(f'export default {"".join(content)}\n')

hr_start, hr_end, hr_content = get_block('function HRDashboard() {', match_brackets=True)
nurse_start, nurse_end, nurse_content = get_block('function NurseDashboard() {', match_brackets=True)
doc_start, doc_end, doc_content = get_block('function DoctorDashboard() {', match_brackets=True)
reg_start, reg_end, reg_content = get_block('function RegistrationDashboard() {', match_brackets=True)

patient_start, patient_end, patient_content = get_block('{viewDetailPatient && (', ')}', match_brackets=False)

print(f"HR: {hr_start+1}-{hr_end+1}")
print(f"Nurse: {nurse_start+1}-{nurse_end+1}")
print(f"Doctor: {doc_start+1}-{doc_end+1}")
print(f"Registration: {reg_start+1}-{reg_end+1}")
print(f"PatientModal: {patient_start+1}-{patient_end+1}")
