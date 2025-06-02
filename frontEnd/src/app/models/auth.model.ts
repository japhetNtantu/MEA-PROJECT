import { Customer } from "./users.model"; // Importe l'interface Customer

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
