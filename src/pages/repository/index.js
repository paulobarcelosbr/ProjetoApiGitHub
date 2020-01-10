import React , { Component } from "react";
 import  api from '../../services/api';

// import { Container } from './styles';

export default class Repository extends Component{
  state = {
    repository: {}, // criado como objeto pois irá receber somente uma reposta.
    issues: [], // criado como array pois irá receber varios resultados
    loading: true,
  };
  async componentDidMount(){
    const { match } = this.props; //recupera os dados que vem das propriedade

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([   // permite que eu realize as duas requisições ao mesmo tempo.
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`), {
        params: {
          state: 'open',     // parametros passado na requisição da api para realização de alguns filtros
          per_page: 5,
        },
      },
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,   // .data pois é onde o axios guarda os dados.
      loading:false,
    })
  }

  render(){
    const { repository, issues, loading} = this.state;
    return <h1>Repository</h1>
  }
}
