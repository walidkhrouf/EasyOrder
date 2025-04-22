export interface Livraison {
  id?: number;
  commandeId: number;
  adresseLivraison: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}
