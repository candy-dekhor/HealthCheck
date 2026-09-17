const fs = require('fs');
let code = fs.readFileSync('app/src/App.jsx', 'utf8');

// We want to fix the mock data block, from `const [patients, setPatients] = useState([` to `]);`
code = code.replace(/id:\s*\d+,\s*name:.*?,/g, match => {
  // We don't want to mess with this, let's just do a regex replace for the position field inside the mock data.
  return match;
});

// A simpler regex to find position: '...' and extract the value.
// If the value contains MK or RN, it's a department.
code = code.replace(/position:\s*'([^']+)'/g, (match, val) => {
  if (val.includes('MK') || val.includes('RN') || val.includes('การตลาด') || val.includes('ต่ออายุ')) {
    return `position: 'พนักงานขาย', department: '${val}'`;
  }
  if (val === 'พนักงานขาย') {
    // If it's already 'พนักงานขาย', maybe department is missing. We will let it be.
    return match;
  }
  return match;
});

// Clean up duplicate position/department if any
code = code.replace(/position:\s*'พนักงานขาย',\s*department:\s*'พนักงานขาย',\s*department:\s*'([^']+)'/g, "position: 'พนักงานขาย', department: '$1'");

// Now update the Export to Excel logic
code = code.replace(
  /pt\.position\s*\|\|\s*'-'/g,
  "pt.department || pt.position || '-'"
);

fs.writeFileSync('app/src/App.jsx', code);
console.log('Fixed App.jsx');
