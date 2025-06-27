// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MockERC721 Token
 * @dev ERC721 token representing intellectual property rights with burn and mint capabilities
 * @notice This token can be bridged across chains using the MockIPBridge contract
 */
contract MockERC721 is
    ERC721URIStorage,
    ERC721Burnable,
    Ownable,
    AccessControl,
    Pausable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    uint256 private _currentTokenId;
    string private _baseTokenURI;
    string private _name;
    string private _symbol;

    // Mapping from token ID to IP metadata
    mapping(uint256 => IPMetadata) public ipMetadata;

    struct IPMetadata {
        string ipType; // "patent", "trademark", "copyright", etc.
        string title;
        string description;
        address creator;
        uint256 creationDate;
        string[] tags;
        bool isActive;
    }

    event IPTokenMinted(
        uint256 indexed tokenId,
        address indexed to,
        string ipType,
        string title
    );
    event IPTokenBurned(uint256 indexed tokenId);
    event IPMetadataUpdated(uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI
    ) ERC721(name_, symbol_) {
        _baseTokenURI = baseTokenURI;
        _name = name_;
        _symbol = symbol_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _currentTokenId = 1; // Start from token ID 1
    }

    /**
     * @dev Mint a new IP token
     * @param to Address to mint the token to
     * @param _tokenURI URI for token metadata
     * @param ipType Type of intellectual property
     * @param title Title of the IP
     * @param description Description of the IP
     * @param tags Array of tags for categorization
     */
    function mintIP(
        address to,
        string memory _tokenURI,
        string memory ipType,
        string memory title,
        string memory description,
        string[] memory tags
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(ipType).length > 0, "IP type cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");

        uint256 tokenId = _currentTokenId;
        _currentTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        ipMetadata[tokenId] = IPMetadata({
            ipType: ipType,
            title: title,
            description: description,
            creator: to,
            creationDate: block.timestamp,
            tags: tags,
            isActive: true
        });

        emit IPTokenMinted(tokenId, to, ipType, title);
        return tokenId;
    }

    /**
     * @dev Public mint IP function for users to mint IP tokens without needing a role
     * @notice This function allows anyone to mint an IP token, but it should be used testnet or development environments only.
     * @param to Address to mint the token to
     * @param _tokenURI URI for token metadata
     * @param ipType Type of intellectual property
     * @param title Title of the IP
     * @param description Description of the IP
     * @param tags Array of tags for categorization
     */
    function publicMintIP(
        address to,
        string memory _tokenURI,
        string memory ipType,
        string memory title,
        string memory description,
        string[] memory tags
    ) external whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(ipType).length > 0, "IP type cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");

        uint256 tokenId = _currentTokenId;
        _currentTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        ipMetadata[tokenId] = IPMetadata({
            ipType: ipType,
            title: title,
            description: description,
            creator: to,
            creationDate: block.timestamp,
            tags: tags,
            isActive: true
        });

        emit IPTokenMinted(tokenId, to, ipType, title);
        return tokenId;
    }

    /**
     * @dev Mint token with specific token ID (for bridge operations)
     * @param to Address to mint the token to
     * @param tokenId Specific token ID to mint
     * @param _tokenURI URI for token metadata
     */
    function mint(
        address to,
        uint256 tokenId,
        string memory _tokenURI
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(!_exists(tokenId), "Token already exists");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    /**
     * @dev Mint token with specific token ID (simplified for bridge)
     */
    function mint(
        address to,
        uint256 tokenId
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(!_exists(tokenId), "Token already exists");

        _safeMint(to, tokenId);
    }

    /**
     * @dev Mint token to address (auto-increment ID)
     */
    function mint(
        address to
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");

        uint256 tokenId = _currentTokenId;
        _currentTokenId++;

        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @dev Public Mint function for users to mint tokens without needing a role
     * @notice This function allows anyone to mint a token, but it should be used testnet or development environments only.
     */
    function publicMint(
        address to
    ) external whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");

        uint256 tokenId = _currentTokenId;
        _currentTokenId++;

        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @dev Burn a token (override to add role check)
     */
    function burn(uint256 tokenId) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId) ||
                hasRole(BURNER_ROLE, _msgSender()),
            "Not authorized to burn"
        );

        if (ipMetadata[tokenId].creator != address(0)) {
            ipMetadata[tokenId].isActive = false;
        }

        super.burn(tokenId);
        emit IPTokenBurned(tokenId);
    }

    /**
     * @dev Update IP metadata (only token owner or admin)
     */
    function updateIPMetadata(
        uint256 tokenId,
        string memory description,
        string[] memory tags
    ) external {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to update metadata"
        );

        ipMetadata[tokenId].description = description;
        ipMetadata[tokenId].tags = tags;

        emit IPMetadataUpdated(tokenId);
    }

    /**
     * @dev Set base URI for tokens
     */
    function setBaseURI(
        string memory baseTokenURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseTokenURI;
        emit BaseURIUpdated(baseTokenURI);
    }

    /**
     * @dev Add bridge contract as minter and burner
     */
    function addBridgeContract(
        address bridgeContract
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bridgeContract != address(0), "Invalid bridge contract");
        _grantRole(MINTER_ROLE, bridgeContract);
        _grantRole(BURNER_ROLE, bridgeContract);
        _grantRole(BRIDGE_ROLE, bridgeContract);
    }

    /**
     * @dev Remove bridge contract roles
     */
    function removeBridgeContract(
        address bridgeContract
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, bridgeContract);
        _revokeRole(BURNER_ROLE, bridgeContract);
        _revokeRole(BRIDGE_ROLE, bridgeContract);
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Get IP metadata for a token
     */
    function getIPMetadata(
        uint256 tokenId
    ) external view returns (IPMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return ipMetadata[tokenId];
    }

    /**
     * @dev Get IP tags for a token
     */
    function getIPTags(
        uint256 tokenId
    ) external view returns (string[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return ipMetadata[tokenId].tags;
    }

    /**
     * @dev Check if token exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /**
     * @dev Get current token ID counter
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _currentTokenId;
    }

    /**
     * @dev Get total supply of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _currentTokenId - 1;
    }

    /**
     * @dev Override _baseURI to return the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice Return the token URI (same for all tokens in this mock)
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        ownerOf(tokenId);
        
        // Check if there's a specific URI set for this token
        // string memory _tokenURI = super.tokenURI(tokenId);
        // if (bytes(_tokenURI).length > 0) {
        //     return _tokenURI;
        // }
        
        // Fall back to base URI for all tokens
        return _baseTokenURI;
    }

    /**
     * @dev Override _burn to handle URI storage
     */
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Override supportsInterface to handle AccessControl
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override _beforeTokenTransfer to handle pausing
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    /// @notice Explicit override to ensure Alchemy & indexers can read name
    function name() public view override returns (string memory) {
        return _name;
    }

    /// @notice Explicit override to ensure Alchemy & indexers can read symbol
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
}