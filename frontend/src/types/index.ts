// Types para as entidades
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataCadastro: string;
  perfis: Perfil[];
}

export interface Perfil {
  id: number;
  nome: string;
}

export interface Local {
  id: number;
  usuarioId: number;
  nomeLocal: string;
  endereco: string;
  cep: string;
  dataCadastro: string;
}

export interface Medidor {
  id: number;
  localId: number;
  codigoMedidor: string;
  modelo: string;
  dataInstalacao: string;
  status: 'ATIVO' | 'INATIVO' | 'MANUTENCAO';
  ultimaLeitura?: number;
}

export interface Leitura {
  id: number;
  medidorId: number;
  valorLeitura: number;
  dataHoraLeitura: string;
  fotoLeitura?: string;
}

export interface Alerta {
  id: number;
  medidorId: number;
  tipoAlerta: 'CONSUMO_ALTO' | 'VAZAMENTO' | 'MEDIDOR_INATIVO' | 'OUTRO';
  descricao: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDO' | 'IGNORADO';
  dataHoraCriacao: string;
  dataHoraResolucao?: string;
}

// Request types
export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  perfis: string[];
}

export interface UsuarioUpdateRequest {
  nome: string;
  email: string;
  telefone?: string;
  perfis: string[];
}

export interface LocalRequest {
  usuarioId: number;
  nomeLocal: string;
  endereco: string;
  cep: string;
}

export interface MedidorRequest {
  localId: number;
  codigoMedidor: string;
  modelo: string;
  dataInstalacao: string;
  status?: 'ATIVO' | 'INATIVO' | 'MANUTENCAO';
}

export interface LeituraRequest {
  medidorId: number;
  valorLeitura: number;
  fotoLeitura?: string;
}

export interface AlertaRequest {
  medidorId: number;
  tipoAlerta: 'CONSUMO_ALTO' | 'VAZAMENTO' | 'MEDIDOR_INATIVO' | 'OUTRO';
  descricao: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDO' | 'IGNORADO';
}

// Auth types
export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthUser {
  usuario: Usuario;
  credentials: string;
}
