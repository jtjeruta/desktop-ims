const AddEditProductFormSkeleton = () => (
    <div className="animate-pulse flex flex-col gap-4">
        <div>
            <div className="h-6 w-28 bg-slate-200 rounded col-span-2 mb-2" />
            <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
        </div>
        <div className="flex gap-4">
            <div className="grow">
                <div className="h-6 w-20 bg-slate-200 rounded col-span-2 mb-2" />
                <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
            </div>
            <div className="grow">
                <div className="h-6 w-24 bg-slate-200 rounded col-span-2 mb-2" />
                <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
            </div>
        </div>
        <div className="flex gap-4">
            <div className="grow">
                <div className="h-6 w-32 bg-slate-200 rounded col-span-2 mb-2" />
                <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
            </div>
            <div className="grow">
                <div className="h-6 w-36 bg-slate-200 rounded col-span-2 mb-2" />
                <div className="h-8 w-full bg-slate-200 rounded col-span-2" />
            </div>
        </div>
        <div className="flex justify-end">
            <div className="h-8 w-28 bg-slate-200 rounded col-span-2" />
        </div>
    </div>
)

export default AddEditProductFormSkeleton
