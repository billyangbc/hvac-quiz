import { ImportData } from "@/components/dashboard/ImportData";

const ImportPage = async () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Import Data</h1>
      <ImportData />
    </div>
  );
};

export default ImportPage;
