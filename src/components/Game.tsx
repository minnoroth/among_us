"use client";

import {
	Box,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { database, ref, remove } from "@/lib/firebase";

interface GameProps {
	tasks: string[];
	isImpostor: boolean;
	onGameEnd: () => void;
}

export default function Game({ tasks, onGameEnd }: GameProps) {
	const [endDialogOpen, setEndDialogOpen] = useState(false);

	// Prevent page refresh during game
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "Hra stále běží! Opravdu chceš odejít?";
			return e.returnValue;
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);

	const handleEndGame = async () => {
		// Clear the entire game state
		await remove(ref(database, "game"));
		onGameEnd();
	};

	const getCardStyle = () => {
		return {
			bgcolor: "#1976d2",
			color: "white",
		};
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			minHeight="100vh"
			p={2}
			pb={10}
		>
			<Paper
				elevation={3}
				sx={{
					p: 3,
					maxWidth: 500,
					width: "100%",
					mb: 2,
				}}
			>
				<Typography variant="h4" textAlign="center" gutterBottom>
					🎮 Tvoje úkoly
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					textAlign="center"
					gutterBottom
				>
					Plň úkoly popořadě, jak jsou zobrazeny
				</Typography>
			</Paper>

			<Box
				display="flex"
				flexDirection="column"
				gap={2}
				width="100%"
				maxWidth={500}
			>
				{tasks.map((task, index) => (
					<Card key={task} sx={getCardStyle()}>
						<CardContent>
							<Box display="flex" alignItems="flex-start" gap={2}>
								<Typography
									variant="h5"
									sx={{
										minWidth: 40,
										height: 40,
										borderRadius: "50%",
										bgcolor: "rgba(255,255,255,0.2)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{index + 1}
								</Typography>
								<Typography
									variant="body1"
									sx={{ pt: 0.5, fontSize: "1.1rem" }}
								>
									{task}
								</Typography>
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>

			<Box
				position="fixed"
				bottom={0}
				left={0}
				right={0}
				p={2}
				bgcolor="background.paper"
				boxShadow={3}
			>
				<Button
					variant="outlined"
					color="error"
					fullWidth
					onClick={() => setEndDialogOpen(true)}
					sx={{ maxWidth: 500, mx: "auto", display: "block" }}
				>
					Ukončit hru
				</Button>
			</Box>

			<Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)}>
				<DialogTitle>Ukončit hru?</DialogTitle>
				<DialogContent>
					<Typography>
						Opravdu chceš ukončit hru pro všechny hráče? Všichni budou odpojeni
						z lobby.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEndDialogOpen(false)}>Zrušit</Button>
					<Button onClick={handleEndGame} color="error" variant="contained">
						Ukončit hru
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
