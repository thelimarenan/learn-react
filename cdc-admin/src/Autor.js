import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './components/InputCustomizado';
import TratadorErros from './TratadorErros';

export class FormAutor extends Component {

    constructor() {
        super();
        this.state = {nome:'', email: '', senha: ''};
        this.enviarForm = this.enviarForm.bind(this);
    }

    enviarForm(event) {
      console.log(event);
      event.preventDefault();
      
      $.ajax({
        url: 'https://cdc-react.herokuapp.com/api/autores',
        contentType: 'application/json',
        dataType: 'json',
        type: 'post',
        data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
        success: function(novaLista) {
          PubSub.publish('atualiza-lista-autores', novaLista);
          this.setState({nome:'', email: '', senha: ''});
        }.bind(this),
        error: function(res) {
          if(res.status === 400) {
            new TratadorErros().publicaErros(res.responseJSON);
          }
        },
        beforeSend: function() {
          PubSub.publish('limpa-erro', {});
        }
      });
    }

    salvaAlteracao(nomeInput,evento){
      var campo = {};
      campo[nomeInput] = evento.target.value;
      this.setState(campo);
    }

    render() {
      return (
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">
              <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')}/>
              <InputCustomizado id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')}/>
              <InputCustomizado id="senha" label="Senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')}/>
              <div className="pure-control-group">
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>
          </div> 
      );
    }
}

export class ListaAutores extends Component {

    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.lista.map(function(autor) {
                      return (
                        <tr key={autor.id}>
                          <td>{autor.nome}</td>
                          <td>{autor.email}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table> 
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista: []};
    }

    componentDidMount() {
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/autores',
          dataType: 'json',
          success: function(autores) {
            let late = autores.reverse().slice(0,10);
            this.setState({lista: late});
          }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores', function(topic, novaLista) {
          let late = novaLista.reverse().slice(0,10);
          this.setState({lista: late});
        }.bind(this));
    }

    render(){
        return(
          <div>
              <div className="header">
                  <h1>Cadastro de autores</h1>
              </div>
              <div className="content" id="content">
                <FormAutor /> 
                <ListaAutores lista={this.state.lista} />
              </div>
          </div>
        );
    }
}