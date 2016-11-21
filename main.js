import Exponent from 'exponent';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://rare-molybdenum-506.myreindex.com/graphql'
  }),
});

class AppContainer extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );
  }
}

@graphql(gql`
  query MessagesQuery {
    viewer {
      allMessages(last: 25) {
        nodes {
          text
        }
      }
    }
  }
`)
class App extends React.Component {
  render() {
    if (this.props.data.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    let messages = this.props.data.viewer.allMessages.nodes;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardDismissMode="on-drag"
          style={{flex: 1}}
          contentContainerStyle={{paddingTop: 30, paddingBottom: 50, paddingHorizontal: 10}}>
          {messages.map((message, i) => <Text key={i}>{message.text}</Text>)}
        </ScrollView>

        {
          /**
            * Note: KeyboardAvoidingView won't quite work as expected after fresh npm install
            * b/c it is missing this commit:
            * https://github.com/facebook/react-native/commit/ec6e2741720d70f7523477bf4d4e421cac9a19e1
            **/
        }
        <KeyboardAvoidingView
          behavior="padding"
          style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <MessageInput onNewMessage={() => this.props.data.refetch()} />
        </KeyboardAvoidingView>

        <View style={styles.statusBarUnderlay} />
      </View>
    );
  }
}


@graphql(gql`
  mutation AddMessage($text: String!) {
    createMessage(input: { text: $text }) {
      changedMessage {
        text
      }
    }
  }
`)
class MessageInput extends React.Component {
  state = {
    text: '',
  }

  _handleSubmission = async () => {
    try {
      let result = await this.props.mutate({variables: {text: this.state.text}});
      this.setState({text: ''});
      this.props.onNewMessage();
    } catch(e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <TextInput
        onChangeText={text => this.setState({text})}
        onSubmitEditing={this._handleSubmission}
        placeholder="Leave a message"
        style={styles.messageInput}
        value={this.state.text}
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageInput: {
    backgroundColor: '#fff',
    height: 50,
    width: Dimensions.get('window').width,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
  },
  statusBarUnderlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: Exponent.Constants.statusBarHeight,
    backgroundColor: '#888',
  },
});

Exponent.registerRootComponent(AppContainer);
