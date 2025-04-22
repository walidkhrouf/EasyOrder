export interface Commande {
  id?: number;
  clientId: number;
  produitIds: number[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  total: number;
}
