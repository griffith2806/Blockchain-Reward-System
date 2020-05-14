import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import Marketplace from '../abis/Marketplace.json'
import Main from './Main'
import View from './View'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const companyCount = await marketplace.methods.companyCount().call()
      // console.log(companyCount.toString())
      for (var i = 1; i <= companyCount; i++) {
        const company = await marketplace.methods.companies(i).call()
        this.setState({
          companies: [...this.state.companies, company]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  // purchasecompany(id, price) {
  //   this.setState({ loading: true })
  //   this.state.marketplace.methods.purchasecompany(id).send({ from: this.state.account, value: price })
  //     .once('receipt', (receipt) => {
  //       this.setState({ loading: false })
  //     })
  // }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      companyCount: 0,
      companies: [],
      loading: true
    }

    this.createCompany = this.createCompany.bind(this)
    // this.purchasecompany = this.purchasecompany.bind(this)
  }

  createCompany(name) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createCompany(name).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      });
  }

  viewCompany(){
    this.setState.methods.window.alert('khkh');
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  companies={this.state.companies}
                  createCompany={this.createCompany}
                // purchasecompany={this.purchasecompany} 
                />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
