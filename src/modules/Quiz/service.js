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
const calculateResult = async (data) => {
  const count_iteration = {};
  const details = [];
  let final_clusters = [];
  let final_archetypes = [];
  async function getTopTwoMaxCount(obj) {
    let sortedArray = Object.entries(obj).sort((a, b) => {
      return b[1].count - a[1].count;
    });

    // console.log("sorted", sortedArray);

    if (sortedArray[1][1].count != sortedArray[2][1].count) {
      final_archetypes = [sortedArray[0][0], sortedArray[1][0]];
      // console.log("final_archetypes", final_archetypes);

      final_clusters = await Promise.all(
        [sortedArray[0][0], sortedArray[1][0]].map(async (d) => {
          const cluster = await ClusterModel.find({
            archetype: { $in: [d] },
          });
          return cluster.length && cluster[0]._id.toString();
        })
      );
    } else {
      const clusterarray_of_final_two_arch = await Promise.all(
        [sortedArray[1][0], sortedArray[2][0]].map(async (d) => {
          const cluster = await ClusterModel.find({
            archetype: { $in: [d] },
          });
          return cluster.length && cluster[0]._id.toString();
        })
      );
      const cluster_dict = {};

      await Promise.all(
        Object.entries(obj).map(async ([key]) => {
          const cluster = await ClusterModel.find({
            archetype: { $in: [key] },
          });

          if (
            cluster.length &&
            clusterarray_of_final_two_arch.includes(cluster[0]._id.toString())
          ) {
            const clusterId = cluster[0]._id.toString();
            cluster_dict[clusterId] = (cluster_dict[clusterId] || 0) + 1;
          }
        })
      );

      const values = Object.values(cluster_dict);
      // console.log("cluster_dict", cluster_dict);

      if (Number(values[0]) != Number(values[1])) {
        final_clusters = Object.keys(cluster_dict);
        final_archetypes = [sortedArray[0][0], sortedArray[1][0]];
      } else {
        const cluster = await ClusterModel.find({
          archetype: { $in: [sortedArray[0][0]] },
        });
        final_clusters = cluster.length && cluster[0]._id.toString();
        final_archetypes = [sortedArray[0][0]];
      }
    }

    return final_clusters;
  }

  await Promise.all(
    data.map(async (e) => {
      const first_question = await QuestionModel.findOne({
        _id: e.question_id.toString(),
        "options.text": e.answer.trim(),
      });
      // console.log("object", first_question._id);

      if (first_question) {
        first_question.options = first_question.options.filter(
          (option) =>
            option.text.toLowerCase().trim() === e.answer.toLowerCase().trim()
        );

        const archetype_data = await ArcheTypeModel.findById(
          first_question.options[0].archetype
        );

        if (count_iteration[archetype_data._id.toString()]) {
          count_iteration[archetype_data._id.toString()].count += 1; // Increment the count
        } else {
          count_iteration[archetype_data._id.toString()] = {
            id: archetype_data._id.toString(),
            name: archetype_data.title,
            count: 1,
          };
        }

        details.push({
          questionText: first_question.questionText,
          answer: first_question.options[0].text,
          archetype_name: archetype_data.title,
          archetype_id: archetype_data._id.toString(),
          color: archetype_data.color,
        });
      }
    })
  );
  // console.log("count_iteration", count_iteration);
  const cluster_array = await getTopTwoMaxCount(count_iteration);
  // cluster_array?.map((e) => {});
  const archedata = await Promise.all(
    final_archetypes.map(async (e) => {
      return ArcheTypeModel.findById(e, "title image color isLeft");
    })
  );

  const pdf = final_archetypes
    ? await PDFModel.findOne(
        {
          archetypes: { $eq: final_archetypes },
        },
        { pdfUrl: 1, _id: 0, title: 1 }
      )
    : "";

  return { cluster_array, archedata: archedata, pdf };
};

const quizServices = {
  createQuestion,
  getQuestion,
  getQuizQuestion,
  calculateResult,
};
export default quizServices;
