import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustomizado extends Component {

    constructor() {
        super();
        this.state = {msgErro: ''};
    }
    
    componentDidMount() {
        PubSub.subscribe('erro-validacao', function(topic, erro) {
            if(erro.field == this.props.name) {
                this.setState({msgErro: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe('limpa-erro', function(topic){
            this.setState({msgErro:''});
        }.bind(this));
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <input id={this.props.id} 
                    type={this.props.type} 
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange} />
                <span>{this.state.msgErro}</span>
            </div>
        );
    }
}