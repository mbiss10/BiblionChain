import "semantic-ui-css/semantic.min.css";
import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import Bookshelf from "./components/Bookshelf";
import SearchPageNew from "./components/SearchPage";
import web3 from "./ethereum/web3";
import biblionchain from "./ethereum/biblionchain";

class App extends Component {
  address = biblionchain.options.address;

  state = {
    isbns: [],
  };

  panes = [
    {
      menuItem: "My Bookshelf",
      render: () => (
        <Tab.Pane>
          <Bookshelf isbns={this.state.isbns} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Browse Books",
      render: () => (
        <Tab.Pane>
          <SearchPageNew />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "About the Project",
      render: () => (
        <Tab.Pane>
          <ul>
            <li>
              <em>What's the name all about?</em>
              <ul>
                <li>
                  BibliOnChain comes from the Greek word biblíon, meaning
                  “book,” and the concept of information being stored "on
                  chain," i.e. on a blockchain where it resides in an immutable,
                  distributed ledger that's resistant to tampering.
                </li>
              </ul>
            </li>
            <li>
              <em>Where's the underlying contract?</em>
              <ul>
                <li>
                  The contract underlying this dApp is deployed to Ethereum's
                  Rinkeby Test Network at address: <code>{this.address}</code>.
                </li>
                <li>
                  Click{" "}
                  <a
                    href={`https://rinkeby.etherscan.io/address/${this.address}`}
                  >
                    here
                  </a>{" "}
                  to view on Etherscan.
                </li>
              </ul>
            </li>
            <li>
              <em>I love this!</em>
              <ul>
                <li>
                  Donate to the creator @ bissell.eth -- ETH, altcoins, or Bored
                  Apes are all valid payment types :)
                </li>
              </ul>
            </li>
          </ul>
        </Tab.Pane>
      ),
    },
  ];

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const count = await biblionchain.methods.numBooksRead(account).call();
    var isbns = [];
    for (let i = 0; i < count; i++) {
      let res = await biblionchain.methods.ownerToBooks(account, i).call();
      isbns.push(res);
    }
    console.log(isbns);
    this.setState({ isbns });
  }

  render() {
    return (
      <div
        style={{
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: "10px",
          width: "90%",
        }}
      >
        <h1 style={{ margin: 0, padding: 0 }}>BibliOnChain</h1>
        <h4 style={{ marginTop: 0, paddingTop: 0 }}>
          <em>Your bookshelf, on the blockchain.</em>
        </h4>
        <Tab panes={this.panes} />
        <br></br>
      </div>
    );
  }
}

export default App;
