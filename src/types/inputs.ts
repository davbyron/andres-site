export interface SettingsFormInputs {
  aboutText: string;
  languageLevels: {
    id?: number;
    name: string;
    color: string;
    languages: {
      id?: number;
      name: string;
    }[];
  }[];
}

export interface SignInInputs {
  email: string;
  password: string;
}
