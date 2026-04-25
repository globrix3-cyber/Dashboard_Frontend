import { PackageSearch } from 'lucide-react';

export default function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your search or filters.",
  icon: Icon = PackageSearch,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
        <Icon size={48} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}