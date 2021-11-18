import React, { Component } from "react";
import {
  Card,
  Icon,
  Image,
  Loader,
  Dimmer,
  Button,
  Modal,
  Grid,
} from "semantic-ui-react";
import biblionchain from "../ethereum/biblionchain";
import web3 from "../ethereum/web3";

class BookCard extends Component {
  state = {
    loading: true,
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
    const data = this.props.volumeInfo;
    const isbn = data.industryIdentifiers[0].identifier;
    console.log(data);
    const readerCount = await biblionchain.methods.numReaders(isbn).call();
    this.setState({
      loading: false,
      isbn: isbn,
      title: data.title ? data.title : "",
      subtitle: data.subtitle ? data.subtitle : "",
      author: data.authors ? data.authors[0] : "Unknown Author",
      img_src: data.imageLinks
        ? data.imageLinks.thumbnail
        : "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png",
      published_date: data.publishedDate ? data.publishedDate : "",
      description: data.description ? data.description : "",
      readerCount: readerCount,
    });
  }

  handleAddBook = async () => {
    const accounts = await web3.eth.getAccounts();
    await biblionchain.methods.addBook(this.state.isbn).send({
      from: accounts[0],
    });
    this.setState({ ...this.state, modalOpen: false });
  };

  render() {
    const regExprRemoveUnderscores = new RegExp("^_*");
    let descriptionCleaned = this.state.description.replace(
      regExprRemoveUnderscores,
      ""
    );
    let shortDescription = descriptionCleaned.slice(0, 200);
    let lastSpace = shortDescription.lastIndexOf(" ");
    shortDescription =
      lastSpace > 0
        ? shortDescription.slice(0, lastSpace).trim()
        : shortDescription;
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
            <em> {shortDescription ? shortDescription + "..." : ""} </em>
          </Card.Description>
        </Card.Content>
        <Modal
          onClose={() => this.setState({ ...this.state, modalOpen: false })}
          onOpen={() => this.setState({ ...this.state, modalOpen: true })}
          open={this.state.modalOpen}
          trigger={
            <Button color="green">
              <Icon name="add circle" /> Add Book
            </Button>
          }
        >
          <Modal.Header>
            Add <em> {this.state.title} </em> to your bookshelf!
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <h5>
                <u> Review book details before adding to your bookshelf: </u>
              </h5>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <Image
                      src={this.state.img_src}
                      size="small"
                      wrapped
                      bordered
                      centered
                    />
                  </Grid.Column>
                  <Grid.Column width={13} verticalAlign="middle">
                    <b>Title: </b>
                    <em> {this.state.title} </em>
                    {this.state.subtitle === "" ? (
                      ""
                    ) : (
                      <span>
                        <br /> <b>Subtitle:</b> {this.state.subtitle}
                      </span>
                    )}
                    <br />
                    <b>Author:</b> {this.state.author}
                    <br />
                    <b> Published: </b> {this.state.published_date}
                    <br />
                    <b> ISBN: </b>
                    {this.state.isbn}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <br />
              <em> {descriptionCleaned ? descriptionCleaned : ""} </em>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="red"
              onClick={() => this.setState({ ...this.state, modalOpen: false })}
            >
              Nevermind
            </Button>
            <Button
              content="Add to my bookshelf"
              labelPosition="right"
              icon="checkmark"
              onClick={this.handleAddBook}
              positive
            />
          </Modal.Actions>
        </Modal>
        <Card.Content extra>
          <a>
            <Icon name="user" />
            Read by {this.state.readerCount} user
            {this.state.readerCount === 1 ? "" : "s"}
          </a>
        </Card.Content>
      </Card>
    );
  }
}

export default BookCard;
