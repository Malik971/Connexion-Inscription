import { Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
  const onSubmit = (data) => {
        const publication = {
            ...data,
            utilisateurId: user.id,
            datePublication: new Date().toISOString(),
            likePublication: 0,
            auteur: user.nomUtilisateur,
        }
        
        axios.post("http://localhost:3000/publication", publication).then((res) => {
            console.log(res);
            toast.success("Publication ajoutée");
            reset();
        })
        .catch((err) => {
            console.log(err);
            toast.error("Erreur lors de l'ajout de la publication");
        });
  };

  return (
    <Stack width={"80%"} margin={"auto"}>
      <h1>Ajouter une publication</h1>
      <form
        style={{
          marginTop: 4,
        }}
        // Propriétés onSubmit et handleSubmit de la balise form
        onSubmit={handleSubmit(onSubmit)}
      >
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
          />
          <TextField
            id="titre"
            label="Entrer l'url de votre image"
            variant="outlined"
            fullWidth
            size="small"
            type="text"
            {...register("imagePublication", {
              required: "Veuillez saisir une image",
              pattern: {
                // L'url doit commencer par http ou https et se terminer par .png, .jpg, .jpeg ou .gif
                value: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i,
                message: "Veuillez saisir une url valide",
              },
            })}
          />
          <Button
            // Propriétés variante, sx, type et endIcon de Button
            variant="contained"
            sx={{ 
                marginTop: 1,
                marginBottom: 4,
            
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
