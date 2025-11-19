// app/api/interview-question/route.js
import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const {
      jobTitle,
      company,
      jobDescription,
      history, // array av { question, answer, feedback?, score? }
    } = await req.json();

    const safeHistory = Array.isArray(history) ? history : [];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
Du är en teknisk intervju-coach.

Regler:
- Varje fråga ska vara från ett nytt fokusområde jämfört med den senaste frågan.
- Du ställer inga följdfrågor på samma område.
- Feedback och ideal answer-outline ska ALLTID handla om den SENASTE frågan och kandidatens SENASTE svar.

Process:
- Analysera kandidatens senaste svar (om det finns).
- Ge feedback + score på den SENASTE frågan.
- Generera en nästa fråga som handlar om ett ANNAT fokusområde än den senaste frågan.
- Svara i strikt JSON enligt given struktur.
      `,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Här är kontext om rollen:
Jobbtitel: ${jobTitle}
Företag: ${company}
Jobbbeskrivning: ${jobDescription || "Ingen beskriven"}

Senaste frågan kandidaten fick:
${safeHistory.at(-1)?.question || "Ingen tidigare fråga"}

Kandidatens senaste svar:
${safeHistory.at(-1)?.answer || "Inget tidigare svar"}

Full historik av frågor/svar hittills:
${JSON.stringify(safeHistory, null, 2)}

VIKTIGT:
- Feedback och score ska ALLTID baseras på just "senaste frågan" och "senaste svaret".
- "focus_area" ska beskriva området för den SENASTE frågan (inte nästa fråga).
- "suggested_ideal_answer_outline" ska vara en direkt mall för ett perfekt svar på den SENASTE frågan.
- Nästa fråga ("next_question") ska vara inom ett ANNAT fokusområde än den senaste frågan, men "focus_area" ändras inte för den.

Returnera SVAR SOM REN JSON med denna struktur:

{
  "feedback_on_last_answer": "feedback på senaste svaret, eller null om ingen tidigare fråga",
  "score_on_last_answer": 0-10 eller null,
  "focus_area": "område för den SENASTE frågan (t.ex. Scrum, databaser, REST API-design)",
  "difficulty": "easy | medium | hard",
  "next_question": "helt ny fråga om ett ANNAT område än den senaste frågan",
  "hint_for_next_question": "hint som hjälper kandidaten svara på next_question, eller null",
  "suggested_ideal_answer_outline": [
    "punkt 1",
    "punkt 2"
  ]
}

VIKTIGT:
- Svara *endast* med giltig JSON.
- Ingen extra text före eller efter JSON:et.
            `,
            },
          ],
        },
      ],
    });

    let raw = response.output_text?.trim() ?? "";

    if (raw.startsWith("```")) {
      const firstNewline = raw.indexOf("\n");
      const lastFence = raw.lastIndexOf("```");

      if (firstNewline !== -1 && lastFence !== -1 && lastFence > firstNewline) {
        raw = raw.slice(firstNewline + 1, lastFence).trim();
      }
    }

    let result;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      console.error("Kunde inte JSON-parsa modellen:", raw);
      return Response.json(
        {
          error: "Modellen returnerade ogiltig JSON.",
          raw,
        },
        { status: 500 }
      );
    }

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error:
          "Något gick fel när intervjufrågan eller feedbacken skulle genereras.",
      },
      { status: 500 }
    );
  }
}
