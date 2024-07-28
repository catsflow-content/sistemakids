import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="_row">
      <button title="Retornar para a página anterior" className="_btn min" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <CaretLeft className="ico" />
      </button>
      <span className="_block">{currentPage} de {totalPages}</span>
      <button title="Avançar para a próxima página" className="_btn min" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <CaretRight className="ico" />
      </button>
    </div>
  );
};

export default Pagination;
