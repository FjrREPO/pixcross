import BorrowingPoolComponent from "./_components/borrowing-pool-component";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: PageProps) => {
  const { slug } = await props.params;
  const [id, chainIdStr] = slug.split("_");
  const chainId = Number(chainIdStr);

  return <BorrowingPoolComponent chainId={chainId as ChainSupported} id={id} />;
};

export default Page;
