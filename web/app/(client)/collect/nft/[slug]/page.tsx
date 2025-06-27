import MainComponent from "./_components/main-component";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: PageProps) => {
  const { slug } = await props.params;
  const [contractAddress, chainIdStr] = slug.split("_");
  const chainId = Number(chainIdStr);

  return (
    <MainComponent
      chainId={chainId as ChainSupported}
      contractAddress={contractAddress}
    />
  );
};

export default Page;
