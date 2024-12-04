import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import AjouterUnePublication from "./components/AjouterUnePublication";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import CartPub from "./components/CartPub";

export default function dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("utilisateur")) {
      navigate("/connexion");
    }
  });

  
  const {
    data: publications,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["publications"],
    queryFn: () =>
      axios.get("http://localhost:3000/publication").then((res) => res.data),
    onerror: (error) => console.log(error),
  });

  let pubTrier = publications?.sort((a, b) => {
    return new Date(b.datePublication) - new Date(a.datePublication);
  })

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <h1>
          <center>Chargement...</center>
        </h1>
      </div>
    );
  }

  return (
    <Box>
      <Navbar />
      <AjouterUnePublication />
      <Box width={"80%"} margin={"auto"} marginTop={2}>
        {publications && pubTrier.map((publication) => (
          <CartPub publication={publication} />
        ))}
      </Box>
    </Box>
  );
}
