import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Surface, IconButton } from "react-native-paper";

const INITIAL_STATE = { message: "" }

export default class BottomTextInput extends React.Component{
  handleMessageChange = message => this.setState({ message });
  handleSendPress = () => {
    if(this.props.onSendPress) this.props.onSendPress(this.state.message);
  }

  clear = () => this.setState({ message: "" });
  requestFocus = () => {
    if(this.txtMessage !== null) this.txtMessage.focus();
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.txtMessage = null;
    this.requestFocus = this.requestFocus.bind(this);
    this.clear = this.clear.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
  }

  render(){
    return(
      <Surface style={styles.inputBoxContainer}>
        <View style={{ flexDirection: "row" }}>
          <TextInput 
            ref={i => this.txtMessage = i} 
            autoFocus={true}
            placeholder="Type a message" 
            style={{ flex: 1 }}
            value={this.state.message}
            onChangeText={this.handleMessageChange}/>
          <IconButton icon="send" size={24} color="#0EAD69" style={{ flex: 0 }} onPress={this.handleSendPress}/>
        </View>
      </Surface>
    )
  }
}

const styles = StyleSheet.create({
  inputBoxContainer: { 
    backgroundColor: "white", elevation: 16, padding: 16, paddingTop: 8, paddingBottom: 8 
  }
})