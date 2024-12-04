import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function CartPub({ publication }) {
  const user = JSON.parse(localStorage.getItem("utilisateur"));
  const queryClient = useQueryClient();
  const supprimerPublication = (id) => async () => {
    await axios.delete(`http://localhost:3000/publication/${id}`);
    queryClient.invalidateQueries("publications");
  };
  return (
    <Box
      width={"100%"}
      margin={"auto"}
      padding={"10px"}
      bgcolor={"#f5f5f5"}
      borderRadius={4}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Avatar src={publication.utilisateur} />
        <Typography>{publication.auteur}</Typography>

        {user.id === publication.utilisateurId && (
          <IconButton
            aria-label="delete"
            onClick={supprimerPublication(publication.id)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
      <Typography>{publication.textePublication}</Typography>
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
  );
}
