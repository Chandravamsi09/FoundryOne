export function sanitizeInput(value: string): string {
  return value.trim();
}

export function isValidPasswordStrength(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Engineering Manager',
    employee: 'Software Engineer',
    client: 'Client Partner'
  };
  return roleNames[role.toLowerCase()] || role;
}
