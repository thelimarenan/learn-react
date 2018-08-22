import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';

export class FormAutor extends Component {

    constructor() {
        super();
        this.state = {nome:'', email: '', senha: ''};
        this.enviarForm = this.enviarForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviarForm(event) {
        event.preventDefault();
        
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/autores',
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success: function(response) {
            console.log("Sucesso");
          }.bind(this),
          error: function(res) {
            console.error("Erro");
          }
        });
      }
    
      setNome(event) {
        this.setState({nome: event.target.value});
      }
    
      setEmail(event) {
        this.setState({email: event.target.value});
      }
    
      setSenha(event) {
        this.setState({senha: event.target.value});
      }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">
                <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}/>
                <InputCustomizado id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.setEmail}/>
                <InputCustomizado id="senha" label="Senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha}/>
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

    constructor() {
        super();
        this.state = {lista: []};
        this.atuaizarLista = this.atuaizarLista.bind(this);
    }

    componentDidMount() {
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/autores',
          dataType: 'json',
          success: function(response) {
            this.atuaizarLista(response);
          }.bind(this)
        });
    }
    
    atuaizarLista(autores) {
        let latter = autores.reverse().slice(0,10);
        this.setState({lista: latter});
    }

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
                    this.state.lista.map(function(autor) {
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