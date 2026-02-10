// Input validation utilities

export function isValidHostname(hostname: string): boolean {
  if (!hostname || hostname.trim().length === 0) {
    return false;
  }
  
  // Allow IP addresses and domain names
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
  
  return ipRegex.test(hostname) || domainRegex.test(hostname);
}

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port > 0 && port <= 65535;
}

export function isValidUsername(username: string): boolean {
  if (!username || username.trim().length === 0) {
    return false;
  }
  
  // Basic validation - alphanumeric, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

export function sanitizeCommand(command: string): string {
  // Basic command sanitization to prevent injection
  // Remove dangerous characters and sequences
  return command
    .replace(/[;&|`$()]/g, '') // Remove shell metacharacters
    .trim();
}