import { initializeApp } from "firebase/app";
import {  getFirestore, collection,  
    getDocs, DocumentData, getDoc,
    addDoc, deleteDoc,
    doc,
    CollectionReference,
    updateDoc,
    DocumentReference} from "firebase/firestore";

import {getDownloadURL, getStorage, ref, uploadBytes,deleteObject, UploadMetadata} from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MESASUREMENT_ID
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

/* Firestore */

//pega o número de elementos tem uma coleção
export async function sizeCollection(collection:CollectionReference<DocumentData, DocumentData>):Promise<number>{
    return (await getDocs(collection)).size;
}

//pega uma coleção para trabalhar
export function getCollection(name:string):CollectionReference<DocumentData, DocumentData>{
    return collection(db, name);
}

//pega todos itens de uma coleção
export async function getItems(collection:CollectionReference<DocumentData, DocumentData>): Promise<{id:string, data:any}[]>{
    return  (await getDocs(collection)).docs.map((doc)=>{
        return {
            id: doc.id.toString(), 
            data: doc.data()
        }
    });
}


//pega apenas um item de uma coleção
export async function getItem(doc: DocumentReference<unknown, DocumentData>){
    return await getDoc(doc);
}


//pega a referencia de um documento
export async function getItemReference(collection:string, docId:string){
    return await doc(db, collection, docId);
}

//adiciona um item a uma coleção
export async function putItem(collection:CollectionReference<DocumentData, DocumentData>, data:any){
 return (await  addDoc(collection, data));
}


//Atualiza os dados de um item de uma coleção
export async function updateItem(doc:DocumentReference<unknown, DocumentData>, data:any){
    await updateDoc(doc, data);
}

//deleta um item de uma coleção
export async function deleteItem(collection:string, docId:string){
    await deleteDoc(await getItemReference(collection, docId));
}

/* Storage */

//enviar ficheiro para o firebase
export function uploadFile(url:string, data: ArrayBuffer | Blob | Uint8Array, 
    metadata:UploadMetadata |  undefined = undefined
    ){

    return new Promise<string>(async (resolve, reject)=>{
        const imageRef = ref(storage, url);
        resolve(await getDownloadURL((await uploadBytes(imageRef, data, metadata)).ref))
    });
   
}

//eliminar ficheiro do firebase
export async function deleteFile(url:string){
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}