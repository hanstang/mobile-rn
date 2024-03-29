import { Database } from "./index";

class Query{
  /**
   * 
   * @param {Database} database 
   */
  constructor(database = new Database()){
    this.database = database;
    this.getConfiguration = { source: "cache" };
  }

  setGetConfiguration(source){ this.getConfiguration = { source }; }
}

export class AddDocument extends Query{
  constructor(){
    super();
    this.executeQuery = this.executeQuery.bind(this);
    this.executeFirebaseQuery = this.executeFirebaseQuery.bind(this);
  }

  /**
   * 
   * @param {Collection} collection 
   * @param {Document} firebaseDocument - set is as `null` to automatically create document id 
   * @param {Object} defaultValue 
   * @param {Object} setOption - see firestore SetOptions documentation
   * @returns {Promise} - firebase `set` function
   */
  executeQuery(collection, firebaseDocument=null, defaultValue, setOptions = {}){
    const collectionRef = this.database.getDatabase().collection(collection.getName());
    return this.executeFirebaseQuery(collectionRef, firebaseDocument, defaultValue, setOptions);
  }

  /**
   * 
   * @param {CollectionReference} firebaseReference 
   * @param {Document} firebaseDocument - set is as `null` to automatically create document id 
   * @param {Object} defaultValue 
   * @param {Object} setOptions 
   */
  executeFirebaseQuery(collectionRef, firebaseDocument=null, defaultValue, setOptions){
    if(firebaseDocument === null) return collectionRef.add(defaultValue);
    else return collectionRef.doc(firebaseDocument.getId()).set(defaultValue, setOptions);
  }
}


export class GetDocument extends Query{  
  /**
   * 
   * @param {Collection} collection 
   * @param {Document} firebaseDocument 
   */
  executeQuery(collection, firebaseDocument){
    return this.database.getDatabase()
                        .collection(collection.getName())
                        .doc(firebaseDocument.getId())
                        .get(this.getConfiguration);
  }

  executeFirebaseQuery(firebaseQuery){
    return firebaseQuery.get(this.getConfiguration);
  }
}

export class UpdateDocument extends Query{
  /**
   * 
   * @param {Collection} collection 
   * @param {Document} firebaseDocument 
   * @param {Object} updateObject - Firestore update statement, see firebase/firestore documentation
   */
  executeQuery(collection, firebaseDocument, updateObject){
    return this.database.getDatabase()
                        .collection(collection.getName())
                        .doc(firebaseDocument.getId())
                        .update(updateObject)
  }
}

export class RemoveDocumentField extends Query{
  executeQuery(collection, firebaseDocument, removeObject){
    return this.database.getDatabase()
                        .collection(collection.getName())
                        .doc(firebaseDocument.getId())
                        .update(removeObject);
  }
}

export class SearchDocumentByField extends Query{
  /**
   * 
   * @param {String} fieldName 
   * @param {String} operator - Firebase operator, refer to [https://firebase.google.com/docs/firestore/query-data/queries?authuser=0#simple_queries](Firebase Documentation)
   * @param {String} searchValue 
   */
  constructor(fieldName, operator, searchValue){
    super();
    this.fieldName = fieldName;
    this.operator = operator
    this.searchValue = searchValue;
  }

  /**
   * 
   * @param {Collection} collection 
   * @returns {Promise} Firebase Firestore `get` function. This function will return null if you are not providing `fieldName`, `operator` and `searchValue`.
   */
  executeQuery(collection){
    if(this.fieldName && this.operator && this.searchValue){
      return this.database.getDatabase()
                          .collection(collection.getName())
                          .where(this.fieldName, this.operator, this.searchValue)
                          .get(this.getConfiguration);
    }else return null;
  }
}