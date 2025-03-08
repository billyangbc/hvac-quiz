
type InputErrorsT = {
  email?: string[];
};

type ErrorFormStateT = {
  error: true;
  message: string;
  inputErrors?: InputErrorsT;
};

export type InitialFormStateT = {
  error: false;
};

export type ConfirmationNewRequestFormStateT =
  | InitialFormStateT
  | ErrorFormStateT;
