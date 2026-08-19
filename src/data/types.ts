export interface Color {
  name: string;
  hex: string;
}

export type StockStatusKey = 'extruyendo' | 'listo' | 'pedido';

export interface Product {
  id: string;
  name: string;
  cat: string;
  price: number;
  g: number;
  mat: string;
  desc: string;
  mpLink: string | null;
  status: StockStatusKey;
  imgs?: string[];
}

export interface PrintJob {
  name: string;
  progress: number;
}
