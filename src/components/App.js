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

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchasecompany(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      companyCount: 0,
      companies: [],
      loading: true
    }

    this.createCompany = this.createCompany.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }

  createCompany(name) {
    // this.setState({ loading: true })
    this.state.marketplace.methods.createCompany(name).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      });
      alert('Company is being added to the blockcahin. Please refresh your page after the transaction has been completed in metamask')
  }


  // ****Needs to redirect to view company 
  viewCompany() {
    this.setState.methods.window.alert('khkh');
  }

  //**********Ensure to replace with seller address************
  purchaseProduct(price) {
    // *********Replace with seller address********
    const web3 = window.web3
      web3.eth.sendTransaction({
        // *********Replace with seller address********
        to: '0x1a2B28C491c11438D1f51ffb29E0351f559937D5',
        from: this.state.account,
        value: web3.utils.toWei(price, 'ether'),
        gas: 21000,
        gasPrice: web3.utils.toWei('2', 'gwei')
      })
  }

  async redeem(amount) {
    let web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts()
    //************Ensure to replace seller address */
    const sellerAddress = '0x1a2B28C491c11438D1f51ffb29E0351f559937D5'

    if (accounts[0] != sellerAddress) {
      web3.eth.sendTransaction({
        to: sellerAddress,
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether'),
        gas: 1000000,
        gasPrice: web3.utils.toWei('2', 'gwei')
      })
    }
    else {
      alert('You cannot buy from the seller address')
    }
  }

  async transfer(toAddress, amount) {
    let web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts()
    const currentAddress = accounts[0]

    if (currentAddress != toAddress) {
      web3.eth.sendTransaction({
        to: toAddress,
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether'),
        gas: 1000000,
        gasPrice: web3.utils.toWei('2', 'gwei')
      })
    }
    else {
      alert('You cannot send to your own address')
    }
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
        <div style={{marginTop: "100px"}}>
          <h2>Purchase Products</h2>
          <button onClick={() => this.purchaseProduct('25')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product A(25 Credits)</button><br></br>
          <button onClick={() => this.purchaseProduct('50')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product B(50 Credits)</button><br></br>
          <button onClick={() => this.purchaseProduct('100')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product C(100 Credits)</button><br></br>
        </div>
        <div style={{marginTop: "100px"}}>
          <h2>Transfer Points</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            const address = this.address.value
            const amount = this.amount.value
            // const price = window.web3.utils.toWei(this.companyPrice.value.toString(), 'Ether')
            this.transfer(address, amount)
          }}>
            <div className="form-group mr-sm-2" style={{width: "400px"}}>
              <input
                id="address"
                type="text"
                ref={(input) => { this.address = input }}
                className="form-control"
                placeholder="To Adress"
                required />
              <input
                id="amount"
                type="number"
                ref={(input) => { this.amount = input }}
                className="form-control"
                placeholder="Amount"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
          <p> </p>
        </div>
        <div style={{marginTop: "100px", marginBottom: "100px"}}>
          <h2>Redeem Points</h2>
          <button onClick={() => this.redeem('25')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product A(25 Credits)</button><br></br>
          <button onClick={() => this.redeem('50')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product B(50 Credits)</button><br></br>
          <button onClick={() => this.redeem('100')} className="btn btn-primary" style={{marginBottom: "10px"}}>Product C(100 Credits)</button><br></br>
        </div>
      </div>
    );
  }
}

export default App;
