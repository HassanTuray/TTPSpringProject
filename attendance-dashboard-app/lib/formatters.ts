// Utility functions for formatting data between database and display formats

/**
 * Converts a display string to database format (lowercase with hyphens)
 * Example: "Computer Science" -> "computer-science"
 */
export function toDbFormat(str: string): string {
  return str.toLowerCase().replace(/ /g, '-');
}

/**
 * Maps year values from database format to display format
 */
export function getYearLabel(yearValue: string): string {
  const yearMap: { [key: string]: string } = {
    freshman: 'Freshman',
    sophomore: 'Sophomore',
    junior: 'Junior',
    senior: 'Senior',
  };
  return yearMap[yearValue] || yearValue;
}

/**
 * Maps club values from database format to display format
 */
export function getClubLabel(clubValue: string): string {
  const clubMap: { [key: string]: string } = {
    codeblack: 'CodeBlack',
    colorstack: 'ColorStack',
    'black-engineers-society': 'Black Engineers Society',
  };
  return clubMap[clubValue] || clubValue;
}

/**
 * Maps major values from database format to display format
 */
export function getMajorLabel(majorValue: string): string {
  const majorMap: { [key: string]: string } = {
    'computer-science': 'Computer Science',
    'electrical-engineering': 'Electrical Engineering',
    'computer-engineering': 'Computer Engineering',
    'information-science': 'Information Science',
    'math': 'Math',
    'mechanical-engineering': 'Mechanical Engineering',
    'civil-engineering': 'Civil Engineering',
    'fire-protection-engineering': 'Fire Protection Engineering',
    'aerospace-engineering': 'Aerospace Engineering',
    'other': 'Other',
  };
  return majorMap[majorValue] || majorValue;
}
