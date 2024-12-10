import { Avatar, Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function CartPub({ publication }) {
  const [likes, setLikes] = useState(publication.likePublication);
  const user = JSON.parse(localStorage.getItem("utilisateur"));
  const queryClient = useQueryClient();

  // Fonction pour supprimer une publication
  const supprimerPublication = (id) => async () => {
    await axios.delete(`http://localhost:3000/publication/${id}`);
    queryClient.invalidateQueries("publications");
  };

  // Fonction pour aimer une publication
  const aimerPublication = async () => {
    const updatedPublication = { ...publication, likePublication: likes + 1 };
    await axios.put(`http://localhost:3000/publication/${publication.id}`, updatedPublication);
    setLikes((prevLikes) => prevLikes + 1);
  };

  // Fonction pour partager une publication
  const partagerPublication = () => {
    if (navigator.share) {
      navigator
        .share({
          title: publication.textePublication,
          text: publication.textePublication,
          url: window.location.href,
        })
        .then(() => console.log("Partage réussi"))
        .catch((error) => console.error("Erreur lors du partage :", error));
    } else {
      alert("Le partage n'est pas supporté sur ce navigateur.");
    }
  };

  return (
    <Box
      width={"100%"}
      maxWidth={"800px"}
      margin={"auto"}
      padding={"10px"}
      marginTop={2}
      bgcolor={"#f5f5f5"}
      borderRadius={4}
      boxShadow={2}
    >
       {/* En-tête avec avatar, auteur et icône de suppression */}
      <Stack direction={"row"} alignItems={"center"} spacing={2} mb={2}>
        <Avatar src={publication.utilisateur} />
        <Typography variant="subtitle1" fontWeight={"bold"}>{publication.auteur}</Typography>

        {user.id === publication.utilisateurId && (
          <IconButton
            aria-label="delete"
            onClick={supprimerPublication(publication.id)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>

      {/* Contenu de la publication */}
      <Typography  variant="body1" mb={2}>{publication.textePublication}</Typography>

      {/* Image de la publication */}
      <Box
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "400px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      <img
        src={publication.imagePublication}
        alt={publication.textePublication}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 4,
          marginTop: 2,
        }}
      />
      </Box>
      {/* Boutons d'interaction */}
      <Stack direction={"row"} justifyContent={"space-between"} mt={2}>
        {/* Bouton "Like" */}
        <Button
          startIcon={<FavoriteIcon />}
          onClick={aimerPublication}
          color="error"
        >
          {likes} J'aime
        </Button>

        {/* Bouton "Partager" */}
        <Button
          startIcon={<ShareIcon />}
          onClick={partagerPublication}
          color="primary"
        >
          Partager
        </Button>
      </Stack>
      
    </Box>
  );
}
