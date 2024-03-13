"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

interface UtterancesProps {
  id: number;
  text: string;
}

export const UtteranceList = ({
  utterancesString,
}: {
  utterancesString: string;
}) => {
  const [utterances, setUtterances] = useState<UtterancesProps[]>([]);

  useEffect(() => {
    if (utterancesString) {
      const utterancesArray = utterancesString.split("|");

      const parsedData = utterancesArray.map((text, index) => ({
        id: index + 1,
        text: text.trim(), // Trim to remove any leading or trailing spaces
      }));

      setUtterances(parsedData);
    }
  }, [utterancesString]);
  return (
    <div className="">
      <h2 className="mb-4 font-semibold text-muted-foreground text-lg">
        List of Utterances
      </h2>
      <UtterancePagination utterances={utterances} itemsPerPage={5} />
    </div>
  );
};

const UtterancePagination = ({
  utterances,
  itemsPerPage,
}: {
  utterances: UtterancesProps[];
  itemsPerPage: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(utterances.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const shownUtterances = utterances.slice(startIndex, endIndex);

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {shownUtterances?.map((utterance) => {
          return (
            <div className="py-3 px-5 border rounded-md" key={utterance.id}>
              <p className="text-sm">{utterance.text}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem
              className="cursor-pointer"
              onClick={() =>
                handlePageChange(
                  currentPage > 1 ? currentPage - 1 : currentPage
                )
              }
            >
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem
              className="cursor-pointer"
              onClick={() =>
                handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : currentPage
                )
              }
            >
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
