import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

import TratadorErros from './TratadorErros';
import InputCustomizado from './components/InputCustomizado';

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista: []};
    }

    componentDidMount() {
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/livros',
          dataType: 'json',
          success: function(livros) {
            let late = livros.reverse().slice(0,10);
            this.setState({lista: late});
          }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros', function(topic, novaLista) {
          let late = novaLista.reverse().slice(0,10);
          this.setState({lista: late});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormLivro />
                    <ListaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}

export class ListaLivros extends Component {

    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Preço</th>
                    <th>Autor</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.lista.map(function(livro) {
                      return (
                        <tr key={livro.id}>
                          <td>{livro.titulo}</td>
                          <td>{livro.preco}</td>
                          <td>{livro.autor.nome}</td>
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

export class FormLivro extends Component {

    constructor() {
        super();
        this.state = {titulo:'', preco: '', autor: ''};
        this.enviarForm = this.enviarForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }

    enviarForm(event) {
      event.preventDefault();
      
      $.ajax({
        url: 'https://cdc-react.herokuapp.com/api/Livros',
        contentType: 'application/json',
        dataType: 'json',
        type: 'post',
        data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autor}),
        success: function(novaLista) {
          PubSub.publish('atualiza-lista-livros', novaLista);
          this.setState({titulo:'', preco: '', autor: ''});
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
    
    setTitulo(event) {
      this.setState({titulo: event.target.value});
    }
  
    setPreco(event) {
      this.setState({preco: event.target.value});
    }
  
    setAutor(event) {
      this.setState({autor: event.target.value});
    }

    render() {
      return (
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">
              <InputCustomizado id="titulo" label="Título" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}/>
              <InputCustomizado id="preco" label="Preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco}/>
              <InputCustomizado id="autor" label="Autor - Id" type="text" name="autor" value={this.state.autor} onChange={this.setAutor}/>
              <div className="pure-control-group">
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>
          </div> 
      );
    }
}