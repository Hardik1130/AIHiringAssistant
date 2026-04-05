// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: import.meta.env.VITE_GEMINI_API_KEY
// });

// export async function screenCandidate(resumeText, jobDescription) {
//   const prompt = `
//     Screen this resume against the job description.
//     Resume: ${resumeText}
//     Job Description: ${jobDescription}
//     Return a JSON object with:
//     name, role, score (0-100), reasoning, skills[]
//   `;

//   const response = await ai.models.generateContent({
//     model: "gemini-1.5-flash",
//     contents: prompt,
//     config: {
//       temperature: 0.4,
//     }
//   });

//   return response.text;
// }

// export async function generateJobDescription(jobTitle) {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: `Generate a short, professional 2-sentence job description for a ${jobTitle} role at a high-growth tech startup.`,
//     });

//     return response.text;
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return "Error generating AI description.";
//   }
// }

// export async function getCandidateInsight(candidateName, role) {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: `Provide a 1-sentence AI recruitment insight for ${candidateName} applying for ${role}.`,
//     });

//     return response.text;
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return "Candidate shows high potential.";
//   }
// }


// // import { GoogleGenAI } from "@google/genai";

// // // Ensure you are using Vite's env syntax if this is a frontend project
// // const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

// // const getAI = () => new GoogleGenAI(API_KEY);

// // export async function screenCandidate(resumeText, jobDescription) {
// //   const ai = getAI();
// //   const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

// //   const prompt = `
// //     Screen this resume against the job description. 
// //     Resume: ${resumeText}
// //     Job Description: ${jobDescription}
    
// //     Return a JSON object following the schema provided.
// //   `;

// //   const result = await model.generateContent({
// //     contents: [{ role: "user", parts: [{ text: prompt }] }],
// //     generationConfig: {
// //       responseMimeType: "application/json",
// //       // Note: In standard JS, we just pass the object structure 
// //       // The 'Type' constants come from the library import
// //       responseSchema: {
// //         type: "object",
// //         properties: {
// //           name: { type: "string" },
// //           role: { type: "string" },
// //           score: { type: "number", description: "Match score from 0-100" },
// //           reasoning: { type: "string" },
// //           skills: {
// //             type: "array",
// //             items: { type: "string" }
// //           }
// //         },
// //         required: ["name", "role", "score", "reasoning", "skills"]
// //       }
// //     }
// //   });

// //   const response = await result.response;
// //   return JSON.parse(response.text());
// // }

// // export const generateJobDescription = async (jobTitle) => {
// //   try {
// //     const response = await ai.models.generateContent({
// //       model: "gemini-3-flash-preview",
// //       contents: `Generate a short, professional 2-sentence job description for a ${jobTitle} role at a high-growth tech startup. Focus on innovation and impact.`,
// //       config: {
// //         temperature: 0.7,
// //         maxOutputTokens: 200
// //       }
// //     });

// //     return response.text || "Unable to generate description at this time.";
// //   } catch (error) {
// //     console.error("Gemini API Error:", error);
// //     return "Error generating AI description.";
// //   }
// // };

// // export const getCandidateInsight = async (candidateName, role) => {
// //   try {
// //     const response = await ai.models.generateContent({
// //       model: "gemini-3-flash-preview",
// //       contents: `Provide a 1-sentence AI recruitment insight for a candidate named ${candidateName} applying for a ${role} position. Mention one high-value skill they likely possess based on modern industry standards.`,
// //       config: {
// //         temperature: 0.8,
// //         maxOutputTokens: 100
// //       }
// //     });

// //     return response.text || "Strong fit for technical culture and velocity.";
// //   } catch (error) {
// //     console.error("Gemini API Error:", error);
// //     return "Candidate shows high potential for specialized domain tasks.";
// //   }
// // };