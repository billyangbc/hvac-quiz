type InputErrorsT = {
  currentPassword?: string[];
  newPassword?: string[];
  passwordConfirmation?: string[];
};
export type ErrorActionStateT = {
  error: true;
  message: string;
  inputErrors?: InputErrorsT;
};
type NoErrorActionStateT = {
  error: false;
  message: 'Success';
  data: {
    strapiToken: string;
  };
};
type InitialActionStateT = {
  error: false;
};
export type ChangePasswordActionStateT =
  | ErrorActionStateT
  | NoErrorActionStateT
  | InitialActionStateT;