export const ALL_TASKS = [
	"Pikat se zavřenýma očima do 10ti+před pikolou za pikolou…",
	"Záchod - předveď, že kakáš.",
	"Udělej 10 dřepů.",
	"Udělej 10 kliků.",
	"Zazpívej skákal pes přes oves.",
	"Postav malou pyramidu z karet.",
	"Čti nahlas v knize stranu… ",
	"Stůj na 1 noze a počítej do 60 vteřin.",
	"Dej si s někým páku.",
	"Vypij sklenici vody.",
	"Lehni si na matračku a napočítej 40 oveček.",
	"10x se pokloň skřítkovi.",
	"Napiš 20 slov na písmeno m.",
	"Veď cca dvouminutový monolog na téma Jak vést nováčkovský trénink.",
	"Předstírej čištění zubů cca 1 minutu.",
	"Předstírej, že si dáváš vanu cca 1 minutu.",
	"Bež do kuchyně a zařvi, Máš hlad? a počkáš na odpověď.",
	"Sedni si před krb a předstírej, že opékáš špekáčky.",
	"Vyfoť selfie a pošli to do Discord kanálu among-us.",
	"Vyjdi ven, sundej si kalhoty a zařvi: Chce tady někdo sex?",
	"Předstírej, že přebaluješ dítě cca 1 minutu.",
	"Dojdi pro 2 kusy dřeva do kůlny.",
];

export const IMPOSTOR_CARD = "🔪 Jsi IMPOSTOR! 🔪";

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Generate tasks for all players, trying to maximize variety
export function generateTasksForPlayers(
	playerCount: number,
	impostorCount: number,
): { tasks: string[]; isImpostor: boolean }[] {
	const players: { tasks: string[]; isImpostor: boolean }[] = [];

	// Validate impostor count - must be at least 1 and at most playerCount - 1
	const validatedImpostorCount = Math.max(
		1,
		Math.min(impostorCount, playerCount - 1),
	);

	console.log(
		`generateTasksForPlayers called: ${playerCount} players, ${impostorCount} requested impostors, ${validatedImpostorCount} actual impostors`,
	);

	// Determine which players are impostors
	const impostorIndices = new Set<number>();
	while (impostorIndices.size < validatedImpostorCount) {
		impostorIndices.add(Math.floor(Math.random() * playerCount));
	}

	console.log(`Impostor indices: ${Array.from(impostorIndices).join(", ")}`);

	// Create a pool of tasks - we'll cycle through shuffled versions
	let taskPool = shuffleArray(ALL_TASKS);
	let taskIndex = 0;

	// For each player, assign 5 tasks (or 6 for crewmates, but we use 5 + impostor card)
	// Actually: 6 cards total - impostors get 5 tasks + impostor card
	// Crewmates get 6 tasks

	for (let i = 0; i < playerCount; i++) {
		const isImpostor = impostorIndices.has(i);
		const taskCount = isImpostor ? 5 : 6;
		const playerTasks: string[] = [];

		for (let t = 0; t < taskCount; t++) {
			// If we've used all tasks, reshuffle
			if (taskIndex >= taskPool.length) {
				taskPool = shuffleArray(ALL_TASKS);
				taskIndex = 0;
			}
			playerTasks.push(taskPool[taskIndex]);
			taskIndex++;
		}

		// Shuffle the player's own tasks so order varies
		const shuffledPlayerTasks = shuffleArray(playerTasks);

		if (isImpostor) {
			// Insert impostor card at random position
			const insertPosition = Math.floor(Math.random() * 6);
			shuffledPlayerTasks.splice(insertPosition, 0, IMPOSTOR_CARD);
		}

		players.push({
			tasks: shuffledPlayerTasks,
			isImpostor,
		});
	}

	return players;
}
