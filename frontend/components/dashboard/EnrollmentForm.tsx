'use client';

import { useEffect, useState } from "react";
import { useActionState } from "react";
import useModalStore from "@/hooks/useModalStore";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { StrapiErrors } from "@/components/custom/StrapiErrors";
import { createEnrollment, updateEnrollment, getLearners, connect } from "@/lib/actions/enrollment-actions";
import { getCategories } from "@/lib/actions/category-actions";
import { Enrollment, Learner, EnrollmentCategory } from "@/types/dashboard/Enrollment";
import { Search } from "lucide-react";

interface EnrollmentFormProps {
  enrollment?: Enrollment;
  onSuccess?: () => Promise<void>;
}

export const EnrollmentForm = ({ enrollment, onSuccess }: EnrollmentFormProps) => {
  const action = enrollment ? updateEnrollment : createEnrollment;
  const [state, formAction, isPending] = useActionState(action, null);
  
  const [learners, setLearners] = useState<Learner[]>([]);
  const [categories, setCategories] = useState<EnrollmentCategory[]>([]);
  const [learnerSearch, setLearnerSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (enrollment) {
          // Load learners
          const learnersData = await getLearners();
          setLearners(learnersData?? []);
          
          // Load categories
          const categoriesData = await getCategories();
          setCategories(categoriesData?.data || []);
        }
        
        // Initialization for edit mode (if needed)
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, [enrollment]);
  
  // Filter learners based on search
  const filteredLearners = learners.filter(learner => 
    learner.username.toLowerCase().includes(learnerSearch.toLowerCase())
  );
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
  );
  
  // Handle real-time connection changes
  const handleConnect = async (
    documentId: string,
    isChecked: boolean,
    fieldType: 'learners' | 'categories'
  ) => {
    if (!enrollment?.documentId) return;
    
    try {
      await connect({
        enrollmentId: enrollment.documentId,
        connectType: isChecked ? 'connect' : 'disconnect',
        connectField: fieldType,
        connectIds: [documentId]
      });
      onSuccess?.();
    } catch (error) {
      console.error(`Error ${isChecked ? 'connecting' : 'disconnecting'} ${fieldType}:`, error);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {enrollment ? "Edit Enrollment" : "Create New Enrollment"}
      </h2>
      
      <form action={formAction} className="space-y-6">
        {/* Hidden field for document ID when editing */}
        {enrollment && (
          <input type="hidden" name="id" value={enrollment.documentId} />
        )}
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <Input
              name="name"
              placeholder="Enrollment Name"
              defaultValue={enrollment?.name || ""}
              required
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Input
              name="description"
              placeholder="Description (optional)"
              defaultValue={enrollment?.description || ""}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Error Display */}
        {state?.apiErrors && <StrapiErrors error={state.apiErrors} />}

        {/* Submit Button - Right aligned with top margin */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
          >
            {isPending
              ? `${enrollment ? 'Updating...' : 'Creating...'}`
              : `${enrollment ? 'Update' : 'Create'} Enrollment`}
          </Button>
          {enrollment && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => useModalStore.setState({
                isOpen: true,
                type: 'deleteConfirmation',
                additionalData: {
                  delete: {
                    documentId: enrollment.documentId,
                    target: 'enrollment'
                  }
                }
              })}
            >
              Delete
            </Button>
          )}
        </div>
      </form>

      {enrollment && (
        <>
          {/* Categories Selection - Added top margin */}
          <div className="space-y-3 mt-6">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              Select Categories
            </h3>
            
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            {/* Categories list */}
            <Card className="p-3 max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                <ul className="space-y-2">
                  {filteredCategories.map((category) => (
                    <li key={category.documentId} className="flex items-center space-x-3">
                      <Checkbox
                        id={`category-${category.documentId}`}
                        checked={enrollment?.categories.some(c => c.documentId === category.documentId)}
                        onCheckedChange={(checked) => handleConnect(category.documentId, !!checked, 'categories')}
                      />
                      <label
                        htmlFor={`category-${category.documentId}`}
                        className="text-sm cursor-pointer"
                      >
                        {category.categoryName}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  No categories found
                </p>
              )}
            </Card>
          </div>
          
          {/* Learners Selection - Added top margin */}
          <div className="space-y-3 mt-6">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              Select Learners
            </h3>
            
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search learners..."
                value={learnerSearch}
                onChange={(e) => setLearnerSearch(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            {/* Learners list */}
            <Card className="p-3 max-h-60 overflow-y-auto">
              {filteredLearners.length > 0 ? (
                <ul className="space-y-2">
                  {filteredLearners.map((learner) => (
                    <li key={learner.documentId} className="flex items-center space-x-3">
                      <Checkbox
                        id={`learner-${learner.documentId}`}
                        checked={enrollment?.learners.some(l => l.documentId === learner.documentId)}
                        onCheckedChange={(checked) => handleConnect(learner.documentId, !!checked, 'learners')}
                      />
                      <label
                        htmlFor={`learner-${learner.documentId}`}
                        className="text-sm cursor-pointer"
                      >
                        {learner.username}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  No learners found
                </p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
