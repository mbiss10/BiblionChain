import React, { Component } from "react";
import { Card, Radio } from "semantic-ui-react";
import BookCard from "./BookCard";
import ClassicBookCard from "./ClassicViewCard";

class Bookshelf extends Component {
  state = {
    classicView: false,
  };
  render() {
    return (
      <div>
        <div style={{ marginBottom: "15px" }}>
          <span style={{ marginRight: "10px" }}> Informational View </span>
          <Radio
            toggle
            onChange={() =>
              this.setState({ classicView: !this.state.classicView })
            }
          />
          <span style={{ marginLeft: "10px" }}> Classic View </span>
        </div>
        {this.state.classicView ? (
          <div>
            <div
              style={{
                display: "flex",
                position: "absolute",
                width: "100%",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  paddingTop: "60px",
                  zIndex: 1,
                  justifyContent: "center",
                }}
              >
                <Card.Group itemsPerRow={4}>
                  {this.props.isbns.map((i) => (
                    <ClassicBookCard key={i} isbn={i} />
                  ))}
                </Card.Group>
              </div>
            </div>
            <img
              src="https://media.istockphoto.com/vectors/empty-wooden-bookshelves-vector-id813187286?b=1&k=20&m=813187286&s=170667a&w=0&h=lAqjBwy30QNXsik0rgYhL6EtcnR7CpKsOyN0iVIZN9I="
              className="ui floated image"
              alt="alt"
              width="100%"
            />
          </div>
        ) : (
          <Card.Group itemsPerRow={3}>
            {this.props.isbns.map((i) => (
              <BookCard key={i} isbn={i} />
            ))}
          </Card.Group>
        )}
      </div>
    );
  }
}

export default Bookshelf;
