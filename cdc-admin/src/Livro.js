import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

import TratadorErros from './TratadorErros';
import InputCustomizado from './components/InputCustomizado';

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista: [], autores:[]};
    }

    componentDidMount() {
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/livros',
          dataType: 'json',
          success: function(livros) {
            this.setState({lista: livros.reverse().slice(0,10)});
          }.bind(this)
        });

        $.ajax({
          url:"https://cdc-react.herokuapp.com/api/autores",
          dataType: 'json',
          success:function(autores){
            this.setState({autores: autores.reverse().slice(0,5)});
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
                    <FormLivro autores={this.state.autores}/>
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
        this.setAutorId = this.setAutorId.bind(this);
    }

    enviarForm(event) {
      event.preventDefault();
      
      $.ajax({
        url: 'https://cdc-react.herokuapp.com/api/livros',
        contentType: 'application/json',
        dataType: 'json',
        type: 'post',
        data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
        success: function(novaLista) {
          PubSub.publish('atualiza-lista-livros', novaLista);
          this.setState({titulo:'', preco: '', autorId: ''});
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
  
    setAutorId(event) {
      this.setState({autorId: event.target.value});
    }

    render() {
      return (
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">
              <InputCustomizado id="titulo" label="Título" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}/>
              <InputCustomizado id="preco" label="Preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco}/>
              <div className="pure-control-group">
                <label htmlFor="autor">Autor</label> 
                <select id="autor" name="autor" value={this.state.autorId} onChange={this.setAutorId}>
                  <option value="">Selecione um autor</option>
                  {
                    this.props.autores.map(autor => (
                      <option value={autor.id}>{autor.nome}</option>
                    ))
                  }
                </select>
              </div>
              <div className="pure-control-group">
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>
          </div> 
      );
    }
}