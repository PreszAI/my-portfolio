# Recover Lost Reports - Quick Guide

## Step 1: Check Browser Console
1. Open your browser console (F12)
2. Go to the "Console" tab
3. Type this command and press Enter:

```javascript
localStorage.getItem('communityReports')
```

If you see data, your reports are still there!

## Step 2: Check for Backup
In the console, type:

```javascript
localStorage.getItem('communityReports_backup')
```

If you see data here, you can recover it!

## Step 3: Manual Recovery
If you found data in either location, you can recover it:

### Option A: Use the "Recover Reports" Button
1. Go to the Reports section
2. Look for the orange "Recover Reports" button
3. Click it to restore from backup

### Option B: Manual Recovery via Console
If the button doesn't work, paste this in the console:

```javascript
// Check what's in localStorage
console.log('Main storage:', localStorage.getItem('communityReports'));
console.log('Backup:', localStorage.getItem('communityReports_backup'));

// If backup exists, restore it
const backup = localStorage.getItem('communityReports_backup');
if (backup) {
  localStorage.setItem('communityReports', backup);
  console.log('Reports restored! Refresh the page.');
  location.reload();
}
```

## Step 4: Check All localStorage Keys
To see everything stored:

```javascript
Object.keys(localStorage).forEach(key => {
  if (key.includes('report') || key.includes('Report') || key.includes('community')) {
    console.log(key + ':', localStorage.getItem(key));
  }
});
```

## Common Causes:
- Browser cache cleared
- localStorage quota exceeded
- Browser in incognito/private mode
- Different browser/device

## Prevention:
- Export your reports regularly using the "Export" button
- The system creates automatic backups, but they can be lost if localStorage is cleared



