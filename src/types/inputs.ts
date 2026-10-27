export interface ResetPasswordInputs {
  email: string;
  password: string;
  confirmPassword: string;
};

export interface SettingsFormInputs {
  aboutText: string;
  vowelCharts: {
    id?: number;
    name: string;
    filename: string;
    file?: FileList;
  }[];
  unpublished: {
    id?: number;
    year: number;
    authors: string[];
    title: string;
    filename: string;
    file?: FileList;
  }[];
  research: {
    id?: number;
    year: number;
    authors: string[];
    title: string;
    publication: string;
    pageNumbers: string;
    filename: string;
    file?: FileList;
  }[];
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
