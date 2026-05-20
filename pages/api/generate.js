export default async function handler(req, res) {
  const { location, level } = req.body;

  const prompt = `
    You are an Expert Lead Instructor. Generate a training scenario based on:
    Location: ${location}
    Aggression Level: ${level}

    YOU MUST FOLLOW THIS 10-SECTION STRUCTURE:
    1. THE BIG PICTURE: Contextualize the location.
    2. OBJECTIVES: One primary objective + observable behaviors.
    3. ENGAGEMENT: A tense opening line.
    4. LAST LESSON: Link to basic foundation skills.
    5. MURPHY MOMENT: Introduce ONE specific complication.
    6. SEQUENCE/FLOW: Branching logic (If X, then Y).
    7. PLANNED MODELING: When the instructor demos.
    8. SCAFFOLDING: Plan for 3-5 reps, reducing support.
    9. INTERVENTIONS: Specific "Freeze" and "Rewind" prompts.
    10. STICKABILITY: Debrief plan + Training Scar check.

    Include references to NDM, Section 3 Criminal Law Act, and safety warnings for Positional Asphyxia.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "system", content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ output: data.choices[0].message.content });
}
