import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Composant d'inscription qui contient un formulaire d'inscription
// avec les champs nom, email, mot de passe et confirmation de mot de passe

export default function inscription() {
  // Utilisation de useNavigate pour la navigation
  const navigate = useNavigate();
  // Utilisation de react-hook-form pour gérer le formulaire
  const {
    // Fonction handleSubmit pour gérer la soumission du formulaire
    handleSubmit,
    // Fonction register pour enregistrer les champs du formulaire
    register,
    // Objet errors pour gérer les erreurs de validation
    formState: { errors },
  } = useForm();
  // Fonction onSubmit pour gérer la soumission du formulaire
  const onSubmit = (data) => {
    if (data.motDePasse !== data.confirmerMotDePasse) {
      toast.error("Les mots de passe ne correspondent pas");
    } else {
      axios
        .get(`http://localhost:3000/utilisateur?email=${data.email}`)
        .then((res) => {
          if (res.data.length > 0) {
            toast.error("Un compte existe déjà avec cet email");
          } else {
            // Utilisation de axios pour envoyer les données du formulaire à l'API
            axios
              .post("http://localhost:3000/utilisateur", data)
              .then((res) => {
                console.log(res);

                toast.success("Inscription réussie");
                navigate("/connexion");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Erreur lors de l'inscription");
              });
          }
        });
    }
  };
  return (
    // Stack pour centrer le formulaire
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      bgcolor={"#f5f5f5"}
    >
      {/* Box pour contenir le formulaire */}
      <Box
        width={500}
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
          Inscription
        </Typography>
        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Stack pour aligner les champs du formulaire */}
          <Stack direction={"column"} gap={2}>
            {/* TextField pour les champs du formulaire */}
            <TextField
              // Propriétés de TextField
              id="outlined-basic"
              label="entrer ici votre nom"
              variant="outlined"
              fullWidth
              // Propriétés de register pour enregistrer le champ
              {...register("nomUtilisateur", {
                // Validation du champ nomUtilisateur
                required: "Ce champ est obligatoire",
                maxLength: {
                  value: 20,
                  message: "Le nom ne doit pas dépasser 20 caractères",
                },
                minLength: {
                  value: 3,
                  message: "Le nom doit contenir au moins 3 caractères",
                },
              })}
            />
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
                pattern: "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/",
              })}
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
            />
            <TextField
              id="outlined-basic"
              label="Veiullez confirmer votre mot de passe"
              variant="outlined"
              type="password"
              fullWidth
              {...register("confirmerMotDePasse", {
                required: "Ce champ est obligatoire",
                maxLength: {
                  value: 20,
                  message: "Le mot de passe ne doit pas dépasser 20 caractères",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre",
                    },
                  },
                },
              })}
            />
          </Stack>
          {/* Button pour soumettre le formulaire */}
          <Button
            // Propriétés variante, sx, type et endIcon de Button
            variant="contained"
            sx={{ marginTop: 2 }}
            // type submit pour soumettre le formulaire
            type="submit"
            endIcon={<SendIcon />}
          >
            Inscription
          </Button>
        </form>
      </Box>
    </Stack>
  );
}
