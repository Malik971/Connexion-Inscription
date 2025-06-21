// ✅ INSCRIPTION AVEC FIREBASE + VALIDATION + UI MODERNISÉE

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
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { auth, provider, db } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Inscription() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.motDePasse !== data.confirmerMotDePasse) {
      return toast.error("Les mots de passe ne correspondent pas");
    }

    const userDocRef = doc(db, "utilisateurs", data.email);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      toast.error("Un compte existe déjà avec cet email");
    } else {
      try {
        await setDoc(userDocRef, {
          nomUtilisateur: data.nomUtilisateur,
          email: data.email,
          dateInscription: new Date().toISOString(),
        });
        toast.success("Inscription réussie");
        navigate("/connexion");
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors de l'inscription");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "utilisateurs", user.uid);
      const snapshot = await getDoc(userDoc);

      if (!snapshot.exists()) {
        await setDoc(userDoc, {
          nomUtilisateur: user.displayName,
          email: user.email,
          dateInscription: new Date().toISOString(),
        });
      }

      localStorage.setItem("utilisateur", JSON.stringify(user));
      toast.success("Connexion réussie avec Google");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion avec Google");
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      bgcolor="#f5f5f5"
      padding={isMobile ? 2 : 0}
    >
      <Box
        width={isMobile ? "90%" : 500}
        bgcolor="white"
        borderRadius={2}
        p={3}
      >
        <Typography variant="h4" textAlign="center" mb={2}>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            <TextField
              id="nom"
              label="Nom complet"
              {...register("nomUtilisateur", {
                required: "Nom requis",
                minLength: { value: 3, message: "Min. 3 caractères" },
                maxLength: { value: 20, message: "Max. 20 caractères" },
              })}
              error={!!errors.nomUtilisateur}
              helperText={errors.nomUtilisateur?.message}
              fullWidth
            />

            <TextField
              id="email"
              label="Email"
              type="email"
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Email invalide",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              id="password"
              label="Mot de passe"
              type="password"
              {...register("motDePasse", {
                required: "Mot de passe requis",
                minLength: { value: 8, message: "Min. 8 caractères" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message: "1 majuscule, 1 minuscule, 1 chiffre minimum",
                },
              })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
              fullWidth
            />

            <TextField
              id="confirm-password"
              label="Confirmer le mot de passe"
              type="password"
              {...register("confirmerMotDePasse", {
                required: "Confirmation requise",
                validate: (val) =>
                  val === watch("motDePasse") ||
                  "Les mots de passe ne correspondent pas",
              })}
              error={!!errors.confirmerMotDePasse}
              helperText={errors.confirmerMotDePasse?.message}
              fullWidth
            />

            <Button
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
              sx={{ mt: 2, py: 1.5 }}
            >
              Inscription
            </Button>

            <Typography textAlign="center">
              Déjà inscrit ? <Link to="/connexion">Connexion</Link>
            </Typography>

            <Button
              onClick={handleGoogleLogin}
              variant="outlined"
              color="primary"
            >
              Se connecter avec Google
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
