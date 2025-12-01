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
      instructions: `
You are an expert coach for technical interviews.

Your task:
- Create a concise, high-level study plan for a candidate preparing for a technical interview.
- The output must ALWAYS be valid JSON, matching the exact schema provided below.
- All text (focus_area, skills, questions, preparation) must be in English.
- Assume the candidate is a recent graduate / junior engineer.

Use the following principles:
- Base the content on the role, company, and job description.
- Keep everything concrete and short (no long paragraphs).
- Focus on what the candidate should revise and what question types to expect.
- Tailor the plan to a JUNIOR-level role (no senior / architect-heavy expectations).
      `,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Create a concrete overview of what is expected from a candidate before a technical interview.

Role context:
Job title: ${jobTitle}
Company: ${company}
Job description (may be empty): ${jobDescription || "No description provided."}

Use the job title and job description to:
- Identify the main focus area of the interview (e.g. "Frontend fundamentals with React", "Backend APIs with Node.js", "Data analysis with Python").
- Propose key skills the candidate should review (grouped into two columns for layout).
- Suggest realistic example questions for different question types (technical, behavioral, practical).
- Suggest specific preparation steps and useful tools/websites for practice.

Return the ANSWER AS PURE JSON with the following structure (exact field names, no extra fields):

{
  "focus_area": "short text describing what the interview will mainly focus on",

  "key_skills": [
    [
      "first skill in column 1",
      "second skill in column 1"
    ],
    [
      "first skill in column 2",
      "second skill in column 2"
    ]
  ],

  "question_types": {
    "groups": [
      {
        "heading": "1. Technical",
        "items": [
          "example of a technical question 1",
          "example of a technical question 2"
        ]
      },
      {
        "heading": "2. Behavioral",
        "items": [
          "example of a behavioral question 1",
          "example of a behavioral question 2"
        ]
      },
      {
        "heading": "3. Practical",
        "items": [
          "example of a practical question 1",
          "example of a practical question 2"
        ]
      }
    ]
  },

  "preparation": [
    "concrete bullet point on how the candidate should prepare",
    "another concrete preparation point",
    "include at least one tip about specific tools or websites that can be used to practice the required skills"
  ]
}

Additional requirements:
- All strings must be concise and directly relevant to the provided role.
- Do NOT add any fields outside the schema above.
- Answer ONLY with valid JSON.
- Do NOT wrap the JSON in \`\`\`json or any other code fences.
- No extra text before or after the JSON.
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
