// import Link from "next/link"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface CoursePaginationProps {
//   currentPage: number
//   totalPages: number
//   baseUrl: string
// }

// export function CoursePagination({ currentPage, totalPages, baseUrl }: CoursePaginationProps) {
//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pages = []
//     const maxPagesToShow = 5

//     if (totalPages <= maxPagesToShow) {
//       // Show all pages if total is less than max
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i)
//       }
//     } else {
//       // Always include first page
//       pages.push(1)

//       // Calculate start and end of middle pages
//       let startPage = Math.max(2, currentPage - 1)
//       let endPage = Math.min(totalPages - 1, currentPage + 1)

//       // Adjust if we're near the beginning
//       if (currentPage <= 3) {
//         endPage = 4
//       }

//       // Adjust if we're near the end
//       if (currentPage >= totalPages - 2) {
//         startPage = totalPages - 3
//       }

//       // Add ellipsis after first page if needed
//       if (startPage > 2) {
//         pages.push("ellipsis-start")
//       }

//       // Add middle pages
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i)
//       }

//       // Add ellipsis before last page if needed
//       if (endPage < totalPages - 1) {
//         pages.push("ellipsis-end")
//       }

//       // Always include last page
//       pages.push(totalPages)
//     }

//     return pages
//   }

//   const pageNumbers = getPageNumbers()

//   return (
//     <div className="flex items-center justify-center space-x-1">
//       <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage !== 1}>
//         {currentPage === 1 ? (
//           <span>
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Previous page</span>
//           </span>
//         ) : (
//           <Link href={`${baseUrl}?page=${currentPage - 1}`}>
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Previous page</span>
//           </Link>
//         )}
//       </Button>

//       {pageNumbers.map((page, index) => {
//         if (page === "ellipsis-start" || page === "ellipsis-end") {
//           return (
//             <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
//               ...
//             </span>
//           )
//         }

//         return (
//           <Button
//             key={index}
//             variant={currentPage === page ? "default" : "outline"}
//             size="icon"
//             asChild={currentPage !== page}
//           >
//             {currentPage === page ? <span>{page}</span> : <Link href={`${baseUrl}?page=${page}`}>{page}</Link>}
//           </Button>
//         )
//       })}

//       <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild={currentPage !== totalPages}>
//         {currentPage === totalPages ? (
//           <span>
//             <ChevronRight className="h-4 w-4" />
//             <span className="sr-only">Next page</span>
//           </span>
//         ) : (
//           <Link href={`${baseUrl}?page=${currentPage + 1}`}>
//             <ChevronRight className="h-4 w-4" />
//             <span className="sr-only">Next page</span>
//           </Link>
//         )}
//       </Button>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  courseId: string;
  currentLessonId: string;
}

interface LessonInfo {
  _id: string;
  title: string;
  chapter: {
    _id: string;
    title: string;
  };
}

export function CoursePagination({
  courseId,
  currentLessonId,
}: PaginationProps) {
  const router = useRouter();
  const [prevLesson, setPrevLesson] = useState<LessonInfo | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaginationData();
  }, [courseId, currentLessonId]);

  const fetchPaginationData = async () => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${currentLessonId}/navigation`
      );
      if (!response.ok) throw new Error("Failed to fetch navigation data");
      const data = await response.json();
      setPrevLesson(data.prev);
      setNextLesson(data.next);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-between">
        <Button variant="outline" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" disabled>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        disabled={!prevLesson}
        onClick={() =>
          prevLesson &&
          router.push(`/courses/${courseId}/learn/${prevLesson._id}`)
        }
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {prevLesson ? (
          <span className="flex flex-col items-start text-left">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="line-clamp-1 text-sm">{prevLesson.title}</span>
          </span>
        ) : (
          "Previous"
        )}
      </Button>
      <Button
        variant="outline"
        disabled={!nextLesson}
        onClick={() =>
          nextLesson &&
          router.push(`/courses/${courseId}/learn/${nextLesson._id}`)
        }
      >
        {nextLesson ? (
          <span className="flex flex-col items-end text-right">
            <span className="text-xs text-muted-foreground">Next</span>
            <span className="line-clamp-1 text-sm">{nextLesson.title}</span>
          </span>
        ) : (
          "Next"
        )}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
