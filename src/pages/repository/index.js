import React , { Component } from "react";
import { Link } from 'react-router-dom';
import PorpTypes from 'prop-types';
 import  api from '../../services/api';

 import Container from '../../components/Container/index';
 import { Loading, Owner } from './Styles';


export default class Repository extends Component{
  static PorpTypes={
    match: PorpTypes.shape({
      params: PorpTypes.shape({
        repository: PorpTypes.string,
      }),
    }).isRequired,
  };
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
    if  (loading){
      return<Loading> Carregando </Loading>
    }
    return <Container>
      <Owner>
        <Link to="/">Voltar aos repositórios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>
    </Container>
  }
}
