// app/api/study-plan/route.ts
import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const { jobTitle, company, jobDescription } = await req.json();

    if (!jobTitle || !company) {
      return Response.json(
        { error: "jobTitle och company är obligatoriska" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "Du är en expertcoach för tekniska intervjuer. Du skapar en överblickande roadmap för vad som förväntas av kandidaten i JSON-format.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Skapa en konkret överblick för vad som förväntas inför en teknisk intervju.

Jobbtitel: ${jobTitle}
Företag: ${company}
Jobbbeskrivning (kan vara tom): ${
                jobDescription || "Ingen beskriven."
              }

Returnera SVARET SOM REN JSON med följande struktur (exakt fältnamn, inga extra fält):

{
  "focus_area": "kort text som beskriver vad intervjun kommer att fokusera på",

  "key_skills": [
    [
      "första kompetens i kolumn 1",
      "andra kompetens i kolumn 1"
    ],
    [
      "första kompetens i kolumn 2",
      "andra kompetens i kolumn 2"
    ]
  ],

  "question_types": {
    "groups": [
      {
        "heading": "1. Technical",
        "items": [
          "exempel på teknisk fråga 1",
          "exempel på teknisk fråga 2"
        ]
      },
      {
        "heading": "2. Behavioral",
        "items": [
          "exempel på beteendefråga 1",
          "exempel på beteendefråga 2"
        ]
      },
      {
        "heading": "3. Practical",
        "items": [
          "exempel på praktisk fråga 1",
          "exempel på praktisk fråga 2"
        ]
      }
    ]
  },

  "preparation": [
    "konkret bullet point för hur användaren bör förbereda sig",
    "ytterligare konkret förberedelse-punkt",
    "tipsa gärna om vilka verktyg eller hemsidor som kan användas för att öva på kunskaperna som efterfrågas"
  ]
}

VIKTIGT:
- Svara *endast* med giltig JSON.
- Skriv INTE \`\`\`json eller andra code blocks runt svaret.
- Ingen extra text före eller efter JSON:et.
              `,
            },
          ],
        },
      ],
    });

    const raw = response.output_text;
    let cleaned = raw.trim();

    if (cleaned.startsWith("```")) {
      const firstNewline = cleaned.indexOf("\n");
      const lastFence = cleaned.lastIndexOf("```");

      if (firstNewline !== -1 && lastFence !== -1 && lastFence > firstNewline) {
        cleaned = cleaned.slice(firstNewline + 1, lastFence).trim();
      }
    }

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch (e) {
      console.error("Kunde inte JSON-parsa modellen:", cleaned);
      return Response.json(
        {
          error: "Modellen returnerade ogiltig JSON.",
          raw,
        },
        { status: 500 }
      );
    }

    return Response.json(plan);
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "Något gick fel när studieplanen skulle genereras.",
      },
      { status: 500 }
    );
  }
}
