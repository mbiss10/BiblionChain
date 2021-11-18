import React, { Component } from "react";
import {
  Card,
  Icon,
  Image,
  Loader,
  Dimmer,
  Button,
  Modal,
} from "semantic-ui-react";
import biblionchain from "../ethereum/biblionchain";
import web3 from "../ethereum/web3";

class BookCard extends Component {
  state = {
    loading: true,
    deleted: false,
    isbn: "",
    title: "",
    subtitle: "",
    author: "",
    author_url: "",
    img_src: "",
    published_date: "",
    description: "",
    readerCount: "",
    modalOpen: false,
  };

  async componentDidMount() {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.props.isbn}`
    );
    var data = await response.json();
    if (data.items.length < 1) {
      return;
    }
    data = data.items[0].volumeInfo;
    console.log(data);
    const readerCount = await biblionchain.methods
      .numReaders(this.props.isbn)
      .call();
    this.setState({
      loading: false,
      deleted: false,
      isbn: this.props.isbn,
      title: data.title ? data.title : "",
      subtitle: data.subtitle ? data.subtitle : "",
      author: data.authors ? data.authors[0] : "Unknown Author",
      img_src: data.imageLinks ? data.imageLinks.thumbnail : "",
      published_date: data.publishedDate ? data.publishedDate : "",
      description: data.description ? data.description : "",
      readerCount: readerCount,
    });
  }

  handleRemoveBook = async () => {
    const accounts = await web3.eth.getAccounts();
    await biblionchain.methods.removeBook(this.state.isbn).send({
      from: accounts[0],
    });
    this.setState({ ...this.state, deleted: true });
  };

  render() {
    if (this.state.deleted) {
      return "";
    } else {
      return (
        <Card centered>
          {this.state.img_src === "" ? (
            <Dimmer active>
              <Loader />
            </Dimmer>
          ) : (
            <Image
              src={this.state.img_src}
              size="small"
              wrapped
              bordered
              centered
            />
          )}
          <Card.Content>
            <Card.Header>{this.state.title}</Card.Header>
            <Card.Meta>
              <span>{this.state.subtitle}</span>
            </Card.Meta>
            <Card.Description>
              <b>Author: {this.state.author}</b>
              <br />
              <b> Published: </b> {this.state.published_date}
              <br />
              <b> ISBN: </b>
              {this.state.isbn}
              <br />
              <br />
              <em> {this.state.description} </em>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Icon name="user" />
              Read by {this.state.readerCount} user
              {this.state.readerCount === 1 ? "" : "s"}
            </div>
            <br />
            <div>
              <Modal
                onClose={() =>
                  this.setState({ ...this.state, modalOpen: false })
                }
                onOpen={() => this.setState({ ...this.state, modalOpen: true })}
                open={this.state.modalOpen}
                size="tiny"
                trigger={
                  <Button size="mini">
                    <Icon name="minus circle" /> Remove from bookshelf
                  </Button>
                }
              >
                <Modal.Header>Remove Book</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <b>
                      Are you sure you want to remove{" "}
                      <em> {this.state.title} </em> from your bookshelf?
                    </b>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() =>
                      this.setState({ ...this.state, modalOpen: false })
                    }
                  >
                    Nevermind
                  </Button>
                  <Button
                    content="Remove from my bookshelf"
                    labelPosition="left"
                    icon="minus"
                    onClick={this.handleRemoveBook}
                    color="red"
                  />
                </Modal.Actions>
              </Modal>
            </div>
          </Card.Content>
        </Card>
      );
    }
  }
}

export default BookCard;
