/* global Word console */
// import axios from 'axios';

// async function fetchPokemonData(url: string): Promise<string> {
//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     const typeName = data.types[0].type.name;
//     const weight = data.weight;
//     const message = `The Pokémon is of type: ${typeName} and has a weight of ${weight} units.`;
//     return message;
//   } catch (error) {
//     console.error('Error while fetching data:', error);
//     throw error;
//   }
// }

type UserInput = {
  answer: string;
  search_string: string;
  id: number;
};

const handleUserInput = async (input: UserInput[]) => {
  try {
    await Word.run(async (context) => {
      await context.sync();
      for (const element of input) {
        var search_string_with_id = element.search_string + "-" + element.id;
        var ranges = context.document.body.search(search_string_with_id, { matchCase: true });
        ranges.load();
        await context.sync();
        
        ranges.items.forEach((range) => {
          range.insertText(element.answer, Word.InsertLocation.replace);
        });
        await context.sync();
      }
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

// const insertText = async (texts: Object) => {
//   // Write text to the document.
//   console.log("Inserting text: " + texts);
//   const text = "clear";
//   try {
//     await Word.run(async (context) => {
//       if (text.toLocaleLowerCase() === "comment") {
//         // check if the text has a yellow background color
//         const yellow = "#ffff00";
//         const body = context.document.body;
//         const paragraphs = body.paragraphs;
//         paragraphs.load();
//         await context.sync();
//         paragraphs.items.forEach((paragraph) => {
//           // if the paragraph is highlighted, add a comment
//           if (paragraph.styleBuiltIn === "Title") {
//             console.log("Title");
//             const range = paragraph.getRange("Whole");
//             range.load();
//             range.insertComment("This is a title");
//           }
//         });
//       } else if (text.toLocaleLowerCase() === "clear") {
//         context.document.body.clear();
//       } else if (text.toLocaleLowerCase() === "insert") {
//         // this should fill in the first page of the template
//         // check if there is a paragraph which starts with "Version:"
//         const body = context.document.body;
//         var paragraphs = body.paragraphs;
//         paragraphs.load();
//         await context.sync();
//         paragraphs.items.forEach((paragraph) => {
//           // if the paragraph is highlighted, add a comment
//           if (paragraph.text.startsWith("Version:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("5.2.1", Word.InsertLocation.start);
//           } else if (paragraph.text.startsWith("Gültigkeit ab:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("01.11.2023", Word.InsertLocation.start);
//           } else if (paragraph.text.startsWith("Status:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("Entwurf", Word.InsertLocation.start);
//           } else if (paragraph.text.startsWith("Ersteller:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("M42-GH", Word.InsertLocation.start);
//           } else if (paragraph.text.startsWith("Erstelldatum:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("21.09.2023", Word.InsertLocation.start);
//           } else if (paragraph.text.startsWith("Freigebedatum:")) {
//             var next = paragraph.getNext();
//             next.load();
//             next.clear();
//             next.insertText("M12-55\n13.10.2023", Word.InsertLocation.start);
//           }
//         });

//         await context.sync();
//         paragraphs = body.paragraphs;
//         paragraphs.load();
//         await context.sync();
//         paragraphs.items.forEach((paragraph) => {
//           if(paragraph.text.includes("DD.MM.YYYY")){
//             paragraph.clear();
//           }
//         });


//       } else {
//         const url = "https://pokeapi.co/api/v2/pokemon/" + text.toLowerCase();
//         const message = await fetchPokemonData(url);
//         let body = context.document.body;
//         body.insertParagraph(message, Word.InsertLocation.end);
//       }
//       await context.sync();
//     });
//   } catch (error) {
//     console.log("Error: " + error);
//   }
// };

export default handleUserInput;
export type { UserInput };
