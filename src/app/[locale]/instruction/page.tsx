/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';

const InstructionPage = () => {
  return (
    <div className='flex flex-col items-center gap-5 p-6 max-w-4xl mx-auto text-center'>
      <h1 className='text-2xl font-bold mb-4'>Remove Your Account</h1>

      <Image
        src='/instruction_1.jpeg'
        alt='instruction 1'
        width={300}
        height={500}
      />

      <p className='text-xl mb-4'>
        Open your profile page and tap the "Delete Account" option.
      </p>

      <Image
        src='/instruction_2.jpeg'
        alt='instruction 2'
        width={300}
        height={500}
      />

      <p className='text-xl mb-4'>
        After that, press the "Confirm" button to complete the process.
      </p>
    </div>
  );
};

export default InstructionPage;
