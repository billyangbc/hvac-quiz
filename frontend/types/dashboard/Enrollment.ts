export interface Learner {
  documentId: string;
  username: string;
}

export interface EnrollmentCategory {
  documentId: string;
  categoryName: string;
}

export interface Enrollment {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  learners: Learner[];
  categories: EnrollmentCategory[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentFormValues {
  name: string;
  description?: string;
  learners: string[]; // Array of learner documentIds
  categories: string[]; // Array of category documentIds
}
