// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RKart {
    // List Products
    // Buy Products
    // Withdraw Funds
    
    // Contract Name
    string public name;
    
    // Owner Address
    address public owner;

    // Define Item Struct 

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    
    // Define Order Struct

    struct Order {
        uint256 time;
        Item item;
    }

    // Item Mapping as Key-Value store
    mapping(uint256 => Item) public items;
    
    // orderCount Mapping
    mapping(address => uint256) public orderCount;
    
    // Nested Mapping Orders (Order within Order)
    mapping(address => mapping(uint256 => Order)) public orders;

    // Event List
    event List(string name, uint256 cost, uint256 quantity);

    // Event Buy
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    // Evaluate True/Flase conditions to run a function
    // e.g. Only Owner can call function
    // -; represent function body 
    modifier onlyOwner() {
        require(msg.sender == owner);
        _; 
    }

    constructor() {
        name = "RKart";
        owner = msg.sender;
    }             

    // List Products 
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    
    ) public onlyOwner {
        // Create Item Struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        // Save Item Struct to blockchain using Mapping
        items [_id] = item;

        // Emit List Event
        emit List(_name, _cost, _stock);

    }      

    // Buy Products
    
    // Payable allows to send crypto (built-in)
    function buy(uint256 _id) public payable {
        // Fetch item
        Item memory item = items[_id];
        
        // Check Balance before buy
        require(msg.value >= item.cost);

        // Check if item is in stock
        require(item.stock > 0);

        //Create Order
        //EPOCH time from Jan 1, 1970, no of seconds since this time
        //Create order for Current time since EPOCH time

        Order memory order = Order(block.timestamp, item);

        // Add order for user , takes order id
        orderCount[msg.sender]++;

        orders[msg.sender] [orderCount[msg.sender]] = order;

        //Subtrack Stock
        items[_id].stock = item.stock - 1;

        //Emit Event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);

    }

    // Withdraw Funds

    // Only Owner can call this to withdraw funds
    function withdraw() public onlyOwner {
        //Standard pattern used by devs to withdraw 
        (bool success, ) = owner.call {value : address(this).balance}("");
        require(success);
    }
}
