
# TodoList Component Testing Guide

## Manual Testing Checklist

### Basic Functionality
- [ ] **Add Task**: Enter a task and click the plus button or press Enter
- [ ] **Remove Task**: Click the trash icon to delete a task
- [ ] **Complete Task**: Click the circle/check icon to mark as complete
- [ ] **Input Validation**: Try adding empty, short (<2 chars), long (>100 chars), or duplicate tasks

### Filtering
- [ ] **All Tasks**: Should show all tasks regardless of status
- [ ] **Active Tasks**: Should only show incomplete tasks
- [ ] **Completed Tasks**: Should only show completed tasks

### Sorting
- [ ] **Newest First**: Most recently added tasks appear at the top
- [ ] **Oldest First**: Earliest added tasks appear at the top  
- [ ] **Alphabetical**: Tasks sorted A-Z by text content

### Advanced Features
- [ ] **Clear Completed**: Remove all completed tasks at once
- [ ] **Task Counter**: Verify total, active, and completed counts are accurate
- [ ] **localStorage**: Refresh the page and verify tasks persist

### Edge Cases
- [ ] **Empty State**: No tasks displays appropriate message
- [ ] **Filter Empty State**: No tasks match filter shows appropriate message
- [ ] **Long Task Names**: Tasks with long text wrap properly
- [ ] **Special Characters**: Tasks with emojis, numbers, symbols work correctly

### Accessibility
- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Enter Key**: Submits new tasks when input is focused
- [ ] **Screen Reader**: All buttons and inputs have appropriate labels

## Test Data Suggestions

```
Sample tasks to test with:
- "Buy groceries"
- "Walk the dog 🐕"
- "Finish project presentation"
- "Call mom for her birthday"
- "Learn React testing"
- "A" (should fail - too short)
- "" (should fail - empty)
- Very long task that exceeds the 100 character limit and should trigger validation error
```

## Browser Testing
Test in multiple browsers:
- Chrome/Chromium
- Firefox
- Safari (if on macOS)
- Edge

## Mobile Testing
- Test on mobile devices or browser dev tools mobile view
- Verify touch interactions work properly
- Check responsive layout

## Performance Testing
- Add 50+ tasks and verify performance remains smooth
- Test localStorage with large amounts of data
- Check for memory leaks with browser dev tools
