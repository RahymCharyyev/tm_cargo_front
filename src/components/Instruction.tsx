const InstructionPage = () => {
  return (
    <div className='flex flex-col items-center gap-5 p-6 max-w-4xl mx-auto text-center'>
      <h1 className='text-2xl font-bold mb-4'>Delete Account!</h1>
      <img
        src='/instruction_1.jpeg'
        alt='instruction 1'
        width={300}
        height={500}
      />
      <p className='text-xl mb-4'>
        Go to the profile page and click the "Delete Account" button!
      </p>
      <img
        src='/instruction_2.jpeg'
        alt='instruction 2'
        width={300}
        height={500}
      />
      <p className='text-xl mb-4'>Then click the "Confirm" button!</p>
    </div>
  );
};

export default InstructionPage;
