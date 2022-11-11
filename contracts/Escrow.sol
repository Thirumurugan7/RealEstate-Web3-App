//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public lender;
    address public inspector;
    address payable public seller;
    address public nftAddress;

    modifier onlySeller() {
        require(msg.sender == seller, "Only sender can call this functions");
        _;
    }
    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only sender can call this");
        _;
    }
    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call");
        _;
    }

    //here the first uint256 is the nft id
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice; // seconf uint256 is the price
    mapping(uint256 => uint256) public escrowAmount; // seconf uint256 is the amount
    mapping(uint256 => address) public buyer; // address is the address of the buyer
    mapping(uint256 => bool) public insectionPassed; //bool is either true or false for inspection of each nft

    //constructr function
    constructor(
        address _nftAddress,
        address _inspector,
        address payable _seller,
        address _lender
    ) {
        lender = _lender;
        inspector = _inspector;
        seller = _seller;
        nftAddress = _nftAddress;
    }

    function list(
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address _buyer
    ) public onlySeller {
        //onlyseller is a modifer declared above to modify who can access the particular function

        // transfer functions takes three arguments (from,to,nftID)
        //to==> contract address --> this means this currentr contract

        //transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    // Put Under Contract accessed by only buyer and it is payable function
    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID]);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance; //address(this) is the address of current contract
    }

    function updateInspectionStatus(uint256 _nftID, bool _passed)
        public
        onlyInspector
    {
        insectionPassed[_nftID] = _passed;
    }
}
