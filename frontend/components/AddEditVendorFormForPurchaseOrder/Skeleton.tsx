const AddEditProductFormSkeleton = () => (
    <div className="animate-pulse flex flex-col gap-4">
        {[0, 0, 0, 0, 0, 0].map((_, index) => (
            <div key={`skeleton-${index}`}>
                <div className="h-5 w-28 bg-slate-200 rounded col-span-2 mb-2" />
                <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
            </div>
        ))}
    </div>
)

export default AddEditProductFormSkeleton
