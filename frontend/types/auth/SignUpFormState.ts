type InputErrorsT = {
  username?: string[];
  email?: string[];
  password?: string[];
};

type SignUpFormErrorStateT = {
  error: true;
  message: string;
  inputErrors?: InputErrorsT;
};

export type SignUpFormInitialStateT = {
  error: false;
};

export type SignUpFormStateT = SignUpFormInitialStateT | SignUpFormErrorStateT;
