export const serverSettingsUpdateRules = {
  registration: "boolean",
  loginRequired: "boolean",
  debugSettings: "object",
  "debugSettings.debugSocketEvents": "boolean",
  "debugSettings.debugSocketReconnect": "boolean",
};

export const frontendSettingsUpdateRules = {
  gridCols: "integer|min:1",
  gridRows: "integer|min:1",
  largeTiles: "boolean",
};

export const credentialSettingUpdateRules = {
  jwtSecret: "required|string",
  jwtExpiresIn: "required|integer|min:120",
  refreshTokenAttempts: "required|integer|min:-1",
  refreshTokenExpiry: "required|integer|min:0",
};

export const whitelistUpdateRules = {
  whitelistEnabled: "boolean",
  whitelistedIpAddresses: "array",
  "whitelistedIpAddresses.*": "string",
};

export const wizardUpdateRules = {
  wizardCompleted: "required|boolean",
  wizardCompletedAt: "required|date",
  wizardVersion: "required|integer|min:0",
};
