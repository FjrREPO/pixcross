import ListingComponent from "./_components/listing-component";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: PageProps) => {
  const { slug } = await props.params;
  const [contractAddress, tokenId, chainIdStr] = slug.split("_");
  const chainId = Number(chainIdStr);

  return (
    <ListingComponent
      chainId={chainId as ChainSupported}
      contractAddress={contractAddress}
      tokenId={tokenId}
    />
  );
};

export default Page;
