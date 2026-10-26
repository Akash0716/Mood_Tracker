/**
 * Normalize date utilities for consistent YYYY-MM-DD handling
 * across MongoDB queries and serverless runtimes.
 */

// Returns today's date as 'YYYY-MM-DD'
function getTodayString() {
  const now = new Date();
  return formatDateString(now);
}

// Formats a Date object or string into 'YYYY-MM-DD'
function formatDateString(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Validates 'YYYY-MM-DD' format and valid calendar date
function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

// Check if date string is in the future compared to today
function isFutureDate(dateStr) {
  const today = getTodayString();
  return dateStr > today;
}

// Calculate continuous streak of dates ending today or yesterday
function calculateStreak(sortedDatesDesc) {
  if (!sortedDatesDesc || sortedDatesDesc.length === 0) return 0;

  // Deduplicate and ensure sorted descending
  const uniqueDates = Array.from(new Set(sortedDatesDesc)).sort().reverse();
  const today = getTodayString();
  const yesterday = getPreviousDateString(today);

  // If the most recent check-in is neither today nor yesterday, streak is broken
  const mostRecent = uniqueDates[0];
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = mostRecent;

  for (let i = 0; i < uniqueDates.length; i++) {
    if (uniqueDates[i] === expectedDate) {
      streak++;
      expectedDate = getPreviousDateString(expectedDate);
    } else {
      break;
    }
  }

  return streak;
}

// Get the date string for the day prior to dateStr
function getPreviousDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return formatDateString(d);
}

module.exports = {
  getTodayString,
  formatDateString,
  isValidDateString,
  isFutureDate,
  calculateStreak,
  getPreviousDateString,
};
