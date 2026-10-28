export interface SettingsFileUploadRequest {
  field: string;
  name: string;
  size: number;
  contentType: string;
}

export interface SettingsUploadTokenPayload extends SettingsFileUploadRequest {
  userId: string;
  key: string;
  filename: string;
  expiresAt: number;
}

export interface SettingsUploadReceipt {
  field: string;
  token: string;
}
