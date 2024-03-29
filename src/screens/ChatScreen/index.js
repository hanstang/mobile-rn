import React from "react";
import { 
  View, FlatList, StyleSheet, TextInput, KeyboardAvoidingView
} from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { Header, NavigationEvents } from "react-navigation";

import MyBubble from "src/screens/ChatScreen/MyBubble";
import PeopleBubble from "src/screens/ChatScreen/PeopleBubble";

import MessagesAPI from "src/api/messages";
import PeopleAPI from "src/api/people";

const INITIAL_STATE = { 
  messages: [], message: "", isChatRoomReady: false,
  currentUserEmail: null, bubbleListHeight: 0, isLoadingNewData: false
}

// NOTE: Assuming this `ChatScreen` is a private room
//       For other than private room, you can create another component

/**
 * Navigation parameters
 * @params {string} peopleName
 * @params {string} roomId
 */
export default class ChatScreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: navigation.getParam("peopleName", "Chat") }
  }

  processRawMessages = messages => {
    const { currentUserEmail } = this.state;
    messages.reverse();

    let withAvatar = true;
    let lastSender = null;
    const newMessages = messages.map(message => {
      withAvatar = (lastSender !== message.senderEmail);
      type = (message.senderEmail === currentUserEmail)? "myBubble": "peopleBubble";
      lastSender = message.senderEmail;
      return JSON.parse(JSON.stringify({ ...message, type, withAvatar }));
    })
    newMessages.reverse();
    return newMessages;
  }

  listenMessageRealTimeUpdate = () => {
    const roomId = this.props.navigation.getParam("roomId");
    this.messagesApi = new MessagesAPI(roomId);
    this.messageListener = this.messagesApi.getMessagesWithRealTimeUpdate(roomId, messages => {
      const newMessages = this.processRawMessages(messages);
      this.setState({ messages: newMessages });
    })
  }

  handleScreenWillBlur = () => this.messageListener();
  handleMessageChange = message => this.setState({ message })
  handleSendPress = () => {
    const { message } = this.state;

    if(message !== null || message !== "" || message !== undefined){
      const roomId = this.props.navigation.getParam("roomId");
      new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
        this.setState({ message: "" });
        return new MessagesAPI().sendMessage(roomId, currentUserEmail, message);
      })
    }
  }

  handleScreenWillFocus = () => {
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      this.setState({ currentUserEmail });
      this.listenMessageRealTimeUpdate();
      this.setState({ isChatRoomReady: true });
    })
  }

  handleBubbleListContentSizeChange = (contentWidth, contentHeight) => {
    if(this.state.bubbleListHeight < contentHeight){
      this.setState({ bubbleListHeight: contentHeight });
    }
  }

  handleBubbleListScroll = e => {
    const currentPosition = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    const threshold = 100;
    const { isLoadingNewData } = this.state;
    
    if(currentPosition >= (this.state.bubbleListHeight - threshold) && !isLoadingNewData){
      this.setState({ isLoadingNewData: true });
      this.messagesApi.getNext().then(messages => {
        const newMessages = this.processRawMessages(messages);
        const oldMessages = JSON.parse(JSON.stringify(this.state.messages));
        const combinedMessages = oldMessages.concat(newMessages);
        this.setState({ messages: combinedMessages, isLoadingNewData: false });
      })
    }
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.txtMessage = null;
    this.messageListener = null;
    this.messagesApi = null;
    this.processRawMessages = this.processRawMessages.bind(this);
    this.listenMessageRealTimeUpdate = this.listenMessageRealTimeUpdate.bind(this);
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handleScreenWillBlur = this.handleScreenWillBlur.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleBubbleListContentSizeChange = this.handleBubbleListContentSizeChange.bind(this);
    this.handleBubbleListScroll = this.handleBubbleListScroll.bind(this);
  }

  

  render(){
    return(
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        keyboardVerticalOffset = {Header.HEIGHT + 20}>
        <NavigationEvents 
          onDidFocus={this.handleScreenDidFocus}
          onWillFocus={this.handleScreenWillFocus}/>

        <FlatList
          inverted={true}
          ref={i => this.flatList = i}
          onScroll={this.handleBubbleListScroll}
          onContentSizeChange={this.handleBubbleListContentSizeChange}          
          style={styles.chatListContainer}
          data={this.state.messages}
          renderItem={({ item, index }) => {
            if(item.type === "dateDivider") return <DateDividerListItem />
            if(item.type === "peopleBubble") return <PeopleBubble {...item}/>
            if(item.type === "myBubble") return <MyBubble {...item}/>
          }}/>

          {/* TODO: Change below to ButtomTextInput */}
          <Surface style={styles.inputBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <TextInput 
                ref={i => this.txtMessage = i} 
                placeholder="Type a message" 
                style={{ flex: 1 }}
                value={this.state.message}
                onChangeText={this.handleMessageChange}/>
              <IconButton icon="send" size={24} color="#0EAD69" style={{ flex: 0 }} onPress={this.handleSendPress}/>
            </View>
          </Surface>
      </KeyboardAvoidingView>
    )
  }
}

const DateDividerListItem = props => {
  return (
    <View style={{ flexDirection: "row", paddingTop: 8, paddingBottom: 8, alignItems: "center" }}>
      <Text style={{ marginRight: 8, flex: 0, color: "#D3D9D3", fontWeight: "500" }}>10 JAN, 2019</Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#E8EEE8", flex: 1, height: 1 }}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  chatListContainer: { paddingLeft: 16, paddingRight: 16 },
  inputBoxContainer: { backgroundColor: "white", elevation: 16, padding: 16, paddingTop: 8, paddingBottom: 8 }
})