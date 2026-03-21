'use client';

import { Modal as AntModal } from 'antd';
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeWidthMap = { sm: 400, md: 560, lg: 720 };

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: Props) {
  return (
    <AntModal
      open={isOpen}
      onCancel={onClose}
      title={title}
      footer={null}
      width={sizeWidthMap[size]}
      destroyOnHidden
      centered
    >
      {children}
    </AntModal>
  );
}
