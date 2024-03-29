import React from "react";
import { 
  Text, View, TouchableOpacity,
  StyleSheet
} from "react-native";
import { StackActions } from "react-navigation";
import { 
  Dialog, Paragraph, Portal, 
  Button as MaterialButton 
} from "react-native-paper";

import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

const INITIAL_STATE = { 
  email: "", 
  password: "", 
  verifyPassword: "",
  isError: false,
  errorMessage: ""
}

export default class SignUpScreen extends React.Component{
  static navigationOptions = { header: null }
  
  handleBackToSignIn = () => this.props.navigation.dispatch(StackActions.pop({n: 1}));
  handleErrorDialogDismiss = () => this.setState({isError: false, errorMessage: ""});
  handleEmailChange = email => this.setState({email});
  handlePasswordChange = password => this.setState({password});
  handleVerifyPasswordChange = verifyPassword => this.setState({verifyPassword});
  handleContinuePress = () => {
    if(this.state.email === null || this.state.email === "" || this.state.email === undefined){
      this.setState({isError: true, errorMessage: "Email tidak boleh kosong!"});
    }else if(this.state.password === null || this.state.password === "" || this.state.password === undefined){
      this.setState({isError: true, errorMessage: "Password tidak boleh kosong!"});
    }else if(this.state.password !== this.state.verifyPassword){
      this.setState({isError: true, errorMessage: "Password tidak sama!"});
    }else{
      this.props.navigation.navigate("VerifyPhone", {email: this.state.email, password: this.state.password});
    }
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleBackToSignIn = this.handleBackToSignIn.bind(this);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.title}>Form Registrasi Pengguna Baru</Text>
        <Text style={{ fontSize: 12, marginBottom: 16 }}>Masukan email dan password untuk mendaftar pada aplikasi ini. Mohon untuk tidak pernah membagikan password kepada siapapun</Text>
        <View>
          <TextInput
            placeholder="Email ID"
            textContentType="emailAddress"
            value={this.state.email}
            onChangeText={this.handleEmailChange}/>
          <TextInput
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}/>
          <TextInput
            placeholder="Ulangi Password"
            textContentType="password"
            secureTextEntry={true}
            value={this.state.verifyPassword}
            onChangeText={this.handleVerifyPasswordChange}/>
          <Button text="Lanjutlan" onPress={this.handleContinuePress}/>
        </View>
        <TouchableOpacity style={styles.backToSignInContainer} onPress={this.handleBackToSignIn}>
          <Text style={{ textAlign: "center", color: "#0EAD69", fontWeight: "500" }}>Saya punya akun. Kembali ke Sign In</Text>
        </TouchableOpacity>
        <Portal>
          <Dialog visible={this.state.isError} onDismiss={this.handleErrorDialogDismiss}>
            <Dialog.Title>Ops!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.errorMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <MaterialButton onPress={this.handleErrorDialogDismiss}>Mengerti</MaterialButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 32,
    paddingRight: 32,
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  title: {
    fontWeight: "500",
    fontSize: 24,
    marginBottom: 4
  },
  backToSignInContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0
  }
})