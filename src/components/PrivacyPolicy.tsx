const PrivacyPolicyPage = () => {
  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Website Privacy Policy</h1>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>1. Introduction</h2>
        <p>
          This page is committed to ensuring the protection of personal
          information of users of tm-cargo.com.tm. The Privacy Policy explains
          how user data is collected, used, and protected.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>2. Data Collection</h2>
        <p>When you visit our website, the following data may be collected:</p>
        <ul className='list-disc pl-6'>
          <li>
            First name, last name, and possibly other personal information
          </li>
          <li>Email address and phone numbers</li>
          <li>
            IP addresses, browser type, and information about your visit time
          </li>
          <li>Usage statistics to improve the performance of our system</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>3. Use of Data</h2>
        <p>Collected data is used for the following purposes:</p>
        <ul className='list-disc pl-6'>
          <li>Improving the services of the website</li>
          <li>Responding to user questions and suggestions</li>
          <li>Informing about updates or subscription services</li>
          <li>Ensuring security and system stability</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          4. Sharing of Data with Third Parties
        </h2>
        <p>
          We do not share users’ personal data with third parties. However, data
          may be shared in the following cases:
        </p>
        <ul className='list-disc pl-6'>
          <li>Due to legal requirements</li>
          <li>With the user’s consent</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>5. Data Security</h2>
        <p>
          We use modern technologies and policies to protect users’ data. All
          necessary precautions are taken to prevent unauthorized use or
          deletion of data.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>6. User Rights</h2>
        <p>Users have the right to:</p>
        <ul className='list-disc pl-6'>
          <li>View their data</li>
          <li>Edit or correct it</li>
          <li>Delete or restrict it</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          7. Changes to the Privacy Policy
        </h2>
        <p>
          This policy may be updated from time to time. Users will be informed
          about the updated policy on our website.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>8. Contact</h2>
        <p>
          If you have any questions or suggestions regarding the Privacy Policy,
          you can contact us through the following contact information:
        </p>
        <ul className='list-disc pl-6'>
          <li>
            <strong>Email:</strong> tm-cargo@sanly.tm
          </li>
          <li>
            <strong>Phone:</strong> +993 65 55 21 13
          </li>
        </ul>
      </section>

      <p>
        We do our best to ensure the protection of our users' personal data!
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
