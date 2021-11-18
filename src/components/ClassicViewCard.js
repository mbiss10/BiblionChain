import React, { Component } from "react";
import { Card, Image, Loader, Dimmer } from "semantic-ui-react";
import biblionchain from "../ethereum/biblionchain";

class ClassicBookCard extends Component {
  state = {
    loading: true,
    title: "",
    subtitle: "",
    author: "",
    author_url: "",
    img_src: "",
    published_date: "",
    description: "",
    readerCount: "",
  };

  async componentDidMount() {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.props.isbn}`
    );
    var data = await response.json();
    data = data.items[0].volumeInfo;
    console.log(data);
    const readerCount = await biblionchain.methods
      .numReaders(this.props.isbn)
      .call();
    this.setState({
      loading: false,
      title: data.title ? data.title : "",
      subtitle: data.subtitle ? data.subtitle : "",
      author: data.authors ? data.authors[0] : "Unknown Author",
      img_src: data.imageLinks ? data.imageLinks.thumbnail : "",
      published_date: data.publishedDate ? data.publishedDate : "",
      description: data.description ? data.description : "",
      readerCount: readerCount,
    });
  }

  render() {
    return (
      <Card
        style={{
          width: "200px",
          backgroundColor: "transparent",
          verticalAlign: "bottom",
          border: "none",
          boxShadow: "none",
        }}
      >
        {this.state.img_src === "" ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <Image
            src={this.state.img_src}
            wrapped
            size="large"
            verticalAlign="bottom"
            style={{
              border: "none",
            }}
          />
        )}
      </Card>
    );
  }
}

export default ClassicBookCard;
