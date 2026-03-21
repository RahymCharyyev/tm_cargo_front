'use client';

import { Pagination as AntPagination } from 'antd';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export default function Pagination({ page, totalPages, onPageChange, pageSize = 1 }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <AntPagination
        current={page}
        total={totalPages * pageSize}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  );
}
