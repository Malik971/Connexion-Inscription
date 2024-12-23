import {
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AjouterUnePublication() {
  const user = JSON.parse(localStorage.getItem("utilisateur"));
  const {
    // Fonction handleSubmit pour gérer la soumission du formulaire
    handleSubmit,
    // Fonction register pour enregistrer les champs du formulaire
    register,
    // Fonction reset pour réinitialiser les champs du formulaire
    reset,
    // Objet errors pour gérer les erreurs de validation
    formState: { errors },
  } = useForm();

  const useQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: (pub) => {
      return axios.post("http://localhost:3000/publication", pub);
    },
    onError: (error) => {
      toast.error("Erreur lors de la publication");
    },
    onSuccess: () => {
      reset();
      useQuery.invalidateQueries("publications");
      toast.success("Publication ajoutée avec succès");
    },
  });

  const onSubmit = (data) => {
    const publication = {
      ...data,
      utilisateurId: user.id,
      datePublication: new Date().toISOString(),
      likePublication: 0,
      auteur: user.nomUtilisateur,
    };
    mutation.mutate(publication);
  };

  // Détection de la taille de l'écran pour rendre l'interface responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      width={isMobile ? "90%" : "80%"} // Largeur ajustée pour mobile
      margin="auto"
      padding={isMobile ? 2 : 4} // Padding réduit pour les petits écrans
      sx={{
        marginTop: "50px", // Ajout d'un espace pour éviter le chevauchement avec la navbar
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginBottom: 2,
          fontSize: isMobile ? "1.2rem" : "1.5rem", // Texte plus petit sur mobile
        }}
      >
        Ajouter une publication
      </Typography>
      <Typography
        sx={{
          textAlign: "justify",
          fontSize: isMobile ? "0.9rem" : "1rem", // Explication adaptée pour les petits écrans
          marginBottom: 3,
        }}
      >
        Bienvenue sur la section d'ajout de publication. Ici, vous pouvez créer
        votre propre publication en entrant un texte et une URL d'image. Votre
        publication sera visible par tous les utilisateurs. Vous pouvez
        également explorer les publications des autres pour interagir avec leur
        contenu.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <TextField
            id="titre"
            label="Ajouter une publication"
            variant="outlined"
            fullWidth
            size="small"
            type="text"
            multiline
            rows={4}
            {...register("textePublication", {
              required: "Veuillez saisir un texte",
              minLength: {
                value: 5,
                message: "Le texte doit contenir au moins 5 caractères",
              },
              maxLength: {
                value: 1000,
                message: "Le texte doit contenir au plus 1000 caractères",
              },
            })}
            error={!!errors.textePublication}
            helperText={
              errors.textePublication ? errors.textePublication.message : ""
            }
          />
          <TextField
            id="titre"
            label="Entrer l'url de votre image"
            variant="outlined"
            fullWidth
            size="small"
            type="text"
            {...register("imagePublication", {
              required:
                "Veuillez saisir une image au format .png, .jpg, .jpeg ou .gif",
              pattern: {
                value: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i,
                message:
                  "Veuillez saisir une URL au format .png, .jpg, .jpeg ou .gif",
              },
            })}
            error={!!errors.imagePublication}
            helperText={
              errors.imagePublication
                ? errors.imagePublication.message
                : "Extension .png, .jpg, .jpeg ou .gif obligatoire"
            }
          />
          <Button
            // Propriétés variante, sx, type et endIcon de Button
            variant="contained"
            sx={{
              marginTop: 1,
              padding: isMobile ? 1 : 2, // Taille du bouton adaptée
              fontSize: isMobile ? "0.8rem" : "1rem",
            }}
            // type submit pour soumettre le formulaire
            type="submit"
            endIcon={<SendIcon />}
          >
            Publier
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
