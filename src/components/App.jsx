import { Component } from 'react';

import Modal from 'components/Modal/Modal';

import SearchBar from './SearchBar/SearchBar';
import { Container } from './App.styled';
import { Btn } from './Button/Button.styled';
import { Loader } from './Loader/Loader';

import { getImages } from 'servises/api';

import { ErrorMessage } from './ErrorMessage/ErrorMessage';
import { ImageGalery } from './ImageGallery/ImageGallery';

export class App extends Component {
  state = {
    showBtn: false,
    isEmpty: false,
    images: [],

    value: '',
    isError: '',
    isLoading: false,
    largeImgURL: '',
    page: 1,

    per_page: 12,
    showModal: false,
  };

  componentDidUpdate(_, prevState) {
    const { value, page, per_page } = this.state;

    if (value !== prevState.value || page !== prevState.page) {
      this.setState({ isLoading: true });
      getImages(value, page)
        .then(data => {
          if (!data.hits.length) {
            this.setState({ isEmpty: true });

            return;
          }

          this.setState(prevState => ({
            images: [...prevState.images, ...data.hits],

            showBtn: page < Math.ceil(data.total / per_page),
          }));
        })
        .catch(error => {
          this.setState({ isError: error.message });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  nextPage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleSubmit = value => {
    this.setState({
      value,
      page: 1,
      images: [],
      showBtn: false,
      isEmpty: false,
    });
  };

  toggleModal = link => {
    this.setState({ largeImgURL: link });
  };

  render() {
    const { isEmpty, images, showBtn, isError, isLoading, largeImgURL } =
      this.state;
    return (
      <Container>
        <SearchBar onSubmit={this.handleSubmit} />

        <ImageGalery images={images} openModal={this.toggleModal} />

        {isEmpty && (
          <ErrorMessage>
            There are no such images ... Try again {isError}
          </ErrorMessage>
        )}
        {isError && <ErrorMessage>{isError}</ErrorMessage>}
        {showBtn && <Btn onClick={this.nextPage}>Load more</Btn>}
        {isLoading && <Loader />}
        {largeImgURL && (
          <Modal onClose={this.toggleModal}>
            <img src={largeImgURL} alt="largeImg" />
          </Modal>
        )}
      </Container>
    );
  }
}
