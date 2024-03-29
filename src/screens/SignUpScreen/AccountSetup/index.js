import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Paragraph } from "react-native-paper";
import { StackActions } from "react-navigation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SInfo from "react-native-sensitive-info";
import firebase from "react-native-firebase";

import Button from "../../../components/Button";
import Navigator from "../../../api/navigator";
import PersonalInformationCard from "./PersonalInformationCard";
import ApplicationInformationCard from "./ApplicationInformaitonCard";

const INITIAL_STATE = {
  nickName: ""
}

export default class AccountSetup extends React.Component{
  static navigationOptions = { title: "Account Setup" }

  handleCompleteClick = () => {
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
      console.log(currentUserEmail);
      const applicationInformation = this.applicationInformationCard.getState();
      const personalInformation = this.personalInformationCard.getState();

      const db = firebase.firestore();
      console.log(personalInformation, applicationInformation);
      return db.collection("users").doc(currentUserEmail).update({
        personalInformation, applicationInformation,
        isCompleteSetup: true
      })
    }).then( () => {
      const navigator = new Navigator(this.props.navigation);
      navigator.resetTo("MainTabNavigator", StackActions);
    }).catch(err => console.error(err));
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.personalInformationCard = null;
    this.applicationInformationCard = null;
    this.handleCompleteClick = this.handleCompleteClick.bind(this);
  }

  render(){
    return(
      <KeyboardAwareScrollView 
        style={styles.container}>
        <View>
          <View style={styles.titleContainer}>
            <Title>Selamat datang di Chat App</Title>
            <Paragraph>Mari selesaikan beberapa langkah lagi untuk menyempurnakan akun-mu</Paragraph>
          </View>
          <View style={styles.cardContainer}>
            <PersonalInformationCard ref={i => this.personalInformationCard = i}/>
          </View>
          <View style={styles.cardContainer}>
            <ApplicationInformationCard ref={i => this.applicationInformationCard = i}/>
          </View>
          <View style={styles.cardContainer}>
            <Button text="Sempurna" onPress={this.handleCompleteClick}/>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEE8'
  },
  titleContainer: {
    padding: 16, 
    paddingTop: 8, 
    paddingBottom: 8, 
    backgroundColor: "white"
  },
  cardContainer:{
    padding: 16,
    paddingBottom: 8, 
    paddingTop: 8
  }
})