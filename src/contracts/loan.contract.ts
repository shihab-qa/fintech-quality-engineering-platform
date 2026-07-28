import { Ajv, type JSONSchemaType } from "ajv";

export type LoanStatus =
  "Draft" | "Submitted" | "Approved" | "Rejected" | "Disbursed";

export interface LoanApplication {
  id: string;
  applicantName: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanRequest {
  applicantName: string;
  amount: number;
  termMonths: number;
  purpose: string;
}

export interface LoanListResponse {
  items: LoanApplication[];
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

const loanSchema: JSONSchemaType<LoanApplication> = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "applicantName",
    "amount",
    "termMonths",
    "purpose",
    "status",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: {
      type: "string",
      minLength: 1,
    },
    applicantName: {
      type: "string",
      minLength: 2,
    },
    amount: {
      type: "number",
      exclusiveMinimum: 0,
    },
    termMonths: {
      type: "integer",
      minimum: 1,
      maximum: 60,
    },
    purpose: {
      type: "string",
      minLength: 2,
    },
    status: {
      type: "string",
      enum: ["Draft", "Submitted", "Approved", "Rejected", "Disbursed"],
    },
    createdAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
  },
};

const loanListSchema: JSONSchemaType<LoanListResponse> = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: loanSchema,
    },
  },
};

const loginSchema: JSONSchemaType<LoginResponse> = {
  type: "object",
  additionalProperties: false,
  required: ["token", "user"],
  properties: {
    token: {
      type: "string",
      minLength: 10,
    },
    user: {
      type: "object",
      additionalProperties: false,
      required: ["email", "role"],
      properties: {
        email: {
          type: "string",
          minLength: 3,
        },
        role: {
          type: "string",
          minLength: 2,
        },
      },
    },
  },
};

const ajv = new Ajv({
  allErrors: true,
});

const validateLoan = ajv.compile(loanSchema);
const validateLoanList = ajv.compile(loanListSchema);
const validateLogin = ajv.compile(loginSchema);

function assertContract<T>(
  validator: ((data: unknown) => boolean) & {
    errors?: unknown;
  },
  data: unknown,
  name: string,
): asserts data is T {
  if (!validator(data)) {
    throw new Error(
      `${name} contract mismatch: ${JSON.stringify(validator.errors, null, 2)}`,
    );
  }
}

export function assertLoanContract(
  data: unknown,
): asserts data is LoanApplication {
  assertContract<LoanApplication>(validateLoan, data, "LoanApplication");
}

export function assertLoanListContract(
  data: unknown,
): asserts data is LoanListResponse {
  assertContract<LoanListResponse>(validateLoanList, data, "LoanListResponse");
}

export function assertLoginContract(
  data: unknown,
): asserts data is LoginResponse {
  assertContract<LoginResponse>(validateLogin, data, "LoginResponse");
}
