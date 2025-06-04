export interface Customer {
    id?: string;
    username: string;
    name?: string; 
    firstname?: string;
    phone: string;
    address: string;
    password?: string;
    is_superuser?: boolean; 
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
  }