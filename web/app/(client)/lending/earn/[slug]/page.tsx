import LendingEarnComponent from "./_components/lending-earn-component";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: PageProps) => {
  const { slug } = await props.params;
  const [id, chainIdStr] = slug.split("_");
  const chainId = Number(chainIdStr);

  return <LendingEarnComponent chainId={chainId as ChainSupported} id={id} />;
};

export default Page;
