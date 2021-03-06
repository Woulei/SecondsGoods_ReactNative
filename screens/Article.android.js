import React, { Component } from 'react';
import { View, Text, TouchableHighlight, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import {Actions} from 'react-native-router-flux';

import styles from './Article.styles';
import t from 'tcomb-form-native';
import Article, { formOptions } from '../forms/ArticleForm';
import ImagePicker from 'react-native-image-picker';
import Carousel from 'react-native-snap-carousel';
import productApi from '../api/product';
import ApiUtils from '../api/apiUtils';

var imageOptions = {
  title: 'Selecteer product foto',
  mediaType: 'photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {productPhotos: []};

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { form } = this.refs;
    const newArticle = form.getValue();
    if (!newArticle) return;
    console.log('newArticle', JSON.stringify(newArticle));
    fetch('https://second-goods-admin.herokuapp.com/api/products', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticle)
    })
    .then(ApiUtils.checkStatus)
    .then(response => {
      if (response.status === 201) {

        Actions.RequestSuccess()
      }
    })
    .catch( e => { console.error(e);})
  }

  myPhotoFunc() {
    ImagePicker.showImagePicker(imageOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          productPhotos: this.state.productPhotos.concat([ source ])
        })
        console.log('productPhotos[0]: ', this.state.productPhotos[0]);
      }
    })
  }

  render() {
    const Form = t.form.Form;
    let sliderWidth = 300;
    let itemWidth = 50;

    return (
      <ScrollView style={styles.outerContainer}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Form ref="form" type={Article} options={formOptions} />
          <TouchableHighlight style={styles.button} onPress={this.onSubmit} underlayColor='#99d9f4' >
            <Text style={styles.buttonText}>Verzend aanvraag</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </ScrollView>

    );
  }
}
