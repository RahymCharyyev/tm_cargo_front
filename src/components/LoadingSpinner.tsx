import { Spin } from 'antd';

const sizePropMap = { sm: 'small', md: 'medium', lg: 'large' } as const;

export default function LoadingSpinner({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className='flex items-center justify-center py-12'>
      <Spin size={sizePropMap[size]} />
    </div>
  );
}
