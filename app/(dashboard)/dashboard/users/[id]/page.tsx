const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <h1>Users details page</h1>
      <h3>userid : {id}</h3>
    </div>
  );
};

export default Page;
