
type InputErrorsT = {
  password?: string[];
  passwordConfirmation?: string[];
};

// option A
/*
type InitialFormStateT = {
  error: false;
  code: string; // we set code to props.code || ''
};
type ErrorFormStateT = {
  error: true;
  message: string;
  inputErrors?: InputErrorsT;
  code: string;
};
type SuccessFormStateT = {
  error: false;
  message: 'Success';
};

export type ResetPasswordFormStateT =
  | InitialFormStateT
  | ErrorFormStateT
  | SuccessFormStateT;
*/

// option B
export type ResetPasswordFormStateT = {
  error: boolean;
  message?: string;
  inputErrors?: InputErrorsT;
  code?: string;
};
