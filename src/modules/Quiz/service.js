import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import ArcheTypeModel from "../ArcheType/schema.js";
import assert from "assert";
import QuestionModel from "./schema.js";
import mongoose from "mongoose";
import ClusterModel from "../Cluster/schema.js";
import PDFModel from "../PDF/schema.js";

const createQuestion = async (data) => {
  const { questionText, options } = data;
  const result = await new QuestionModel({
    questionText,
    options,
  }).save();
  return result;
};
const getQuestion = async () => {
  const result = await QuestionModel.find();
  return result;
};
const getQuizQuestion = async () => {
  const result = await QuestionModel.find(
    {},
    { "options.archetype": 0, "options._id": 0 }
  ).sort({ _id: -1 });
  return result;
};

//chat

// const calculateResult = async (data) => {
//   const countIteration = {};
//   const details = [];
//   let finalClusters = [];

//   const getTopTwoMaxCount = async (countData) => {
//     const sortedArray = Object.entries(countData).sort(
//       ([, a], [, b]) => b.count - a.count
//     );
//     const [first, second, third] = sortedArray;

//     if (second[1].count !== third?.[1]?.count) {
//       console.log("object", [first[0], second[0]]);
//       finalClusters = await fetchClusters([first[0], second[0]]);
//        console.log("object finalClusters", finalClusters);

//     } else {
//       const topThreeArchetypes = [second[0], third[0]];
//       const clusterArray = await fetchClusters(topThreeArchetypes);

//       const clusterDict = await mapClusterCounts(countData, clusterArray);

//       const clusterValues = Object.values(clusterDict);
//       if (clusterValues[0] !== clusterValues[1]) {
//         finalClusters = Object.keys(clusterDict);
//       } else {
//         const topCluster = await fetchClusterByArchetype(first[0]);
//         finalClusters = topCluster;
//       }
//     }

//     return finalClusters;
//   };

//   const fetchClusters = async (archetypes) => {
//     const clusters = await ClusterModel.find({
//       archetype: { $in: archetypes },
//     });
//     return clusters.map((cluster) => cluster._id.toString());
//   };

//   const mapClusterCounts = async (countData, clusterArray) => {
//     const clusterDict = {};
//     for (const [archetype, data] of Object.entries(countData)) {
//       const cluster = await fetchClusterByArchetype(archetype);
//       if (clusterArray.includes(cluster)) {
//         clusterDict[cluster] = (clusterDict[cluster] || 0) + 1;
//       }
//     }
//     return clusterDict;
//   };

//   const fetchClusterByArchetype = async (archetype) => {
//     const cluster = await ClusterModel.findOne({ archetype });
//     return cluster?._id?.toString() || null;
//   };

//   // Batch-fetch data to minimize database calls
//   const questionIds = data.map((e) => e.question_id);
//   const questions = await QuestionModel.find({ _id: { $in: questionIds } });

//   const archetypeIds = new Set();
//   data.forEach((e) => {
//     const question = questions.find(
//       (q) =>
//         q._id.toString() === e.question_id &&
//         q.options.some((o) => o.text === e.answer)
//     );
//     if (question) {
//       const answerOption = question.options.find((o) => o.text === e.answer);
//       archetypeIds.add(answerOption.archetype);

//       const { questionText } = question;
//       details.push({
//         questionText,
//         answer: answerOption.text,
//         archetype_name: answerOption.archetype.title,
//         archetype_id: answerOption.archetype._id,
//         color: answerOption.archetype.color,
//       });

//       countIteration[answerOption.archetype] = countIteration[
//         answerOption.archetype
//       ] || {
//         id: answerOption.archetype,
//         name: answerOption.archetype.title,
//         count: 0,
//       };
//       countIteration[answerOption.archetype].count += 1;
//     }
//   });
//   console.log("getTopTwoMaxCount", countIteration);
//   const clusterArray = await getTopTwoMaxCount(countIteration);
//   console.log("cluster_array", clusterArray);
// };

//mera
// const calculateResult = async (data) => {
//   const count_iteration = {};
//   const details = [];
//   let final_clusters = [];
//   let final_archetypes = [];
//   async function getTopTwoMaxCount(obj) {
//     // let sortedArray = Object.entries(obj).sort((a, b) => {
//     //   return b[1].count - a[1].count;
//     // });

//     let sortedArray = Object.entries(obj).sort((a, b) => {
//       if (b[1].count === a[1].count) {
//         // Tie-breaker: Compare keys alphabetically
//         return a[0].localeCompare(b[0]);
//       }
//       return b[1].count - a[1].count;
//     });

//     console.log("sorted", sortedArray);

//     if (sortedArray[1][1].count != sortedArray[2][1].count) {
//       final_archetypes = [sortedArray[0][0], sortedArray[1][0]];
//       // console.log("final_archetypes", final_archetypes);

//       final_clusters = await Promise.all(
//         [sortedArray[0][0], sortedArray[1][0]].map(async (d) => {
//           const cluster = await ClusterModel.find({
//             archetype: { $in: [d] },
//           });
//           return cluster.length && cluster[0]._id.toString();
//         })
//       );
//     } else {
//       const clusterarray_of_final_two_arch = await Promise.all(
//         [sortedArray[1][0], sortedArray[2][0]].map(async (d) => {
//           const cluster = await ClusterModel.find({
//             archetype: { $in: [d] },
//           });
//           console.log("clusterss", cluster);
//           return cluster.length && cluster[0]._id.toString();
//         })
//       );

//       const cluster_dict = {};

//       if (!Array.isArray(clusterarray_of_final_two_arch)) {
//         throw new Error("clusterarray_of_final_two_arch must be an array.");
//       }

//       await Promise.all(
//         Object.entries(obj).map(async ([key]) => {
//           try {
//             const cluster = await ClusterModel.find({
//               archetype: { $in: [key] },
//             });

//             if (
//               cluster.length &&
//               clusterarray_of_final_two_arch.includes(cluster[0]._id.toString())
//             ) {
//               console.log("key", key);
//               const clusterId = cluster[0]._id.toString();

//               if (cluster_dict[clusterId]) {
//                 cluster_dict[clusterId] = {
//                   archetype_id: key,
//                   count: cluster_dict[clusterId].count + 1,
//                 };
//               } else {
//                 cluster_dict[clusterId] = {
//                   archetype_id: key,
//                   count: 1,
//                 };
//               }
//             }
//           } catch (error) {
//             console.error(`Error processing key ${key}:`, error);
//           }
//         })
//       );

//       const values = Object.values(cluster_dict);
//       const keys = Object.keys(cluster_dict);
//       console.log("cluster_dict", cluster_dict);
//       console.log("values keys", values, keys);

//       if (Number(values[0].count) != Number(values[1].count)) {
//         // final_clusters = Object.keys(cluster_dict);
//         if (Number(values[0].count) > Number(values[1].count)) {
//           final_archetypes = [sortedArray[0][0], values[0].archetype_id];
//           console.log("yes", [sortedArray[0][0], values[0].archetype_id]);
//         } else {
//           final_archetypes = [sortedArray[0][0], values[1].archetype_id];
//           console.log("no", [sortedArray[0][0], values[1].archetype_id]);
//         }
//       } else {
//         const cluster = await ClusterModel.find({
//           archetype: { $in: [sortedArray[0][0]] },
//         });
//         final_clusters = cluster.length && cluster[0]._id.toString();
//         final_archetypes = [sortedArray[0][0]];
//       }
//     }

//     return final_clusters;
//   }

//   await Promise.all(
//     data.map(async (e) => {
//       const first_question = await QuestionModel.findOne({
//         _id: e.question_id.toString(),
//         "options.text": e.answer.trim(),
//       });
//       console.log("object", first_question._id);

//       if (first_question) {
//         first_question.options = first_question.options.filter(
//           (option) =>
//             option.text.toLowerCase().trim() === e.answer.toLowerCase().trim()
//         );

//         const archetype_data = await ArcheTypeModel.findById(
//           first_question.options[0].archetype
//         );

//         if (count_iteration[archetype_data._id.toString()]) {
//           count_iteration[archetype_data._id.toString()].count += 1; // Increment the count
//         } else {
//           count_iteration[archetype_data._id.toString()] = {
//             id: archetype_data._id.toString(),
//             name: archetype_data.title,
//             count: 1,
//           };
//         }

//         details.push({
//           questionText: first_question.questionText,
//           answer: first_question.options[0].text,
//           archetype_name: archetype_data.title,
//           archetype_id: archetype_data._id.toString(),
//           color: archetype_data.color,
//         });
//       }
//     })
//   );
//   console.log("count_iteration", count_iteration);
//   const cluster_array = await getTopTwoMaxCount(count_iteration);
//   console.log("cl ar", cluster_array, final_archetypes);
//   // cluster_array?.map((e) => {});
//   const archedata = await Promise.all(
//     final_archetypes.map(async (e) => {
//       return ArcheTypeModel.findById(e, "title image color isLeft");
//     })
//   );

//   const pdf = final_archetypes
//     ? await PDFModel.findOne(
//         {
//           archetypes: { $eq: final_archetypes },
//         },
//         { pdfUrl: 1, _id: 0, title: 1 }
//       )
//     : "";

//   return { cluster_array, archedata: archedata, pdf };
// };

// const calculateResult = async (data) => {
//   const count_iteration = {}; // To store archetype counts
//   const details = []; // To store question details
//   let final_archetypes = []; // To store final archetypes
//   let final_clusters = []; // To store final clusters

//   // Count occurrences of archetypes
//   for (const entry of data) {
//     const question = await QuestionModel.findOne({
//       _id: entry.question_id.toString(),
//       "options.text": entry.answer.trim(),
//     });

//     if (question) {
//       const matchedOption = question.options.find(
//         (opt) =>
//           opt.text.toLowerCase().trim() === entry.answer.toLowerCase().trim()
//       );

//       const archetype = await ArcheTypeModel.findById(matchedOption.archetype);
//       const archetypeId = archetype._id.toString();

//       count_iteration[archetypeId] = count_iteration[archetypeId]
//         ? count_iteration[archetypeId] + 1
//         : 1;

//       details.push({
//         questionText: question.questionText,
//         answer: matchedOption.text,
//         archetype_name: archetype.title,
//         archetype_id: archetypeId,
//         color: archetype.color,
//       });
//     }
//   }

//   // Sort archetypes by count
//   const sortedArchetypes = Object.entries(count_iteration)
//     .map(([id, count]) => ({ id, count }))
//     .sort((a, b) => b.count - a.count);

//   // Pick top three archetypes
//   const topThree = sortedArchetypes.slice(0, 3);

//   if (topThree.length < 3) {
//     throw new Error("Not enough archetypes to determine final selection.");
//   }

//   // Compare counts of top three archetypes
//   const [first, second, third] = topThree;

//   if (second.count !== third.count) {
//     // If the second and third archetypes have different counts
//     final_archetypes = [first.id, second.id];
//   } else {
//     // If the second and third archetypes have the same count
//     const secondClusters = await ClusterModel.find({ archetype: second.id });
//     const thirdClusters = await ClusterModel.find({ archetype: third.id });

//     const secondClusterCount = secondClusters.reduce(
//       (sum, cluster) => sum + cluster.count,
//       0
//     );
//     const thirdClusterCount = thirdClusters.reduce(
//       (sum, cluster) => sum + cluster.count,
//       0
//     );

//     if (secondClusterCount > thirdClusterCount) {
//       final_archetypes = [first.id, second.id];
//     } else {
//       final_archetypes = [first.id, third.id];
//     }
//   }

//   // Fetch additional data for final archetypes
//   const archedata = await Promise.all(
//     final_archetypes.map((id) =>
//       ArcheTypeModel.findById(id, "title image color isLeft")
//     )
//   );

//   // Fetch PDF for the final archetypes
//   const pdf = await PDFModel.findOne(
//     { archetypes: { $eq: final_archetypes } },
//     { pdfUrl: 1, title: 1 }
//   );

//   return { archetypes: final_archetypes, archedata, pdf };
// };

// const calculateResult = async (data) => {
//   const count_iteration = {}; // To store archetype counts
//   const details = []; // To store question details
//   let final_archetypes = []; // To store final archetypes

//   // Track the order of first appearance
//   const firstAppearanceIndex = {};

//   // Count occurrences of archetypes and track first appearance
//   for (let i = 0; i < data.length; i++) {
//     const entry = data[i];

//     const question = await QuestionModel.findOne({
//       _id: entry.question_id.toString(),
//       "options.text": entry.answer.trim(),
//     });

//     if (question) {
//       const matchedOption = question.options.find(
//         (opt) =>
//           opt.text.toLowerCase().trim() === entry.answer.toLowerCase().trim()
//       );

//       const archetype = await ArcheTypeModel.findById(matchedOption.archetype);
//       const archetypeId = archetype._id.toString();

//       // Count the archetype
//       count_iteration[archetypeId] = count_iteration[archetypeId]
//         ? count_iteration[archetypeId] + 1
//         : 1;

//       // Track the first appearance index
//       if (!(archetypeId in firstAppearanceIndex)) {
//         firstAppearanceIndex[archetypeId] = i; // Save the index of first appearance
//       }

//       details.push({
//         questionText: question.questionText,
//         answer: matchedOption.text,
//         archetype_name: archetype.title,
//         archetype_id: archetypeId,
//         color: archetype.color,
//       });
//     }
//   }

//   // Sort archetypes by count (desc) and then by first appearance (asc)
//   const sortedArchetypes = Object.entries(count_iteration)
//     .map(([id, count]) => ({
//       id,
//       count,
//       firstIndex: firstAppearanceIndex[id],
//     }))
//     .sort((a, b) => {
//       if (b.count === a.count) {
//         // If counts are equal, compare by first appearance index
//         return a.firstIndex - b.firstIndex;
//       }
//       return b.count - a.count; // Primary sort by count
//     });

//   // Pick top three archetypes
//   const topThree = sortedArchetypes.slice(0, 3);

//   if (topThree.length < 3) {
//     throw new Error("Not enough archetypes to determine final selection.");
//   }

//   // Compare counts of top three archetypes
//   const [first, second, third] = topThree;

//   if (second.count !== third.count) {
//     // If the second and third archetypes have different counts
//     final_archetypes = [first.id, second.id];
//   } else {
//     // If the second and third archetypes have the same count
//     const secondClusters = await ClusterModel.find({ archetype: second.id });
//     const thirdClusters = await ClusterModel.find({ archetype: third.id });

//     const secondClusterCount = secondClusters.reduce(
//       (sum, cluster) => sum + cluster.count,
//       0
//     );
//     const thirdClusterCount = thirdClusters.reduce(
//       (sum, cluster) => sum + cluster.count,
//       0
//     );

//     if (secondClusterCount > thirdClusterCount) {
//       final_archetypes = [first.id, second.id];
//     } else {
//       final_archetypes = [first.id, third.id];
//     }
//   }

//   // Fetch additional data for final archetypes
//   const archedata = await Promise.all(
//     final_archetypes.map((id) =>
//       ArcheTypeModel.findById(id, "title image color isLeft")
//     )
//   );

//   // Fetch PDF for the final archetypes
//   const pdf = await PDFModel.findOne(
//     { archetypes: { $eq: final_archetypes } },
//     { pdfUrl: 1, title: 1 }
//   );

//   return { archetypes: final_archetypes, archedata, pdf };
// };

const calculateResult = async (data) => {
  const archetypeScores = {}; // Stores the scores of each archetype
  const details = []; // Stores question-answer details
  const firstAppearanceIndex = {}; // Tracks the first occurrence of each archetype
  let finalArchetypes = [];
  // Count archetype scores and track first appearance
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];

    const question = await QuestionModel.findOne({
      _id: entry.question_id.toString(),
      "options.text": entry.answer.trim(),
    });

    if (question) {
      const matchedOption = question.options.find(
        (opt) =>
          opt.text.toLowerCase().trim() === entry.answer.toLowerCase().trim()
      );

      const archetype = await ArcheTypeModel.findById(matchedOption.archetype);
      const archetypeId = archetype._id.toString();

      // Increment the score
      archetypeScores[archetypeId] = (archetypeScores[archetypeId] || 0) + 1;

      // Track the first appearance
      if (!(archetypeId in firstAppearanceIndex)) {
        firstAppearanceIndex[archetypeId] = i;
      }

      details.push({
        questionText: question.questionText,
        answer: matchedOption.text,
        archetype_name: archetype.title,
        archetype_id: archetypeId,
        color: archetype.color,
      });
    }
  }

  // Sort archetypes by score and first appearance
  const sortedArchetypes = Object.entries(archetypeScores)
    .map(([id, score]) => ({
      id,
      score,
      firstIndex: firstAppearanceIndex[id],
    }))
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.firstIndex - b.firstIndex; // Secondary sort by first appearance
      }
      return b.score - a.score; // Primary sort by score
    });

  // Apply Rule 2: Identify the top 2 archetypes
  const topArchetypes = sortedArchetypes.slice(0, 3);

  if (topArchetypes.length < 2) {
    throw new Error("Not enough archetypes to determine results.");
  }

  const [first, second, third] = topArchetypes;

  // Check for a clash (Rule 3)
  if (third && second.score === third.score) {
    const secondClusters = await ClusterModel.find({ archetype: second.id });
    const thirdClusters = await ClusterModel.find({ archetype: third.id });

    const secondClusterScore = secondClusters.reduce(
      (sum, cluster) => sum + cluster.count,
      0
    );
    const thirdClusterScore = thirdClusters.reduce(
      (sum, cluster) => sum + cluster.count,
      0
    );

    if (secondClusterScore !== thirdClusterScore) {
      // Choose the archetype from the top-scoring cluster
      finalArchetypes = [
        first.id,
        secondClusterScore > thirdClusterScore ? second.id : third.id,
      ];
    } else {
      // Rule 4: Compare individual scores within clusters
      const secondHighestInCluster = secondClusters.reduce(
        (max, cluster) => (cluster.count > max ? cluster.count : max),
        0
      );
      const thirdHighestInCluster = thirdClusters.reduce(
        (max, cluster) => (cluster.count > max ? cluster.count : max),
        0
      );

      if (secondHighestInCluster !== thirdHighestInCluster) {
        finalArchetypes = [
          first.id,
          secondHighestInCluster > thirdHighestInCluster ? second.id : third.id,
        ];
      } else {
        // Rule 5: If unresolved, only return the top archetype
        finalArchetypes = [first.id];
      }
    }
  } else {
    // No clash, return top 2 archetypes
    finalArchetypes = [first.id, second.id];
  }

  // Fetch additional data for final archetypes
  const archedata = await Promise.all(
    finalArchetypes.map((id) =>
      ArcheTypeModel.findById(id, "title image color isLeft")
    )
  );

  // Fetch PDF for the final archetypes
  const pdf = await PDFModel.findOne(
    { archetypes: { $eq: finalArchetypes } },
    { pdfUrl: 1, title: 1 }
  );

  return { archetypes: finalArchetypes, archedata, pdf };
};

const quizServices = {
  createQuestion,
  getQuestion,
  getQuizQuestion,
  calculateResult,
};
export default quizServices;
