export function isMissingConfigValue(value: string | undefined) {
  return !value || value.trim().length === 0 || value.includes("placeholder");
}

export function formatMissingConfigError(scope: string, envName: string) {
  return `${scope} is missing required environment variable ${envName}.`;
}
