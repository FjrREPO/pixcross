// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Helper {
    // Supported Networks
    enum SupportedNetworks {
        ETHEREUM_SEPOLIA, // 0
        BASE_SEPOLIA, // 1
        ARBITRUM_SEPOLIA, // 2
        AVALANCHE_FUJI // 3
    }

    mapping(SupportedNetworks enumValue => string humanReadableName)
        public networks;

    enum PayFeesIn {
        Native,
        LINK
    }

    // Chain IDs
    uint64 constant chainIdEthereumSepolia = 16015286601757825753;
    uint64 constant chainIdBaseSepolia = 10344971235874465080;
    uint64 constant chainIdArbitrumSepolia = 3478487238524512106;
    uint64 constant chainIdAvalancheFuji = 14767482510784806043;

    // Router addresses
    address constant routerEthereumSepolia =
        0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address constant routerBaseSepolia =
        0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
    address constant routerArbitrumSepolia =
        0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165;
    address constant routerAvalancheFuji =
        0xF694E193200268f9a4868e4Aa017A0118C9a8177;

    // Link addresses (can be used as fee)
    address constant linkEthereumSepolia =
        0x779877A7B0D9E8603169DdbD7836e478b4624789;
    address constant linkBaseSepolia =
        0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
    address constant linkArbitrumSepolia =
        0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;
    address constant linkAvalancheFuji =
        0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;

    // Wrapped native addresses
    address constant wethEthereumSepolia =
        0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534;
    address constant wethBaseSepolia =
        0x4200000000000000000000000000000000000006;
    address constant wethArbitrumSepolia =
        0xE591bf0A0CF924A0674d7792db046B23CEbF5f34;
    address constant wavaxAvalancheFuji =
        0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

    // CCIP-BnM addresses
    address constant ccipBnMEthereumSepolia =
        0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05;
    address constant ccipBnMBaseSepolia =
        0x88A2d74F47a237a62e7A51cdDa67270CE381555e;
    address constant ccipBnMArbitrumSepolia =
        0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D;
    address constant ccipBnMAvalancheFuji =
        0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4;

    // CCIP-LnM addresses
    address constant ccipLnMEthereumSepolia =
        0x466D489b6d36E7E3b824ef491C225F5830E81cC1;
    address constant clCcipLnMBaseSepolia =
        0xA98FA8A008371b9408195e52734b1768c0d1Cb5c;
    address constant clCcipLnMArbitrumSepolia =
        0x139E99f0ab4084E14e6bb7DacA289a91a2d92927;
    address constant clCcipLnMAvalancheFuji =
        0x70F5c5C40b873EA597776DA2C21929A8282A3b35;

    // USDC addresses
    address constant usdcEthereumSepolia =
        0x854edF78e05Cd554CE538DA198Ce31807F2Cb7CF;
    address constant usdcBaseSepolia =
        0xD353131F4802046eF0f57FE362c64e641Be003Ad;
    address constant usdcArbitrumSepolia =
        0x82A7176a7601764af75CC863640544f4B0ba8e43;
    address constant usdcAvalancheFuji =
        0xC231246DB86C897B1A8DaB35bA2A834F4bC6191c;

    // USDT addresses
    address constant usdtEthereumSepolia =
        0x839206B60a48Ea38F6a1B2FeD93c10194625761E;
    address constant usdtBaseSepolia =
        0x961b6e3a9D14885EBA423a36EA7627Ed4cb20CE1;
    address constant usdtArbitrumSepolia =
        0x8De8B197B46124Efbbefb798005432206F4Fe7BF;
    address constant usdtAvalancheFuji =
        0xC9ca7BeBfBf3E53a8aE36E2e93390a2E6A5dAF4C;

    // IDRX addresses
    address constant idrxEthereumSepolia =
        0x5514991174EB584aA3c057309051E0eCA85E4Ac7;
    address constant idrxBaseSepolia =
        0xcab958b9Af92E8d7fE3f64AdBDea9ccF0bDf75a9;
    address constant idrxArbitrumSepolia =
        0xd15aCcad19004E2A5146B88837e307f20AaC1A0e;
    address constant idrxAvalancheFuji =
        0xCdB252804f39819AB40854EA380bCC339a040B15;

    // GHO Addresses
    address constant ghoEthereumSepolia =
        0xc4bF5CbDaBE595361438F8c6a187bDc330539c60;
    address constant ghoArbitrumSepolia =
        0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810;

    // Mock IPs for Ethereum Sepolia
    address constant mockIP1EthereumSepolia =
        0xc4e0C81ed27f7a4925E6F6ebbDB402A3C7b06842; // BAYC
    address constant mockIP2EthereumSepolia =
        0xC1C957794506eabF394df2D68a3ED1A426E03879; // PUDGY
    address constant mockIP3EthereumSepolia =
        0x183a07Df529873a4e566a41b8653BEd15797A1A4; // AZUKI
    address constant mockIP4EthereumSepolia =
        0x04C3663CB079eDD29CD9eC85Dd7924962cd16B82; // COOL
    address constant mockIP5EthereumSepolia =
        0x75C097F635E7486D9Ad7b380d6B3A857227b1a31; // PUNK
    address constant mockIP6EthereumSepolia =
        0xA2bf2174cAf2fDf40bc15Db138B1fEE0A1754270; // DOODLE
    address constant mockIP7EthereumSepolia =
        0xFD92b28Cd1bc085778831347F36B4306B9877daa; // LION
    address constant mockIP8EthereumSepolia =
        0xfeFFb16FCE6D3a0b03744120716A9BCDa421D7d3; // LILPUDGY
    address constant mockIP9EthereumSepolia =
        0x4837a87905979341e9BeFd8Fa2D67D8d88c52798; // MAYC
    address constant mockIP10EthereumSepolia =
        0x2949482Ec50E357878f231417DB3C45c3414Ccbe; // MILADY
    address constant mockIP11EthereumSepolia =
        0xDeDFb69a66308Cf19B99aBfD63bcAF44f8A8EF66; // MOCA
    address constant mockIP12EthereumSepolia =
        0xC7001929236133A5013a0D10669108db32f61Ce1; // MOON

    // Mock IPs for Base Sepolia
    address constant mockIP1BaseSepolia =
        0xDccA145bA149Ae37c2898cA4cB4a7b2D159347a8; // BAYC
    address constant mockIP2BaseSepolia =
        0x43Be5bDAb5E969185668a76442550056EE25cdfB; // PUDGY
    address constant mockIP3BaseSepolia =
        0x85C924C8A2FE699476189F88c20261A30CD959c3; // AZUKI
    address constant mockIP4BaseSepolia =
        0x2bCC8d029d054e5deCE9BE2629c81387BBC966a4; // COOL
    address constant mockIP5BaseSepolia =
        0xEa01d81e0839892c169757dF23da673FC3625E14; // PUNK
    address constant mockIP6BaseSepolia =
        0x309B6C2B5d7615dC27Ab96ED05fA9a5Ee46AC2c6; // DOODLE
    address constant mockIP7BaseSepolia =
        0x20230867df780114fAcfD5723054Cf64a8951313; // LION
    address constant mockIP8BaseSepolia =
        0xa1A2056bdc204912dfbfFeE317f700CA583f4F2B; // LILPUDGY
    address constant mockIP9BaseSepolia =
        0xCBA2378a2FA0D975eFAC906c11F26b388Cc2E859; // MAYC
    address constant mockIP10BaseSepolia =
        0x79F362aD01091BFc68f56fE6284dF7248C294A9d; // MILADY
    address constant mockIP11BaseSepolia =
        0xe3ec0a3A44aBC2176B1E71549b94f2Ba245574Bc; // MOCA
    address constant mockIP12BaseSepolia =
        0x8c948E2E351dE8880BF6C0B6d978AD5e9f91C98A; // MOON

    // Mock IPs for Arbitrum Sepolia
    address constant mockIP1ArbitrumSepolia =
        0x967E923939ED3281521e6aF6E9cA8Da547C3c62D; // BAYC
    address constant mockIP2ArbitrumSepolia =
        0xcC59E78D63bCc4716833eE6fd5Ac74C108Cacb91; // PUDGY
    address constant mockIP3ArbitrumSepolia =
        0xa5c9a5f2e26e3E6cf114b1E967717c0024CBeD69; // AZUKI
    address constant mockIP4ArbitrumSepolia =
        0xcb7Bc0e2c93f1D9Ad414c938e469d92054187844; // COOL
    address constant mockIP5ArbitrumSepolia =
        0xc1B94C8E802f695013eEFACe3155164C4722EAB2; // PUNK
    address constant mockIP6ArbitrumSepolia =
        0x6F0Cb67b2a0329b7308C6F4ab6e13bE64322dF63; // DOODLE
    address constant mockIP7ArbitrumSepolia =
        0x2F55f94aA2F1E052602F860373EeE33d97E16A05; // LION
    address constant mockIP8ArbitrumSepolia =
        0x9a08C1457D7C757aA220AA571e03a77912ec17a9; // LILPUDGY
    address constant mockIP9ArbitrumSepolia =
        0x882D461d92017152A72F5544DdDc82660D79f76d; // MAYC
    address constant mockIP10ArbitrumSepolia =
        0x111209Bf0053F9379fb1fD6C648995C6DE69Ba2c; // MILADY
    address constant mockIP11ArbitrumSepolia =
        0x4215A03498789Ba2AEe1a2860C50F5A617B2CAEa; // MOCA
    address constant mockIP12ArbitrumSepolia =
        0x1AF49981e81022CFFa0e96b9e716041937771c53; // MOON

    // Mock IPs for Avalanche Fuji
    address constant mockIP1AvalancheFuji =
        0x9584BABbee197890C138116a0DD7b415e90C75d1; // BAYC
    address constant mockIP2AvalancheFuji =
        0x5F42fD0714D1fE8cc867E5Bd448F12eAbF8103f8; // PUDGY
    address constant mockIP3AvalancheFuji =
        0x939043Ef17087D304E9908eAc216Ce9229C6ed41; // AZUKI
    address constant mockIP4AvalancheFuji =
        0xe528677EBAf24978358D81174d2d9A2d84DC7a9C; // COOL
    address constant mockIP5AvalancheFuji =
        0x20dF187d9Ea257bfb533823A47d7Da66eE445794; // PUNK
    address constant mockIP6AvalancheFuji =
        0xaB78381501178965d50Bc9D13499fe441fd4A383; // DOODLE
    address constant mockIP7AvalancheFuji =
        0xDf1a89d11B8Fd8F518c29633984AC97BF691EEb2; // LION
    address constant mockIP8AvalancheFuji =
        0x2ac1Ce4B7082e92BDe95685F8755f9329525a84A; // LILPUDGY
    address constant mockIP9AvalancheFuji =
        0x73530692d0C151465e25C1c5A3e345BcB4d45f83; // MAYC
    address constant mockIP10AvalancheFuji =
        0xDa199Ca713b9b12337074f85c609149A01F34f47; // MILADY
    address constant mockIP11AvalancheFuji =
        0xE9397c5ca839d258602Ec9DCA54e213C385907bd; // MOCA
    address constant mockIP12AvalancheFuji =
        0x5Ffa408b32337CC3Fb96b9fEddCDac0F129F8856; // MOON

    constructor() {
        networks[SupportedNetworks.ETHEREUM_SEPOLIA] = "Ethereum Sepolia";
        networks[SupportedNetworks.AVALANCHE_FUJI] = "Avalanche Fuji";
        networks[SupportedNetworks.ARBITRUM_SEPOLIA] = "Arbitrum Sepolia";
        networks[SupportedNetworks.BASE_SEPOLIA] = "Base Sepolia";
    }

    function getDummyTokensFromNetwork(
        SupportedNetworks network
    ) internal pure returns (address ccipBnM, address ccipLnM) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return (ccipBnMEthereumSepolia, ccipLnMEthereumSepolia);
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return (ccipBnMArbitrumSepolia, clCcipLnMArbitrumSepolia);
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return (ccipBnMAvalancheFuji, clCcipLnMAvalancheFuji);
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return (ccipBnMBaseSepolia, clCcipLnMBaseSepolia);
        }
    }

    function getDummyCCIPBnMFromNetwork(
        SupportedNetworks network
    ) internal pure returns (address ccipBnM) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return ccipBnMEthereumSepolia;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return ccipBnMBaseSepolia;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return ccipBnMArbitrumSepolia;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return ccipBnMAvalancheFuji;
        }
    }

    function getDummyUSDCFromNetwork(
        SupportedNetworks network
    ) internal pure returns (address usdc) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return usdcEthereumSepolia;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return usdcBaseSepolia;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return usdcArbitrumSepolia;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return usdcAvalancheFuji;
        }
    }

    function getDummyUSDTFromNetwork(
        SupportedNetworks network
    ) internal pure returns (address usdt) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return usdtEthereumSepolia;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return usdtBaseSepolia;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return usdtArbitrumSepolia;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return usdtAvalancheFuji;
        }
    }

    function getDummyIDRXFromNetwork(
        SupportedNetworks network
    ) internal pure returns (address idrx) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return idrxEthereumSepolia;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return idrxBaseSepolia;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return idrxArbitrumSepolia;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return idrxAvalancheFuji;
        }
    }

    function getDummyIPFromNetwork(
        SupportedNetworks network,
        uint256 index
    ) internal pure returns (address mockIP) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            if (index == 1) return mockIP1EthereumSepolia;
            else if (index == 2) return mockIP2EthereumSepolia;
            else if (index == 3) return mockIP3EthereumSepolia;
            else if (index == 4) return mockIP4EthereumSepolia;
            else if (index == 5) return mockIP5EthereumSepolia;
            else if (index == 6) return mockIP6EthereumSepolia;
            else if (index == 7) return mockIP7EthereumSepolia;
            else if (index == 8) return mockIP8EthereumSepolia;
            else if (index == 9) return mockIP9EthereumSepolia;
            else if (index == 10) return mockIP10EthereumSepolia;
            else if (index == 11) return mockIP11EthereumSepolia;
            else if (index == 12) return mockIP12EthereumSepolia;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            if (index == 1) return mockIP1BaseSepolia;
            else if (index == 2) return mockIP2BaseSepolia;
            else if (index == 3) return mockIP3BaseSepolia;
            else if (index == 4) return mockIP4BaseSepolia;
            else if (index == 5) return mockIP5BaseSepolia;
            else if (index == 6) return mockIP6BaseSepolia;
            else if (index == 7) return mockIP7BaseSepolia;
            else if (index == 8) return mockIP8BaseSepolia;
            else if (index == 9) return mockIP9BaseSepolia;
            else if (index == 10) return mockIP10BaseSepolia;
            else if (index == 11) return mockIP11BaseSepolia;
            else if (index == 12) return mockIP12BaseSepolia;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            if (index == 1) return mockIP1ArbitrumSepolia;
            else if (index == 2) return mockIP2ArbitrumSepolia;
            else if (index == 3) return mockIP3ArbitrumSepolia;
            else if (index == 4) return mockIP4ArbitrumSepolia;
            else if (index == 5) return mockIP5ArbitrumSepolia;
            else if (index == 6) return mockIP6ArbitrumSepolia;
            else if (index == 7) return mockIP7ArbitrumSepolia;
            else if (index == 8) return mockIP8ArbitrumSepolia;
            else if (index == 9) return mockIP9ArbitrumSepolia;
            else if (index == 10) return mockIP10ArbitrumSepolia;
            else if (index == 11) return mockIP11ArbitrumSepolia;
            else if (index == 12) return mockIP12ArbitrumSepolia;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            if (index == 1) return mockIP1AvalancheFuji;
            else if (index == 2) return mockIP2AvalancheFuji;
            else if (index == 3) return mockIP3AvalancheFuji;
            else if (index == 4) return mockIP4AvalancheFuji;
            else if (index == 5) return mockIP5AvalancheFuji;
            else if (index == 6) return mockIP6AvalancheFuji;
            else if (index == 7) return mockIP7AvalancheFuji;
            else if (index == 8) return mockIP8AvalancheFuji;
            else if (index == 9) return mockIP9AvalancheFuji;
            else if (index == 10) return mockIP10AvalancheFuji;
            else if (index == 11) return mockIP11AvalancheFuji;
            else if (index == 12) return mockIP12AvalancheFuji;
        }
    }

    function getConfigFromNetwork(
        SupportedNetworks network
    )
        internal
        pure
        returns (
            address router,
            address linkToken,
            address wrappedNative,
            uint64 chainId
        )
    {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return (
                routerEthereumSepolia,
                linkEthereumSepolia,
                wethEthereumSepolia,
                chainIdEthereumSepolia
            );
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return (
                routerArbitrumSepolia,
                linkArbitrumSepolia,
                wethArbitrumSepolia,
                chainIdArbitrumSepolia
            );
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return (
                routerAvalancheFuji,
                linkAvalancheFuji,
                wavaxAvalancheFuji,
                chainIdAvalancheFuji
            );
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return (
                routerBaseSepolia,
                linkBaseSepolia,
                wethBaseSepolia,
                chainIdBaseSepolia
            );
        }
    }
}
