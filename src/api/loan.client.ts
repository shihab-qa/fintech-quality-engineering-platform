import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { CreateLoanRequest, LoanApplication, LoanStatus, LoginResponse } from '../contracts/loan.contract.js';

export class LoanClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post('/api/auth/login', { data: { email, password } });
    await expect(response, 'Authentication should succeed').toBeOK();
    const body = (await response.json()) as LoginResponse;
    this.token = body.token;
    return body;
  }

  async create(payload: CreateLoanRequest): Promise<{ response: APIResponse; body: unknown }> {
    const response = await this.request.post('/api/loans', {
      data: payload,
      headers: this.authHeaders()
    });
    return { response, body: await response.json() };
  }

  async list(): Promise<{ response: APIResponse; body: unknown }> {
    const response = await this.request.get('/api/loans', { headers: this.authHeaders() });
    return { response, body: await response.json() };
  }

  async get(id: string): Promise<{ response: APIResponse; body: LoanApplication }> {
    const response = await this.request.get(`/api/loans/${id}`, { headers: this.authHeaders() });
    const body = (await response.json()) as LoanApplication;
    return { response, body };
  }

  async transition(id: string, status: LoanStatus): Promise<{ response: APIResponse; body: unknown }> {
    const response = await this.request.patch(`/api/loans/${id}/status`, {
      data: { status },
      headers: this.authHeaders()
    });
    return { response, body: await response.json() };
  }

  async remove(id: string): Promise<APIResponse> {
    return this.request.delete(`/api/loans/${id}`, { headers: this.authHeaders() });
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('LoanClient is not authenticated. Call login() first.');
    }
    return { Authorization: `Bearer ${this.token}` };
  }
}
