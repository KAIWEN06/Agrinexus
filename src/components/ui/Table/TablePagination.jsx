import Button from "../Button";

export default function TablePagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={page === 1}
      >
        Previous
      </Button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}