import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

import PeopleAPI from "src/api/people";
import CircleAvatar from "src/components/Avatar/Circle";

const INITIAL_STATE = { profilePicture: "" }

export default class MyBubble extends React.PureComponent{
  loadProfilePicture = () => {
    if(this.props.withAvatar && this.props.senderEmail) {
      new PeopleAPI().getDetail(this.props.senderEmail).then(people => {
        this.setState({ profilePicture: people.applicationInformation.profilePicture });
      })
    }
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.loadProfilePicture = this.loadProfilePicture.bind(this);
  }

  componentDidMount(){ this.loadProfilePicture(); }

  render(){
    const sentIcon = this.props.isSent? "done-all": "done";
    const sentTimeString = this.props.isSent? moment(this.props.sentTime.seconds * 1000).format("HH:mmA"):"";

    return(
      <View style={{ flex: 1, flexDirection: "row-reverse", marginBottom: 8, marginTop: 8 }}>
        {this.props.withAvatar?(
          <CircleAvatar size={32} uri={this.state.profilePicture}/>
        ):<View/>}

        <View style={{ marginRight: this.props.withAvatar? 8: 40, marginLeft: 40 }}>
          <View style={{ borderRadius: 8, padding: 8, backgroundColor: "#0EAD69", alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, color: "white" }}>{this.props.message}</Text>
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: "row",alignItems: "center" }}>
              <Text style={{ textAlign: "right", fontWeight: "500", color: "#E8E8E8", fontSize: 8, marginRight: 4 }}>{sentTimeString}</Text>
              <MaterialIcons name={sentIcon} color="#E8E8E8" size={10}/>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

MyBubble.defaultProps = {
  withAvatar: false, isSent: false, message: "", sentTime: null, senderEmail: null
}