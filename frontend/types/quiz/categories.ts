export interface CategoryFormValues {
  id?: string;
  categoryName: string;
  description: string;
}

export interface Category {
  id: number;
  documentId: string;
  categoryName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
