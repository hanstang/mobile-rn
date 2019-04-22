import { Database } from "./index";

export class Collection{
  /**
   * 
   * @param {String} name - a collection name
   */
  constructor(name){ this.name = name }

  getName(){return this.name}

  getFirebaseReference(database = new Database()){
    return database.getDatabase().collection(this.name);
  }
}

export class UserCollection extends Collection{
  constructor(){ super("users"); }
}

export class FriendRequestCollection extends Collection{
  constructor(){ super("friendRequest"); }
}

export class FriendListCollection extends Collection{
  constructor(){ super("friendList"); }
}

export class RoomsCollection extends Collection{
  constructor(){ super("rooms"); }
}

export class MessagesCollection extends Collection{ 
  constructor(){ super("messages"); }
}