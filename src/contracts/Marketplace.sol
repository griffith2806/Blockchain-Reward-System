pragma solidity ^0.5.0;


contract Marketplace {
    string public name;
    uint256 public companyCount = 0;
    uint256 public productCount = 0;
    mapping(uint256 => Company) public companies;
    mapping(uint256 => Product) public products;

    struct Company {
        uint256 id;
        string name;
        address payable owner;
    }

    event CompanyCreated(uint256 id, string name, address payable owner);

    struct Credit {
        uint256 id;
        string productName;
        uint256 reward;
        // address payable owner;
        bool purchased;
    }

    struct Product {
        uint256 id;
        uint256 price;
        bool purchased;
    }

    event ProductPurchased(uint256 id, uint256 price, bool purchased);

    constructor() public {
        name = "DeeGee";
    }

    function createCompany(string memory _name) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        // require(_price > 0);
        // Increment product count
        companyCount++;
        // Create the product
        companies[companyCount] = Company(companyCount, _name, msg.sender);
        // Trigger an event
        emit CompanyCreated(companyCount, _name, msg.sender);
    }

    function createPurchase(address _seller) public payable {
        address payable seller = address(uint160(_seller));
        address(seller).transfer(msg.value);
        productCount++;
        emit ProductPurchased(productCount, msg.value, true);
    }

    // function purchaseProduct(uint256 _id) public payable {
    //     // Fetch the product
    //     Product memory _product = products[_id];
    //     // Fetch the owner
    //     address payable _seller = _product.owner;
    //     // Make sure the product has a valid id
    //     require(_product.id > 0 && _product.id <= productCount);
    //     // Require that there is enough Ether in the transaction
    //     require(msg.value >= _product.price);
    //     // Require that the product has not been purchased already
    //     require(!_product.purchased);
    //     // Require that the buyer is not the seller
    //     require(_seller != msg.sender);
    //     // Transfer ownership to the buyer
    //     _product.owner = msg.sender;
    //     // Mark as purchased
    //     _product.purchased = true;
    //     // Update the product
    //     products[_id] = _product;
    //     // Pay the seller by sending them Ether
    //     address(_seller).transfer(msg.value);
    //     // Trigger an event
    //     emit ProductPurchased(
    //         productCount,
    //         _product.name,
    //         _product.price,
    //         msg.sender,
    //         true
    //     );
    // }
}
