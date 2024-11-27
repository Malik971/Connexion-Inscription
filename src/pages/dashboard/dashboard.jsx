import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import AjouterUnePublication from "./components/AjouterUnePublication";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export default function dashboard() {
  const Navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("utilisateur")) {
      Navigate("/connexion");
    }
  });


    const queryClient = useQueryClient();
    const {data:publication, error, isLoading} = useQuery({
      queryKey: ["publications"],
      queryFn: () =>
        axios
          .get("http://localhost:3000/publication").then((res) => res.data),
      onerror: (error) => console.log(error),
    });

  if (isLoading) {
    return <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    }}
    >
      <h1>
        <center>
          Chargement...
        </center>
      </h1>
    </div>;
  }

  return (
    <Box>
      <Navbar />
      <AjouterUnePublication />
      <Box width={"80%"} margin={"auto"}>
        {publication.map((publication) => (
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
        ))}
      </Box>
    </Box>
  );
}
