import React from "react";
import { useState } from "react";
import { Input } from "semantic-ui-react";

function SearchBar(props) {
  const { onSearch } = props;

  const [searchText, setSearchText] = useState("");

  const handleInput = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const handleEnterKeyPressed = (e) => {
    if (e.key === "Enter") {
      console.log("Entered");
      onSearch(searchText);
    }
  };

  return (
    <div>
      <div className="control">
        <Input
          fluid
          icon="search"
          placeholder="Search books..."
          onChange={handleInput}
          onKeyPress={handleEnterKeyPressed}
          value={searchText}
        />
      </div>
    </div>
  );
}

export default SearchBar;
