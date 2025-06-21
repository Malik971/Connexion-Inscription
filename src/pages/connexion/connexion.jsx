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
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, db } from "../../config/firebase-config";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleIcon } from "../dashboard/components/CustomIcons";

export default function Connexion() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const utilisateur = localStorage.getItem("utilisateur");
    if (utilisateur) navigate("/");
  }, [navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.motDePasse
      );
      const user = userCredential.user;

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
      toast.error("Email ou mot de passe incorrect");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithRedirect(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "utilisateurs", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        const newUser = {
          nom: user.displayName,
          email: user.email,
          image: user.photoURL,
          google: true,
        };
        await setDoc(userDoc, newUser);
        localStorage.setItem("utilisateur", JSON.stringify(newUser));
        toast.success("Bienvenue !");
      } else {
        localStorage.setItem(
          "utilisateur",
          JSON.stringify(userSnapshot.data())
        );
        toast.success("Connexion réussie avec Google !");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur avec Google.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Box
        className="shadow-xl w-full max-w-md bg-white rounded-2xl"
        sx={{ p: isMobile ? 2 : 4 }}
      >
        <Typography
          variant="h4"
          className="text-center font-bold text-gray-800 mb-4"
        >
          Connexion
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              id="email-field"
              label="Adresse e-mail"
              variant="outlined"
              type="email"
              fullWidth
              {...register("email", {
                required: "Ce champ est obligatoire",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Format d'email invalide",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              id="password-field"
              label="Mot de passe"
              variant="outlined"
              type="password"
              fullWidth
              {...register("motDePasse", {
                required: "Ce champ est obligatoire",
                minLength: {
                  value: 8,
                  message: "Minimum 8 caractères",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "Doit contenir une majuscule, une minuscule et un chiffre",
                },
              })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
            />

            <Button
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
              className="!bg-blue-600 hover:!bg-blue-700 transition-all text-white font-semibold"
            >
              Se connecter
            </Button>

            <Typography className="text-center text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link to="/inscription" className="text-blue-600 underline">
                Inscription
              </Link>
            </Typography>

            <Button
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              className="hover:!bg-gray-100 transition-all"
            >
              Se connecter avec Google
            </Button>
          </Stack>
        </form>
      </Box>
    </div>
  );
}
