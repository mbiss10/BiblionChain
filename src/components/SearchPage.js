import React, { Component } from "react";
import SearchBar from "./SearchBar";
import BookCard from "./BookSearchCard";
import { Card } from "semantic-ui-react";

class SearchPage extends Component {
  state = { results: [] };

  onSearch = (text) => {
    if (text === "") {
      this.setState({
        results: [],
      });
    } else {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}`)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log("prev state:", this.state);
          this.setState({
            results: res.items,
          });
          console.log("post state:", this.state);
        });
    }
  };

  render() {
    return (
      <div className="App" key={this.state.results}>
        <div className="container searchApp">
          <h3 className="title is-2 has-text-centered">
            Browse books to add to your bookshelf
          </h3>
          <SearchBar onSearch={this.onSearch} />
          <br />
          <Card.Group itemsPerRow={5}>
            {this.state.results !== undefined && this.state.results.length > 0
              ? this.state.results.map((x) => {
                  return x.volumeInfo.industryIdentifiers !== undefined ? (
                    <BookCard
                      key={x.volumeInfo.industryIdentifiers[0].identifier}
                      volumeInfo={x.volumeInfo}
                    />
                  ) : (
                    ""
                  );
                })
              : ""}
          </Card.Group>
        </div>
      </div>
    );
  }
}

export default SearchPage;
