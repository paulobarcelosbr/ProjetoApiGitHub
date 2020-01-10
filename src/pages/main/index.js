import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../components/Container/index';
 import {  Form, SubmitButton, List} from './styles';


 import api from '../../services/api';

export default class Main extends Component {
  state = {
    newRepo: '',
    loading: false,
    repositories:[],
    error: null,
  };

  //carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');
    if (repositories){
      this.setState({repositories:JSON.parse(repositories)});
    }
  }
  componentDidUpdate(_, prevState){
    const { repositories } = this.state;
    if(prevState.repositories !== repositories){
      localStorage.setItem('repositories',JSON.stringify(repositories));
    }
  }

handleInputChange = e => {
  this.setState ({ newRepo: e.target.value, error: null});
}
handleSubmit = async e =>{
  e.preventDefault();
  this.setState({ loading: true, error:false});

try{
  const { newRepo, repositories  } = this.state;

  if(newRepo === '') throw 'Você precisa inicar um repositório';

  const hasRepo = repositories.find (r => r.name === newRepo);

  if(hasRepo) throw 'Repositório duplicado';

  const response = await api.get(`/repos/${newRepo}`);

  const data= {
    name: response.data.full_name,
  };
  this.setState({
    repositories: [...repositories,data],
    newRepo: '',
  });
}catch(error){
  this.setState({error: true});
}finally{
  this.setState({ loading: false});
}
}
 render(){
   const { newRepo, loading, repositories, error } = this.state
  return (
   <Container>
     <h1>
      <FaGithubAlt />
       Repositórios
     </h1>
     <Form onSubmit={this.handleSubmit} error={error}>
        <input
            type ="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            { loading ? (
                <FaSpinner color="FFF" size={14} />
            ):( <FaPlus color="#fff" size={14} />
            ) }
          </SubmitButton>
     </ Form>
      <List>
            {repositories.map(repository =>(
              <li key={repository.name}>
                      <span>{repository.name}</span>
                      <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                        Detalhes
                        </Link>
              </li>
            ))}
      </List>
   </Container>
    );
  }
}
