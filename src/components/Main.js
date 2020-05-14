import React, { Component } from 'react';
import { useHistory } from "react-router-dom";


class Main extends Component {
    
    render() {
        return (
            <div id="content">
                <h1>Add company</h1>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.companyName.value
                    // const price = window.web3.utils.toWei(this.companyPrice.value.toString(), 'Ether')
                    this.props.createCompany(name)
                }}>
                    <div className="form-group mr-sm-2">
                        <input
                            id="companyName"
                            type="text"
                            ref={(input) => { this.companyName = input }}
                            className="form-control"
                            placeholder="company Name"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Company</button>
                </form>
                <p> </p>
                <h2>Buy company</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Owner</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody id="companyList">
                        {this.props.companies.map((company, key) => {
                            return (
                                <tr key={key}>
                                    <th scope="row">{company.id.toString()}</th>
                                    <td>{company.name}</td>
                                    {/* <td>{window.web3.utils.fromWei(company.price.toString(), 'Ether')} Eth</td> */}
                                    <td>{company.owner}</td>
                                    <td>
                                        {!company.purchased
                                            ? <button
                                                name={company.id}
                                                value={company.price}
                                                onClick={(event) => {
                                                    this.props.purchaseProduct(event.target.name, event.target.value)
                                                }}
                                            >
                                                View
            </button>
                                            : null
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Main;