# Bug Diagnostic & Resolution Report

## 1. Summary
* **Issue Title**: [Brief description of the bug]
* **Severity**: [Critical / Major / Moderate / Minor]
* **Affected Component**: [Frontend / Backend / Database / Authentication]
* **Date Identified**: [YYYY-MM-DD]

---

## 2. Reproduction Steps
* **Prerequisites**: [e.g., Logged in as user X]
* **Steps to Reproduce**:
  1. Navigate to `/...` or send HTTP `[METHOD]` to `[ENDPOINT]`
  2. Input data: `...`
  3. Action taken: `...`
* **Observed Result**: [Exact error message, status code, or broken UI behavior]
* **Expected Result**: [What should have happened]

---

## 3. Root Cause Analysis
* **Primary File & Line**: `[path/to/file.js#L12-L25]`
* **Explanation**:
  * *Why it failed*: [Detailed explanation of why the defect occurred]
  * *Underlying cause*: [e.g., Unhandled null reference, unescaped SQL parameter, missing async/await]

---

## 4. Proposed Surgical Fix
* **Files to Modify**:
  * `[path/to/file.js]` - [Summary of changes]
* **Code Diff / Summary**:
```javascript
// Before
const user = await getUser(id);
return user.name; // Crashes if user is null

// After
const user = await getUser(id);
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
return res.status(200).json({ name: user.name });
```

---

## 5. Verification & Test Evidence
* **Reproduction Test**: [Passed / Failed]
* **Regression Check**: [List of existing features or tests verified]
* **Terminal Test Output**:
```text
[Paste raw test or curl execution output here]
```

