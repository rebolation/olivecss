---
name: Bug report
about: Report a bug in the project
title: "[BUG]"
labels: bug
assignees: ''
---

**What version of Olive CSS are you using?**

For example: 
v0.2.0

**What framework (React, Svelte, etc.) and build tool (Vite, Webpack, etc.) are you using?**

For example: 
React 19.1.0
Vite 7.1.2

**Please describe the bug and include any error messages if available.**

For example:
The original classes are removed, and only the ones written in comments remain.

**Please provide the code where the bug occurs (20 lines or fewer).**

For example: 
```
return (
  <div>
    {items
      ?.filter(item => item.active)
      .map((item, index) => (
        <div className="item" key={index}>
          {/* active-item */}         <-- HERE
        </div>
      ))}
  </div>
);
```
