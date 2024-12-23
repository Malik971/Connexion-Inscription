import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { GoogleIcon } from "../dashboard/components/CustomIcons";

// Composant d'inscription qui contient un formulaire d'inscription
// avec les champs nom, email, mot de passe et confirmation de mot de passe

export default function Connexion() {
  // Utilisation de useNavigate pour la navigation
  const navigate = useNavigate();

  // Fonction de connexion via Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Vérifiez si l'utilisateur existe déjà dans Firestore
      const userDoc = await doc(db, "utilisateurs", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // Si l'utilisateur Google n'existe pas encore, ajoutez-le à la base de données
        const newUser = {
          nom: user.displayName,
          email: user.email,
          image: user.photoURL,
          google: true, // Indique qu'il s'agit d'un utilisateur Google
        };
        await setDoc(userDoc, newUser);
        localStorage.setItem("utilisateur", JSON.stringify(newUser));
        toast.success("Bienvenue, utilisateur Google ajouté !");
      } else {
        // Si l'utilisateur existe, utilisez ses données
        localStorage.setItem(
          "utilisateur",
          JSON.stringify(userSnapshot.data())
        );
        toast.success("Connexion réussie avec Google !");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la connexion avec Google.");
    }
  };
  // Utilisation de useEffect pour vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const utilisateur = localStorage.getItem("utilisateur");
    if (utilisateur) {
      navigate("/"); // Redirection vers la page d'accueil si un utilisateur est connecté
    }
  }, [navigate]);
  // Utilisation de react-hook-form pour gérer le formulaire
  const {
    // Fonction handleSubmit pour gérer la soumission du formulaire
    handleSubmit,
    // Fonction register pour enregistrer les champs du formulaire
    register,
    // Objet errors pour gérer les erreurs de validation
    formState: { errors },
  } = useForm();

  // Fonction de connexion avec email et mot de passe
  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.motDePasse
      );
      const user = userCredential.user;

      // Récupérez les informations utilisateur depuis Firestore
      const userDoc = doc(db, "utilisateurs", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        localStorage.setItem(
          "utilisateur",
          JSON.stringify(userSnapshot.data())
        );
        navigate("/");
        toast.success("Connexion réussie");
      } else {
        toast.error("Utilisateur non trouvé dans Firestore");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Erreur lors de la connexion : Email ou mot de passe incorrect"
      );
    }
  };

  // Détection de la taille de l'écran
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Pour les écrans <600px

  return (
    // Stack pour centrer le formulaire
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      bgcolor={"#f5f5f5"}
      padding={isMobile ? 2 : 0} // Réduction du padding sur mobile
    >
      {/* Box pour contenir le formulaire */}
      <Box
        width={isMobile ? "90%" : 500} // Largeur ajustée pour mobile
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          padding: 2,
        }}
      >
        {/* Typography utiliser par matérial mui */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          Connexion
        </Typography>
        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Stack pour aligner les champs du formulaire */}
          <Stack direction={"column"} gap={2}>
            {/* TextField pour les champs du formulaire */}
            <TextField
              id="outlined-basic"
              label="entrer ici votre email"
              variant="outlined"
              fullWidth
              // type email qui permet de vérifier si l'email contient un @
              type="email"
              {...register("email", {
                required: "Ce champ est obligatoire",
                // ce qui suit est une expression régulière pour valider l'email
                // elle vérifie si l'email est de la forme
                // email@domaine
                // où domaine est de la forme domaine.com
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "email de la forme email@domaine.com",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
            <TextField
              id="outlined-basic"
              label="entrer ici votre mot de passe"
              variant="outlined"
              type="password"
              fullWidth
              {...register("motDePasse", {
                required: "Ce champ est obligatoire",
                maxLength: {
                  value: 20,
                  message: "Le mot de passe ne doit pas dépasser 20 caractères",
                },
                minLength: {
                  value: 8,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères",
                },
                pattern: {
                  // expression régulière pour valider le mot de passe
                  // il doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre
                  // et doit contenir au moins 8 caractères
                  // il est de la forme [a-zA-Z\d]{8,}
                  // où a-zA-Z\d signifie une lettre majuscule, une lettre minuscule et un chiffre
                  // {8,} signifie qu'il doit contenir au moins 8 caractères
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre",
                },
              })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse ? errors.motDePasse.message : ""}
            />
          </Stack>
          {/* Button pour soumettre le formulaire */}
          <Stack>
            <Button
              // Propriétés variante, sx, type et endIcon de Button
              variant="contained"
              sx={{
                marginTop: 2,
                padding: isMobile ? 1 : 2, // Bouton plus petit sur mobile
                fontSize: isMobile ? "0.8rem" : "1rem",
              }}
              // type submit pour soumettre le formulaire
              type="submit"
              endIcon={<SendIcon />}
            >
              Connexion
            </Button>
            <Typography
              sx={{
                textAlign: "center",
                marginTop: 2,
                marginBottom: 2,
                fontSize: isMobile ? "0.9rem" : "1rem", // Taille de texte ajustée pour les mobiles
              }}
            >
              Pas encore de compte ? <Link to="/inscription">Inscription</Link>
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
            >
              Se connecter avec Google
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
