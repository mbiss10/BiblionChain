// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract BiblionChain {
    mapping(address => string[]) public ownerToBooks;
    mapping(string => address[]) public bookToOwners;
    mapping(address => mapping(string => bool)) public ownershipLookup;

    modifier ownsBook(string memory _isbn) {
        require(ownershipLookup[msg.sender][_isbn] == true);
        _;
    }

    event BookAdded(address indexed _reader, string _isbn);
    event BookRemoved(address indexed _reader, string _isbn);

    function addBook(string memory _isbn) public {
        ownerToBooks[msg.sender].push(_isbn);
        bookToOwners[_isbn].push(msg.sender);
        ownershipLookup[msg.sender][_isbn] = true;
        emit BookAdded(msg.sender, _isbn);
    }

    function removeBook(string memory _isbn) public ownsBook(_isbn) {
        for (
            uint256 index = 0;
            index < ownerToBooks[msg.sender].length;
            index++
        ) {
            if (
                keccak256(bytes(ownerToBooks[msg.sender][index])) ==
                keccak256(bytes(_isbn))
            ) {
                for (
                    uint256 i = index;
                    i < ownerToBooks[msg.sender].length - 1;
                    i++
                ) {
                    // Overwrite ISBN by shifting array elements
                    ownerToBooks[msg.sender][i] = ownerToBooks[msg.sender][
                        i + 1
                    ];
                }
                // Reduce size of array
                ownerToBooks[msg.sender].pop();
                break;
            }
        }

        for (uint256 index = 0; index < bookToOwners[_isbn].length; index++) {
            if (bookToOwners[_isbn][index] == msg.sender) {
                for (
                    uint256 i = index;
                    i < bookToOwners[_isbn].length - 1;
                    i++
                ) {
                    // Overwrite address by shifting array elements
                    bookToOwners[_isbn][i] = bookToOwners[_isbn][i + 1];
                }
                // Reduce size of array
                bookToOwners[_isbn].pop();
                break;
            }
        }

        ownershipLookup[msg.sender][_isbn] = false;
        emit BookRemoved(msg.sender, _isbn);
    }

    function numReaders(string memory _isbn) public view returns (uint256) {
        return bookToOwners[_isbn].length;
    }

    function numBooksRead(address _reader) public view returns (uint256) {
        return ownerToBooks[_reader].length;
    }
}
