import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Container, Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;

    if (this.state.newRepo !== '') {
      try {
        const response = await api.get(`/repos/${newRepo}`);

        const data = {
          name: response.data.full_name,
        };

        if (
          repositories
            .map(t => t.name.toLowerCase() === this.state.newRepo.toLowerCase())
            .every(f => f === false)
        ) {
          this.setState({
            repositories: [...repositories, data],
          });
        } else {
          console.log('Repository already exists.');
        }
      } catch (err) {
        console.log(`Error code: ${err.response.status}`);
      }
    }

    // clear textbox and enable button
    this.setState({
      newRepo: '',
      loading: false,
    });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton carregando={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <a href="styles.js">Detalhes</a>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
