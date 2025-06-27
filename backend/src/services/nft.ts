export function generateMetadata(
  name: string,
  description: string,
  imageUrl: string,
) {
  return {
    name,
    description,
    image: imageUrl,
    attributes: [
      {
        trait_type: "Dynamic Name",
        value: name,
      },
      {
        trait_type: "Generated",
        value: new Date().toISOString(),
      },
    ],
  };
}