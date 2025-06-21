import { db } from './firebase-config';  // Importer la configuration Firebase
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";

// Ajouter un utilisateur dans Firestore
export const addUser = async (user) => {
  try {
    await setDoc(doc(db, "utilisateurs", user.id), user);  // Ajouter un utilisateur avec son ID unique
    console.log("Utilisateur ajouté avec succès !");
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'utilisateur : ", e);
  }
};

// Récupérer tous les utilisateurs depuis Firestore
export const getUsers = async () => {
  const usersCollection = collection(db, "utilisateurs");
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  return userList;  // Retourne une liste d'utilisateurs
};

// Ajouter une publication
export const addPublication = async (publication) => {
  try {
    await setDoc(doc(db, "publications", publication.id), publication);  // Ajouter une publication avec son ID unique
    console.log("Publication ajoutée avec succès !");
  } catch (e) {
    console.error("Erreur lors de l'ajout de la publication : ", e);
  }
};

// Récupérer toutes les publications
export const getPublications = async () => {
  const publicationsCollection = collection(db, "publications");
  const publicationSnapshot = await getDocs(publicationsCollection);
  const publicationList = publicationSnapshot.docs.map((doc) => doc.data());
  return publicationList;  // Retourne une liste de publications
};