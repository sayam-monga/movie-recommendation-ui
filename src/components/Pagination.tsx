
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${
            currentPage === i 
              ? 'bg-primaryAccent text-foreground' 
              : 'bg-input text-foreground hover:bg-buttonHover'
          } w-10 h-10 rounded-full flex items-center justify-center`}
        >
          {i}
        </Button>
      );
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="bg-input text-foreground hover:bg-buttonHover disabled:opacity-50"
      >
        Previous
      </Button>
      
      <div className="flex space-x-2">
        {renderPageNumbers()}
      </div>
      
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="bg-input text-foreground hover:bg-buttonHover disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
