type InputErrorsT = {
  email?: string[];
};

type ErrorFormStateT = {
  error: true;
  message: string;
  inputErrors?: InputErrorsT;
};

export type NoErrorFormStateT = {
  error: false;
  message?: string;
};

export type RequestPasswordResetFormStateT =
  | NoErrorFormStateT
  | ErrorFormStateT;
