import { dataCMC } from "@/data/cmc.data";

export const useCryptoToken = () => {
  const data = dataCMC;

  return { data, isLoading: false };
};
