'use server'

export async function sendPosition(fix: { lat: number; lng: number }) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/traffic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fix),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de la position");
    }

    const data = await response.json();
    console.log("Position envoyée avec succès:", data);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la position:", error);
  }
}


